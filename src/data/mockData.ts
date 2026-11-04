import { GardenSector, BentoItem, WeatherTelemetry, FarmProfile, AgroRecord, MeteoTelemetryData, ForecastSectorRow, NavigationTab } from '../types';

export const mockFarmProfile: FarmProfile = {
  name: 'Ферма «Золотой Сад»',
  areaHa: 22.0,
  region: 'Тульская область',
  lastSurveyDate: '12.08.2025',
};

export const mockWeather: WeatherTelemetry = {
  temperature: 18,
  condition: 'Ясно, без осадков',
  precipitationMm: 0,
  humidityPercent: 65,
};

export const mockBentoItems: BentoItem[] = [
  {
    id: 'drone',
    title: 'Гиперспектральные данные с дрона',
    subtitle: 'Анализ состояния деревьев и плодов',
    category: 'drone',
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    iconColor: '#10b981',
  },
  {
    id: 'agritech',
    title: 'Агротехнические данные',
    subtitle: 'Полив, удобрения, обработка',
    category: 'agritech',
    iconBg: 'bg-teal-50 text-teal-600 border border-teal-100',
    iconColor: '#14b8a6',
  },
  {
    id: 'meteo',
    title: 'Метеоданные',
    subtitle: 'Температура, осадки, погода',
    category: 'meteo',
    iconBg: 'bg-sky-50 text-sky-600 border border-sky-100',
    iconColor: '#0284c7',
  },
  {
    id: 'ai',
    title: 'AI-аналитика',
    subtitle: 'Карта зрелости и рекомендации',
    category: 'ai',
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
    iconColor: '#8b5cf6',
  },
];

export const mockSectors: GardenSector[] = [
  {
    id: 'sector-1',
    name: 'Участок 1',
    variety: 'Гала',
    maturityPercent: 45,
    status: 'early',
    recommendedDate: '25 сентября – 5 октября',
    area: 4.8,
    brix: 11.2,
    firmnessKgCm2: 8.4,
    starchIndex: 2.1,
    soilMoisturePercent: 65,
    ndviIndex: 0.69,
    ripeningHistory: [
      { date: '01.08', percent: 18 },
      { date: '08.08', percent: 26 },
      { date: '15.08', percent: 34 },
      { date: '22.08', percent: 40 },
      { date: '28.08', percent: 45 },
    ],
  },
  {
    id: 'sector-2',
    name: 'Участок 2',
    variety: 'Фуджи',
    maturityPercent: 52,
    status: 'early',
    recommendedDate: '20 – 28 сентября',
    area: 4.2,
    brix: 12.1,
    firmnessKgCm2: 8.0,
    starchIndex: 3.0,
    soilMoisturePercent: 68,
    ndviIndex: 0.72,
    ripeningHistory: [
      { date: '01.08', percent: 24 },
      { date: '08.08', percent: 32 },
      { date: '15.08', percent: 40 },
      { date: '22.08', percent: 46 },
      { date: '28.08', percent: 52 },
    ],
  },
  {
    id: 'sector-3',
    name: 'Участок 3',
    variety: 'Голден',
    maturityPercent: 60,
    status: 'ripening',
    recommendedDate: '18 – 25 сентября',
    area: 3.9,
    brix: 12.8,
    firmnessKgCm2: 7.5,
    starchIndex: 3.8,
    soilMoisturePercent: 70,
    ndviIndex: 0.75,
    ripeningHistory: [
      { date: '01.08', percent: 25 },
      { date: '08.08', percent: 35 },
      { date: '15.08', percent: 44 },
      { date: '22.08', percent: 52 },
      { date: '28.08', percent: 60 },
    ],
  },
  {
    id: 'sector-4',
    name: 'Участок 4',
    variety: 'Ред Делишес',
    maturityPercent: 85,
    status: 'ready',
    recommendedDate: '10 – 15 сентября',
    area: 5.1,
    brix: 14.5,
    firmnessKgCm2: 6.8,
    starchIndex: 6.2,
    soilMoisturePercent: 72,
    ndviIndex: 0.84,
    ripeningHistory: [
      { date: '01.08', percent: 45 },
      { date: '08.08', percent: 60 },
      { date: '15.08', percent: 72 },
      { date: '22.08', percent: 80 },
      { date: '28.08', percent: 85 },
    ],
  },
  {
    id: 'sector-5',
    name: 'Участок 5',
    variety: 'Гала',
    maturityPercent: 78,
    status: 'ripening',
    recommendedDate: '15 – 22 сентября',
    area: 4.0,
    brix: 13.9,
    firmnessKgCm2: 7.0,
    starchIndex: 5.1,
    soilMoisturePercent: 66,
    ndviIndex: 0.80,
    ripeningHistory: [
      { date: '01.08', percent: 38 },
      { date: '08.08', percent: 52 },
      { date: '15.08', percent: 64 },
      { date: '22.08', percent: 72 },
      { date: '28.08', percent: 78 },
    ],
  },
];

// Computed metrics from single source of truth
export const totalFarmAreaHa = Number(mockSectors.reduce((acc, s) => acc + s.area, 0).toFixed(1)); // 22.0
export const averageFruitReadiness = Math.round(mockSectors.reduce((acc, s) => acc + s.maturityPercent, 0) / mockSectors.length); // 64
export const averageSoilMoisture = Math.round(mockSectors.reduce((acc, s) => acc + s.soilMoisturePercent, 0) / mockSectors.length); // 68

// Unified maturity color and status metadata (SSOT)
export interface MaturityMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  progressBarBg: string;
  hexColor: string;
  statusColorName: 'red' | 'orange' | 'yellow' | 'green' | 'blue';
}

export const getMaturityColor = (percent: number): string => {
  if (percent >= 75) return '#059669'; // Emerald green (optimal ready >=75%)
  if (percent >= 60) return '#84cc16'; // Lime / yellow-green (medium ripening 60-74%)
  if (percent >= 45) return '#f59e0b'; // Amber / warm orange (early ripening 45-59%)
  return '#ef4444'; // Red (early / immature <45%)
};

export const getMaturityMetadata = (percent: number): MaturityMeta => {
  if (percent >= 75) {
    return {
      label: 'Готов к сбору',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      progressBarBg: 'bg-emerald-500',
      hexColor: '#059669',
      statusColorName: 'green',
    };
  }
  if (percent >= 60) {
    return {
      label: 'Средняя зрелость',
      badgeBg: 'bg-lime-50',
      badgeText: 'text-lime-700',
      badgeBorder: 'border-lime-200',
      progressBarBg: 'bg-lime-500',
      hexColor: '#84cc16',
      statusColorName: 'yellow',
    };
  }
  if (percent >= 45) {
    return {
      label: 'Начало созревания',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
      progressBarBg: 'bg-amber-500',
      hexColor: '#f59e0b',
      statusColorName: 'orange',
    };
  }
  return {
    label: 'Ранняя зрелость',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    progressBarBg: 'bg-rose-500',
    hexColor: '#ef4444',
    statusColorName: 'red',
  };
};

export const mockForecastRows: ForecastSectorRow[] = mockSectors.map((sector) => {
  const meta = getMaturityMetadata(sector.maturityPercent);
  return {
    id: sector.id.replace('sector-', 'forecast-'),
    name: sector.name,
    variety: sector.variety,
    maturityPercent: sector.maturityPercent,
    statusColor: meta.statusColorName,
    recommendedDate: sector.recommendedDate,
  };
});

export interface ForecastRecommendationItem {
  id: string;
  priority: string;
  priorityColor: string;
  title: string;
  description: string;
  actionText: string;
  targetTab: NavigationTab;
  iconName: 'calendar' | 'truck' | 'sparkles';
}

export const mockRecommendations: ForecastRecommendationItem[] = [
  {
    id: 'rec-1',
    priority: 'Высокий приоритет',
    priorityColor: 'bg-red-50 text-red-700 border-red-200',
    title: 'Участок 4 (Ред Делишес) — старт сбора 10 – 15 сентября',
    description:
      'Зрелость плодов достигла 85%, сахаристость 14.5 °Bx, плотность 6.8 кг/см² оптимальна для закладки на длительное хранение. Задержка более 5 дней может привести к перезреванию и падению лежкости.',
    actionText: 'Перейти к карте сектора',
    targetTab: 'map',
    iconName: 'calendar',
  },
  {
    id: 'rec-2',
    priority: 'Средний приоритет',
    priorityColor: 'bg-orange-50 text-orange-700 border-orange-200',
    title: 'Участок 5 (Гала) — подготовка тары и бригад на 15 – 22 сентября',
    description:
      'Зрелость 78%. Рекомендуется прекратить внекорневые подкормки за 7 дней до начала сбора и зарезервировать калиброванные деревянные контейнеры.',
    actionText: 'Просмотреть агро-данные',
    targetTab: 'data',
    iconName: 'truck',
  },
  {
    id: 'rec-3',
    priority: 'Плановый контроль',
    priorityColor: 'bg-sky-50 text-sky-700 border-sky-200',
    title: 'Участки 1, 2 и 3 (Гала, Фуджи, Голден) — контроль полива',
    description:
      'Степень зрелости от 45% до 60%. Оптимальный режим влажности почвы — 65–70%. Рекомендуется повторный мониторинг дроном 5 сентября для контроля темпов созревания.',
    actionText: 'Открыть карту сада',
    targetTab: 'map',
    iconName: 'sparkles',
  },
];

export const initialAgroRecords: AgroRecord[] = [
  {
    id: 'agro-1',
    type: 'Полив',
    title: 'Полив',
    date: '05.07.2025',
    sector: 'Все участки',
    notes: 'Капельное орошение 12 м³/га',
  },
  {
    id: 'agro-2',
    type: 'Удобрения',
    title: 'Удобрения',
    date: '15.06.2025',
    sector: 'Участок 2, Участок 5',
    notes: 'Внесение калийных комплексов',
  },
  {
    id: 'agro-3',
    type: 'Обработка',
    title: 'Обработка',
    date: '28.06.2025',
    sector: 'Все участки',
    notes: 'Профилактическая защита биофунгицидом',
  },
];

export const initialMeteoData: MeteoTelemetryData = {
  temperature: 22,
  precipitationMm: 0,
  humidityPercent: 65,
  lastSyncTime: '12.08.2025 09:40',
};

export const droneModelsList: string[] = [
  'DJI Mavic 3M',
  'DJI Matrice 350 RTK + MS600',
  'AgEagle eBee X',
  'WingtraOne GEN II',
];

export * from './mockSettings';
export * from './mockNotifications';
