import React, { useState } from 'react';
import {
  Thermometer,
  CloudRain,
  Droplets,
  Download,
  Check,
  CloudSun,
  RefreshCw,
} from 'lucide-react';
import { MeteoTelemetryData } from '../../types';
import { initialMeteoData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface MeteoWidgetProps {
  data?: MeteoTelemetryData;
  onImport?: () => void;
  className?: string;
}

export const MeteoWidget: React.FC<MeteoWidgetProps> = ({
  data: propData,
  onImport,
  className = '',
}) => {
  const { isEnglish, isImperial, formatTemperature, formatPrecipitation, t } = useApp();
  const [data, setData] = useState<MeteoTelemetryData>(propData || initialMeteoData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedRecently, setSyncedRecently] = useState(false);

  const handleImport = () => {
    setIsSyncing(true);
    if (onImport) {
      onImport();
    }
    // Simulate telemetry fetch/sync
    setTimeout(() => {
      setIsSyncing(false);
      setSyncedRecently(true);
      setData((prev) => ({
        ...prev,
        lastSyncTime: isEnglish ? 'Just now' : 'Только что',
      }));
      setTimeout(() => setSyncedRecently(false), 3000);
    }, 400);
  };

  return (
    <div
      data-testid="meteo-widget"
      className={`bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-800">
              {t('data.meteo.title') || 'Метеоданные'}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                syncedRecently ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span className="text-xs text-slate-400 font-medium">
              {isEnglish ? 'Online' : 'Онлайн'}
            </span>
          </div>
        </div>

        {/* Telemetry Metrics List */}
        <div data-testid="meteo-metrics-list" className="space-y-3">
          {/* Temperature */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Thermometer className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">
                {isEnglish ? 'Temperature' : 'Температура'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-800">
              {isImperial ? formatTemperature(data.temperature) : `${data.temperature} °C`}
            </span>
          </div>

          {/* Precipitation */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CloudRain className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">
                {isEnglish ? 'Precipitation' : 'Осадки'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-800">
              {isImperial ? formatPrecipitation(data.precipitationMm) : `${data.precipitationMm} ${isEnglish ? 'mm' : 'мм'}`}
            </span>
          </div>

          {/* Humidity */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-700">
                {isEnglish ? 'Humidity' : 'Влажность'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-800">{data.humidityPercent}%</span>
          </div>
        </div>
      </div>

      {/* Import Button */}
      <div className="mt-4 pt-2">
        <button
          type="button"
          data-testid="import-meteo-button"
          onClick={handleImport}
          disabled={isSyncing}
          className="w-full py-2.5 border border-slate-200/90 text-emerald-800 hover:bg-emerald-50/50 hover:border-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
              <span>{isEnglish ? 'Syncing...' : 'Синхронизация...'}</span>
            </>
          ) : syncedRecently ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{isEnglish ? 'Data Updated' : 'Данные обновлены'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-emerald-700" />
              <span>{isEnglish ? 'Import Meteo Data' : 'Импортировать данные'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MeteoWidget;
