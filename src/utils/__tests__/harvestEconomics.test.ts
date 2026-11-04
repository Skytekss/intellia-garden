import { describe, it, expect } from 'vitest';
import { calculateHarvestEconomics, DEFAULT_ECONOMICS_PARAMS } from '../harvestEconomics';
import { GardenSector } from '../../types';

describe('harvestEconomics (Revenue vs Harvest Window Optimization)', () => {
  const mockSector: GardenSector = {
    id: 'sector-4',
    name: 'Участок 4',
    variety: 'Ред Делишес',
    maturityPercent: 85,
    status: 'ready',
    recommendedDate: '10 – 15 сентября',
    area: 4.8,
    brix: 14.5,
    firmnessKgCm2: 7.2,
    starchIndex: 5.5,
    soilMoisturePercent: 62,
    ndviIndex: 0.86,
    ripeningHistory: [],
  };

  it('computes total yield and peak revenue at optimal harvest window', () => {
    const result = calculateHarvestEconomics(mockSector, DEFAULT_ECONOMICS_PARAMS, false);

    // 4.8 ha * 35 t/ha = 168 tons = 168,000 kg
    expect(result.totalYieldKg).toBe(168000);
    expect(result.maxRevenueRub).toBeGreaterThan(15000000); // > 15 million rubles
    expect(result.curve.length).toBe(6);

    const optimalPoint = result.curve.find((c) => c.isOptimal);
    expect(optimalPoint).toBeDefined();
    expect(optimalPoint?.totalRevenueRub).toBe(result.maxRevenueRub);
  });

  it('demonstrates early harvest penalties due to smaller fruit caliber and weight', () => {
    const result = calculateHarvestEconomics(mockSector, DEFAULT_ECONOMICS_PARAMS, false);

    expect(result.earlyHarvestPenaltyRub).toBeGreaterThan(500000);
    const earlyPoint = result.curve[0];
    expect(earlyPoint.totalRevenueRub).toBeLessThan(result.maxRevenueRub);
  });

  it('demonstrates late harvest penalties due to accelerated fruit drop and softening', () => {
    const result = calculateHarvestEconomics(mockSector, DEFAULT_ECONOMICS_PARAMS, false);

    expect(result.lateHarvestPenaltyRub).toBeGreaterThan(1000000);
    const latePoint = result.curve[result.curve.length - 1];
    expect(latePoint.dropPercent).toBeGreaterThan(15); // significant drop
    expect(latePoint.totalRevenueRub).toBeLessThan(result.maxRevenueRub);
  });

  it('adapts when CA storage share is increased (higher revenue)', () => {
    const lowStorage = calculateHarvestEconomics(mockSector, {
      ...DEFAULT_ECONOMICS_PARAMS,
      caStorageSharePercent: 20,
    });

    const highStorage = calculateHarvestEconomics(mockSector, {
      ...DEFAULT_ECONOMICS_PARAMS,
      caStorageSharePercent: 80,
    });

    expect(highStorage.maxRevenueRub).toBeGreaterThan(lowStorage.maxRevenueRub);
  });
});
