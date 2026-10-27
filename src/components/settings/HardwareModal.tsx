import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Radio,
  RefreshCw,
  Battery,
  Wifi,
  Clock,
  CheckCircle2,
  CloudSun,
  Droplets,
  Camera,
  Layers,
  Info,
} from 'lucide-react';
import { HardwareSensor, SensorIconType } from '../../types';

export interface HardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensors: HardwareSensor[];
  onRefreshSensors?: () => void;
}

const renderSensorIcon = (type: SensorIconType) => {
  switch (type) {
    case 'meteo':
      return <CloudSun className="w-5 h-5 text-emerald-700" />;
    case 'soil':
      return <Droplets className="w-5 h-5 text-emerald-700" />;
    case 'camera':
      return <Camera className="w-5 h-5 text-emerald-700" />;
    case 'spectral':
      return <Layers className="w-5 h-5 text-emerald-700" />;
    default:
      return <Radio className="w-5 h-5 text-emerald-700" />;
  }
};

export const HardwareModal: React.FC<HardwareModalProps> = ({
  isOpen,
  onClose,
  sensors,
  onRefreshSensors,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshMessage('Телеметрия всех датчиков успешно обновлена!');
      onRefreshSensors?.();
      setTimeout(() => {
        setRefreshMessage(null);
      }, 3500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            data-testid="hardware-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hardware-modal-title"
            data-testid="hardware-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="hardware-modal-title"
                    className="text-sm sm:text-base font-bold text-slate-900"
                  >
                    Датчики и оборудование
                  </h3>
                  <p className="text-xs text-slate-500">
                    Статусы подключённых IoT-устройств и метеостанций
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-testid="close-hardware-modal"
                onClick={onClose}
                aria-label="Закрыть окно"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Status summary banner */}
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50/80 border border-emerald-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-950 font-medium">
                  Все подключенные устройства находятся на связи и передают телеметрию без задержек.
                </div>
              </div>

              {refreshMessage && (
                <div
                  data-testid="hardware-refresh-message"
                  className="p-3 bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{refreshMessage}</span>
                </div>
              )}

              {/* Sensor cards */}
              <div className="space-y-3">
                {sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    data-testid={`hardware-detail-${sensor.id}`}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                          {renderSensorIcon(sensor.iconType)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {sensor.name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">
                            Модель: {sensor.model}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          {sensor.statusText}
                        </span>
                      </div>
                    </div>

                    {sensor.details && (
                      <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-100">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{sensor.details}</span>
                      </div>
                    )}

                    {/* Sensor stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 text-xs text-slate-600">
                      {sensor.batteryLevel !== undefined && (
                        <div className="flex items-center gap-1.5">
                          <Battery className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>Заряд: {sensor.batteryLevel}%</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>Сигнал: Отличный</span>
                      </div>
                      {sensor.lastPing && (
                        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Синхронизация: {sensor.lastPing}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                data-testid="refresh-hardware-button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-emerald-700 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
                <span>{isRefreshing ? 'Обновление...' : 'Обновить статус'}</span>
              </button>

              <button
                type="button"
                data-testid="close-hardware-modal-footer"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Готово
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
