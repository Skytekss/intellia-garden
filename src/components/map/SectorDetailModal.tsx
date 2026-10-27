import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Droplets, 
  Sparkles, 
  Activity, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  FileText 
} from 'lucide-react';
import { GardenSector } from '../../types';
import { useApp } from '../../context/AppContext';

interface SectorDetailModalProps {
  sector: GardenSector | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SectorDetailModal: React.FC<SectorDetailModalProps> = ({
  sector,
  isOpen,
  onClose,
}) => {
  const { isEnglish, formatArea, formatTemperature, formatPrecipitation } = useApp();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!sector) return null;

  const getStatusBadge = () => {
    switch (sector.status) {
      case 'ready':
        return {
          text: isEnglish ? 'Ready for harvest' : 'Готов к сбору урожая',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
      case 'ripening':
        return {
          text: isEnglish ? 'Active ripening phase' : 'Активная фаза созревания',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          dotClass: 'bg-amber-500',
        };
      case 'early':
      default:
        return {
          text: isEnglish ? 'Early fruit growth' : 'Ранняя вегетация плодов',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
          dotClass: 'bg-rose-500',
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-sector-title"
          data-testid="sector-detail-modal"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            data-testid="modal-backdrop"
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="bg-[#05382b] text-white p-5 sm:p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-sm border border-emerald-500/30">
                    {sector.id.replace('sector-', '')}
                  </span>
                  <div>
                    <h2 id="modal-sector-title" className="text-xl sm:text-2xl font-bold tracking-tight">
                      {isEnglish
                        ? `${sector.name} — variety "${sector.variety}"`
                        : `${sector.name} — сорт «${sector.variety}»`}
                    </h2>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      {isEnglish ? 'Area:' : 'Площадь:'} {formatArea(sector.area)} •{' '}
                      {isEnglish ? 'Spectrometry dated 12.08.2025' : 'Спектрометрия от 12.08.2025'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}>
                    <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                    {statusInfo.text} ({sector.maturityPercent}%)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-200 border border-emerald-700/40">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    {isEnglish ? 'Harvest window:' : 'Окно сбора:'} {sector.recommendedDate}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={isEnglish ? 'Close modal' : 'Закрыть модальное окно'}
                data-testid="modal-close-btn"
                className="rounded-lg p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-160px)] overflow-y-auto">
              {/* Agro Metrics Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {isEnglish
                    ? 'Physicochemical Fruit Maturity Metrics'
                    : 'Физико-химические показатели зрелости плодов'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Brix */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">
                        {isEnglish ? 'Sugar Content' : 'Сахаристость'}
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {sector.brix} <span className="text-xs font-normal text-slate-500">°Bx</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEnglish ? 'Norm: 13.0 – 15.0 °Bx' : 'Норма: 13.0 – 15.0 °Bx'}
                    </div>
                  </div>

                  {/* Firmness */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">
                        {isEnglish ? 'Flesh Firmness' : 'Плотность мякоти'}
                      </span>
                      <Activity className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {sector.firmnessKgCm2} <span className="text-xs font-normal text-slate-500">{isEnglish ? 'kg/cm²' : 'кг/см²'}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEnglish ? 'Optimum: 6.5 – 7.5 kg/cm²' : 'Оптимум: 6.5 – 7.5 кг/см²'}
                    </div>
                  </div>

                  {/* Starch index */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">
                        {isEnglish ? 'Starch Test' : 'Крахмальный тест'}
                      </span>
                      <TrendingUp className="w-4 h-4 text-teal-500" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {sector.starchIndex} <span className="text-xs font-normal text-slate-500">/ 10</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEnglish ? 'CTIFL scale (norm 4–6)' : 'Шкала CTIFL (норма 4–6)'}
                    </div>
                  </div>

                  {/* Soil Moisture */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">
                        {isEnglish ? 'Soil Moisture' : 'Влажность почвы'}
                      </span>
                      <Droplets className="w-4 h-4 text-sky-500" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {sector.soilMoisturePercent}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEnglish ? 'Optimal: 60 – 70%' : 'Комфортно: 60 – 70%'}
                    </div>
                  </div>

                  {/* NDVI */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">
                        {isEnglish ? 'NDVI Index' : 'Индекс NDVI'}
                      </span>
                      <Layers className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {sector.ndviIndex}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEnglish ? 'Healthy canopy (>0.75)' : 'Здоровый полог (>0.75)'}
                    </div>
                  </div>

                  {/* Maturity status */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">
                        {isEnglish ? 'Harvest Readiness' : 'Готовность к сбору'}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-bold text-emerald-700">
                      {sector.maturityPercent}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isEnglish ? 'AI model forecast' : 'По прогнозу ИИ'}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Agronomist Recommendations */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {isEnglish
                    ? 'INTELLIA AI Agronomist Recommendations'
                    : 'Рекомендации AI-агронома «ИНТЕЛЛИЯ»'}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {isEnglish
                    ? `According to hyperspectral analysis, sugar accumulation rate (${sector.brix} °Bx) and starch regression (${sector.starchIndex}/10) are optimal. Cease nitrogen fertilizer application, verify bin logistics, and prepare harvesting machinery for dates: `
                    : `По данным гиперспектрального анализа темпы накопления сахаров (${sector.brix} °Bx) и регрессии крахмала (${sector.starchIndex}/10) оптимальны. Рекомендуется прекратить внесение азотных удобрений, провести калибровку контейнеров и подготовить уборочную технику к датам: `}
                  <strong className="text-emerald-800">{sector.recommendedDate}</strong>.
                  {isEnglish ? ' Pre-harvest fruit drop risk is under 2.4%.' : ' Риск осыпания плодов — менее 2.4%.'}
                </p>
              </div>

              {/* Weather & microclimate snippet */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <span className="font-medium text-slate-700">
                  {isEnglish ? 'Sector Microclimate:' : 'Метеоусловия участка:'}
                </span>
                <span>
                  {isEnglish ? 'Temperature:' : 'Температура:'}{' '}
                  <strong className="text-slate-800">{formatTemperature(18)}</strong>
                </span>
                <span>
                  {isEnglish ? 'Air Humidity:' : 'Влажность воздуха:'}{' '}
                  <strong className="text-slate-800">65%</strong>
                </span>
                <span>
                  {isEnglish ? 'Precipitation:' : 'Осадки:'}{' '}
                  <strong className="text-slate-800">{formatPrecipitation(0)}</strong>
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                onClick={() =>
                  alert(
                    isEnglish
                      ? 'Sector agronomic report generated successfully.'
                      : 'Отчет по сектору успешно сформирован.'
                  )
                }
              >
                <FileText className="w-4 h-4 text-slate-500" />
                {isEnglish ? 'Export Report' : 'Экспорт отчета'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#07503b] hover:bg-[#096047] text-white transition-all shadow-xs cursor-pointer"
              >
                {isEnglish ? 'Got it' : 'Понятно'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
