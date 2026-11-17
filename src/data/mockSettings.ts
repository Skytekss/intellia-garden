import {
  GeneralSettings,
  HardwareSensor,
  NotificationSettings,
  DataManagementSettings,
  FarmProfileSettings,
  UserProfile,
} from '../types';

export const initialGeneralSettings: GeneralSettings = {
  language: 'Русский',
  measurementUnit: 'Метрическая (°C, мм, га)',
  timezone: '(UTC+3) Москва',
  dateFormat: 'ДД.ММ.ГГГГ',
};

export const initialSensors: HardwareSensor[] = [
  {
    id: 'sensor-meteo',
    name: 'Метеостанция',
    status: 'online',
    statusText: 'Онлайн',
    iconType: 'meteo',
    model: 'Davis Vantage Pro2 Plus',
    batteryLevel: 98,
    signalStrength: 'good',
    lastPing: '2 мин. назад',
    details: 'Температура, влажность, давление, скорость ветра, ультрафиолет',
  },
  {
    id: 'sensor-soil',
    name: 'Датчики влажности почвы',
    status: 'online',
    statusText: 'Онлайн',
    iconType: 'soil',
    model: 'Sentek Drill & Drop (12 узлов)',
    batteryLevel: 94,
    signalStrength: 'good',
    lastPing: '5 мин. назад',
    details: 'Влажность, засоленность и температура почвы на глубинах 10–60 см',
  },
  {
    id: 'sensor-camera',
    name: 'Камеры',
    status: 'online',
    statusText: 'Онлайн',
    iconType: 'camera',
    model: 'Hikvision Solar PTZ 4K (4 шт.)',
    batteryLevel: 100,
    signalStrength: 'good',
    lastPing: '1 мин. назад',
    details: 'Оптический мониторинг кроны и рядов посадки в реальном времени',
  },
  {
    id: 'sensor-spectral',
    name: 'Гиперспектральный модуль',
    status: 'online',
    statusText: 'Онлайн',
    iconType: 'spectral',
    model: 'Cubert Ultris X20 Plus',
    batteryLevel: 87,
    signalStrength: 'good',
    lastPing: '10 мин. назад',
    details: 'Съемка в диапазонах 450–950 нм (164 спектральных канала)',
  },
];

export const initialNotificationSettings: NotificationSettings = {
  harvestAndMaturity: true,
  weatherConditions: true,
  agrotechnicalWorks: true,
  systemUpdates: true,
};

export const initialDataManagementSettings: DataManagementSettings = {
  autoSync: true,
  retentionPeriod: '30 дней',
  lastBackupDate: '27.10.2026, 04:00',
};

export const initialFarmProfileSettings: FarmProfileSettings = {
  name: 'Ферма «Золотой Сад»',
  areaHa: 22.0,
  region: 'Тульская область',
  lastSurveyDate: '12.08.2025',
};

export const initialUserProfile: UserProfile = {
  id: 'user-budantseva',
  fullName: 'Буданцева Елизавета',
  fullNameEn: 'Elizaveta Budantseva',
  initials: 'ЕБ',
  role: 'Главный агроном',
  roleEn: 'Chief Agronomist',
  email: 'e.budantseva@intellia.agro',
  phone: '+7 (916) 842-19-04',
  telegram: '@eliza_budantseva',
  status: 'online',
  statusNote: 'Центральная агролаборатория',
  statusNoteEn: 'Central Agro-Laboratory',
  avatarGradient: 'from-emerald-800 to-teal-600',
  specialization: 'Интенсивные сады, капельный полив, фитосанитария',
  specializationEn: 'Intensive orchards, drip irrigation, plant protection',
};

export const DEMO_USERS: UserProfile[] = [
  initialUserProfile,
  {
    id: 'user-nechaeva',
    fullName: 'Нечаева Анастасия',
    fullNameEn: 'Anastasia Nechaeva',
    initials: 'АН',
    role: 'Агроном по защите садов',
    roleEn: 'Plant Protection Agronomist',
    email: 'a.nechaeva@intellia.agro',
    phone: '+7 (920) 731-55-12',
    telegram: '@nastya_orchard',
    status: 'field',
    statusNote: 'Осмотр Сектора 4 (Гала)',
    statusNoteEn: 'Inspecting Sector 4 (Gala)',
    avatarGradient: 'from-blue-700 to-cyan-500',
    specialization: 'Фитосанитарный мониторинг, БПЛА-диагностика, учет болезней',
    specializationEn: 'Phytosanitary monitoring, UAV diagnostics, disease control',
  },
  {
    id: 'user-bryksina',
    fullName: 'Брыксина Виолетта',
    fullNameEn: 'Violetta Bryksina',
    initials: 'ВБ',
    role: 'Агроном-лаборант / Оценка качества',
    roleEn: 'Lab Agronomist / Quality Control',
    email: 'v.bryksina@intellia.agro',
    phone: '+7 (903) 115-44-89',
    telegram: '@violetta_agro',
    status: 'online',
    statusNote: 'Лаборатория спектрального анализа',
    statusNoteEn: 'Spectral Analysis Lab',
    avatarGradient: 'from-amber-700 to-emerald-600',
    specialization: 'Биохимия плодов, сахаристость (Brix), индекс Штрейфа, хранение',
    specializationEn: 'Fruit biochemistry, Brix sugars, Streif index, storage quality',
  },
];
