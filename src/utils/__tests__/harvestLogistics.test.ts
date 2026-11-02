import { describe, it, expect } from 'vitest';
import { calculateHarvestLogistics } from '../harvestLogistics';
import { GardenSector } from '../../types';

describe('harvestLogistics utility', () => {
  const mockSectors: GardenSector[] = [
    {
      id: 's-1',
      name: 'Участок 1',
      variety: 'Гала',
      maturityPercent: 45,
      status: 'ripening',
      recommendedDate: '25 сентября – 5 октября',
      area: 4.8,
      brix: 11.2,
      firmnessKgCm2: 8.5,
      starchIndex: 3.2,
      soilMoisturePercent: 68,
      ndviIndex: 0.72,
      ripeningHistory: [],
    },
    {
      id: 's-4',
      name: 'Участок 4',
      variety: 'Ред Делишес',
      maturityPercent: 85,
      status: 'ready',
      recommendedDate: '10 – 15 сентября',
      area: 5.2,
      brix: 13.8,
      firmnessKgCm2: 7.2,
      starchIndex: 6.8,
      soilMoisturePercent: 62,
      ndviIndex: 0.81,
      ripeningHistory: [],
    },
  ];

  it('calculates total yield, pickers, bins, and refrigerated trucks accurately', () => {
    // Total area: 4.8 + 5.2 = 10.0 ha
    // Yield: 35 t/ha -> 350.0 tons
    const logistics = calculateHarvestLogistics(mockSectors, {
      harvestWindowDays: 14,
      pickerDailyNormKg: 750,
      binCapacityKg: 400,
      truckCapacityTons: 20,
    });

    expect(logistics.totalAreaHa).toBe(10);
    expect(logistics.totalTonsExpected).toBe(350);
    // Daily tons: 350 / 14 = 25.0 tons (25000 kg)
    expect(logistics.dailyTonsToHarvest).toBe(25);
    // Pickers: 25000 kg / 750 kg = 33.33 -> 34 pickers
    expect(logistics.pickersRequired).toBe(34);
    // Bins: 350000 kg / 400 kg = 875 bins
    expect(logistics.binsRequired).toBe(875);
    // Trucks: 350 / 20 = 17.5 -> 18 trucks
    expect(logistics.refrigeratedTrucksRequired).toBe(18);
  });
});
