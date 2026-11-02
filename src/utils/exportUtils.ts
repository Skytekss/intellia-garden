import { SimulatedSectorForecast, FarmProfile } from '../types';

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
