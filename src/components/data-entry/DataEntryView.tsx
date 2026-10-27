import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  ClipboardList,
  CloudSun,
  CheckCircle2,
  X,
} from 'lucide-react';
import { NavigationTab, DataSubTab, HyperspectralUploadState, AgroRecord } from '../../types';
import { HyperspectralUploadCard } from './HyperspectralUploadCard';
import { AgroWidget } from './AgroWidget';
import { MeteoWidget } from './MeteoWidget';

interface DataEntryViewProps {
  onNavigate?: (tab: NavigationTab) => void;
}

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export const DataEntryView: React.FC<DataEntryViewProps> = ({ onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<DataSubTab>('spectral');
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const handleSaveHyperspectral = (_data: HyperspectralUploadState) => {
    showToast('Гиперспектральные данные успешно сохранены в реестр сада!');
  };

  const handleContinue = () => {
    showToast('Данные сохранены. Переход к аналитике и прогнозам...');
    if (onNavigate) {
      onNavigate('forecasts');
    }
  };

  const handleAddAgroRecord = (record: AgroRecord) => {
    showToast(`Запись «${record.title}» успешно добавлена в агрожурнал!`);
  };

  const handleImportMeteo = () => {
    showToast('Метеоданные успешно синхронизированы с метеостанцией!');
  };

  return (
    <div
      data-testid="data-entry-view"
      className="space-y-6 w-full min-w-0"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            data-testid="toast-notification"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 bg-[#05382b] text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-600/40 text-xs font-semibold max-w-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 text-emerald-200/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Ввод</span>
            <span>данных</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Загрузка снимков БПЛА, ведение агротехнических операций и телеметрия сада
          </p>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div
        data-testid="data-subtabs-nav"
        className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto no-scrollbar pb-px min-w-0"
      >
        <button
          type="button"
          data-testid="subtab-spectral"
          onClick={() => setActiveSubTab('spectral')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'spectral'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Гиперспектральные данные</span>
        </button>

        <button
          type="button"
          data-testid="subtab-agro"
          onClick={() => setActiveSubTab('agro')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'agro'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-emerald-700" />
          <span>Агротехнические данные</span>
        </button>

        <button
          type="button"
          data-testid="subtab-meteo"
          onClick={() => setActiveSubTab('meteo')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'meteo'
              ? 'border-emerald-700 text-emerald-900 bg-emerald-50/40 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <CloudSun className="w-4 h-4 text-emerald-700" />
          <span>Метеоданные</span>
        </button>
      </div>

      {/* Main Grid: Left col-span-8, Right col-span-4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
        {/* Left Column: Hyperspectral Upload Card (8 cols) */}
        <div className="lg:col-span-8 min-w-0 space-y-6">
          <HyperspectralUploadCard
            onSave={handleSaveHyperspectral}
            onNavigateNext={handleContinue}
          />
        </div>

        {/* Right Column: Agro & Meteo Widgets (4 cols) */}
        <div className="lg:col-span-4 min-w-0 space-y-6">
          <AgroWidget onAddRecord={handleAddAgroRecord} />
          <MeteoWidget onImport={handleImportMeteo} />
        </div>
      </div>
    </div>
  );
};

export default DataEntryView;
