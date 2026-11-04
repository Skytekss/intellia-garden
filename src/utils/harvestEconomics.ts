import { GardenSector } from '../types';

export interface HarvestEconomicsParams {
  freshMarketPriceRubPerKg: number; // e.g. 95 ₽
  caStoragePriceRubPerKg: number; // e.g. 125 ₽
  processingPriceRubPerKg: number; // e.g. 20 ₽
  caStorageSharePercent: number; // e.g. 60%
  yieldTonsPerHa?: number; // e.g. 35 t/ha
}

export interface DailyEconomicsPoint {
  dayOffset: number; // -8, -4, 0, +4, +8, +12
  dateLabel: string;
  isOptimal: boolean;
  premiumFruitKg: number;
  dropLossKg: number;
  totalRevenueRub: number;
  freshMarketRevenueRub: number;
  storageRevenueRub: number;
  dropLossRevenueRub: number;
  dropPercent: number;
}

export interface HarvestEconomicsSummary {
  sectorName: string;
  variety: string;
  totalAreaHa: number;
  totalYieldKg: number;
  optimalDate: string;
  maxRevenueRub: number;
  earlyHarvestPenaltyRub: number; // Loss if harvested 1 week too early
  lateHarvestPenaltyRub: number; // Loss if harvested 1 week too late due to drop & softening
  curve: DailyEconomicsPoint[];
}

export const DEFAULT_ECONOMICS_PARAMS: HarvestEconomicsParams = {
  freshMarketPriceRubPerKg: 95,
  caStoragePriceRubPerKg: 125,
  processingPriceRubPerKg: 20,
  caStorageSharePercent: 60,
  yieldTonsPerHa: 35,
};

/**
 * Calculates financial revenue curve and optimal picking margin.
 */
export function calculateHarvestEconomics(
  sector: GardenSector,
  params: HarvestEconomicsParams = DEFAULT_ECONOMICS_PARAMS,
  isEnglish: boolean = false
): HarvestEconomicsSummary {
  const yieldTons = params.yieldTonsPerHa ?? 35;
  const totalYieldKg = Math.round(sector.area * yieldTons * 1000);

  // Time shifts around the harvest window: from -8 days to +12 days
  const offsets = [-8, -4, 0, 4, 8, 12];

  const curve: DailyEconomicsPoint[] = offsets.map((offset) => {
    let maturityFactor = 1.0;
    let dropPercent = 1.5;
    let premiumQualityRatio = 0.92;

    if (offset < 0) {
      // Early harvest: fruit is smaller (mass deficit ~8%), low drop, but lower grading
      const earlyFactor = Math.abs(offset) / 8;
      maturityFactor = 1.0 - 0.1 * earlyFactor;
      dropPercent = Math.max(0.5, 1.5 - earlyFactor);
      premiumQualityRatio = 0.75 + 0.17 * (1 - earlyFactor);
    } else if (offset === 0) {
      // Optimal window
      maturityFactor = 1.0;
      dropPercent = 1.8;
      premiumQualityRatio = 0.94;
    } else {
      // Late harvest: exponential fruit drop and firmness decline
      const lateFactor = offset / 12;
      maturityFactor = 1.02; // slight sugar weight gain
      dropPercent = +(1.8 + 22 * Math.pow(lateFactor, 1.8)).toFixed(1);
      premiumQualityRatio = Math.max(0.45, 0.94 - 0.45 * lateFactor);
    }

    const availableHarvestKg = Math.round(totalYieldKg * maturityFactor);
    const dropLossKg = Math.round((availableHarvestKg * dropPercent) / 100);
    const harvestedTreeKg = availableHarvestKg - dropLossKg;

    const premiumKg = Math.round(harvestedTreeKg * premiumQualityRatio);
    const standardKg = harvestedTreeKg - premiumKg;

    // Financial distribution:
    // Premium fruit split between CA storage (higher price) and fresh retail
    const storageShare = params.caStorageSharePercent / 100;
    const storageKg = Math.round(premiumKg * storageShare);
    const freshKg = premiumKg - storageKg + standardKg;

    const freshMarketRevenueRub = Math.round(freshKg * params.freshMarketPriceRubPerKg);
    const storageRevenueRub = Math.round(storageKg * params.caStoragePriceRubPerKg);
    const dropLossRevenueRub = Math.round(dropLossKg * params.processingPriceRubPerKg);

    const totalRevenueRub = freshMarketRevenueRub + storageRevenueRub + dropLossRevenueRub;

    let dateLabel = '';
    if (offset === 0) {
      dateLabel = isEnglish ? 'Optimal (0d)' : 'Оптимум (0 дн.)';
    } else if (offset > 0) {
      dateLabel = `+${offset} ${isEnglish ? 'days' : 'дн.'}`;
    } else {
      dateLabel = `${offset} ${isEnglish ? 'days' : 'дн.'}`;
    }

    return {
      dayOffset: offset,
      dateLabel,
      isOptimal: offset === 0,
      premiumFruitKg: premiumKg,
      dropLossKg,
      totalRevenueRub,
      freshMarketRevenueRub,
      storageRevenueRub,
      dropLossRevenueRub,
      dropPercent,
    };
  });

  const optimalPoint = curve.find((c) => c.isOptimal) || curve[2];
  const earliestPoint = curve[0];
  const latestPoint = curve[curve.length - 1];

  const maxRevenueRub = optimalPoint.totalRevenueRub;
  const earlyHarvestPenaltyRub = Math.max(0, maxRevenueRub - earliestPoint.totalRevenueRub);
  const lateHarvestPenaltyRub = Math.max(0, maxRevenueRub - latestPoint.totalRevenueRub);

  return {
    sectorName: sector.name,
    variety: sector.variety,
    totalAreaHa: sector.area,
    totalYieldKg,
    optimalDate: sector.recommendedDate,
    maxRevenueRub,
    earlyHarvestPenaltyRub,
    lateHarvestPenaltyRub,
    curve,
  };
}
