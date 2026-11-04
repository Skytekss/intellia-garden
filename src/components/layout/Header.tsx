import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, MapPin, Check, Bell } from 'lucide-react';
import { NavigationTab, FarmProfile } from '../../types';
import { useApp } from '../../context/AppContext';

export interface HeaderProps {
  activeTab: NavigationTab;
  onOpenMobileMenu?: () => void;
  farmProfile?: FarmProfile;
  title?: string;
  onNavigate?: (tab: NavigationTab) => void;
}

const TAB_TITLES_RU: Record<NavigationTab, string> = {
  overview: 'Сводка по саду',
  map: 'Интерактивная карта сада',
  data: 'Спектральные и агро-данные',
  forecasts: 'Прогнозы созревания',
  notifications: 'Центр уведомлений',
  settings: 'Настройки системы',
  support: 'Служба агрономической поддержки',
};

const TAB_TITLES_EN: Record<NavigationTab, string> = {
  overview: 'Garden Overview',
  map: 'Interactive Garden Map',
  data: 'Spectral & Agro Data',
  forecasts: 'Ripening Forecasts',
  notifications: 'Notification Center',
  settings: 'System Settings',
  support: 'Agronomic Support Service',
};

const AVAILABLE_FARMS = [
  'Ферма «Золотой Сад»',
  'Участок «Яблоневый Яр»',
  'Сады Придонья — Сектор Север',
];

const FARM_NAMES_EN: Record<string, string> = {
  'Ферма «Золотой Сад»': 'Farm "Golden Orchard"',
  'Участок «Яблоневый Яр»': 'Apple Ravine Plot',
  'Сады Придонья — Сектор Север': 'Don Orchards — North Sector',
};

const REGION_NAMES_EN: Record<string, string> = {
  'Тульская область': 'Tula Region',
  'Липецкая область': 'Lipetsk Region',
  'Краснодарский край': 'Krasnodar Krai',
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  farmProfile,
  title,
  onNavigate,
}) => {
  const app = useApp();
  const effectiveFarm = farmProfile || app.farmProfile;
  const isEn = app.isEnglish;

  const [selectedFarm, setSelectedFarm] = useState(effectiveFarm.name);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync selectedFarm when farmProfile updates
  useEffect(() => {
    setSelectedFarm(effectiveFarm.name);
  }, [effectiveFarm.name]);

  const displayTitle =
    title ||
    (isEn ? TAB_TITLES_EN[activeTab] : TAB_TITLES_RU[activeTab]) ||
    (isEn ? 'Garden Overview' : 'Сводка по саду');

  const areaDisplay = app.isImperial
    ? `${(effectiveFarm.areaHa * 2.471).toFixed(1)} ${isEn ? 'ac' : 'акров'}`
    : `${effectiveFarm.areaHa} ${isEn ? 'ha' : 'га'}`;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      data-testid="app-header"
      className="w-full bg-[#f4f7f6]/95 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 xl:px-10 py-3 transition-colors"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
        {/* Left: Mobile trigger & Page title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              aria-label={isEn ? 'Open navigation menu' : 'Открыть меню навигации'}
              data-testid="mobile-menu-trigger"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            <h1
              data-testid="page-title"
              className="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate flex items-center gap-2"
            >
              <span className="truncate">{displayTitle}</span>
              {activeTab === 'overview' && (
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/60 shrink-0">
                  {isEn ? 'Active Season' : 'Активный сезон'}
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {isEn ? (REGION_NAMES_EN[effectiveFarm.region] || effectiveFarm.region) : effectiveFarm.region} • {isEn ? 'Area:' : 'Площадь:'} {areaDisplay}
            </p>
          </div>
        </div>

        {/* Right: Notifications, Farm Selector & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
          {/* Quick Notification icon */}
          {onNavigate && (
            <button
              type="button"
              data-testid="header-notifications-button"
              onClick={() => onNavigate('notifications')}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label={isEn ? 'Notifications' : 'Уведомления'}
            >
              <Bell className="w-4 h-4" />
              {app.unreadNotificationsCount > 0 && (
                <span
                  data-testid="header-notifications-badge"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-[#f4f7f6] shadow-xs"
                >
                  {app.unreadNotificationsCount > 9 ? '9+' : app.unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {/* Farm selector dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              data-testid="farm-selector-button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:bg-slate-50/80 text-xs sm:text-sm font-semibold text-slate-800 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="hidden sm:inline truncate max-w-[140px] md:max-w-[200px]">
                {isEn ? (FARM_NAMES_EN[selectedFarm] || selectedFarm) : selectedFarm}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                data-testid="farm-dropdown-menu"
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isEn ? 'Select Farm' : 'Выбор хозяйства'}
                </div>
                {AVAILABLE_FARMS.map((farm) => {
                  const isSelected = farm === selectedFarm;
                  const farmLabel = isEn ? (FARM_NAMES_EN[farm] || farm) : farm;
                  return (
                    <button
                      key={farm}
                      type="button"
                      onClick={() => {
                        setSelectedFarm(farm);
                        setIsDropdownOpen(false);
                        app.setCurrentFarmId(farm);
                        app.updateFarmProfile({
                          ...effectiveFarm,
                          name: farm,
                        });
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-left hover:bg-slate-50 transition-colors ${
                        isSelected
                          ? 'text-emerald-700 font-semibold bg-emerald-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{farmLabel}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User profile avatar */}
          <div
            className="flex items-center gap-2 pl-1 border-l border-slate-200/80 cursor-pointer"
            title={
              isEn
                ? 'User profile: Elizaveta B. (Chief Agronomist)'
                : 'Профиль пользователя: Елизавета Б. (Главный агроном)'
            }
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {isEn ? 'EB' : 'ЕБ'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {isEn ? 'Elizaveta B.' : 'Елизавета Б.'}
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                {isEn ? 'Chief Agronomist' : 'Главный агроном'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
