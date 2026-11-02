import { ForecastSectorRow, SimulatedSectorForecast, WhatIfSimulationParams, RainCondition } from '../types';

interface MonthMeta {
  index: number;
  ruGenitive: string;
  enShort: string;
  daysInMonth: number;
}

const MONTHS: MonthMeta[] = [
  { index: 0, ruGenitive: 'января', enShort: 'Jan', daysInMonth: 31 },
  { index: 1, ruGenitive: 'февраля', enShort: 'Feb', daysInMonth: 28 },
  { index: 2, ruGenitive: 'марта', enShort: 'Mar', daysInMonth: 31 },
  { index: 3, ruGenitive: 'апреля', enShort: 'Apr', daysInMonth: 30 },
  { index: 4, ruGenitive: 'мая', enShort: 'May', daysInMonth: 31 },
  { index: 5, ruGenitive: 'июня', enShort: 'Jun', daysInMonth: 30 },
  { index: 6, ruGenitive: 'июля', enShort: 'Jul', daysInMonth: 31 },
  { index: 7, ruGenitive: 'августа', enShort: 'Aug', daysInMonth: 31 },
  { index: 8, ruGenitive: 'сентября', enShort: 'Sep', daysInMonth: 30 },
  { index: 9, ruGenitive: 'октября', enShort: 'Oct', daysInMonth: 31 },
  { index: 10, ruGenitive: 'ноября', enShort: 'Nov', daysInMonth: 30 },
  { index: 11, ruGenitive: 'декабря', enShort: 'Dec', daysInMonth: 31 },
];

/**
 * Calculates net day delta based on temperature anomaly and precipitation condition.
 * Negative delta = harvest is earlier; Positive delta = harvest is delayed.
 */
export function calculateDeltaDays(tempAnomaly: number, rainCondition: RainCondition): number {
  const tempShift = -1.5 * tempAnomaly;
  const rainShift = rainCondition === 'heavy' ? 2 : rainCondition === 'dry' ? -1 : 0;
  return Math.round(tempShift + rainShift);
}

/**
 * Adjusts a single day and month by a delta number of days.
 */
function shiftDayMonth(day: number, monthIdx: number, delta: number): { day: number; monthIdx: number } {
  let d = day + delta;
  let m = monthIdx;

  while (d < 1) {
    m = (m - 1 + 12) % 12;
    d += MONTHS[m].daysInMonth;
  }

  while (d > MONTHS[m].daysInMonth) {
    d -= MONTHS[m].daysInMonth;
    m = (m + 1) % 12;
  }

  return { day: d, monthIdx: m };
}

/**
 * Shifts a human-readable date range string (RU or EN) by deltaDays.
 * Examples:
 * "10 – 15 сентября", delta: -3 -> "07 – 12 сентября"
 * "25 сентября – 5 октября", delta: -3 -> "22 сентября – 02 октября"
 * "Sep 10 – Sep 15", delta: -3 -> "Sep 07 – Sep 12"
 */
export function shiftDateString(dateStr: string, deltaDays: number, isEnglish: boolean = false): string {
  if (deltaDays === 0 || !dateStr.trim()) {
    return dateStr;
  }

  const isEn = isEnglish || /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(dateStr);

  if (isEn) {
    // English format: "Sep 10 – Sep 15" or "Sep 25 – Oct 05"
    const enRegex = /([A-Za-z]{3})\s+(\d{1,2})\s*[-–—]\s*([A-Za-z]{3})?\s*(\d{1,2})/;
    const match = dateStr.match(enRegex);
    if (!match) return dateStr;

    const startMonthStr = match[1];
    const startDay = parseInt(match[2], 10);
    const endMonthStr = match[3] || startMonthStr;
    const endDay = parseInt(match[4], 10);

    const startMonthIdx = MONTHS.findIndex((m) => m.enShort.toLowerCase() === startMonthStr.toLowerCase());
    const endMonthIdx = MONTHS.findIndex((m) => m.enShort.toLowerCase() === endMonthStr.toLowerCase());

    if (startMonthIdx === -1 || endMonthIdx === -1) return dateStr;

    const shiftedStart = shiftDayMonth(startDay, startMonthIdx, deltaDays);
    const shiftedEnd = shiftDayMonth(endDay, endMonthIdx, deltaDays);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const startMonthName = MONTHS[shiftedStart.monthIdx].enShort;
    const endMonthName = MONTHS[shiftedEnd.monthIdx].enShort;

    return `${startMonthName} ${pad(shiftedStart.day)} – ${endMonthName} ${pad(shiftedEnd.day)}`;
  }

  // Russian format: "10 – 15 сентября" or "25 сентября – 5 октября"
  // Case A: Two months ("25 сентября – 5 октября")
  const twoMonthRegex = /(\d{1,2})\s+([а-яё]+)\s*[-–—]\s*(\d{1,2})\s+([а-яё]+)/i;
  const twoMatch = dateStr.match(twoMonthRegex);
  if (twoMatch) {
    const startDay = parseInt(twoMatch[1], 10);
    const startMonthStr = twoMatch[2].toLowerCase();
    const endDay = parseInt(twoMatch[3], 10);
    const endMonthStr = twoMatch[4].toLowerCase();

    const startMonthIdx = MONTHS.findIndex((m) => m.ruGenitive === startMonthStr);
    const endMonthIdx = MONTHS.findIndex((m) => m.ruGenitive === endMonthStr);

    if (startMonthIdx !== -1 && endMonthIdx !== -1) {
      const shiftedStart = shiftDayMonth(startDay, startMonthIdx, deltaDays);
      const shiftedEnd = shiftDayMonth(endDay, endMonthIdx, deltaDays);

      const startMonthName = MONTHS[shiftedStart.monthIdx].ruGenitive;
      const endMonthName = MONTHS[shiftedEnd.monthIdx].ruGenitive;

      if (startMonthName === endMonthName) {
        return `${shiftedStart.day} – ${shiftedEnd.day} ${startMonthName}`;
      }
      return `${shiftedStart.day} ${startMonthName} – ${shiftedEnd.day} ${endMonthName}`;
    }
  }

  // Case B: Single month ("10 – 15 сентября")
  const singleMonthRegex = /(\d{1,2})\s*[-–—]\s*(\d{1,2})\s+([а-яё]+)/i;
  const singleMatch = dateStr.match(singleMonthRegex);
  if (singleMatch) {
    const startDay = parseInt(singleMatch[1], 10);
    const endDay = parseInt(singleMatch[2], 10);
    const monthStr = singleMatch[3].toLowerCase();

    const monthIdx = MONTHS.findIndex((m) => m.ruGenitive === monthStr);
    if (monthIdx !== -1) {
      const shiftedStart = shiftDayMonth(startDay, monthIdx, deltaDays);
      const shiftedEnd = shiftDayMonth(endDay, monthIdx, deltaDays);

      const startMonthName = MONTHS[shiftedStart.monthIdx].ruGenitive;
      const endMonthName = MONTHS[shiftedEnd.monthIdx].ruGenitive;

      if (startMonthName === endMonthName) {
        return `${shiftedStart.day} – ${shiftedEnd.day} ${startMonthName}`;
      }
      return `${shiftedStart.day} ${startMonthName} – ${shiftedEnd.day} ${endMonthName}`;
    }
  }

  return dateStr;
}

/**
 * Generates an agronomic risk and recommendation notice based on simulation params.
 */
export function getSimulationRiskNotice(
  params: WhatIfSimulationParams,
  isEnglish: boolean = false
): { notice: string; isHighRisk: boolean } {
  const { tempAnomaly, rainCondition } = params;

  if (tempAnomaly >= 3) {
    return {
      notice: isEnglish
        ? 'High heat anomaly (+3°C+): Rapid maturity acceleration and premature fruit drop risk. Advance selective picking by 4–5 days recommended.'
        : 'Температурная аномалия (+3°C+): Ускоренное созревание и риск осыпания плодов. Рекомендуется начать выборочный съем на 4–5 дней раньше.',
      isHighRisk: true,
    };
  }

  if (rainCondition === 'heavy') {
    return {
      notice: isEnglish
        ? 'Heavy rainfall scenario: Increased risk of watercore and fungal rot. Firmness monitoring and 48h dry window before storage required.'
        : 'Сценарий обильных дождей: Повышен риск водянистости и развития серой гнили. Необходима выдержка 48 ч сухой погоды перед закладкой в РГС.',
      isHighRisk: true,
    };
  }

  if (rainCondition === 'dry') {
    return {
      notice: isEnglish
        ? 'Dry weather scenario: Soil moisture deficit accelerates flesh firmness loss. Weekly Brix refractometry is critical.'
        : 'Сценарий засухи: Дефицит влаги в почве ускоряет падение плотности мякоти. Рекомендуется внеочередной замер Brix рефрактометром.',
      isHighRisk: false,
    };
  }

  if (tempAnomaly <= -2) {
    return {
      notice: isEnglish
        ? 'Cold anomaly (-2°C or lower): Starch breakdown delayed. Recommend postponing harvest by 3–4 days to achieve target sugar content.'
        : 'Холодная аномалия (-2°C и ниже): Замедлен гидролиз крахмала. Рекомендуется сместить сбор на 3–4 дня позже для набора сахаристости.',
      isHighRisk: false,
    };
  }

  if (tempAnomaly !== 0) {
    const days = Math.abs(calculateDeltaDays(tempAnomaly, rainCondition));
    const direction = tempAnomaly > 0 ? (isEnglish ? 'earlier' : 'раньше') : (isEnglish ? 'later' : 'позже');
    return {
      notice: isEnglish
        ? `Moderate temperature shift (${tempAnomaly > 0 ? '+' : ''}${tempAnomaly}°C): Harvest dates adjusted by ${days} days ${direction}.`
        : `Умеренное отклонение температуры (${tempAnomaly > 0 ? '+' : ''}${tempAnomaly}°C): Сроки сбора скорректированы на ${days} дн. ${direction}.`,
      isHighRisk: false,
    };
  }

  return {
    notice: isEnglish
      ? 'Optimal baseline agro-climatic conditions for balanced ripening and long-term CA storage.'
      : 'Базовые агрометеорологические условия оптимальны для равномерного созревания и длительного хранения в РГС.',
    isHighRisk: false,
  };
}

/**
 * Runs the What-If simulation on a list of forecast sector rows.
 */
export function simulateHarvestForecast(
  rows: ForecastSectorRow[],
  params: WhatIfSimulationParams,
  isEnglish: boolean = false
): SimulatedSectorForecast[] {
  const deltaDays = calculateDeltaDays(params.tempAnomaly, params.rainCondition);
  const { notice } = getSimulationRiskNotice(params, isEnglish);

  return rows.map((row) => {
    // Maturity shift
    const maturityDelta = Math.round(params.tempAnomaly * 2 + (params.rainCondition === 'dry' ? 2 : params.rainCondition === 'heavy' ? -1 : 0));
    const simulatedMaturity = Math.max(15, Math.min(100, row.maturityPercent + maturityDelta));

    // Date shift
    const simulatedDate = shiftDateString(row.recommendedDate, deltaDays, isEnglish);

    return {
      ...row,
      originalDate: row.recommendedDate,
      simulatedDate,
      deltaDays,
      simulatedMaturityPercent: simulatedMaturity,
      riskNotice: notice,
      riskNoticeEn: notice,
    };
  });
}
