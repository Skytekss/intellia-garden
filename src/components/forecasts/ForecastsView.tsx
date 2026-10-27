import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NavigationTab, ForecastSectorRow } from '../../types';
import { ForecastKpiCards } from './ForecastKpiCards';
import { ForecastTable } from './ForecastTable';
import { ForecastAiCard } from './ForecastAiCard';
import { ForecastMaturityPreview } from './ForecastMaturityPreview';
import { ForecastRecommendations } from './ForecastRecommendations';

export type ForecastSubTab = 'maturity-map' | 'harvest-dates' | 'recommendations';

export interface ForecastsViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  initialSubTab?: ForecastSubTab;
  forecastRows?: ForecastSectorRow[];
  className?: string;
}

export const ForecastsView: React.FC<ForecastsViewProps> = ({
  onNavigate,
  initialSubTab = 'harvest-dates',
  forecastRows,
  className = '',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ForecastSubTab>(initialSubTab);

  const subTabs: Array<{ id: ForecastSubTab; label: string; testId: string }> = [
    {
      id: 'maturity-map',
      label: 'Карта зрелости',
      testId: 'subtab-maturity-map',
    },
    {
      id: 'harvest-dates',
      label: 'Сроки сбора',
      testId: 'subtab-harvest-dates',
    },
    {
      id: 'recommendations',
      label: 'Рекомендации',
      testId: 'subtab-recommendations',
    },
  ];

  return (
    <div
      data-testid="forecasts-view"
      className={`space-y-6 w-full min-w-0 transition-opacity duration-200 ${className}`}
    >
      {/* 1. Header with Title and Sub-tabs */}
      <div className="space-y-4">
        {/* Title */}
        <h1
          data-testid="forecasts-title"
          className="text-2xl font-bold text-slate-900 tracking-tight"
        >
          Прогнозы
        </h1>

        {/* Sub-tabs Bar matching reference */}
        <div
          data-testid="forecasts-subtabs-bar"
          className="flex items-center gap-2 sm:gap-6 border-b border-slate-200/90 overflow-x-auto min-w-0 pb-px"
          role="tablist"
          aria-label="Вкладки раздела прогнозов"
        >
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-testid={tab.testId}
                onClick={() => setActiveSubTab(tab.id)}
                className={`relative pb-2.5 px-1 sm:px-2 text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="forecast-subtab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Content based on active subtab */}
      {activeSubTab === 'harvest-dates' && (
        <motion.div
          key="harvest-dates"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6 w-full min-w-0"
          data-testid="subtab-content-harvest-dates"
        >
          {/* 3 KPI Cards */}
          <ForecastKpiCards />

          {/* Interactive Table «Рекомендованные даты сбора» */}
          <ForecastTable rows={forecastRows} />

          {/* Bottom AI Card */}
          <ForecastAiCard />
        </motion.div>
      )}

      {activeSubTab === 'maturity-map' && (
        <motion.div
          key="maturity-map"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          data-testid="subtab-content-maturity-map"
        >
          <ForecastMaturityPreview onNavigate={onNavigate} />
        </motion.div>
      )}

      {activeSubTab === 'recommendations' && (
        <motion.div
          key="recommendations"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          data-testid="subtab-content-recommendations"
        >
          <ForecastRecommendations onNavigate={onNavigate} />
        </motion.div>
      )}
    </div>
  );
};
