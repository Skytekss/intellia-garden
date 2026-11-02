import { describe, it, expect } from 'vitest';
import { buildForecastCsvContent } from '../exportUtils';
import { SimulatedSectorForecast, FarmProfile } from '../../types';

describe('exportUtils', () => {
  const mockFarm: FarmProfile = {
    name: 'Ферма «Золотой Сад»',
    region: 'Тульская область',
    areaHa: 22.0,
    lastSurveyDate: '12.08.2025',
  };

  const mockSimulatedRows: SimulatedSectorForecast[] = [
    {
      id: 's-1',
      name: 'Участок 1',
      variety: 'Гала',
      maturityPercent: 45,
      simulatedMaturityPercent: 49,
      statusColor: 'yellow',
      recommendedDate: '22 сентября – 2 октября',
      originalDate: '25 сентября – 5 октября',
      simulatedDate: '22 сентября – 2 октября',
      deltaDays: -3,
      riskNotice: 'Умеренное отклонение температуры',
    },
  ];

  it('generates valid UTF-8 BOM CSV with farm metadata, headers and sector details', () => {
    const csv = buildForecastCsvContent(mockSimulatedRows, mockFarm, false);

    // Starts with UTF-8 BOM
    expect(csv.charCodeAt(0)).toBe(0xFEFF);

    // Contains metadata
    expect(csv).toContain('ИНТЕЛЛИЯ — Отчет по прогнозированию');
    expect(csv).toContain('Ферма «Золотой Сад»');
    expect(csv).toContain('Тульская область');

    // Contains headers
    expect(csv).toContain('"Участок","Сорт яблок","Базовая зрелость (%)"');

    // Contains row data
    expect(csv).toContain('Участок 1');
    expect(csv).toContain('Гала');
    expect(csv).toContain('-3');
  });
});
