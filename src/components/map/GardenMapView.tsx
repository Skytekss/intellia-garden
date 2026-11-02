import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, Check, Plane } from 'lucide-react';
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
  const app = useApp();
  const { isEnglish, t, farmProfile } = app;
  const sectors = getLocalizedSectors(isEnglish, app.sectors);
  const effectiveFarm = getLocalizedFarmProfile(farmProfile || mockFarmProfile, isEnglish);

  const [selectedSectorId, setSelectedSectorId] = useState<string>('sector-4');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeModalSector, setActiveModalSector] = useState<GardenSector | null>(null);

  // Dropdown states
  const [isFarmMenuOpen, setIsFarmMenuOpen] = useState<boolean>(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState<boolean>(false);

  const farmMenuRef = useRef<HTMLDivElement>(null);
  const surveyMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (farmMenuRef.current && !farmMenuRef.current.contains(event.target as Node)) {
        setIsFarmMenuOpen(false);
      }
      if (surveyMenuRef.current && !surveyMenuRef.current.contains(event.target as Node)) {
        setIsSurveyModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure selected sector exists in current farm
  const currentSectorExists = sectors.some((s) => s.id === selectedSectorId);
  const effectiveSectorId = currentSectorExists ? selectedSectorId : sectors[0]?.id || 'sector-1';

  const selectedSector =
    sectors.find((s) => s.id === effectiveSectorId) || sectors[0];

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
          <div className="relative inline-flex items-center" ref={farmMenuRef}>
            <button
              type="button"
              data-testid="map-farm-selector-btn"
              onClick={() => setIsFarmMenuOpen((prev) => !prev)}
              aria-expanded={isFarmMenuOpen}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs hover:border-emerald-300 transition-colors cursor-pointer"
              aria-label={isEnglish ? 'Select Farm' : 'Выбрать хозяйство'}
            >
              <span>{effectiveFarm.name}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isFarmMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Farm Selector Dropdown Menu */}
            {isFarmMenuOpen && (
              <div
                data-testid="map-farm-dropdown"
                className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isEnglish ? 'Select Farm' : 'Выбор хозяйства'}
                </div>
                {app.farms.map((f) => {
                  const isSelected = f.id === app.currentFarmId;
                  const label = isEnglish ? f.nameEn : f.name;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        app.setCurrentFarmId(f.id);
                        setIsFarmMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected
                          ? 'text-emerald-700 font-semibold bg-emerald-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{label}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Survey Date Pill & Retrospective Dropdown */}
          <div className="relative inline-flex items-center" ref={surveyMenuRef}>
            <button
              type="button"
              data-testid="map-survey-date-btn"
              onClick={() => setIsSurveyModalOpen((prev) => !prev)}
              aria-expanded={isSurveyModalOpen}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 text-xs sm:text-sm font-medium shadow-xs hover:border-emerald-300 transition-colors cursor-pointer"
              title={isEnglish ? 'View UAV survey flights history' : 'Просмотреть историю облетов БПЛА'}
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{app.activeSurveyDate || effectiveFarm.lastSurveyDate || '12.08.2025'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isSurveyModalOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Survey History Popover */}
            {isSurveyModalOpen && (
              <div
                data-testid="map-survey-history-menu"
                className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-30 animate-in fade-in zoom-in-95 duration-150 space-y-2"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Plane className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isEnglish ? 'UAV Survey History' : 'История съемок БПЛА'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {app.surveyHistory.length} {isEnglish ? 'flights' : 'облета'}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {app.surveyHistory.map((flight, idx) => {
                    const isActive = flight.date === (app.activeSurveyDate || effectiveFarm.lastSurveyDate);
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          app.setActiveSurveyDate(flight.date);
                          setIsSurveyModalOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                            : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{flight.label}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{flight.date}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                          <span>{flight.droneModel} • {flight.resolutionCmPx} см/пкс</span>
                          <span className="text-emerald-700 font-bold">NDVI {flight.ndviAvg}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
