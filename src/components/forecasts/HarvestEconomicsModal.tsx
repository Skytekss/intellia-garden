import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Sparkles } from 'lucide-react';
import { GardenSector } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  calculateHarvestEconomics,
  DEFAULT_ECONOMICS_PARAMS,
  HarvestEconomicsParams,
} from '../../utils/harvestEconomics';
import { getLocalizedSectors } from '../../context/localizedData';

export interface HarvestEconomicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectors: GardenSector[];
}

export const HarvestEconomicsModal: React.FC<HarvestEconomicsModalProps> = ({
  isOpen,
  onClose,
  sectors: propSectors,
}) => {
  const { isEnglish, sectors: rawSectors } = useApp();
  const sectors = getLocalizedSectors(isEnglish, propSectors.length > 0 ? propSectors : rawSectors);

  const [selectedSectorId, setSelectedSectorId] = useState<string>(() =>
    sectors.length > 0 ? sectors[0].id : 'sector-1'
  );

  const [params, setParams] = useState<HarvestEconomicsParams>(DEFAULT_ECONOMICS_PARAMS);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSector = sectors.find((s) => s.id === selectedSectorId) || sectors[0];
  const economics = calculateHarvestEconomics(currentSector, params, isEnglish);

  const formatMillions = (rub: number) => {
    return (rub / 1_000_000).toFixed(2);
  };

  const maxPointRevenue = Math.max(...economics.curve.map((p) => p.totalRevenueRub));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="economics-modal-title"
      data-testid="harvest-economics-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        data-testid="economics-modal-backdrop"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-3xl w-full p-4 sm:p-6 md:p-7 space-y-5 my-auto z-10 animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2
                id="economics-modal-title"
                data-testid="economics-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                {isEnglish
                  ? 'Harvest Profitability & Margin Timing Optimization'
                  : 'Оптимизация маржинальности и окно максимальной выручки'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEnglish
                  ? 'Revenue vs. Picking Date model: Retail price, CA storage premium, and fruit drop losses'
                  : 'Модель «Выручка vs Дата сбора»: розница, закладка в РГС и риск потерь от падалицы'}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="economics-modal-close"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={isEnglish ? 'Close modal' : 'Закрыть окно'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {sectors.map((sec) => {
            const isSelected = sec.id === selectedSectorId;
            return (
              <button
                key={sec.id}
                type="button"
                data-testid={`econ-sector-tab-${sec.id}`}
                onClick={() => setSelectedSectorId(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#07503b] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {sec.name} ({sec.variety})
              </button>
            );
          })}
        </div>

        {/* Top 3 KPI Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Max Peak Revenue */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90">
            <span className="text-xs font-medium text-emerald-800 block">
              {isEnglish ? 'Optimal Window Revenue' : 'Выручка в оптимуме'}
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-950 mt-1">
              {formatMillions(economics.maxRevenueRub)} <span className="text-xs font-semibold text-emerald-800">{isEnglish ? 'M ₽' : 'млн ₽'}</span>
            </div>
            <span className="text-xs text-emerald-700 mt-1 block">
              {isEnglish ? 'Window:' : 'Окно:'} {currentSector.recommendedDate}
            </span>
          </div>

          {/* Early Penalty */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-medium text-slate-500 block">
              {isEnglish ? 'Early Harvest Penalty (-8d)' : 'Потери при раннем сборе (-8 дн.)'}
            </span>
            <div className="text-lg sm:text-xl font-bold text-amber-700 mt-1">
              -{formatMillions(economics.earlyHarvestPenaltyRub)} <span className="text-xs font-normal text-slate-500">{isEnglish ? 'M ₽' : 'млн ₽'}</span>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              {isEnglish ? 'Caliber deficit (-10% mass)' : 'Недобор массы плодов (-10%)'}
            </span>
          </div>

          {/* Late Penalty */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-medium text-slate-500 block">
              {isEnglish ? 'Late Harvest Penalty (+12d)' : 'Потери от перезревания (+12 дн.)'}
            </span>
            <div className="text-lg sm:text-xl font-bold text-rose-700 mt-1">
              -{formatMillions(economics.lateHarvestPenaltyRub)} <span className="text-xs font-normal text-slate-500">{isEnglish ? 'M ₽' : 'млн ₽'}</span>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              {isEnglish ? 'Massive drop (~24% losses)' : 'Осыпание плодов (~24%)'}
            </span>
          </div>
        </div>

        {/* Visual Revenue Comparison Chart */}
        <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {isEnglish ? 'Projected Revenue Dynamics (Days around optimal window)' : 'Динамика выручки по датам сбора'}
            </span>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
              {isEnglish ? 'Peak Profit Target' : 'Максимум прибыли'}
            </span>
          </div>

          {/* Custom Responsive SVG Bar Chart */}
          <div className="grid grid-cols-6 gap-2 pt-2">
            {economics.curve.map((point) => {
              const heightRatio = maxPointRevenue > 0 ? (point.totalRevenueRub / maxPointRevenue) * 100 : 50;

              return (
                <div key={point.dayOffset} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="text-xs font-bold text-slate-700">
                    {formatMillions(point.totalRevenueRub)}M
                  </span>

                  <div className="w-full h-28 bg-slate-200/60 rounded-xl relative flex items-end p-1">
                    <div
                      style={{ height: `${heightRatio}%` }}
                      className={`w-full rounded-lg transition-all duration-300 ${
                        point.isOptimal
                          ? 'bg-[#07503b] shadow-xs'
                          : point.dayOffset < 0
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                  </div>

                  <span className={`text-xs font-semibold ${point.isOptimal ? 'text-emerald-800' : 'text-slate-600'}`}>
                    {point.dateLabel}
                  </span>

                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${
                    point.dropPercent > 10
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {point.dropPercent}% {isEnglish ? 'drop' : 'пад.'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Parameter Sliders */}
        <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            {isEnglish ? 'Adjust Market & Storage Pricing Model' : 'Настройка параметров рыночных цен и хранения'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Slider 1: Fresh price */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{isEnglish ? 'Fresh Market' : 'Свежий рынок'}:</span>
                <span className="font-bold text-slate-800">{params.freshMarketPriceRubPerKg} ₽/кг</span>
              </div>
              <input
                type="range"
                min="60"
                max="130"
                step="5"
                data-testid="input-fresh-price"
                value={params.freshMarketPriceRubPerKg}
                onChange={(e) => setParams({ ...params, freshMarketPriceRubPerKg: Number(e.target.value) })}
                className="w-full accent-[#07503b] cursor-pointer"
              />
            </div>

            {/* Slider 2: Storage price */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{isEnglish ? 'CA Storage Net' : 'Закладка в РГС'}:</span>
                <span className="font-bold text-slate-800">{params.caStoragePriceRubPerKg} ₽/кг</span>
              </div>
              <input
                type="range"
                min="90"
                max="180"
                step="5"
                data-testid="input-storage-price"
                value={params.caStoragePriceRubPerKg}
                onChange={(e) => setParams({ ...params, caStoragePriceRubPerKg: Number(e.target.value) })}
                className="w-full accent-[#07503b] cursor-pointer"
              />
            </div>

            {/* Slider 3: Storage quota */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{isEnglish ? 'CA Storage Quota' : 'Доля в РГС'}:</span>
                <span className="font-bold text-slate-800">{params.caStorageSharePercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                data-testid="input-storage-quota"
                value={params.caStorageSharePercent}
                onChange={(e) => setParams({ ...params, caStorageSharePercent: Number(e.target.value) })}
                className="w-full accent-[#07503b] cursor-pointer"
              />
            </div>

            {/* Slider 4: Yield */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{isEnglish ? 'Yield' : 'Урожайность'}:</span>
                <span className="font-bold text-slate-800">{params.yieldTonsPerHa} т/га</span>
              </div>
              <input
                type="range"
                min="15"
                max="55"
                step="1"
                data-testid="input-yield"
                value={params.yieldTonsPerHa}
                onChange={(e) => setParams({ ...params, yieldTonsPerHa: Number(e.target.value) })}
                className="w-full accent-[#07503b] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Agronomic & Economic Insight */}
        <div
          data-testid="economics-ai-insight"
          className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900"
        >
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {isEnglish
              ? `Economic recommendation for ${currentSector.name} (${currentSector.variety}): Maximize picking during the primary window (${currentSector.recommendedDate}). Harvesting 1 week early loses ${formatMillions(economics.earlyHarvestPenaltyRub)} M ₽ in caliber weight, while 12 days delay causes up to ${formatMillions(economics.lateHarvestPenaltyRub)} M ₽ drop and downgrading losses.`
              : `Экономическое резюме для ${currentSector.name} (${currentSector.variety}): Рекомендуется сосредоточить уборочные звенья в базовое окно (${currentSector.recommendedDate}). Преждевременная уборка за 8 дней снижает выручку на ${formatMillions(economics.earlyHarvestPenaltyRub)} млн ₽ из-за недобора калибра, а задержка на 12 дней приводит к потерям до ${formatMillions(economics.lateHarvestPenaltyRub)} млн ₽ от падалицы.`}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            data-testid="economics-modal-done"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isEnglish ? 'Apply & Close' : 'Применить и закрыть'}
          </button>
        </div>
      </div>
    </div>
  );
};
