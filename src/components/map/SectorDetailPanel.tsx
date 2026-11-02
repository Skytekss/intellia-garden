import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { GardenSector } from '../../types';
import { RipeningChart } from './RipeningChart';
import { useApp } from '../../context/AppContext';

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
  const { isEnglish, formatArea } = useApp();

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
      <motion.div
        key={sector.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 flex flex-col justify-between"
      >
        <div>
          {/* Sector Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {sector.name}
          </h2>

          {/* Characteristics List */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center text-sm">
              <span className="text-slate-500 w-36">
                {isEnglish ? 'Variety:' : 'Сорт:'}
              </span>
              <span className="font-semibold text-slate-800">{sector.variety}</span>
            </div>

            <div className="flex items-center text-sm">
              <span className="text-slate-500 w-36">
                {isEnglish ? 'Area:' : 'Площадь:'}
              </span>
              <span className="font-semibold text-slate-800">{formatArea(sector.area)}</span>
            </div>

            <div className="flex items-center text-sm">
              <span className="text-slate-500 w-36">
                {isEnglish ? 'Fruit Readiness:' : 'Готовность плодов:'}
              </span>
              <span className="font-semibold text-slate-800 inline-flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${getMaturityDot(sector.maturityPercent)}`} />
                {sector.maturityPercent}%
              </span>
            </div>

            <div className="flex items-center text-sm">
              <span className="text-slate-500 w-36">
                {isEnglish ? 'Harvest Window:' : 'Окно сбора:'}
              </span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-xs border border-emerald-200/70 inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {sector.harvestWindow}
              </span>
            </div>
          </div>

          {/* Recommended Date Card */}
          <div className="mt-4 p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{sector.recommendedDate}</span>
          </div>

          {/* Ripening Dynamics Section */}
          <div className="mt-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
              {isEnglish ? 'Ripening Dynamics' : 'Динамика созревания'}
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
          <motion.button
            type="button"
            onClick={() => onOpenDetails(sector)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-between px-5 py-3 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white font-semibold text-sm transition-colors shadow-xs group cursor-pointer"
            data-testid="sector-details-btn"
          >
            <span>{isEnglish ? 'View details' : 'Подробнее'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
