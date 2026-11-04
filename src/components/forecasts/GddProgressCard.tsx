import React, { useState } from 'react';
import { Thermometer, Flame, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateSectorGdd, GDD_BASE_TEMPERATURE_C } from '../../utils/gddModel';
import { getLocalizedSectors } from '../../context/localizedData';

export interface GddProgressCardProps {
  className?: string;
}

export const GddProgressCard: React.FC<GddProgressCardProps> = ({ className = '' }) => {
  const { isEnglish, sectors: rawSectors, currentFarm, tempAnomaly, rainCondition } = useApp();
  const sectors = getLocalizedSectors(isEnglish, rawSectors);

  const [selectedSectorId, setSelectedSectorId] = useState<string>(() =>
    sectors.length > 0 ? sectors[0].id : 'sector-1'
  );

  const currentSector = sectors.find((s) => s.id === selectedSectorId) || sectors[0];
  if (!currentSector) return null;

  const currentTemp = currentFarm?.weather?.temperature ?? 20;
  const analysis = calculateSectorGdd(currentSector, currentTemp, tempAnomaly, rainCondition);

  return (
    <div
      data-testid="gdd-progress-card"
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5 ${className}`}
    >
      {/* Header & Sector Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <Thermometer className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {isEnglish
                  ? 'Growing Degree Days Phenological Model (GDD)'
                  : 'Модель эффективных температур созревания (GDD)'}
              </h3>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100/70 text-amber-800 border border-amber-200/60">
                T_base = {GDD_BASE_TEMPERATURE_C}°C
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEnglish
                ? 'Physiological heat units tracking per apple cultivar'
                : 'Биологический учет накопленного тепла по помологическим стандартам'}
            </p>
          </div>
        </div>

        {/* Sector Tabs/Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {sectors.map((sec) => {
            const isSelected = sec.id === selectedSectorId;
            return (
              <button
                key={sec.id}
                type="button"
                data-testid={`gdd-sector-btn-${sec.id}`}
                onClick={() => setSelectedSectorId(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#07503b] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                }`}
              >
                {sec.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Progress Bar Area */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span>{currentSector.name}</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
              {currentSector.variety}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span className="text-emerald-700 text-sm font-black">{analysis.accumulatedGdd}</span>
            <span className="text-slate-400">/</span>
            <span>{analysis.targetGdd} GDD</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs ml-1">
              {analysis.progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
          <div
            data-testid="gdd-progress-bar"
            style={{ width: `${Math.min(100, Math.max(4, analysis.progressPercent))}%` }}
            className={`h-full rounded-full transition-all duration-500 ${
              analysis.progressPercent >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-[#07503b]'
                : analysis.progressPercent >= 50
                ? 'bg-gradient-to-r from-amber-400 to-emerald-500'
                : 'bg-gradient-to-r from-rose-400 to-amber-400'
            }`}
          />
        </div>
      </div>

      {/* Metrics 3-Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Daily GDD accumulation */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">{isEnglish ? 'Daily Heat Influx' : 'Темп накопления'}</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900">
            +{analysis.dailyGddRate} <span className="text-xs font-normal text-slate-500">GDD / {isEnglish ? 'day' : 'день'}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isEnglish ? `At mean ${currentTemp}°C` : `При среднесуточной ${currentTemp}°C`}
          </div>
        </div>

        {/* Metric 2: Days remaining to physiological maturity */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">{isEnglish ? 'Days to Threshold' : 'Дней до оптимума'}</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900">
            {analysis.daysRemaining === 0 ? (
              <span className="text-emerald-700">{isEnglish ? 'Reached' : 'Достигнут'}</span>
            ) : (
              <span>~{analysis.daysRemaining} <span className="text-xs font-normal text-slate-500">{isEnglish ? 'days' : 'дн.'}</span></span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isEnglish ? 'Target window' : 'Окно:'} {currentSector.recommendedDate}
          </div>
        </div>

        {/* Metric 3: Physiological Status */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">{isEnglish ? 'Thermal Status' : 'Температурный статус'}</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-900">
            {isEnglish ? analysis.statusLabelEn : analysis.statusLabelRu}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${analysis.status === 'optimal' ? 'bg-emerald-500' : analysis.status === 'accelerated' ? 'bg-amber-500' : 'bg-sky-500'}`} />
            <span>{tempAnomaly === 0 ? (isEnglish ? 'Normal season' : 'Норма сезона') : `${tempAnomaly > 0 ? '+' : ''}${tempAnomaly}°C anomaly`}</span>
          </div>
        </div>
      </div>

      {/* AI Phenology Recommendation Note */}
      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isEnglish ? analysis.recommendationEn : analysis.recommendationRu}
        </p>
      </div>
    </div>
  );
};
