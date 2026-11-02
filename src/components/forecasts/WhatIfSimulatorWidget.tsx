import React from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Sun,
  Droplets,
  CloudRain,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RainCondition } from '../../types';
import { calculateDeltaDays, getSimulationRiskNotice } from '../../utils/harvestSimulation';

export interface WhatIfSimulatorWidgetProps {
  className?: string;
}

export const WhatIfSimulatorWidget: React.FC<WhatIfSimulatorWidgetProps> = ({ className = '' }) => {
  const {
    isEnglish,
    t,
    tempAnomaly,
    setTempAnomaly,
    rainCondition,
    setRainCondition,
    resetSimulation,
    isSimulationActive,
  } = useApp();

  const deltaDays = calculateDeltaDays(tempAnomaly, rainCondition);
  const { notice, isHighRisk } = getSimulationRiskNotice(
    { tempAnomaly, rainCondition },
    isEnglish
  );

  const getDeltaBadge = () => {
    if (deltaDays === 0) {
      return {
        label: isEnglish ? 'On schedule (0 days)' : 'По графику (0 дн.)',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
      };
    }
    if (deltaDays < 0) {
      return {
        label: isEnglish ? `${Math.abs(deltaDays)} days earlier` : `На ${Math.abs(deltaDays)} дн. раньше`,
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    }
    return {
      label: isEnglish ? `${deltaDays} days delayed` : `На ${deltaDays} дн. позже`,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    };
  };

  const deltaBadge = getDeltaBadge();

  return (
    <div
      data-testid="whatif-simulator-widget"
      className={`bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4 ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t('forecasts.whatif.title')}
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                AI What-If
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('forecasts.whatif.subtitle')}
            </p>
          </div>
        </div>

        {/* Status Badge & Reset CTA */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span
            data-testid="simulation-status-badge"
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isSimulationActive
                ? 'bg-amber-50 text-amber-800 border-amber-200 animate-in fade-in'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {isSimulationActive
              ? isEnglish
                ? 'Scenario Active'
                : 'Сценарий активен'
              : isEnglish
              ? 'Baseline (Norm)'
              : 'Базовый (Норма)'}
          </span>

          {isSimulationActive && (
            <button
              type="button"
              data-testid="btn-reset-simulation"
              onClick={resetSimulation}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              title={t('forecasts.whatif.reset')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('forecasts.whatif.reset')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls Grid: Temperature Slider & Rain Radios */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left Column: Temperature Anomaly */}
        <div className="md:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              {t('forecasts.whatif.tempAnomaly')}
            </span>
            <span
              data-testid="temp-anomaly-value"
              className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-xs ${
                tempAnomaly > 0
                  ? 'bg-amber-100 text-amber-800'
                  : tempAnomaly < 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {tempAnomaly > 0 ? `+${tempAnomaly}` : tempAnomaly}°C
            </span>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min={-3}
              max={4}
              step={0.5}
              value={tempAnomaly}
              onChange={(e) => setTempAnomaly(parseFloat(e.target.value))}
              aria-label={t('forecasts.whatif.tempAnomaly')}
              data-testid="temp-anomaly-slider"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium px-0.5">
              <span>-3°C ({isEnglish ? 'Cold' : 'Холод'})</span>
              <span>0°C ({isEnglish ? 'Norm' : 'Норма'})</span>
              <span>+4°C ({isEnglish ? 'Heat' : 'Жара'})</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-medium mr-1">
              {isEnglish ? 'Presets:' : 'Пресеты:'}
            </span>
            {[
              { label: '-2°C', val: -2 },
              { label: '0°C', val: 0 },
              { label: '+1.5°C', val: 1.5 },
              { label: '+3°C', val: 3 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setTempAnomaly(p.val)}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  tempAnomaly === p.val
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Precipitation Condition */}
        <div className="md:col-span-5 space-y-2.5">
          <div className="text-xs font-semibold text-slate-700">
            {t('forecasts.whatif.rainCondition')}
          </div>

          <div
            className="grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-label={t('forecasts.whatif.rainCondition')}
          >
            {[
              {
                id: 'dry' as RainCondition,
                label: t('forecasts.whatif.rain.dry'),
                icon: Sun,
                testId: 'rain-btn-dry',
              },
              {
                id: 'optimal' as RainCondition,
                label: t('forecasts.whatif.rain.optimal'),
                icon: Droplets,
                testId: 'rain-btn-optimal',
              },
              {
                id: 'heavy' as RainCondition,
                label: t('forecasts.whatif.rain.heavy'),
                icon: CloudRain,
                testId: 'rain-btn-heavy',
              },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = rainCondition === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  data-testid={item.testId}
                  onClick={() => setRainCondition(item.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1 ${
                      isSelected ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Simulation Result Banner */}
      <div
        data-testid="simulation-summary-banner"
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border text-xs ${
          isHighRisk
            ? 'bg-amber-50/80 border-amber-300 text-amber-900'
            : isSimulationActive
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-slate-50/80 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          {isHighRisk ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : isSimulationActive ? (
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{notice}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            {isEnglish ? 'Shift:' : 'Сдвиг:'}
          </span>
          <span
            data-testid="simulation-shift-badge"
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${deltaBadge.color}`}
          >
            {deltaBadge.label}
          </span>
        </div>
      </div>
    </div>
  );
};
