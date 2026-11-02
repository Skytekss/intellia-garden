import React from 'react';
import { Calendar, Apple, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDeltaDays, shiftDateString } from '../../utils/harvestSimulation';

export interface ForecastKpiData {
  averageHarvestDate: string;
  averageHarvestDateSubtext: string;
  fruitReadinessPercent: number;
  fruitReadinessSubtext: string;
  forecastAccuracyPercent: number;
  forecastAccuracySubtext: string;
}

interface ForecastKpiCardsProps {
  data?: Partial<ForecastKpiData>;
  className?: string;
}

export const ForecastKpiCards: React.FC<ForecastKpiCardsProps> = ({
  data,
  className = '',
}) => {
  const { isEnglish, t, sectors, tempAnomaly, rainCondition, isSimulationActive } = useApp();

  const deltaDays = calculateDeltaDays(tempAnomaly, rainCondition);

  // Compute baseline readiness from sectors
  const baselineReadiness = sectors.length > 0
    ? Math.round(sectors.reduce((sum, s) => sum + s.maturityPercent, 0) / sectors.length)
    : 68;

  const simulatedReadinessDelta = Math.round(
    tempAnomaly * 2 + (rainCondition === 'dry' ? 2 : rainCondition === 'heavy' ? -1 : 0)
  );
  const effectiveReadiness = Math.max(15, Math.min(100, baselineReadiness + (isSimulationActive ? simulatedReadinessDelta : 0)));

  const baselineHarvestDate = isEnglish ? 'Sep 12 – Sep 25' : '12 – 25 сентября';
  const effectiveHarvestDate = isSimulationActive
    ? shiftDateString(baselineHarvestDate, deltaDays, isEnglish)
    : baselineHarvestDate;

  const defaultKpiData: ForecastKpiData = {
    averageHarvestDate: effectiveHarvestDate,
    averageHarvestDateSubtext: isSimulationActive
      ? isEnglish
        ? `Shift: ${deltaDays < 0 ? `${deltaDays} d.` : `+${deltaDays} d.`}`
        : `Сдвиг: ${deltaDays < 0 ? `${deltaDays} дн.` : `+${deltaDays} дн.`}`
      : isEnglish
      ? '(orchard average)'
      : '(по саду)',
    fruitReadinessPercent: effectiveReadiness,
    fruitReadinessSubtext: isSimulationActive
      ? isEnglish
        ? '(scenario model)'
        : '(по модели)'
      : isEnglish
      ? '(in average)'
      : '(в среднем)',
    forecastAccuracyPercent: 92,
    forecastAccuracySubtext: isEnglish ? '(past seasons)' : '(по прошлым сезонам)',
  };

  const metrics = { ...defaultKpiData, ...data };

  const cards = [
    {
      id: 'harvest-date',
      testId: 'kpi-card-harvest-date',
      label: t('forecasts.kpi.harvestDate') || 'Средняя дата сбора',
      value: metrics.averageHarvestDate,
      subtext: metrics.averageHarvestDateSubtext,
      icon: Calendar,
      iconBg: isSimulationActive ? 'bg-amber-100' : 'bg-emerald-100',
      iconColor: isSimulationActive ? 'text-amber-800' : 'text-emerald-700',
      borderColor: isSimulationActive ? 'border-amber-300' : 'hover:border-emerald-200',
    },
    {
      id: 'fruit-readiness',
      testId: 'kpi-card-fruit-readiness',
      label: t('forecasts.kpi.fruitReadiness') || 'Готовность плодов',
      value: `${metrics.fruitReadinessPercent}%`,
      subtext: metrics.fruitReadinessSubtext,
      icon: Apple,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
      borderColor: 'hover:border-purple-200',
    },
    {
      id: 'forecast-accuracy',
      testId: 'kpi-card-forecast-accuracy',
      label: t('forecasts.kpi.accuracy') || 'Точность прогноза',
      value: `${metrics.forecastAccuracyPercent}%`,
      subtext: metrics.forecastAccuracySubtext,
      icon: BarChart3,
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-700',
      borderColor: 'hover:border-sky-200',
    },
  ];

  return (
    <div
      data-testid="forecast-kpi-cards"
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ${className}`}
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            data-testid={card.testId}
            className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md ${card.borderColor}`}
          >
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-500 block">
                {card.label}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {card.value}
              </div>
              <span className="text-xs text-slate-400 font-medium block">
                {card.subtext}
              </span>
            </div>

            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
