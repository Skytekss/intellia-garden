import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  GeneralSettings,
  HardwareSensor,
  NotificationSettings,
  DataManagementSettings,
  FarmProfileSettings,
} from '../types';
import {
  initialGeneralSettings,
  initialSensors,
  initialNotificationSettings,
  initialDataManagementSettings,
  initialFarmProfileSettings,
} from '../data/mockSettings';

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

  // Farm Profile
  farmProfile: FarmProfileSettings;
  updateFarmProfile: (updated: FarmProfileSettings) => void;

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
  notifications: 'intellia_notification_settings',
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

  const [farmProfile, setFarmProfileState] = useState<FarmProfileSettings>(() =>
    safeGetStorage<FarmProfileSettings>(STORAGE_KEYS.farm, initialFarmProfileSettings)
  );

  const [sensors, setSensorsState] = useState<HardwareSensor[]>(() =>
    safeGetStorage<HardwareSensor[]>(STORAGE_KEYS.sensors, initialSensors)
  );

  const [notificationSettings, setNotificationSettingsState] = useState<NotificationSettings>(() =>
    safeGetStorage<NotificationSettings>(STORAGE_KEYS.notifications, initialNotificationSettings)
  );

  const [dataManagementSettings, setDataManagementSettingsState] = useState<DataManagementSettings>(() =>
    safeGetStorage<DataManagementSettings>(STORAGE_KEYS.dataManagement, initialDataManagementSettings)
  );

  const updateGeneralSettings = useCallback((updated: Partial<GeneralSettings>) => {
    setGeneralSettingsState((prev) => {
      const next = { ...prev, ...updated };
      safeSetStorage(STORAGE_KEYS.general, next);
      return next;
    });
  }, []);

  const updateFarmProfile = useCallback((updated: FarmProfileSettings) => {
    setFarmProfileState(updated);
    safeSetStorage(STORAGE_KEYS.farm, updated);
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

  const language = (generalSettings.language === 'English' ? 'English' : 'Русский') as 'Русский' | 'English';
  const isEnglish = language === 'English';

  const setLanguage = useCallback((lang: 'Русский' | 'English') => {
    updateGeneralSettings({ language: lang });
  }, [updateGeneralSettings]);

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
      // Matches DD.MM.YYYY
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
      // Matches DD.MM.YYYY, HH:mm
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
      farmProfile,
      updateFarmProfile,
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
      farmProfile,
      updateFarmProfile,
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
    // Return sensible fallback for standalone unit testing without provider
    const isEnglish = initialGeneralSettings.language === 'English';
    const isImperial = initialGeneralSettings.measurementUnit.includes('°F');
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
      farmProfile: initialFarmProfileSettings,
      updateFarmProfile: () => {},
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
