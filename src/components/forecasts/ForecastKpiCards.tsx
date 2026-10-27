import React from 'react';
import { Calendar, Apple, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { averageFruitReadiness } from '../../data/mockData';

export interface ForecastKpiData {
  averageHarvestDate: string;
  averageHarvestDateSubtext: string;
  fruitReadinessPercent: number;
  fruitReadinessSubtext: string;
  forecastAccuracyPercent: number;
  forecastAccuracySubtext: string;
}

const defaultKpiData: ForecastKpiData = {
  averageHarvestDate: '12 – 25 сентября',
  averageHarvestDateSubtext: '(по саду)',
  fruitReadinessPercent: averageFruitReadiness,
  fruitReadinessSubtext: '(в среднем)',
  forecastAccuracyPercent: 92,
  forecastAccuracySubtext: '(по прошлым сезонам)',
};

interface ForecastKpiCardsProps {
  data?: Partial<ForecastKpiData>;
  className?: string;
}

export const ForecastKpiCards: React.FC<ForecastKpiCardsProps> = ({
  data,
  className = '',
}) => {
  const metrics = { ...defaultKpiData, ...data };

  const cards = [
    {
      id: 'harvest-date',
      testId: 'kpi-card-harvest-date',
      label: 'Средняя дата сбора',
      value: metrics.averageHarvestDate,
      subtext: metrics.averageHarvestDateSubtext,
      icon: Calendar,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      borderColor: 'hover:border-emerald-200',
    },
    {
      id: 'fruit-readiness',
      testId: 'kpi-card-fruit-readiness',
      label: 'Готовность плодов',
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
      label: 'Точность прогноза',
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
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.id}
            data-testid={card.testId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-4 lg:p-5 flex items-center gap-3.5 lg:gap-4 transition-shadow duration-200 hover:shadow-md ${card.borderColor}`}
          >
            {/* Circular Icon Container */}
            <div
              className={`w-11 h-11 lg:w-12 lg:h-12 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
              aria-hidden="true"
            >
              <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 stroke-[2]" />
            </div>

            {/* Metric Information */}
            <div className="min-w-0 flex-1">
              <span className="block text-xs text-slate-500 font-medium truncate">
                {card.label}
              </span>
              <div className="text-base lg:text-xl font-bold text-slate-900 tracking-tight leading-snug whitespace-nowrap">
                {card.value}
              </div>
              <span className="block text-xs text-slate-400 font-normal truncate">
                {card.subtext}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
