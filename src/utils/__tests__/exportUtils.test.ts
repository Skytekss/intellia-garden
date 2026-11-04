import { describe, it, expect } from 'vitest';
import { buildForecastCsvContent, buildSectorPassportCsvContent } from '../exportUtils';
import { SimulatedSectorForecast, FarmProfile, GardenSector } from '../../types';

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
    ripeningHistory: [
      { date: '01.08', percent: 60 },
      { date: '15.08', percent: 85 },
    ],
  };

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

  it('generates valid sector passport CSV with physicochemical metrics and history', () => {
    const csvRu = buildSectorPassportCsvContent(mockSector, mockFarm, false);
    expect(csvRu.charCodeAt(0)).toBe(0xFEFF);
    expect(csvRu).toContain('Агрономический паспорт участка сада');
    expect(csvRu).toContain('Участок 4');
    expect(csvRu).toContain('Ред Делишес');
    expect(csvRu).toContain('14.5');
    expect(csvRu).toContain('7.2');
    expect(csvRu).toContain('0.86');

    const csvEn = buildSectorPassportCsvContent(mockSector, mockFarm, true);
    expect(csvEn).toContain('Sector Agronomic Passport');
    expect(csvEn).toContain('Sugar Content (Brix)');
    expect(csvEn).toContain('Flesh Firmness');
  });
});
