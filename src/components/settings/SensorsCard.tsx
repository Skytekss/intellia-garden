import React from 'react';
import {
  Radio,
  BarChart2,
  ChevronRight,
  CloudSun,
  Droplets,
  Camera,
  Layers,
  Settings,
} from 'lucide-react';
import { HardwareSensor, SensorIconType } from '../../types';

export interface SensorsCardProps {
  sensors: HardwareSensor[];
  onConfigureHardware: () => void;
}

const renderSensorIcon = (type: SensorIconType) => {
  switch (type) {
    case 'meteo':
      return <CloudSun className="w-4 h-4 text-emerald-700 shrink-0" />;
    case 'soil':
      return <Droplets className="w-4 h-4 text-emerald-700 shrink-0" />;
    case 'camera':
      return <Camera className="w-4 h-4 text-emerald-700 shrink-0" />;
    case 'spectral':
      return <Layers className="w-4 h-4 text-emerald-700 shrink-0" />;
    default:
      return <Radio className="w-4 h-4 text-emerald-700 shrink-0" />;
  }
};

export const SensorsCard: React.FC<SensorsCardProps> = ({
  sensors,
  onConfigureHardware,
}) => {
  const allOnline = sensors.every((s) => s.status === 'online');

  return (
    <div
      data-testid="sensors-card"
      className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4 hover:shadow-md transition-shadow min-w-0"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <Radio className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            Датчики и оборудование
          </h2>
          <p className="text-xs text-slate-500 truncate">
            Управление подключёнными устройствами
          </p>
        </div>
      </div>

      {/* Status banner */}
      <button
        type="button"
        onClick={onConfigureHardware}
        data-testid="sensors-status-banner"
        className="w-full bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-100/80 rounded-xl p-3 flex items-center justify-between text-left transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <BarChart2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="text-xs font-semibold text-emerald-900 truncate">
            {allOnline ? 'Все датчики работают нормально' : 'Требуется проверка датчиков'}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </button>

      {/* Sensor list */}
      <div className="space-y-3 pt-1">
        {sensors.map((sensor) => (
          <div
            key={sensor.id}
            data-testid={`sensor-item-${sensor.id}`}
            className="flex items-center justify-between gap-3 py-1 min-w-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              {renderSensorIcon(sensor.iconType)}
              <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                {sensor.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`w-2 h-2 rounded-full ${
                  sensor.status === 'online'
                    ? 'bg-emerald-500'
                    : sensor.status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-medium text-slate-500">
                {sensor.statusText}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action bottom button */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onConfigureHardware}
          data-testid="configure-hardware-button"
          className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-colors cursor-pointer text-left group"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-emerald-700" />
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              Настроить оборудование
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
};
