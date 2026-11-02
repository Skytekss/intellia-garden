import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { HeroBanner } from './HeroBanner';
import { BentoCards } from './BentoCards';
import { CTABar } from './CTABar';
import { NavigationTab } from '../../types';
import { useApp } from '../../context/AppContext';
import { getLocalizedSectors } from '../../context/localizedData';

export interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  className?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  className = '',
}) => {
  const { isEnglish, sectors: rawSectors } = useApp();
  const sectors = getLocalizedSectors(isEnglish, rawSectors);

  // Find most urgent / ready sector
  const urgentSector = sectors.length > 0
    ? [...sectors].sort((a, b) => b.maturityPercent - a.maturityPercent)[0]
    : null;

  const handleSelectBentoCard = (categoryId: string) => {
    if (categoryId === 'ai') {
      onNavigate('forecasts');
    } else if (categoryId === 'drone') {
      onNavigate('map');
    } else if (categoryId === 'agritech' || categoryId === 'meteo') {
      onNavigate('data');
    }
  };

  return (
    <div
      data-testid="dashboard-view"
      className={`space-y-6 w-full min-w-0 animate-in fade-in duration-300 ${className}`}
    >
      {/* 1. Hero Banner with golden hour background & animated drone */}
      <HeroBanner onNavigate={onNavigate} />

      {/* 2. Interactive Harvest Quick Alert & Simulator Link */}
      <div
        data-testid="dashboard-harvest-alert"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:border-emerald-200"
      >
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                {isEnglish ? 'Optimal Harvest Window' : 'Оптимальное окно сбора'}
              </span>
              <span className="text-xs font-bold text-slate-800">
                {urgentSector ? `${urgentSector.name} (${urgentSector.variety})` : (isEnglish ? 'Sector 4' : 'Участок 4')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 truncate">
              {isEnglish
                ? `Ripening reached ${urgentSector?.maturityPercent ?? 85}%. Recommended harvest: ${urgentSector?.recommendedDate ?? 'Sep 10 – 15'}.`
                : `Зрелость достигла ${urgentSector?.maturityPercent ?? 85}%. Рекомендуемый сбор: ${urgentSector?.recommendedDate ?? '10 – 15 сентября'}.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            type="button"
            data-testid="dashboard-map-btn"
            onClick={() => onNavigate('map')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isEnglish ? 'View on Map' : 'На карту сада'}
          </button>
          <button
            type="button"
            data-testid="dashboard-forecast-btn"
            onClick={() => onNavigate('forecasts')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>{isEnglish ? 'Simulate & Plan' : 'Смоделировать сценарий'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. 4 Bento Data Cards (Drone, Agritech, Meteo, AI) */}
      <BentoCards onSelectCard={handleSelectBentoCard} />

      {/* 4. CTA Bar: "Перейти к карте сада" */}
      <CTABar onNavigate={onNavigate} />
    </div>
  );
};
