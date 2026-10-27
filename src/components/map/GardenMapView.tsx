import React, { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { NavigationTab, GardenSector } from '../../types';
import { mockFarmProfile } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { getLocalizedSectors, getLocalizedFarmProfile } from '../../context/localizedData';
import { GardenMap } from './GardenMap';
import { SectorDetailPanel } from './SectorDetailPanel';
import { SectorDetailModal } from './SectorDetailModal';

interface GardenMapViewProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const GardenMapView: React.FC<GardenMapViewProps> = () => {
  const { isEnglish, t, farmProfile } = useApp();
  const sectors = getLocalizedSectors(isEnglish);
  const effectiveFarm = getLocalizedFarmProfile(farmProfile || mockFarmProfile, isEnglish);

  const [selectedSectorId, setSelectedSectorId] = useState<string>('sector-4');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeModalSector, setActiveModalSector] = useState<GardenSector | null>(null);

  const selectedSector =
    sectors.find((s) => s.id === selectedSectorId) || sectors[3] || sectors[0];

  const handleOpenDetails = (sector: GardenSector) => {
    setActiveModalSector(sector);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5" data-testid="garden-map-view">
      {/* Top Bar: Farm Selector, Date & Maturity Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/70 backdrop-blur-xs p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Left: Farm selector & Survey Date */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Farm selector dropdown button */}
          <div className="relative inline-flex items-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs hover:border-emerald-300 transition-colors"
              aria-label={isEnglish ? 'Select Farm' : 'Выбрать хозяйство'}
            >
              <span>{effectiveFarm.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Survey Date Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 text-xs sm:text-sm font-medium shadow-xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{effectiveFarm.lastSurveyDate || '12.08.2025'}</span>
          </div>
        </div>

        {/* Right: Maturity Legend Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3" data-testid="maturity-legend">
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            {t('map.legend.maturity') || 'Зрелость плодов'}
          </span>

          <div className="flex flex-col items-center">
            {/* Spectral Gradient Bar */}
            <div 
              className="w-28 sm:w-36 h-2.5 rounded-full bg-gradient-to-r from-[#0284c7] via-[#10b981] via-[#eab308] via-[#ea580c] to-[#ef4444] shadow-xs"
              role="img"
              aria-label={isEnglish ? 'Fruit ripening scale from low to high' : 'Шкала зрелости плодов от низкой к высокой'}
            />
            {/* Legend Labels */}
            <div className="w-full flex justify-between items-center text-xs text-slate-400 mt-0.5 font-medium">
              <span>{t('map.legend.low') || 'Ниже'}</span>
              <span>{t('map.legend.high') || 'Выше'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Garden Map (Left) & Sector Detail Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 min-w-0 w-full">
          <GardenMap
            sectors={sectors}
            selectedSectorId={selectedSector.id}
            onSelectSector={setSelectedSectorId}
            className="w-full"
          />
        </div>

        {/* Right Column: Sector Detail Card */}
        <div className="lg:col-span-4 min-w-0">
          <SectorDetailPanel
            sector={selectedSector}
            onOpenDetails={handleOpenDetails}
            className="h-full"
          />
        </div>
      </div>

      {/* Agro-Analytics Modal */}
      <SectorDetailModal
        sector={activeModalSector}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
