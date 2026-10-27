export type SensorStatus = 'online' | 'warning' | 'offline';
export type SensorIconType = 'meteo' | 'soil' | 'camera' | 'spectral';

export interface HardwareSensor {
  id: string;
  name: string;
  status: SensorStatus;
  statusText: string;
  iconType: SensorIconType;
  model: string;
  batteryLevel?: number;
  signalStrength?: 'good' | 'medium' | 'low';
  lastPing?: string;
  details?: string;
}

export interface GeneralSettings {
  language: string;
  measurementUnit: string;
  timezone: string;
  dateFormat: string;
}

export interface NotificationSettings {
  harvestAndMaturity: boolean;
  weatherConditions: boolean;
  agrotechnicalWorks: boolean;
  systemUpdates: boolean;
}

export interface DataManagementSettings {
  autoSync: boolean;
  retentionPeriod: string;
  lastBackupDate?: string;
}

export interface FarmProfileSettings {
  name: string;
  areaHa: number;
  region: string;
  lastSurveyDate?: string;
}

export interface SystemSettingsState {
  general: GeneralSettings;
  sensors: HardwareSensor[];
  notifications: NotificationSettings;
  dataManagement: DataManagementSettings;
  farm: FarmProfileSettings;
}
