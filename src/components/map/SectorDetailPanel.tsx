import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { GardenSector } from '../../types';
import { RipeningChart } from './RipeningChart';

interface SectorDetailPanelProps {
  sector: GardenSector;
  onOpenDetails: (sector: GardenSector) => void;
  className?: string;
}

export const SectorDetailPanel: React.FC<SectorDetailPanelProps> = ({
  sector,
  onOpenDetails,
  className = '',
}) => {
  const getMaturityDot = (percent: number) => {
    if (percent >= 75) return 'bg-emerald-500';
    if (percent >= 60) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col justify-between ${className}`}
      data-testid="sector-detail-panel"
    >
      <div>
        {/* Sector Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {sector.name}
        </h2>

        {/* Characteristics List */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center text-sm">
            <span className="text-slate-500 w-36">Сорт:</span>
            <span className="font-semibold text-slate-800">{sector.variety}</span>
          </div>

          <div className="flex items-center text-sm">
            <span className="text-slate-500 w-36">Площадь:</span>
            <span className="font-semibold text-slate-800">{sector.area} га</span>
          </div>

          <div className="flex items-center text-sm">
            <span className="text-slate-500 w-36">Готовность плодов:</span>
            <span className="font-semibold text-slate-800 inline-flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${getMaturityDot(sector.maturityPercent)}`} />
              {sector.maturityPercent}%
            </span>
          </div>
        </div>

        {/* Recommended Harvest Date Pill */}
        <div className="mt-5">
          <p className="text-xs text-slate-500 mb-1.5 font-medium">
            Рекомендуемая дата сбора:
          </p>
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-sm font-semibold w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sector.recommendedDate}</span>
          </div>
        </div>

        {/* Ripening Dynamics Section */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
            Динамика созревания
          </h3>
          <div className="bg-slate-50/50 rounded-xl p-2 border border-slate-100">
            <RipeningChart
              history={sector.ripeningHistory}
              currentPercent={sector.maturityPercent}
            />
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-6 pt-2">
        <button
          type="button"
          onClick={() => onOpenDetails(sector)}
          className="w-full inline-flex items-center justify-between px-5 py-3 rounded-xl bg-[#07503b] hover:bg-[#096047] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-xs group"
          data-testid="sector-details-btn"
        >
          <span>Подробнее</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
