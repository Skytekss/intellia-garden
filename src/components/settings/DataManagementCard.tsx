import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Database,
  Cloud,
  Clock,
  Archive,
  CloudUpload,
  ChevronDown,
  Loader2,
  Check,
} from 'lucide-react';
import { DataManagementSettings } from '../../types';
import { useApp } from '../../context/AppContext';

export interface DataManagementCardProps {
  settings: DataManagementSettings;
  onChange: (settings: DataManagementSettings) => void;
  onBackupSuccess?: (timestamp: string) => void;
}

const RETENTION_OPTIONS = [
  '14 дней',
  '30 дней',
  '60 дней',
  '90 дней',
  '1 год',
  'Бессрочно',
];

const RETENTION_MAP_EN: Record<string, string> = {
  '14 дней': '14 days',
  '30 дней': '30 days',
  '60 дней': '60 days',
  '90 дней': '90 days',
  '1 год': '1 year',
  'Бессрочно': 'Indefinitely',
};

export const DataManagementCard: React.FC<DataManagementCardProps> = ({
  settings,
  onChange,
  onBackupSuccess,
}) => {
  const { t, isEnglish } = useApp();
  const [backupStatus, setBackupStatus] = useState<'idle' | 'creating' | 'success'>('idle');

  const handleToggleAutoSync = () => {
    onChange({
      ...settings,
      autoSync: !settings.autoSync,
    });
  };

  const handleChangeRetention = (retentionPeriod: string) => {
    onChange({
      ...settings,
      retentionPeriod,
    });
  };

  const handleCreateBackup = () => {
    if (backupStatus === 'creating') return;

    setBackupStatus('creating');
    setTimeout(() => {
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(
        now.getMonth() + 1
      ).padStart(2, '0')}.${now.getFullYear()}, ${String(now.getHours()).padStart(
        2,
        '0'
      )}:${String(now.getMinutes()).padStart(2, '0')}`;

      onChange({
        ...settings,
        lastBackupDate: formattedDate,
      });

      setBackupStatus('success');
      onBackupSuccess?.(formattedDate);

      setTimeout(() => {
        setBackupStatus('idle');
      }, 3000);
    }, 1200);
  };

  return (
    <div
      data-testid="data-management-card"
      className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4 hover:shadow-md transition-shadow min-w-0"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <Database className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {t('settings.data.title') || 'Управление данными'}
          </h2>
          <p className="text-xs text-slate-500 truncate">
            {t('settings.data.subtitle') || 'Хранение и синхронизация информации'}
          </p>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-4 pt-1">
        {/* Auto Sync Toggle */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <Cloud className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-slate-700 truncate">
              {t('settings.data.autoSync') || 'Автоматическая синхронизация'}
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.autoSync}
            aria-label={t('settings.data.autoSync') || 'Автоматическая синхронизация'}
            data-testid="toggle-auto-sync"
            onClick={handleToggleAutoSync}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
              settings.autoSync ? 'bg-[#07503b]' : 'bg-slate-200'
            }`}
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform ${
                settings.autoSync ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Retention Period */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <label
              htmlFor="retention-period-select"
              className="text-xs sm:text-sm font-medium text-slate-700 truncate cursor-pointer"
            >
              {t('settings.data.retention') || 'Период сохранения данных'}
            </label>
          </div>

          <div className="relative shrink-0">
            <select
              id="retention-period-select"
              aria-label={t('settings.data.retention') || 'Период сохранения данных'}
              data-testid="select-retention-period"
              value={settings.retentionPeriod}
              onChange={(e) => handleChangeRetention(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer min-w-[110px] sm:min-w-[130px]"
            >
              {RETENTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {isEnglish ? RETENTION_MAP_EN[opt] || opt : opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Backup Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <Archive className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-medium text-slate-700 block truncate">
                {t('settings.data.backup') || 'Резервное копирование'}
              </span>
              {settings.lastBackupDate && (
                <span className="text-xs text-slate-500 block truncate">
                  {t('settings.data.lastBackup') || 'Последняя:'} {settings.lastBackupDate}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            data-testid="create-backup-button"
            onClick={handleCreateBackup}
            disabled={backupStatus === 'creating'}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              backupStatus === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : backupStatus === 'creating'
                ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 text-slate-700 hover:text-slate-900 shadow-xs'
            }`}
          >
            {backupStatus === 'creating' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>{isEnglish ? 'Creating...' : 'Создание...'}</span>
              </>
            ) : backupStatus === 'success' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEnglish ? 'Backup created!' : 'Копия создана!'}</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('settings.data.createBackup') || 'Создать резервную копию'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
