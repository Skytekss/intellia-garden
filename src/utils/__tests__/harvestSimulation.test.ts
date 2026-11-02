import { describe, it, expect } from 'vitest';
import {
  calculateDeltaDays,
  shiftDateString,
  getSimulationRiskNotice,
  simulateHarvestForecast,
} from '../harvestSimulation';
import { ForecastSectorRow } from '../../types';

describe('harvestSimulation utility', () => {
  describe('calculateDeltaDays', () => {
    it('returns 0 for normal baseline conditions', () => {
      expect(calculateDeltaDays(0, 'optimal')).toBe(0);
    });

    it('calculates negative delta (earlier harvest) when temperature is higher', () => {
      // +2°C -> -1.5 * 2 = -3
      expect(calculateDeltaDays(2, 'optimal')).toBe(-3);
      // +4°C -> -1.5 * 4 = -6
      expect(calculateDeltaDays(4, 'optimal')).toBe(-6);
    });

    it('calculates positive delta (delayed harvest) when temperature is lower', () => {
      // -2°C -> -1.25 * -2 = +2.5 -> +3
      expect(calculateDeltaDays(-2, 'optimal')).toBe(3);
    });

    it('factors in precipitation conditions', () => {
      // Heavy rain delays by +2 days
      expect(calculateDeltaDays(0, 'heavy')).toBe(2);
      // Drought accelerates by -1 day
      expect(calculateDeltaDays(0, 'dry')).toBe(-1);
      // Combined: +2°C and heavy rain: -2.5 + 2 = -0.5 -> 0 or -1
      expect(calculateDeltaDays(2, 'heavy')).toBe(-1);
    });
  });

  describe('shiftDateString', () => {
    it('returns original string if deltaDays is 0', () => {
      expect(shiftDateString('10 – 15 сентября', 0)).toBe('10 – 15 сентября');
    });

    it('shifts Russian single-month date ranges correctly', () => {
      // Shifting backwards by 3 days
      expect(shiftDateString('10 – 15 сентября', -3)).toBe('7 – 12 сентября');
      // Shifting forward by 2 days
      expect(shiftDateString('10 – 15 сентября', 2)).toBe('12 – 17 сентября');
    });

    it('shifts Russian multi-month date ranges across month boundaries', () => {
      // 25 сентября – 5 октября shifted by -3 days
      expect(shiftDateString('25 сентября – 5 октября', -3)).toBe('22 сентября – 2 октября');
      // 3 – 8 октября shifted by -5 days
      expect(shiftDateString('3 – 8 октября', -5)).toBe('28 сентября – 3 октября');
    });

    it('shifts English date ranges', () => {
      expect(shiftDateString('Sep 10 – Sep 15', -3, true)).toBe('Sep 07 – Sep 12');
      expect(shiftDateString('Sep 25 – Oct 05', -3, true)).toBe('Sep 22 – Oct 02');
    });
  });

  describe('getSimulationRiskNotice', () => {
    it('returns high risk notice for heat anomaly >= 3°C', () => {
      const res = getSimulationRiskNotice({ tempAnomaly: 3.5, rainCondition: 'optimal' });
      expect(res.isHighRisk).toBe(true);
      expect(res.notice).toContain('Температурная аномалия');
    });

    it('returns heavy rain warning when rainCondition is heavy', () => {
      const res = getSimulationRiskNotice({ tempAnomaly: 0, rainCondition: 'heavy' });
      expect(res.isHighRisk).toBe(true);
      expect(res.notice).toContain('обильных дождей');
    });

    it('returns optimal baseline text when condition is normal', () => {
      const res = getSimulationRiskNotice({ tempAnomaly: 0, rainCondition: 'optimal' });
      expect(res.isHighRisk).toBe(false);
      expect(res.notice).toContain('оптимальны');
    });
  });

  describe('simulateHarvestForecast', () => {
    const mockRows: ForecastSectorRow[] = [
      {
        id: 's-1',
        name: 'Участок 1',
        variety: 'Гала',
        maturityPercent: 45,
        statusColor: 'yellow',
        recommendedDate: '25 сентября – 5 октября',
      },
      {
        id: 's-4',
        name: 'Участок 4',
        variety: 'Ред Делишес',
        maturityPercent: 85,
        statusColor: 'green',
        recommendedDate: '10 – 15 сентября',
      },
    ];

    it('simulates shifted forecast with updated maturity and delta', () => {
      const result = simulateHarvestForecast(mockRows, { tempAnomaly: 2, rainCondition: 'optimal' });

      expect(result).toHaveLength(2);
      expect(result[0].deltaDays).toBe(-3);
      expect(result[0].originalDate).toBe('25 сентября – 5 октября');
      expect(result[0].simulatedDate).toBe('22 сентября – 2 октября');
      expect(result[0].simulatedMaturityPercent).toBe(49); // +4%

      expect(result[1].deltaDays).toBe(-3);
      expect(result[1].simulatedDate).toBe('7 – 12 сентября');
      expect(result[1].simulatedMaturityPercent).toBe(89); // +4%
    });
  });
});
