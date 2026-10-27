import React from 'react';
import {
  LayoutDashboard,
  Map,
  Database,
  TrendingUp,
  Bell,
  Settings,
  Headphones,
  Sprout,
  X,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { WeatherWidget } from './WeatherWidget';

export interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  className?: string;
  onCloseMobile?: () => void;
  showMobileClose?: boolean;
}

interface NavItemConfig {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'overview', label: 'Главная', icon: LayoutDashboard },
  { id: 'map', label: 'Карта сада', icon: Map },
  { id: 'data', label: 'Данные', icon: Database },
  { id: 'forecasts', label: 'Прогнозы', icon: TrendingUp },
  { id: 'notifications', label: 'Уведомления', icon: Bell, badge: 3 },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  className = '',
  onCloseMobile,
  showMobileClose = false,
}) => {
  const handleNavClick = (tabId: NavigationTab) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      data-testid="app-sidebar"
      className={`w-[260px] h-full flex flex-col justify-between bg-[#05382b] border-r border-emerald-900/40 select-none text-slate-100 ${className}`}
    >
      {/* Top Header & Logo */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mint pill with leaf/sprout */}
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-emerald-300 shadow-sm shadow-emerald-950/20 shrink-0">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-white uppercase leading-tight">
                ИНТЕЛЛИЯ
              </span>
              <span className="text-xs text-emerald-200/70 font-normal leading-tight mt-0.5">
                Умные решения для вашего сада
              </span>
            </div>
          </div>

          {showMobileClose && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-emerald-800/40 transition-colors"
              aria-label="Закрыть меню"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Separator line */}
        <div className="h-px bg-emerald-900/40 mt-4" />
      </div>

      {/* Main Navigation links */}
      <nav aria-label="Основная навигация" className="flex-1 px-3.5 py-2 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              data-testid={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-left cursor-pointer ${
                isActive
                  ? 'bg-[#047857] text-white shadow-[0_0_15px_rgba(4,120,87,0.4)] font-semibold'
                  : 'text-emerald-100/75 hover:text-white hover:bg-emerald-800/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-emerald-300/80'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold leading-none ${
                    isActive
                      ? 'bg-white text-emerald-800'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section: Support & Weather */}
      <div className="p-3.5 pt-2 space-y-2.5 border-t border-emerald-900/40">
        {/* Support Button */}
        <button
          type="button"
          data-testid="nav-item-support"
          onClick={() => handleNavClick('support')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group text-left cursor-pointer ${
            activeTab === 'support'
              ? 'bg-[#047857] text-white shadow-[0_0_15px_rgba(4,120,87,0.4)] font-semibold'
              : 'text-emerald-100/75 hover:text-white hover:bg-emerald-800/30'
          }`}
        >
          <Headphones
            className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
              activeTab === 'support' ? 'text-white' : 'text-emerald-300/80'
            }`}
          />
          <span>Поддержка</span>
        </button>

        {/* Weather Widget */}
        <WeatherWidget />
      </div>
    </aside>
  );
};
