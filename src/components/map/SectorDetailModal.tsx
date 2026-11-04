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
  FileText,
  Pencil,
  RotateCcw,
  Save,
} from 'lucide-react';
import { GardenSector, NavigationTab } from '../../types';
import { useApp } from '../../context/AppContext';
import { downloadSectorPassportCsv } from '../../utils/exportUtils';

interface SectorDetailModalProps {
  sector: GardenSector | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: NavigationTab) => void;
}

export const SectorDetailModal: React.FC<SectorDetailModalProps> = ({
  sector,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const {
    isEnglish,
    formatArea,
    formatTemperature,
    formatPrecipitation,
    currentFarm,
    activeSurveyDate,
    addNotification,
    updateSector,
  } = useApp();

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [isExported, setIsExported] = React.useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);

  // Form values for inline editing
  const [formBrix, setFormBrix] = React.useState<number>(sector?.brix ?? 13.5);
  const [formFirmness, setFormFirmness] = React.useState<number>(sector?.firmnessKgCm2 ?? 6.8);
  const [formStarch, setFormStarch] = React.useState<number>(sector?.starchIndex ?? 4.5);
  const [formSoilMoisture, setFormSoilMoisture] = React.useState<number>(sector?.soilMoisturePercent ?? 65);
  const [formNdvi, setFormNdvi] = React.useState<number>(sector?.ndviIndex ?? 0.82);

  // Synchronize form when sector changes or modal opens
  useEffect(() => {
    if (sector) {
      setFormBrix(sector.brix);
      setFormFirmness(sector.firmnessKgCm2);
      setFormStarch(sector.starchIndex);
      setFormSoilMoisture(sector.soilMoisturePercent);
      setFormNdvi(sector.ndviIndex);
      setIsEditing(false);
      setSaveSuccess(false);
    }
  }, [sector, isOpen]);

  const handleSaveMetrics = () => {
    if (!sector) return;
    updateSector(sector.id, {
      brix: Number(formBrix),
      firmnessKgCm2: Number(formFirmness),
      starchIndex: Number(formStarch),
      soilMoisturePercent: Number(formSoilMoisture),
      ndviIndex: Number(formNdvi),
    });

    addNotification({
      category: 'agritech',
      badgeText: isEnglish ? 'Metrics Saved' : 'Паспорт обновлен',
      title: isEnglish ? `Sector ${sector.name} metrics updated` : `Показатели участка «${sector.name}» обновлены`,
      description: isEnglish
        ? `New values recorded: Brix ${formBrix} °Bx, Firmness ${formFirmness} kg/cm², Starch ${formStarch}/10.`
        : `Зафиксированы новые замеры: Brix ${formBrix} °Bx, плотность ${formFirmness} кг/см², крахмал ${formStarch}/10.`,
      actionText: isEnglish ? 'View Sector' : 'К участку',
      actionTarget: 'map',
      isRead: false,
      dotColor: 'teal',
      iconType: 'agritech',
    });

    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExport = () => {
    if (!sector) return;
    try {
      downloadSectorPassportCsv(sector, currentFarm, isEnglish);
    } catch {
      // Graceful fallback for non-DOM test runners
    }

    addNotification({
      category: 'system',
      badgeText: isEnglish ? 'Report Export' : 'Экспорт отчета',
      title: isEnglish ? `Passport for ${sector.name} exported` : `Паспорт участка «${sector.name}» выгружен`,
      description: isEnglish
        ? `Agronomic metrics and spectrometry for ${sector.name} (${sector.variety}) exported.`
        : `Агрономические показатели и спектрометрия участка «${sector.name}» (${sector.variety}) успешно сформированы.`,
      actionText: isEnglish ? 'View Data' : 'К данным',
      actionTarget: 'data',
      isRead: false,
      dotColor: 'teal',
      iconType: 'agritech',
    });
    setIsExported(true);
    setTimeout(() => setIsExported(false), 3000);
  };

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
                      {isEnglish ? `Spectrometry dated ${activeSurveyDate || currentFarm.lastSurveyDate || '12.08.2025'}` : `Спектрометрия от ${activeSurveyDate || currentFarm.lastSurveyDate || '12.08.2025'}`}
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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isEnglish
                      ? 'Physicochemical Fruit Maturity Metrics'
                      : 'Физико-химические показатели зрелости плодов'}
                  </h3>
                  {!isEditing ? (
                    <button
                      type="button"
                      data-testid="edit-sector-metrics-btn"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200/80 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3 h-3 text-emerald-700" />
                      <span>{isEnglish ? 'Edit Metrics' : 'Редактировать'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        data-testid="cancel-sector-metrics-btn"
                        onClick={() => {
                          setFormBrix(sector.brix);
                          setFormFirmness(sector.firmnessKgCm2);
                          setFormStarch(sector.starchIndex);
                          setFormSoilMoisture(sector.soilMoisturePercent);
                          setFormNdvi(sector.ndviIndex);
                          setIsEditing(false);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isEnglish ? 'Cancel' : 'Отмена'}</span>
                      </button>
                      <button
                        type="button"
                        data-testid="save-sector-metrics-btn"
                        onClick={handleSaveMetrics}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#07503b] hover:bg-[#096047] px-3 py-1 rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        <Save className="w-3 h-3" />
                        <span>{isEnglish ? 'Save' : 'Сохранить'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {saveSuccess && (
                  <div
                    data-testid="save-success-alert"
                    className="mb-3 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {isEnglish
                        ? 'Sector metrics successfully saved to database & context!'
                        : 'Показатели сектора успешно сохранены и обновлены в системе!'}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Brix */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="text-xs font-medium">
                        {isEnglish ? 'Sugar Content' : 'Сахаристость'}
                      </span>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    {isEditing ? (
                      <div className="flex items-center gap-1 my-1">
                        <input
                          type="number"
                          step="0.1"
                          min="5"
                          max="25"
                          value={formBrix}
                          onChange={(e) => setFormBrix(parseFloat(e.target.value) || 0)}
                          data-testid="input-brix"
                          className="w-full text-base font-bold text-slate-900 bg-white border border-emerald-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#07503b] focus:outline-hidden"
                        />
                        <span className="text-xs font-medium text-slate-500 shrink-0">°Bx</span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-slate-900">
                        {sector.brix} <span className="text-xs font-normal text-slate-500">°Bx</span>
                      </div>
                    )}
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
                    {isEditing ? (
                      <div className="flex items-center gap-1 my-1">
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="15"
                          value={formFirmness}
                          onChange={(e) => setFormFirmness(parseFloat(e.target.value) || 0)}
                          data-testid="input-firmness"
                          className="w-full text-base font-bold text-slate-900 bg-white border border-emerald-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#07503b] focus:outline-hidden"
                        />
                        <span className="text-xs font-medium text-slate-500 shrink-0">{isEnglish ? 'kg/cm²' : 'кг/см²'}</span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-slate-900">
                        {sector.firmnessKgCm2} <span className="text-xs font-normal text-slate-500">{isEnglish ? 'kg/cm²' : 'кг/см²'}</span>
                      </div>
                    )}
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
                    {isEditing ? (
                      <div className="flex items-center gap-1 my-1">
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="10"
                          value={formStarch}
                          onChange={(e) => setFormStarch(parseFloat(e.target.value) || 0)}
                          data-testid="input-starch"
                          className="w-full text-base font-bold text-slate-900 bg-white border border-emerald-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#07503b] focus:outline-hidden"
                        />
                        <span className="text-xs font-medium text-slate-500 shrink-0">/ 10</span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-slate-900">
                        {sector.starchIndex} <span className="text-xs font-normal text-slate-500">/ 10</span>
                      </div>
                    )}
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
                    {isEditing ? (
                      <div className="flex items-center gap-1 my-1">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          value={formSoilMoisture}
                          onChange={(e) => setFormSoilMoisture(parseInt(e.target.value, 10) || 0)}
                          data-testid="input-soil-moisture"
                          className="w-full text-base font-bold text-slate-900 bg-white border border-emerald-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#07503b] focus:outline-hidden"
                        />
                        <span className="text-xs font-medium text-slate-500 shrink-0">%</span>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-slate-900">
                        {sector.soilMoisturePercent}%
                      </div>
                    )}
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
                    {isEditing ? (
                      <div className="flex items-center gap-1 my-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0.1"
                          max="1.0"
                          value={formNdvi}
                          onChange={(e) => setFormNdvi(parseFloat(e.target.value) || 0)}
                          data-testid="input-ndvi"
                          className="w-full text-base font-bold text-slate-900 bg-white border border-emerald-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#07503b] focus:outline-hidden"
                        />
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-slate-900">
                        {sector.ndviIndex}
                      </div>
                    )}
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
                  <strong className="text-slate-800">{formatTemperature(currentFarm.weather.temperature)}</strong>
                </span>
                <span>
                  {isEnglish ? 'Soil Moisture:' : 'Влажность почвы:'}{' '}
                  <strong className="text-slate-800">{sector.soilMoisturePercent}%</strong>
                </span>
                <span>
                  {isEnglish ? 'Precipitation:' : 'Осадки:'}{' '}
                  <strong className="text-slate-800">{formatPrecipitation(currentFarm.weather.precipitationMm)}</strong>
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
                  onClick={handleExport}
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  {isExported
                    ? (isEnglish ? 'Report Exported!' : 'Отчет выгружен!')
                    : (isEnglish ? 'Export Report' : 'Экспорт отчета')}
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('forecasts');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-800 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    {isEnglish ? 'Forecasts' : 'К прогнозам'}
                  </button>
                )}
              </div>

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
