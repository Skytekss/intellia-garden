import React from 'react';
import { Settings, Globe, Ruler, Clock, Calendar, ChevronDown } from 'lucide-react';
import { GeneralSettings } from '../../types';

export interface GeneralSettingsCardProps {
  settings: GeneralSettings;
  onChange: (settings: GeneralSettings) => void;
}

const LANGUAGE_OPTIONS = ['Русский', 'English'];

const UNIT_OPTIONS = [
  'Метрическая (°C, мм, га)',
  'Имперская (°F, дюймы, акры)',
];

const TIMEZONE_OPTIONS = [
  '(UTC+3) Москва',
  '(UTC+0) Лондон',
  '(UTC-5) Нью-Йорк',
  '(UTC+2) Калининград',
  '(UTC+4) Самара',
  '(UTC+5) Екатеринбург',
];

const DATE_FORMAT_OPTIONS = [
  'ДД.ММ.ГГГГ',
  'ГГГГ-ММ-ДД',
  'ММ/ДД/ГГГГ',
];

const UNIT_MAP_EN: Record<string, string> = {
  'Метрическая (°C, мм, га)': 'Metric (°C, mm, ha)',
  'Имперская (°F, дюймы, акры)': 'Imperial (°F, in, ac)',
};

const TIMEZONE_MAP_EN: Record<string, string> = {
  '(UTC+3) Москва': '(UTC+3) Moscow',
  '(UTC+0) Лондон': '(UTC+0) London',
  '(UTC-5) Нью-Йорк': '(UTC-5) New York',
  '(UTC+2) Калининград': '(UTC+2) Kaliningrad',
  '(UTC+4) Самара': '(UTC+4) Samara',
  '(UTC+5) Екатеринбург': '(UTC+5) Yekaterinburg',
};

const DATE_FORMAT_MAP_EN: Record<string, string> = {
  'ДД.ММ.ГГГГ': 'DD.MM.YYYY',
  'ГГГГ-ММ-ДД': 'YYYY-MM-DD',
  'ММ/ДД/ГГГГ': 'MM/DD/YYYY',
};

export const GeneralSettingsCard: React.FC<GeneralSettingsCardProps> = ({
  settings,
  onChange,
}) => {
  const isEn = settings.language === 'English';

  const handleChange = <K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K]
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div
      data-testid="general-settings-card"
      className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 sm:p-5 space-y-4 hover:shadow-md transition-shadow min-w-0"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <Settings className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {isEn ? 'General Settings' : 'Основные настройки'}
          </h2>
          <p className="text-xs text-slate-500 truncate">
            {isEn ? 'General application parameters' : 'Общие параметры приложения'}
          </p>
        </div>
      </div>

      {/* Settings list */}
      <div className="space-y-3.5 pt-1">
        {/* Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
            <label
              htmlFor="general-language"
              className="text-xs sm:text-sm font-medium text-slate-700 truncate cursor-pointer"
            >
              {isEn ? 'Interface Language' : 'Язык интерфейса'}
            </label>
          </div>
          <div className="relative shrink-0 sm:max-w-none">
            <select
              id="general-language"
              aria-label={isEn ? 'Interface Language' : 'Язык интерфейса'}
              data-testid="select-language"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="appearance-none w-full sm:w-auto bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer min-w-[140px] sm:min-w-[160px]"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {isEn ? (opt === 'Русский' ? 'Russian' : opt) : opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Measurement Units */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Ruler className="w-4 h-4 text-emerald-700 shrink-0" />
            <label
              htmlFor="general-measurement-unit"
              className="text-xs sm:text-sm font-medium text-slate-700 truncate cursor-pointer"
            >
              {isEn ? 'Measurement Units' : 'Единицы измерения'}
            </label>
          </div>
          <div className="relative shrink-0 sm:max-w-none">
            <select
              id="general-measurement-unit"
              aria-label={isEn ? 'Measurement Units' : 'Единицы измерения'}
              data-testid="select-measurement-unit"
              value={settings.measurementUnit}
              onChange={(e) => handleChange('measurementUnit', e.target.value)}
              className="appearance-none w-full sm:w-auto bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer min-w-[140px] sm:min-w-[190px]"
            >
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {isEn ? UNIT_MAP_EN[opt] || opt : opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Timezone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <label
              htmlFor="general-timezone"
              className="text-xs sm:text-sm font-medium text-slate-700 truncate cursor-pointer"
            >
              {isEn ? 'Timezone' : 'Часовой пояс'}
            </label>
          </div>
          <div className="relative shrink-0 sm:max-w-none">
            <select
              id="general-timezone"
              aria-label={isEn ? 'Timezone' : 'Часовой пояс'}
              data-testid="select-timezone"
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="appearance-none w-full sm:w-auto bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer min-w-[140px] sm:min-w-[170px]"
            >
              {TIMEZONE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {isEn ? TIMEZONE_MAP_EN[opt] || opt : opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Date Format */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
            <label
              htmlFor="general-date-format"
              className="text-xs sm:text-sm font-medium text-slate-700 truncate cursor-pointer"
            >
              {isEn ? 'Date Format' : 'Формат даты'}
            </label>
          </div>
          <div className="relative shrink-0 sm:max-w-none">
            <select
              id="general-date-format"
              aria-label={isEn ? 'Date Format' : 'Формат даты'}
              data-testid="select-date-format"
              value={settings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="appearance-none w-full sm:w-auto bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer min-w-[140px] sm:min-w-[140px]"
            >
              {DATE_FORMAT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {isEn ? DATE_FORMAT_MAP_EN[opt] || opt : opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
