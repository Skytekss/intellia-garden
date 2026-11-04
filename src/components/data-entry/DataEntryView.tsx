import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  ClipboardList,
  CloudSun,
  CheckCircle2,
  X,
  Gauge,
  Sun,
  Radio,
  Flame,
} from 'lucide-react';
import { NavigationTab, DataSubTab, HyperspectralUploadState, AgroRecord } from '../../types';
import { HyperspectralUploadCard } from './HyperspectralUploadCard';
import { StreifIndexCalculator } from './StreifIndexCalculator';
import { AgroWidget } from './AgroWidget';
import { MeteoWidget } from './MeteoWidget';
import { useApp } from '../../context/AppContext';

interface DataEntryViewProps {
  onNavigate?: (tab: NavigationTab) => void;
}

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export const DataEntryView: React.FC<DataEntryViewProps> = ({ onNavigate }) => {
  const { isEnglish, t } = useApp();

  const resolveSubTabFromUrl = (): DataSubTab => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sub = params.get('subtab');
      if (sub === 'spectral' || sub === 'agro' || sub === 'meteo') return sub;
      if (sub === 'calculator' || sub === 'streif') return 'agro';
    } catch {
      // fallback
    }
    return 'spectral';
  };

  const [activeSubTab, setActiveSubTabState] = useState<DataSubTab>(resolveSubTabFromUrl);

  React.useEffect(() => {
    const handlePopState = () => {
      setActiveSubTabState(resolveSubTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveSubTab = (tab: DataSubTab) => {
    setActiveSubTabState(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('subtab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // fallback in tests
    }
  };

  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const handleSaveHyperspectral = (_data: HyperspectralUploadState) => {
    showToast(
      isEnglish
        ? 'Hyperspectral data successfully saved to orchard registry!'
        : 'Гиперспектральные данные успешно сохранены в реестр сада!'
    );
  };

  const handleContinue = () => {
    showToast(
      isEnglish
        ? 'Data saved. Proceeding to ripening analytics & forecasts...'
        : 'Данные сохранены. Переход к аналитике и прогнозам...'
    );
    if (onNavigate) {
      onNavigate('forecasts');
    }
  };

  const handleAddAgroRecord = (record: AgroRecord) => {
    showToast(
      isEnglish
        ? `Record "${record.title}" successfully added to agro journal!`
        : `Запись «${record.title}» успешно добавлена в агрожурнал!`
    );
  };

  const handleImportMeteo = () => {
    showToast(
      isEnglish
        ? 'Meteo data synchronized with weather station successfully!'
        : 'Метеоданные успешно синхронизированы с метеостанцией!'
    );
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
            <span>{isEnglish ? 'Data' : 'Ввод'}</span>
            <span>{isEnglish ? 'Entry' : 'данных'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('data.subtitle') ||
              'Загрузка снимков БПЛА, ведение агротехнических операций и телеметрия сада'}
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
          <span>{t('data.tab.spectral') || 'Гиперспектральные данные'}</span>
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
          <span>{t('data.tab.agro') || 'Агротехнические данные'}</span>
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
          <span>{t('data.tab.meteo') || 'Метеоданные'}</span>
        </button>
      </div>

      {/* Subtab 1: Spectral (Split Comparator + AI Drone Analyzer + Widgets) */}
      {activeSubTab === 'spectral' && (
        <div
          data-testid="subtab-spectral-content"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0"
        >
          <div className="lg:col-span-8 min-w-0 space-y-6">
            <HyperspectralUploadCard
              onSave={handleSaveHyperspectral}
              onNavigateNext={handleContinue}
            />
          </div>

          <div className="lg:col-span-4 min-w-0 space-y-6">
            <AgroWidget onAddRecord={handleAddAgroRecord} />
            <MeteoWidget onImport={handleImportMeteo} />
          </div>
        </div>
      )}

      {/* Subtab 2: Agro Data (Streif Ripening Index Calculator + Journal) */}
      {activeSubTab === 'agro' && (
        <div
          data-testid="subtab-agro-content"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0"
        >
          <div className="lg:col-span-8 min-w-0 space-y-6">
            {/* Express Streif Ripening Index Lab Calculator */}
            <StreifIndexCalculator
              onApplied={(sectorName, si) =>
                showToast(
                  isEnglish
                    ? `Streif Index (SI = ${si}) applied to ${sectorName}!`
                    : `Замер индекса Стрейфа (SI = ${si}) внесен для сектора «${sectorName}»!`
                )
              }
            />

            {/* Quick reference guide for Streif & CTIFL norms */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-700" />
                <span>
                  {isEnglish
                    ? 'Streif Index Methodology & Optimal Picking Windows'
                    : 'Методика расчета индекса Стрейфа и критерии оптимума сбора'}
                </span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isEnglish
                  ? 'The Streif Index (SI = F / (R * S)) provides the gold standard for timing the harvest of long-storing apple cultivars. Values between 0.07 and 0.09 indicate prime picking readiness for Ultra-Low Oxygen (ULO/CA) cold rooms with up to 7–9 months storage capability.'
                  : 'Индекс Стрейфа (SI = F / (R * S)) является международным стандартом определения оптимального окна уборки яблок для длительного хранения. Значение 0.07–0.09 соответствует высшей лежкоспособности плодов в камерах с РГС (ULO) до 7–9 месяцев.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 min-w-0 space-y-6">
            <AgroWidget onAddRecord={handleAddAgroRecord} />
          </div>
        </div>
      )}

      {/* Subtab 3: Meteo Telemetry (Sensors, GDD, Station Sync) */}
      {activeSubTab === 'meteo' && (
        <div
          data-testid="subtab-meteo-content"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0"
        >
          <div className="lg:col-span-8 min-w-0 space-y-6">
            {/* Advanced Meteo Station Telemetry Card */}
            <div
              data-testid="meteo-advanced-station"
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                    <CloudSun className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {isEnglish
                        ? 'Davis Vantage Pro2 Agro-Weather Station'
                        : 'Автоматическая агрометеостанция Davis Vantage Pro2'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isEnglish
                        ? 'Telemetry telemetry loop: 5 min update • LoRaWAN 868 MHz'
                        : 'Интервал телеметрии: 5 мин • Канал связи LoRaWAN 868 МГц'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              {/* Meteo Telemetry Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isEnglish ? 'Accumulated GDD' : 'Сумма тепл. GDD'}</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">1,280 °C</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {isEnglish ? 'Base T = 10°C' : 'Базовая T₀ = 10°C'}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isEnglish ? 'Solar Radiation' : 'Инсоляция'}</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">840 Вт/м²</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {isEnglish ? 'Peak irradiance' : 'Максимальная'}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Gauge className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isEnglish ? 'Pressure' : 'Давление'}</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">1,014 гПа</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">760 мм рт. ст.</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isEnglish ? 'Sensor Probes' : 'Почв. зонды'}</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">4 / 4</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {isEnglish ? '100% active' : 'Все активны'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 min-w-0 space-y-6">
            <MeteoWidget onImport={handleImportMeteo} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryView;
