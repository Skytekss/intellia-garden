import { AppleVariety, GardenSector, RainCondition } from '../types';

/**
 * Growing Degree Days (GDD) physiological thresholds for commercial apple cultivars.
 * Base physiological developmental threshold for Malus domestica: T_base = 10.0°C.
 * Thresholds calibrated according to international pomological standards.
 */
export const GDD_VARIETY_THRESHOLDS: Record<string, { targetGdd: number; harvestWindowDays: number }> = {
  // Russian labels
  'Гала': { targetGdd: 1300, harvestWindowDays: 12 },
  'Хани Крисп': { targetGdd: 1380, harvestWindowDays: 14 },
  'Голден': { targetGdd: 1480, harvestWindowDays: 14 },
  'Голден Делишес': { targetGdd: 1480, harvestWindowDays: 14 },
  'Ред Делишес': { targetGdd: 1550, harvestWindowDays: 16 },
  'Фуджи': { targetGdd: 1650, harvestWindowDays: 18 },
  // English labels
  'Gala': { targetGdd: 1300, harvestWindowDays: 12 },
  'Honeycrisp': { targetGdd: 1380, harvestWindowDays: 14 },
  'Golden Delicious': { targetGdd: 1480, harvestWindowDays: 14 },
  'Golden': { targetGdd: 1480, harvestWindowDays: 14 },
  'Red Delicious': { targetGdd: 1550, harvestWindowDays: 16 },
  'Fuji': { targetGdd: 1650, harvestWindowDays: 18 },
};

export const GDD_BASE_TEMPERATURE_C = 10.0;

export interface SectorGddAnalysis {
  variety: AppleVariety;
  baseTempC: number;
  targetGdd: number;
  accumulatedGdd: number;
  progressPercent: number;
  dailyGddRate: number;
  daysRemaining: number;
  status: 'under' | 'optimal' | 'accelerated';
  statusLabelRu: string;
  statusLabelEn: string;
  recommendationRu: string;
  recommendationEn: string;
}

/**
 * Calculates GDD metrics for a given sector and climate telemetry.
 */
export function calculateSectorGdd(
  sector: GardenSector,
  currentTempC: number = 20,
  tempAnomalyC: number = 0,
  rainCondition: RainCondition = 'optimal'
): SectorGddAnalysis {
  const varietyConfig = GDD_VARIETY_THRESHOLDS[sector.variety] || { targetGdd: 1450, harvestWindowDays: 14 };
  const targetGdd = varietyConfig.targetGdd;

  // Base accumulation derived from physiological readiness (maturity percent)
  const baseProgress = Math.min(100, Math.max(0, sector.maturityPercent));
  let accumulatedGdd = Math.round((targetGdd * baseProgress) / 100);

  // Effective temperature considering What-If simulation anomaly
  const effectiveMeanTemp = currentTempC + tempAnomalyC;
  const effectiveDailyRate = Math.max(1.5, +(effectiveMeanTemp - GDD_BASE_TEMPERATURE_C).toFixed(1));

  // Rain impact on heat absorption and photosynthesis efficiency
  let rainFactor = 1.0;
  if (rainCondition === 'dry') {
    // Heat stress slows fruit respiration slightly
    rainFactor = 0.92;
  } else if (rainCondition === 'heavy') {
    // Cloud cover reduces thermal absorption
    rainFactor = 0.88;
  }

  const finalDailyRate = +(effectiveDailyRate * rainFactor).toFixed(1);
  const remainingGdd = Math.max(0, targetGdd - accumulatedGdd);
  const daysRemaining = Math.max(0, Math.ceil(remainingGdd / finalDailyRate));

  // Determine thermal pace status
  let status: 'under' | 'optimal' | 'accelerated' = 'optimal';
  let statusLabelRu = 'Оптимальный темп накопления тепла';
  let statusLabelEn = 'Optimal thermal accumulation pace';
  let recommendationRu = `Накоплено ${accumulatedGdd} из ${targetGdd} GDD. Развитие плодов идет строго в соответствии с фенологической моделью сорта ${sector.variety}.`;
  let recommendationEn = `Accumulated ${accumulatedGdd} of ${targetGdd} GDD. Fruit development is strictly aligned with the phenological model for ${sector.variety}.`;

  if (tempAnomalyC >= 2) {
    status = 'accelerated';
    statusLabelRu = 'Ускоренное созревание (тепловая аномалия)';
    statusLabelEn = 'Accelerated ripening (thermal anomaly)';
    recommendationRu = `Превышение нормы температур ускоряет гидролиз крахмала (+${tempAnomalyC}°C). Окно сбора сдвигается на ${daysRemaining} дн. раньше базового срока.`;
    recommendationEn = `Higher temperatures accelerate starch breakdown (+${tempAnomalyC}°C). Harvest window shifts ${daysRemaining} days earlier than baseline.`;
  } else if (tempAnomalyC <= -2) {
    status = 'under';
    statusLabelRu = 'Замедленное созревание (дефицит тепла)';
    statusLabelEn = 'Delayed ripening (thermal deficit)';
    recommendationRu = `Дефицит эффективных температур (${tempAnomalyC}°C) замедляет синтез антоцианов и сахаров. Требуется мониторинг сахаристости Brix.`;
    recommendationEn = `Deficit of effective degree-days (${tempAnomalyC}°C) slows sugar and anthocyanin synthesis. Ongoing Brix monitoring required.`;
  }

  return {
    variety: sector.variety,
    baseTempC: GDD_BASE_TEMPERATURE_C,
    targetGdd,
    accumulatedGdd,
    progressPercent: Math.min(100, Math.round((accumulatedGdd / targetGdd) * 100)),
    dailyGddRate: finalDailyRate,
    daysRemaining,
    status,
    statusLabelRu,
    statusLabelEn,
    recommendationRu,
    recommendationEn,
  };
}
