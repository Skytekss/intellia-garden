import { GardenSector, BentoItem, WeatherTelemetry, FarmProfile } from '../types';

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
    ripeningHistory: [
      { date: '01.08', percent: 38 },
      { date: '08.08', percent: 52 },
      { date: '15.08', percent: 64 },
      { date: '22.08', percent: 72 },
      { date: '28.08', percent: 78 },
    ],
  },
];
