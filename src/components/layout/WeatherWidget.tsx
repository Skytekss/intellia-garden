import React from 'react';
import { Sun, Droplets, Wind } from 'lucide-react';
import { WeatherTelemetry } from '../../types';
import { mockWeather } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export interface WeatherWidgetProps {
  weather?: WeatherTelemetry;
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather = mockWeather,
  className = '',
}) => {
  const { formatTemperature, formatWindSpeed, isEnglish } = useApp();

  const conditionText = isEnglish
    ? 'Clear, no rain'
    : weather.condition;

  return (
    <div
      data-testid="sidebar-weather-widget"
      className={`bg-[#03261d] border border-[#064e3b] rounded-2xl p-3.5 text-white shadow-sm transition-all hover:border-[#0a664e] ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/15 flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5 text-amber-400 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white leading-none">
              {formatTemperature(weather.temperature)}
            </div>
            <div className="text-xs text-emerald-200/80 font-medium mt-0.5">
              {conditionText}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#064e3b]/80 flex items-center justify-between text-xs text-emerald-300/70">
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-sky-400" />
          {isEnglish ? 'Humidity' : 'Влажность'} {weather.humidityPercent}%
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3 h-3 text-teal-400" />
          {formatWindSpeed(2.4)}
        </span>
      </div>
    </div>
  );
};
