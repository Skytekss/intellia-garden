import React from 'react';
import { Map, ArrowRight, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { NavigationTab, GardenSector } from '../../types';
import { getMaturityMetadata } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { getLocalizedSectors } from '../../context/localizedData';

interface ForecastMaturityPreviewProps {
  onNavigate?: (tab: NavigationTab) => void;
  className?: string;
}

export const ForecastMaturityPreview: React.FC<ForecastMaturityPreviewProps> = ({
  onNavigate,
  className = '',
}) => {
  const { isEnglish, isImperial } = useApp();
  const sectors = getLocalizedSectors(isEnglish);
  return (
    <div
      data-testid="forecast-maturity-preview"
      className={`space-y-4 sm:space-y-6 ${className}`}
    >
      {/* Top Banner with CTA */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Map className="w-3.5 h-3.5" />
            <span>{isEnglish ? 'Spectral Maturity Map' : 'Спектральная карта созревания'}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {isEnglish
              ? 'Fruit readiness distribution across orchard sectors'
              : 'Распределение готовности плодов по секторам сада'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {isEnglish
              ? 'Cartographic visualization based on NDVI index and UAV hyperspectral imagery.'
              : 'Картографическая визуализация на основе индекса NDVI и гиперспектральных снимков с БПЛА.'}
          </p>
        </div>

        {onNavigate && (
          <button
            type="button"
            data-testid="cta-open-full-map"
            onClick={() => onNavigate('map')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] active:scale-[0.98] text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
          >
            <span>{isEnglish ? 'Open full orchard map' : 'Открыть полную карту сада'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid of Sector Ripening Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sector: GardenSector, index: number) => {
          const meta = getMaturityMetadata(sector.maturityPercent);

          return (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{isEnglish ? 'Sector' : 'Сектор'}</span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {sector.name}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                  >
                    {sector.maturityPercent}%
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isEnglish ? 'Variety:' : 'Сорт:'}</span>
                    <span className="font-semibold text-slate-800">{sector.variety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isEnglish ? 'Area:' : 'Площадь:'}</span>
                    <span className="font-medium text-slate-700">
                      {isImperial
                        ? `${(sector.area * 2.471).toFixed(1)} ${isEnglish ? 'ac' : 'акров'}`
                        : `${sector.area} ${isEnglish ? 'ha' : 'га'}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isEnglish ? 'Harvest window:' : 'Окно сбора:'}</span>
                    <span className="font-semibold text-emerald-700">
                      {sector.recommendedDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isEnglish ? 'Phase:' : 'Фаза:'}</span>
                    <span className={`font-semibold ${meta.badgeText}`}>
                      {isEnglish
                        ? (sector.maturityPercent >= 75
                            ? 'Ready for harvest'
                            : sector.maturityPercent >= 55
                            ? 'Ripening'
                            : 'Early phase')
                        : meta.label}
                    </span>
                  </div>
                </div>

                {/* Ripening Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>{isEnglish ? 'Ripening level' : 'Уровень созревания'}</span>
                    <span>{sector.maturityPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.progressBarBg} transition-all duration-500`}
                      style={{ width: `${sector.maturityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('map')}
                  className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isEnglish ? 'View on map' : 'Посмотреть на карте'}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
