export type NavigationTab = 
  | 'overview' 
  | 'map' 
  | 'data' 
  | 'forecasts' 
  | 'notifications' 
  | 'settings' 
  | 'support';

export type AppleVariety = 'Гала' | 'Фуджи' | 'Голден' | 'Ред Делишес' | 'Хани Крисп';

export interface GardenSector {
  id: string;
  name: string;
  variety: AppleVariety;
  maturityPercent: number;
  status: 'ready' | 'ripening' | 'early';
  recommendedDate: string;
  area: number; // площадь в гектарах
  brix: number; // сахаристость (°Bx)
  firmnessKgCm2: number; // плотность мякоти (кг/см²)
  starchIndex: number; // индекс крахмала (1-10)
  soilMoisturePercent: number; // влажность почвы (%)
  ndviIndex: number; // вегетационный индекс NDVI
  ripeningHistory: Array<{
    date: string;
    percent: number;
  }>;
}

export interface WeatherTelemetry {
  temperature: number;
  condition: string;
  precipitationMm: number;
  humidityPercent: number;
}

export interface BentoItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'drone' | 'agritech' | 'meteo' | 'ai';
  iconBg: string;
  iconColor: string;
}

export interface NotificationItem {
  id: string;
  category: 'important' | 'harvest' | 'weather' | 'system' | 'agritech' | 'ai';
  badgeText: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionText: string;
  actionTarget: NavigationTab;
}

export interface ForecastSectorRow {
  id: string;
  name: string;
  variety: AppleVariety;
  maturityPercent: number;
  statusColor: 'green' | 'light-green' | 'yellow' | 'orange';
  recommendedDate: string;
}

export interface FarmProfile {
  name: string;
  areaHa: number;
  region: string;
  lastSurveyDate: string;
}

// Data Entry Screen Types
export type SpectralChannel = 'RGB' | 'NIR' | 'Red Edge' | 'SWIR';

export type DroneModel = 
  | 'DJI Mavic 3M'
  | 'DJI Matrice 350 RTK + MS600'
  | 'AgEagle eBee X'
  | 'WingtraOne GEN II'
  | string;

export type AgroOperationType = 
  | 'Полив' 
  | 'Удобрения' 
  | 'Обработка' 
  | 'Обрезка' 
  | 'Прореживание плодов';

export interface AgroRecord {
  id: string;
  type: AgroOperationType;
  title: string;
  date: string;
  sector?: string;
  notes?: string;
}

export interface MeteoTelemetryData {
  temperature: number;
  precipitationMm: number;
  humidityPercent: number;
  lastSyncTime?: string;
}

export interface HyperspectralUploadState {
  surveyDate: string;
  droneModel: string;
  channels: SpectralChannel[];
  files: File[];
}

export type DataSubTab = 'spectral' | 'agro' | 'meteo';

