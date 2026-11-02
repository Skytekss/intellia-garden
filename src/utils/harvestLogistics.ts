import { HarvestLogisticsParams, HarvestLogisticsSummary, GardenSector } from '../types';

export const DEFAULT_LOGISTICS_PARAMS: HarvestLogisticsParams = {
  harvestWindowDays: 14,
  pickerDailyNormKg: 750, // standard 700-800 kg per picker per 8-hour shift in high-density apple orchards
  binCapacityKg: 400, // standard wooden/plastic orchard bulk bin (400 kg capacity)
  truckCapacityTons: 20, // standard 20-ton euro reefer truck
};

/**
 * Calculates harvest logistics and resource requirements.
 */
export function calculateHarvestLogistics(
  sectors: GardenSector[],
  params: Partial<HarvestLogisticsParams> = {},
  avgYieldTonsPerHa: number = 35 // default intensive Russian/European orchard yield: 32-38 t/ha
): HarvestLogisticsSummary {
  const mergedParams: Required<HarvestLogisticsParams> = {
    harvestWindowDays: Math.max(1, params.harvestWindowDays ?? DEFAULT_LOGISTICS_PARAMS.harvestWindowDays),
    pickerDailyNormKg: Math.max(100, params.pickerDailyNormKg ?? DEFAULT_LOGISTICS_PARAMS.pickerDailyNormKg),
    binCapacityKg: Math.max(50, params.binCapacityKg ?? (DEFAULT_LOGISTICS_PARAMS.binCapacityKg || 400)),
    truckCapacityTons: Math.max(1, params.truckCapacityTons ?? (DEFAULT_LOGISTICS_PARAMS.truckCapacityTons || 20)),
  };

  const totalAreaHa = +(sectors.reduce((sum, s) => sum + s.area, 0)).toFixed(1);
  const totalTonsExpected = +(totalAreaHa * avgYieldTonsPerHa).toFixed(1);
  const dailyTonsToHarvest = +(totalTonsExpected / mergedParams.harvestWindowDays).toFixed(1);

  // Pickers calculation: daily kg / norm kg per picker
  const dailyKgToHarvest = dailyTonsToHarvest * 1000;
  const pickersRequired = Math.ceil(dailyKgToHarvest / mergedParams.pickerDailyNormKg);

  // Total bins required: total kg / bin kg
  const totalKg = totalTonsExpected * 1000;
  const binsRequired = Math.ceil(totalKg / mergedParams.binCapacityKg);

  // Trucks required: total tons / truck tons
  const refrigeratedTrucksRequired = Math.ceil(totalTonsExpected / mergedParams.truckCapacityTons);

  return {
    totalAreaHa,
    totalTonsExpected,
    avgYieldTonsPerHa,
    harvestWindowDays: mergedParams.harvestWindowDays,
    pickerDailyNormKg: mergedParams.pickerDailyNormKg,
    pickersRequired,
    binsRequired,
    refrigeratedTrucksRequired,
    dailyTonsToHarvest,
  };
}
