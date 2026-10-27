import React from 'react';
import { motion } from 'motion/react';
import { Bell, Apple, Sun, ShieldCheck, Sparkles } from 'lucide-react';
import { NotificationSettings } from '../../types';

export interface NotificationsCardProps {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
}

interface ToggleItem {
  key: 'harvestAndMaturity' | 'weatherConditions' | 'agrotechnicalWorks' | 'systemUpdates';
  label: string;
  icon: React.ReactNode;
}

export const NotificationsCard: React.FC<NotificationsCardProps> = ({
  settings,
  onChange,
}) => {
  const toggleSetting = (key: keyof NotificationSettings) => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const items: ToggleItem[] = [
    {
      key: 'harvestAndMaturity',
      label: 'Урожай и зрелость плодов',
      icon: <Apple className="w-4 h-4 text-emerald-700 shrink-0" />,
    },
    {
      key: 'weatherConditions',
      label: 'Погодные условия',
      icon: <Sun className="w-4 h-4 text-emerald-700 shrink-0" />,
    },
    {
      key: 'agrotechnicalWorks',
      label: 'Агротехнические работы',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />,
    },
    {
      key: 'systemUpdates',
      label: 'Обновления системы',
      icon: <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />,
    },
  ];

  return (
    <div
      data-testid="notifications-card"
      className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4 hover:shadow-md transition-shadow min-w-0"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            Уведомления
          </h2>
          <p className="text-xs text-slate-500 truncate">
            Настройте, о каких событиях вы хотите получать уведомления
          </p>
        </div>
      </div>

      {/* Toggles list */}
      <div className="space-y-3.5 pt-1">
        {items.map(({ key, label, icon }) => {
          const isEnabled = settings[key];

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 min-w-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                {icon}
                <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                  {label}
                </span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                aria-label={label}
                data-testid={`toggle-${key}`}
                onClick={() => toggleSetting(key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                  isEnabled ? 'bg-[#07503b]' : 'bg-slate-200'
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
