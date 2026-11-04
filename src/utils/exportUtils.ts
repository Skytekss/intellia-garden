import { SimulatedSectorForecast, FarmProfile, GardenSector, FarmData } from '../types';

/**
 * Escapes a cell value for safe CSV formatting.
 */
function escapeCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  if (str.includes(',') || str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Builds CSV string content from simulated sector forecasts.
 */
export function buildForecastCsvContent(
  rows: SimulatedSectorForecast[],
  farmProfile: FarmProfile,
  isEnglish: boolean = false
): string {
  const headers = isEnglish
    ? [
        'Sector Name',
        'Apple Variety',
        'Baseline Readiness (%)',
        'Simulated Readiness (%)',
        'Baseline Harvest Window',
        'Simulated Harvest Window',
        'Shift (Days)',
        'Risk & Agronomic Recommendation',
      ]
    : [
        'Участок',
        'Сорт яблок',
        'Базовая зрелость (%)',
        'Смоделированная зрелость (%)',
        'Базовое окно сбора',
        'Смоделированное окно сбора',
        'Сдвиг (дней)',
        'Агрономический риск и рекомендации',
      ];

  const metaRows = [
    isEnglish
      ? [`"INTELLIA Smart Orchard — Harvest Forecast Report"`]
      : [`"ИНТЕЛЛИЯ — Отчет по прогнозированию сроков уборки яблок"`],
    isEnglish
      ? [`"Farm:",${escapeCsvCell(farmProfile.name)},"Region:",${escapeCsvCell(farmProfile.region)},"Total Area:",${escapeCsvCell(`${farmProfile.areaHa} ha`)}`]
      : [`"Хозяйство:",${escapeCsvCell(farmProfile.name)},"Регион:",${escapeCsvCell(farmProfile.region)},"Общая площадь:",${escapeCsvCell(`${farmProfile.areaHa} га`)}`],
    isEnglish
      ? [`"Generated at:",${escapeCsvCell(new Date().toLocaleDateString('en-US'))}`]
      : [`"Дата генерации:",${escapeCsvCell(new Date().toLocaleDateString('ru-RU'))}`],
    [], // empty line
  ];

  const dataRows = rows.map((r) => [
    escapeCsvCell(r.name),
    escapeCsvCell(r.variety),
    escapeCsvCell(r.maturityPercent),
    escapeCsvCell(r.simulatedMaturityPercent),
    escapeCsvCell(r.originalDate),
    escapeCsvCell(r.simulatedDate),
    escapeCsvCell(r.deltaDays === 0 ? '0' : r.deltaDays > 0 ? `+${r.deltaDays}` : `${r.deltaDays}`),
    escapeCsvCell(isEnglish ? r.riskNoticeEn || r.riskNotice : r.riskNotice),
  ]);

  const allLines = [
    ...metaRows.map((r) => r.join(',')),
    headers.map(escapeCsvCell).join(','),
    ...dataRows.map((r) => r.join(',')),
  ];

  // Prepend UTF-8 Byte Order Mark (\uFEFF) for Excel compatibility
  return '\uFEFF' + allLines.join('\r\n');
}

/**
 * Initiates browser download of the generated CSV report.
 */
export function downloadForecastCsv(
  rows: SimulatedSectorForecast[],
  farmProfile: FarmProfile,
  isEnglish: boolean = false
): void {
  const csvContent = buildForecastCsvContent(rows, farmProfile, isEnglish);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const farmSlug = farmProfile.name.toLowerCase().replace(/[^a-z0-9а-яё]/gi, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `intellia_harvest_forecast_${farmSlug}_${dateStr}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Builds CSV string content for a single sector agronomic passport.
 */
export function buildSectorPassportCsvContent(
  sector: GardenSector,
  farm: FarmProfile | FarmData,
  isEnglish: boolean = false
): string {
  const farmName = farm.name;
  const region = farm.region;

  const metaRows = [
    isEnglish
      ? [`"INTELLIA Smart Orchard — Sector Agronomic Passport"`]
      : [`"ИНТЕЛЛИЯ — Агрономический паспорт участка сада"`],
    isEnglish
      ? [
          `"Sector:",${escapeCsvCell(sector.name)},"Variety:",${escapeCsvCell(sector.variety)},"Area:",${escapeCsvCell(`${sector.area} ha`)}`,
        ]
      : [
          `"Участок:",${escapeCsvCell(sector.name)},"Сорт:",${escapeCsvCell(sector.variety)},"Площадь:",${escapeCsvCell(`${sector.area} га`)}`,
        ],
    isEnglish
      ? [`"Farm:",${escapeCsvCell(farmName)},"Region:",${escapeCsvCell(region)}`]
      : [`"Хозяйство:",${escapeCsvCell(farmName)},"Регион:",${escapeCsvCell(region)}`],
    isEnglish
      ? [
          `"Readiness:",${escapeCsvCell(`${sector.maturityPercent}%`)},"Status:",${escapeCsvCell(sector.status)},"Recommended Harvest:",${escapeCsvCell(sector.recommendedDate)}`,
        ]
      : [
          `"Готовность:",${escapeCsvCell(`${sector.maturityPercent}%`)},"Статус:",${escapeCsvCell(sector.status)},"Окно сбора:",${escapeCsvCell(sector.recommendedDate)}`,
        ],
    isEnglish
      ? [`"Exported At:",${escapeCsvCell(new Date().toLocaleDateString('en-US'))}`]
      : [`"Дата выгрузки:",${escapeCsvCell(new Date().toLocaleDateString('ru-RU'))}`],
    [], // empty line
  ];

  const metricHeaders = isEnglish
    ? ['Indicator / Metric', 'Value', 'Unit', 'Agronomic Reference Range']
    : ['Показатель / Метрика', 'Значение', 'Единица измерения', 'Агрономическая норма'];

  const metricRows = [
    [
      escapeCsvCell(isEnglish ? 'Sugar Content (Brix)' : 'Сахаристость (Brix)'),
      escapeCsvCell(sector.brix),
      escapeCsvCell('°Bx'),
      escapeCsvCell('13.0 – 15.0 °Bx'),
    ],
    [
      escapeCsvCell(isEnglish ? 'Flesh Firmness' : 'Плотность мякоти'),
      escapeCsvCell(sector.firmnessKgCm2),
      escapeCsvCell(isEnglish ? 'kg/cm²' : 'кг/см²'),
      escapeCsvCell(isEnglish ? '6.5 – 7.5 kg/cm²' : '6.5 – 7.5 кг/см²'),
    ],
    [
      escapeCsvCell(isEnglish ? 'Starch Regression Index' : 'Индекс крахмала (CTIFL)'),
      escapeCsvCell(sector.starchIndex),
      escapeCsvCell('/ 10'),
      escapeCsvCell(isEnglish ? 'CTIFL scale (4 – 6)' : 'Шкала CTIFL (4 – 6)'),
    ],
    [
      escapeCsvCell(isEnglish ? 'Soil Moisture' : 'Влажность почвы'),
      escapeCsvCell(sector.soilMoisturePercent),
      escapeCsvCell('%'),
      escapeCsvCell('60 – 70%'),
    ],
    [
      escapeCsvCell(isEnglish ? 'Vegetation Index (NDVI)' : 'Индекс вегетации (NDVI)'),
      escapeCsvCell(sector.ndviIndex),
      escapeCsvCell('idx'),
      escapeCsvCell(isEnglish ? '> 0.75 (Healthy canopy)' : '> 0.75 (Здоровый полог)'),
    ],
    [
      escapeCsvCell(isEnglish ? 'Overall Harvest Readiness' : 'Общая готовность к сбору'),
      escapeCsvCell(sector.maturityPercent),
      escapeCsvCell('%'),
      escapeCsvCell(isEnglish ? '80 – 90% optimal' : '80 – 90% оптимум'),
    ],
  ];

  const historyHeader = isEnglish
    ? ['Ripening Observation Date', 'Readiness (%)']
    : ['Дата замера созревания', 'Готовность (%)'];

  const historyRows = (sector.ripeningHistory || []).map((h) => [
    escapeCsvCell(h.date),
    escapeCsvCell(h.percent),
  ]);

  const allLines = [
    ...metaRows.map((r) => r.join(',')),
    metricHeaders.map(escapeCsvCell).join(','),
    ...metricRows.map((r) => r.join(',')),
    [],
    historyHeader.map(escapeCsvCell).join(','),
    ...historyRows.map((r) => r.join(',')),
  ];

  return '\uFEFF' + allLines.join('\r\n');
}

/**
 * Initiates browser download of the generated Sector Passport CSV report.
 */
export function downloadSectorPassportCsv(
  sector: GardenSector,
  farm: FarmProfile | FarmData,
  isEnglish: boolean = false
): void {
  const csvContent = buildSectorPassportCsvContent(sector, farm, isEnglish);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const sectorSlug = sector.name.toLowerCase().replace(/[^a-z0-9а-яё]/gi, '_');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `intellia_passport_${sectorSlug}_${dateStr}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
