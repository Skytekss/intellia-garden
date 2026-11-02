import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  GeneralSettings,
  HardwareSensor,
  NotificationSettings,
  DataManagementSettings,
  FarmProfileSettings,
  FarmData,
  GardenSector,
  AgroRecord,
  NotificationItem,
  SurveyHistoryEntry,
  RainCondition,
} from '../types';
import {
  initialGeneralSettings,
  initialSensors,
  initialNotificationSettings,
  initialDataManagementSettings,
  initialFarmProfileSettings,
} from '../data/mockSettings';
import { FARMS_DATA, getFarmById } from '../data/farmsData';
import { mockNotifications } from '../data/mockNotifications';

export interface AppContextType {
  // General Settings
  generalSettings: GeneralSettings;
  updateGeneralSettings: (updated: Partial<GeneralSettings>) => void;
  language: 'Русский' | 'English';
  setLanguage: (lang: 'Русский' | 'English') => void;
  isEnglish: boolean;

  // Measurement Units
  measurementUnit: string;
  setMeasurementUnit: (unit: string) => void;
  isImperial: boolean;
  formatTemperature: (tempC: number) => string;
  formatArea: (areaHa: number) => string;
  formatPrecipitation: (mm: number) => string;
  formatWindSpeed: (ms: number) => string;

  // Timezone & Date Format
  timezone: string;
  setTimezone: (tz: string) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
  formatDate: (dateStr: string) => string;
  formatTimestamp: (isoOrFormatted: string) => string;

  // Multi-Farm Management & Profile
  farms: FarmData[];
  currentFarmId: string;
  setCurrentFarmId: (farmId: string) => void;
  currentFarm: FarmData;
  farmProfile: FarmProfileSettings;
  updateFarmProfile: (updated: FarmProfileSettings) => void;

  // Sectors (Single Source of Truth)
  sectors: GardenSector[];
  updateSector: (sectorId: string, updated: Partial<GardenSector>) => void;

  // Agro Records Journal (Persistence & Interactivity)
  agroRecords: AgroRecord[];
  addAgroRecord: (record: Omit<AgroRecord, 'id'>) => AgroRecord;
  deleteAgroRecord: (recordId: string) => void;

  // Notifications (Real Unread Count & Persistence)
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;

  // Survey History
  surveyHistory: SurveyHistoryEntry[];
  addSurveyEntry: (entry: SurveyHistoryEntry) => void;
  activeSurveyDate: string;
  setActiveSurveyDate: (date: string) => void;

  // What-If Harvest Simulation (Sprint 2)
  tempAnomaly: number;
  setTempAnomaly: (delta: number) => void;
  rainCondition: RainCondition;
  setRainCondition: (condition: RainCondition) => void;
  resetSimulation: () => void;
  isSimulationActive: boolean;

  // Sensors & Notifications & Data Management
  sensors: HardwareSensor[];
  updateSensors: (sensors: HardwareSensor[]) => void;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (updated: Partial<NotificationSettings>) => void;
  dataManagementSettings: DataManagementSettings;
  updateDataManagementSettings: (updated: Partial<DataManagementSettings>) => void;

  // Translation helper
  t: (key: string) => string;
}

import { TRANSLATIONS } from './translations';
export { TRANSLATIONS };

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  general: 'intellia_general_settings',
  farm: 'intellia_farm_profile',
  currentFarmId: 'intellia_current_farm_id',
  notifications: 'intellia_notification_settings',
  notificationsList: 'intellia_notifications_list',
  dataManagement: 'intellia_datamanagement_settings',
  sensors: 'intellia_sensors',
};

const safeGetStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const safeSetStorage = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or disabled errors
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [generalSettings, setGeneralSettingsState] = useState<GeneralSettings>(() => {
    const stored = safeGetStorage<GeneralSettings>(STORAGE_KEYS.general, initialGeneralSettings);
    if (typeof window !== 'undefined') {
      try {
        const search = new URLSearchParams(window.location.search);
        const urlLang = search.get('lang');
        const urlUnits = search.get('units');
        let override = { ...stored };
        if (urlLang === 'en' || urlLang === 'English') {
          override.language = 'English';
        } else if (urlLang === 'ru' || urlLang === 'Русский') {
          override.language = 'Русский';
        }
        if (urlUnits === 'imperial') {
          override.measurementUnit = 'Имперская (°F, дюймы, акры)';
        } else if (urlUnits === 'metric') {
          override.measurementUnit = 'Метрическая (°C, мм, га)';
        }
        return override;
      } catch {
        return stored;
      }
    }
    return stored;
  });

  // Current farm ID & Data
  const [currentFarmId, setCurrentFarmIdState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const search = new URLSearchParams(window.location.search);
        const urlFarm = search.get('farm') || search.get('farmId');
        if (urlFarm) {
          const match = FARMS_DATA.find((f) => f.id === urlFarm || f.name === urlFarm);
          if (match) return match.id;
        }
      } catch {
        // Fall back to storage
      }
    }
    return safeGetStorage<string>(STORAGE_KEYS.currentFarmId, 'golden-orchard');
  });

  const currentFarm = useMemo(() => {
    return getFarmById(currentFarmId);
  }, [currentFarmId]);

  // Farm Profile Settings (synced with currentFarm)
  const [farmProfile, setFarmProfileState] = useState<FarmProfileSettings>(() => {
    const stored = safeGetStorage<FarmProfileSettings | null>(STORAGE_KEYS.farm, null);
    if (stored) return stored;
    const farm = getFarmById(currentFarmId);
    return {
      name: farm.name,
      areaHa: farm.areaHa,
      region: farm.region,
      lastSurveyDate: farm.lastSurveyDate,
    };
  });

  // Sectors for current farm
  const [sectors, setSectorsState] = useState<GardenSector[]>(() => {
    return safeGetStorage<GardenSector[]>(`intellia_sectors_${currentFarmId}`, currentFarm.sectors);
  });

  // Agro Records for current farm
  const [agroRecords, setAgroRecordsState] = useState<AgroRecord[]>(() => {
    return safeGetStorage<AgroRecord[]>(`intellia_agro_records_${currentFarmId}`, currentFarm.agroRecords);
  });

  // Notifications List
  const [notifications, setNotificationsState] = useState<NotificationItem[]>(() => {
    return safeGetStorage<NotificationItem[]>(STORAGE_KEYS.notificationsList, mockNotifications);
  });

  // Active survey date
  // Survey History for current farm
  const [surveyHistory, setSurveyHistoryState] = useState<SurveyHistoryEntry[]>(() => {
    return safeGetStorage<SurveyHistoryEntry[]>(`intellia_survey_history_${currentFarmId}`, currentFarm.surveyHistory);
  });

  const [activeSurveyDate, setActiveSurveyDateState] = useState<string>(currentFarm.lastSurveyDate);

  const [sensors, setSensorsState] = useState<HardwareSensor[]>(() =>
    safeGetStorage<HardwareSensor[]>(STORAGE_KEYS.sensors, initialSensors)
  );

  const [notificationSettings, setNotificationSettingsState] = useState<NotificationSettings>(() =>
    safeGetStorage<NotificationSettings>(STORAGE_KEYS.notifications, initialNotificationSettings)
  );

  const [dataManagementSettings, setDataManagementSettingsState] = useState<DataManagementSettings>(() =>
    safeGetStorage<DataManagementSettings>(STORAGE_KEYS.dataManagement, initialDataManagementSettings)
  );

  // What-If Harvest Simulation (Sprint 2)
  const [tempAnomaly, setTempAnomaly] = useState<number>(0);
  const [rainCondition, setRainCondition] = useState<RainCondition>('optimal');

  const resetSimulation = useCallback(() => {
    setTempAnomaly(0);
    setRainCondition('optimal');
  }, []);

  const isSimulationActive = tempAnomaly !== 0 || rainCondition !== 'optimal';

  const updateGeneralSettings = useCallback((updated: Partial<GeneralSettings>) => {
    setGeneralSettingsState((prev) => {
      const next = { ...prev, ...updated };
      safeSetStorage(STORAGE_KEYS.general, next);
      return next;
    });
  }, []);

  const language = (generalSettings.language === 'English' ? 'English' : 'Русский') as 'Русский' | 'English';
  const isEnglish = language === 'English';

  const setLanguage = useCallback((lang: 'Русский' | 'English') => {
    updateGeneralSettings({ language: lang });
  }, [updateGeneralSettings]);

  // Farm switcher logic
  const setCurrentFarmId = useCallback((newFarmId: string) => {
    const targetFarm = FARMS_DATA.find((f) => f.id === newFarmId || f.name === newFarmId) || FARMS_DATA[0];
    setCurrentFarmIdState(targetFarm.id);
    safeSetStorage(STORAGE_KEYS.currentFarmId, targetFarm.id);

    const newProfile: FarmProfileSettings = {
      name: targetFarm.name,
      areaHa: targetFarm.areaHa,
      region: targetFarm.region,
      lastSurveyDate: targetFarm.lastSurveyDate,
    };
    setFarmProfileState(newProfile);
    safeSetStorage(STORAGE_KEYS.farm, newProfile);

    // Load sectors for selected farm
    const storedSectors = safeGetStorage<GardenSector[]>(`intellia_sectors_${targetFarm.id}`, targetFarm.sectors);
    setSectorsState(storedSectors);

    // Load agro records for selected farm
    const storedRecords = safeGetStorage<AgroRecord[]>(`intellia_agro_records_${targetFarm.id}`, targetFarm.agroRecords);
    setAgroRecordsState(storedRecords);

    // Load survey history for selected farm
    const storedSurveyHistory = safeGetStorage<SurveyHistoryEntry[]>(`intellia_survey_history_${targetFarm.id}`, targetFarm.surveyHistory);
    setSurveyHistoryState(storedSurveyHistory);

    setActiveSurveyDateState(targetFarm.lastSurveyDate);
  }, []);

  const updateFarmProfile = useCallback((updated: FarmProfileSettings) => {
    // If the farm name matches one of our defined farms, switch to that farm id
    const matchingFarm = FARMS_DATA.find((f) => f.name === updated.name || f.nameEn === updated.name);
    if (matchingFarm && matchingFarm.id !== currentFarmId) {
      setCurrentFarmId(matchingFarm.id);
    } else {
      setFarmProfileState(updated);
      safeSetStorage(STORAGE_KEYS.farm, updated);
    }
  }, [currentFarmId, setCurrentFarmId]);

  // Sector update
  const updateSector = useCallback((sectorId: string, updated: Partial<GardenSector>) => {
    setSectorsState((prev) => {
      const next = prev.map((s) => (s.id === sectorId ? { ...s, ...updated } : s));
      safeSetStorage(`intellia_sectors_${currentFarmId}`, next);
      return next;
    });
  }, [currentFarmId]);

  // Notifications management
  const addNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'timestamp'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: isEnglish ? 'Just now' : 'Только что',
    };
    setNotificationsState((prev) => {
      const next = [newItem, ...prev];
      safeSetStorage(STORAGE_KEYS.notificationsList, next);
      return next;
    });
  }, [isEnglish]);

  const markNotificationRead = useCallback((id: string) => {
    setNotificationsState((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      safeSetStorage(STORAGE_KEYS.notificationsList, next);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotificationsState((prev) => {
      const next = prev.map((n) => ({ ...n, isRead: true }));
      safeSetStorage(STORAGE_KEYS.notificationsList, next);
      return next;
    });
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotificationsState((prev) => {
      const next = prev.filter((n) => n.id !== id);
      safeSetStorage(STORAGE_KEYS.notificationsList, next);
      return next;
    });
  }, []);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Agro record creation & biometrics impact
  const addAgroRecord = useCallback((newRecordData: Omit<AgroRecord, 'id'>) => {
    const newRecord: AgroRecord = {
      ...newRecordData,
      id: `agro-${Date.now()}`,
    };

    setAgroRecordsState((prev) => {
      const next = [newRecord, ...prev];
      safeSetStorage(`intellia_agro_records_${currentFarmId}`, next);
      return next;
    });

    // Detect target sector
    let targetSectorId = newRecord.sectorId;
    if (!targetSectorId && newRecord.sector && newRecord.sector !== 'Все участки' && newRecord.sector !== 'All Sectors') {
      const matched = sectors.find((s) => s.name === newRecord.sector || s.id === newRecord.sector);
      if (matched) targetSectorId = matched.id;
    }

    // Impact on sector biometrics
    if (targetSectorId) {
      setSectorsState((prevSectors) => {
        const nextSectors = prevSectors.map((sec) => {
          if (sec.id === targetSectorId) {
            const isIrrigation = newRecord.type === 'Полив' || newRecord.type === 'Irrigation';
            const isFertilizer = newRecord.type === 'Удобрения' || newRecord.type === 'Fertilization';

            let nextSoil = sec.soilMoisturePercent;
            let nextBrix = sec.brix;
            let nextMaturity = sec.maturityPercent;
            const nextHistory = [...sec.ripeningHistory];

            if (isIrrigation) {
              nextSoil = Math.min(95, sec.soilMoisturePercent + 12);
            }
            if (isFertilizer) {
              nextBrix = +(sec.brix + 0.4).toFixed(1);
              nextMaturity = Math.min(100, sec.maturityPercent + 3);
              const now = new Date();
              const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}`;
              nextHistory.push({ date: dateStr, percent: nextMaturity });
            }

            return {
              ...sec,
              soilMoisturePercent: nextSoil,
              brix: nextBrix,
              maturityPercent: nextMaturity,
              ripeningHistory: nextHistory,
            };
          }
          return sec;
        });
        safeSetStorage(`intellia_sectors_${currentFarmId}`, nextSectors);
        return nextSectors;
      });
    }

    // Generate auto notification
    const notifTitle = isEnglish
      ? `Agrotechnical Operation: ${newRecord.title}`
      : `Агротехническая операция: ${newRecord.title}`;
    const notifDesc = isEnglish
      ? `Recorded for ${newRecord.sector || 'All Sectors'}. Orchard biometrics updated.`
      : `Внесена для сектора «${newRecord.sector || 'Все участки'}». Биометрические параметры обновлены.`;

    addNotification({
      category: 'agritech',
      badgeText: isEnglish ? 'Operation Logged' : 'Операция проведена',
      title: notifTitle,
      description: notifDesc,
      isRead: false,
      actionText: isEnglish ? 'View Journal' : 'Смотреть журнал',
      actionTarget: 'data',
      filterCategories: ['important'],
      dotColor: 'teal',
      iconType: 'agritech',
    });

    return newRecord;
  }, [currentFarmId, sectors, isEnglish, addNotification]);

  const deleteAgroRecord = useCallback((recordId: string) => {
    setAgroRecordsState((prev) => {
      const next = prev.filter((r) => r.id !== recordId);
      safeSetStorage(`intellia_agro_records_${currentFarmId}`, next);
      return next;
    });
  }, [currentFarmId]);

  const addSurveyEntry = useCallback((entry: SurveyHistoryEntry) => {
    setSurveyHistoryState((prev) => {
      const next = [entry, ...prev];
      safeSetStorage(`intellia_survey_history_${currentFarmId}`, next);
      return next;
    });
    setActiveSurveyDateState(entry.date);
  }, [currentFarmId]);

  const setActiveSurveyDate = useCallback((date: string) => {
    setActiveSurveyDateState(date);
  }, []);

  const updateSensors = useCallback((updated: HardwareSensor[]) => {
    setSensorsState(updated);
    safeSetStorage(STORAGE_KEYS.sensors, updated);
  }, []);

  const updateNotificationSettings = useCallback((updated: Partial<NotificationSettings>) => {
    setNotificationSettingsState((prev) => {
      const next = { ...prev, ...updated };
      safeSetStorage(STORAGE_KEYS.notifications, next);
      return next;
    });
  }, []);

  const updateDataManagementSettings = useCallback((updated: Partial<DataManagementSettings>) => {
    setDataManagementSettingsState((prev) => {
      const next = { ...prev, ...updated };
      safeSetStorage(STORAGE_KEYS.dataManagement, next);
      return next;
    });
  }, []);

  const measurementUnit = generalSettings.measurementUnit;
  const isImperial = useMemo(() => {
    return (
      measurementUnit.includes('Имперская') ||
      measurementUnit.includes('Imperial') ||
      measurementUnit.includes('°F')
    );
  }, [measurementUnit]);

  const setMeasurementUnit = useCallback((unit: string) => {
    updateGeneralSettings({ measurementUnit: unit });
  }, [updateGeneralSettings]);

  const timezone = generalSettings.timezone;
  const setTimezone = useCallback((tz: string) => {
    updateGeneralSettings({ timezone: tz });
  }, [updateGeneralSettings]);

  const dateFormat = generalSettings.dateFormat;
  const setDateFormat = useCallback((format: string) => {
    updateGeneralSettings({ dateFormat: format });
  }, [updateGeneralSettings]);

  // Unit conversion helpers
  const formatTemperature = useCallback(
    (tempC: number): string => {
      if (isImperial) {
        const f = Math.round(tempC * 1.8 + 32);
        return `${f}°F`;
      }
      return `${tempC > 0 ? '+' : ''}${tempC}°C`;
    },
    [isImperial]
  );

  const formatArea = useCallback(
    (areaHa: number): string => {
      if (isImperial) {
        const acres = (areaHa * 2.471).toFixed(1);
        return `${acres} ${isEnglish ? 'ac' : 'акров'}`;
      }
      return `${areaHa} ${isEnglish ? 'ha' : 'га'}`;
    },
    [isImperial, isEnglish]
  );

  const formatPrecipitation = useCallback(
    (mm: number): string => {
      if (isImperial) {
        const inches = (mm * 0.03937).toFixed(1);
        return `${inches} in`;
      }
      return `${mm} ${isEnglish ? 'mm' : 'мм'}`;
    },
    [isImperial, isEnglish]
  );

  const formatWindSpeed = useCallback(
    (ms: number): string => {
      if (isImperial) {
        const mph = (ms * 2.237).toFixed(1);
        return `${mph} mph`;
      }
      return `${ms} ${isEnglish ? 'm/s' : 'м/с'}`;
    },
    [isImperial, isEnglish]
  );

  // Date formatting helpers
  const formatDate = useCallback(
    (dateStr: string): string => {
      if (!dateStr) return '';
      const parts = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
      if (parts) {
        const [, day, month, year] = parts;
        if (dateFormat === 'ММ/ДД/ГГГГ' || dateFormat === 'MM/DD/YYYY') {
          return `${month}/${day}/${year}`;
        }
        if (dateFormat === 'ГГГГ-ММ-ДД' || dateFormat === 'YYYY-MM-DD') {
          return `${year}-${month}-${day}`;
        }
        return `${day}.${month}.${year}`;
      }
      return dateStr;
    },
    [dateFormat]
  );

  const formatTimestamp = useCallback(
    (isoOrFormatted: string): string => {
      if (!isoOrFormatted) return '';
      const match = isoOrFormatted.match(/^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}:\d{2})$/);
      if (match) {
        const [, day, month, year, time] = match;
        const formattedDate = formatDate(`${day}.${month}.${year}`);
        return `${formattedDate}, ${time}`;
      }
      return isoOrFormatted;
    },
    [formatDate]
  );

  // Translation helper
  const t = useCallback(
    (key: string): string => {
      const langKey = isEnglish ? 'en' : 'ru';
      return TRANSLATIONS[langKey][key] || key;
    },
    [isEnglish]
  );

  const contextValue = useMemo<AppContextType>(
    () => ({
      generalSettings,
      updateGeneralSettings,
      language,
      setLanguage,
      isEnglish,
      measurementUnit,
      setMeasurementUnit,
      isImperial,
      formatTemperature,
      formatArea,
      formatPrecipitation,
      formatWindSpeed,
      timezone,
      setTimezone,
      dateFormat,
      setDateFormat,
      formatDate,
      formatTimestamp,
      farms: FARMS_DATA,
      currentFarmId,
      setCurrentFarmId,
      currentFarm,
      farmProfile,
      updateFarmProfile,
      sectors,
      updateSector,
      agroRecords,
      addAgroRecord,
      deleteAgroRecord,
      notifications,
      unreadNotificationsCount,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      addNotification,
      surveyHistory,
      addSurveyEntry,

      activeSurveyDate,
      setActiveSurveyDate,
      tempAnomaly,
      setTempAnomaly,
      rainCondition,
      setRainCondition,
      resetSimulation,
      isSimulationActive,
      sensors,
      updateSensors,
      notificationSettings,
      updateNotificationSettings,
      dataManagementSettings,
      updateDataManagementSettings,
      t,
    }),
    [
      generalSettings,
      updateGeneralSettings,
      language,
      setLanguage,
      isEnglish,
      measurementUnit,
      setMeasurementUnit,
      isImperial,
      formatTemperature,
      formatArea,
      formatPrecipitation,
      formatWindSpeed,
      timezone,
      setTimezone,
      dateFormat,
      setDateFormat,
      formatDate,
      formatTimestamp,
      currentFarmId,
      setCurrentFarmId,
      currentFarm,
      farmProfile,
      updateFarmProfile,
      sectors,
      updateSector,
      agroRecords,
      addAgroRecord,
      deleteAgroRecord,
      notifications,
      unreadNotificationsCount,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      addNotification,
      surveyHistory,
      addSurveyEntry,

      activeSurveyDate,
      setActiveSurveyDate,
      tempAnomaly,
      setTempAnomaly,
      rainCondition,
      setRainCondition,
      resetSimulation,
      isSimulationActive,
      sensors,
      updateSensors,
      notificationSettings,
      updateNotificationSettings,
      dataManagementSettings,
      updateDataManagementSettings,
      t,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    const isEnglish = initialGeneralSettings.language === 'English';
    const isImperial = initialGeneralSettings.measurementUnit.includes('°F');
    const defaultFarm = FARMS_DATA[0];
    return {
      generalSettings: initialGeneralSettings,
      updateGeneralSettings: () => {},
      language: (initialGeneralSettings.language as 'Русский' | 'English') || 'Русский',
      setLanguage: () => {},
      isEnglish,
      measurementUnit: initialGeneralSettings.measurementUnit,
      setMeasurementUnit: () => {},
      isImperial,
      formatTemperature: (tC) => (isImperial ? `${Math.round(tC * 1.8 + 32)}°F` : `${tC > 0 ? '+' : ''}${tC}°C`),
      formatArea: (a) => `${a} га`,
      formatPrecipitation: (p) => `${p} мм`,
      formatWindSpeed: (w) => `${w} м/с`,
      timezone: initialGeneralSettings.timezone,
      setTimezone: () => {},
      dateFormat: initialGeneralSettings.dateFormat,
      setDateFormat: () => {},
      formatDate: (d) => d,
      formatTimestamp: (ts) => ts,
      farms: FARMS_DATA,
      currentFarmId: defaultFarm.id,
      setCurrentFarmId: () => {},
      currentFarm: defaultFarm,
      farmProfile: initialFarmProfileSettings,
      updateFarmProfile: () => {},
      sectors: defaultFarm.sectors,
      updateSector: () => {},
      agroRecords: defaultFarm.agroRecords,
      addAgroRecord: (rec) => ({ ...rec, id: 'agro-fallback' }),
      deleteAgroRecord: () => {},
      notifications: mockNotifications,
      unreadNotificationsCount: mockNotifications.filter((n) => !n.isRead).length,
      markNotificationRead: () => {},
      markAllNotificationsRead: () => {},
      deleteNotification: () => {},
      addNotification: () => {},
      surveyHistory: defaultFarm.surveyHistory,
      addSurveyEntry: () => {},
      activeSurveyDate: defaultFarm.lastSurveyDate,
      setActiveSurveyDate: () => {},
      tempAnomaly: 0,
      setTempAnomaly: () => {},
      rainCondition: 'optimal',
      setRainCondition: () => {},
      resetSimulation: () => {},
      isSimulationActive: false,
      sensors: initialSensors,
      updateSensors: () => {},
      notificationSettings: initialNotificationSettings,
      updateNotificationSettings: () => {},
      dataManagementSettings: initialDataManagementSettings,
      updateDataManagementSettings: () => {},
      t: (key) => TRANSLATIONS.ru[key] || key,
    };
  }
  return context;
};
