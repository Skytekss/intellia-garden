import { GardenSector, BentoItem, WeatherTelemetry, FarmProfile, AgroRecord, MeteoTelemetryData, ForecastSectorRow } from '../types';

export const mockFarmProfile: FarmProfile = {
  name: 'Ферма «Золотой Сад»',
  areaHa: 4.2,
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
    maturityPercent: 85,
    status: 'ready',
    recommendedDate: '10 – 15 сентября',
    area: 4.8,
    brix: 14.5,
    firmnessKgCm2: 6.8,
    starchIndex: 6.2,
    soilMoisturePercent: 65,
    ndviIndex: 0.82,
    ripeningHistory: [
      { date: '01.08', percent: 45 },
      { date: '08.08', percent: 60 },
      { date: '15.08', percent: 72 },
      { date: '22.08', percent: 80 },
      { date: '28.08', percent: 85 },
    ],
  },
  {
    id: 'sector-2',
    name: 'Участок 2',
    variety: 'Фуджи',
    maturityPercent: 72,
    status: 'ripening',
    recommendedDate: '15 – 22 сентября',
    area: 4.2,
    brix: 13.8,
    firmnessKgCm2: 7.2,
    starchIndex: 4.5,
    soilMoisturePercent: 68,
    ndviIndex: 0.78,
    ripeningHistory: [
      { date: '01.08', percent: 35 },
      { date: '08.08', percent: 48 },
      { date: '15.08', percent: 58 },
      { date: '22.08', percent: 66 },
      { date: '28.08', percent: 72 },
    ],
  },
  {
    id: 'sector-3',
    name: 'Участок 3',
    variety: 'Голден',
    maturityPercent: 60,
    status: 'ripening',
    recommendedDate: '20 – 28 сентября',
    area: 3.9,
    brix: 12.4,
    firmnessKgCm2: 7.8,
    starchIndex: 3.2,
    soilMoisturePercent: 70,
    ndviIndex: 0.74,
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
    maturityPercent: 45,
    status: 'early',
    recommendedDate: '25 сентября – 5 октября',
    area: 5.1,
    brix: 11.2,
    firmnessKgCm2: 8.4,
    starchIndex: 2.1,
    soilMoisturePercent: 72,
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
    id: 'sector-5',
    name: 'Участок 5',
    variety: 'Гала',
    maturityPercent: 78,
    status: 'ripening',
    recommendedDate: '18 – 25 сентября',
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


export const mockForecastRows: ForecastSectorRow[] = [
  {
    id: 'forecast-1',
    name: 'Участок 1',
    variety: 'Гала',
    maturityPercent: 85,
    statusColor: 'green',
    recommendedDate: '10 – 15 сентября',
  },
  {
    id: 'forecast-2',
    name: 'Участок 2',
    variety: 'Фуджи',
    maturityPercent: 72,
    statusColor: 'light-green',
    recommendedDate: '15 – 22 сентября',
  },
  {
    id: 'forecast-3',
    name: 'Участок 3',
    variety: 'Голден',
    maturityPercent: 60,
    statusColor: 'yellow',
    recommendedDate: '20 – 28 сентября',
  },
  {
    id: 'forecast-4',
    name: 'Участок 4',
    variety: 'Ред Делишес',
    maturityPercent: 45,
    statusColor: 'orange',
    recommendedDate: '25 сентября – 5 октября',
  },
  {
    id: 'forecast-5',
    name: 'Участок 5',
    variety: 'Гала',
    maturityPercent: 78,
    statusColor: 'green',
    recommendedDate: '18 – 25 сентября',
  },
];

export * from './mockSettings';
export * from './mockNotifications';
