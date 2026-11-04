import { describe, it, expect } from 'vitest';
import { calculateSectorGdd, GDD_BASE_TEMPERATURE_C } from '../gddModel';
import { GardenSector } from '../../types';

describe('gddModel (Growing Degree Days Calculation)', () => {
  const mockGalaSector: GardenSector = {
    id: 'sector-1',
    name: 'Участок 1',
    variety: 'Гала',
    maturityPercent: 45,
    status: 'ripening',
    recommendedDate: '25 сентября – 5 октября',
    area: 5.2,
    brix: 11.2,
    firmnessKgCm2: 8.4,
    starchIndex: 3.2,
    soilMoisturePercent: 65,
    ndviIndex: 0.82,
    ripeningHistory: [],
  };

  const mockRedDeliciousSector: GardenSector = {
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

  it('calculates baseline GDD metrics for Gala cultivar accurately', () => {
    const analysis = calculateSectorGdd(mockGalaSector, 20, 0, 'optimal');

    expect(analysis.baseTempC).toBe(GDD_BASE_TEMPERATURE_C);
    expect(analysis.targetGdd).toBe(1300);
    // 45% of 1300 = 585
    expect(analysis.accumulatedGdd).toBe(585);
    expect(analysis.progressPercent).toBe(45);
    expect(analysis.dailyGddRate).toBe(10); // 20 - 10 = 10 GDD/day
    // Remaining = 1300 - 585 = 715 / 10 = 72 days
    expect(analysis.daysRemaining).toBe(72);
    expect(analysis.status).toBe('optimal');
  });

  it('calculates metrics for mature Red Delicious and reflects high progress', () => {
    const analysis = calculateSectorGdd(mockRedDeliciousSector, 20, 0, 'optimal');

    expect(analysis.targetGdd).toBe(1550);
    // 85% of 1550 = 1318
    expect(analysis.accumulatedGdd).toBe(1318);
    expect(analysis.progressPercent).toBe(85);
    expect(analysis.daysRemaining).toBeLessThan(25);
  });

  it('adapts to positive thermal anomaly (accelerated ripening)', () => {
    const warmAnalysis = calculateSectorGdd(mockGalaSector, 20, 3, 'optimal');

    expect(warmAnalysis.status).toBe('accelerated');
    expect(warmAnalysis.dailyGddRate).toBeGreaterThan(10);
    expect(warmAnalysis.statusLabelRu).toContain('Ускоренное созревание');
    expect(warmAnalysis.statusLabelEn).toContain('Accelerated ripening');
  });

  it('adapts to negative thermal anomaly (delayed ripening)', () => {
    const coolAnalysis = calculateSectorGdd(mockGalaSector, 20, -3, 'optimal');

    expect(coolAnalysis.status).toBe('under');
    expect(coolAnalysis.dailyGddRate).toBeLessThan(10);
    expect(coolAnalysis.statusLabelRu).toContain('Замедленное созревание');
  });

  it('handles unknown cultivars gracefully with default fallback thresholds', () => {
    const unknownSector = { ...mockGalaSector, variety: 'Ред Крафт' };
    const analysis = calculateSectorGdd(unknownSector, 20, 0, 'optimal');

    expect(analysis.targetGdd).toBe(1450);
    expect(analysis.progressPercent).toBe(45);
  });
});
