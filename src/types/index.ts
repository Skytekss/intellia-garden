export type NavigationTab = 
  | 'overview' 
  | 'map' 
  | 'data' 
  | 'forecasts' 
  | 'notifications' 
  | 'settings' 
  | 'support';

export type AppleVariety = 'Гала' | 'Фуджи' | 'Голден' | 'Ред Делишес' | 'Хани Крисп' | 'Gala' | 'Fuji' | 'Golden Delicious' | 'Red Delicious' | 'Honeycrisp' | string;

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

export type NotificationCategory = 'important' | 'harvest' | 'weather' | 'system' | 'agritech' | 'ai';

export type NotificationFilterTab = 'all' | 'important' | 'harvest' | 'weather' | 'diseases' | 'system';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  badgeText: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionText: string;
  actionTarget: NavigationTab;
  filterCategories?: NotificationFilterTab[];
  dotColor?: 'red' | 'green' | 'amber' | 'blue' | 'teal' | 'none';
  iconType?: 'apple' | 'harvest' | 'weather' | 'system' | 'agritech' | 'ai';
  details?: {
    fullText?: string;
    recommendation?: string;
    metadata?: Record<string, string>;
  };
}

export interface ForecastSectorRow {
  id: string;
  name: string;
  variety: AppleVariety;
  maturityPercent: number;
  statusColor: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'light-green';
  recommendedDate: string;
}

export interface FarmProfile {
  name: string;
  areaHa: number;
  region: string;
  lastSurveyDate?: string;
}

export type FarmId = 'golden-orchard' | 'apple-ravine' | 'don-orchards' | string;

export interface SurveyHistoryEntry {
  date: string;
  label: string;
  droneModel: string;
  resolutionCmPx: number;
  ndviAvg: number;
  weatherNote: string;
}

export interface FarmData {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  regionEn: string;
  areaHa: number;
  lastSurveyDate: string;
  surveyHistory: SurveyHistoryEntry[];
  sectors: GardenSector[];
  agroRecords: AgroRecord[];
  weather: WeatherTelemetry;
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
  | 'Прореживание плодов'
  | string;

export interface AgroRecord {
  id: string;
  type: AgroOperationType;
  title: string;
  date: string;
  sector?: string;
  sectorId?: string;
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

export * from './settings';
