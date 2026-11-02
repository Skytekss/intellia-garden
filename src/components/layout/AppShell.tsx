import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NavigationTab, FarmProfile } from '../../types';
import { LayoutDashboard, Map, TrendingUp, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface AppShellProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  children: React.ReactNode;
  farmProfile?: FarmProfile;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onSelectTab,
  children,
  farmProfile,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const app = useApp();
  const effectiveFarmProfile = farmProfile || app.farmProfile;
  const isEn = app.isEnglish;

  return (
    <div className="min-h-screen w-full bg-[#f4f7f6] flex text-slate-800 overflow-x-hidden">
      {/* 1. Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-[260px] z-30">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
        />
      </div>

      {/* 2. Mobile Drawer & Backdrop with Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-backdrop"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="relative z-50 w-[280px] max-w-[85vw] h-full shadow-2xl"
            >
              <Sidebar
                activeTab={activeTab}
                onSelectTab={onSelectTab}
                onCloseMobile={() => setIsMobileMenuOpen(false)}
                showMobileClose={true}
                className="w-full"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0 w-full pb-16 lg:pb-0 overflow-x-hidden">
        <Header
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          farmProfile={effectiveFarmProfile}
          onNavigate={onSelectTab}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* 4. Mobile Quick Bottom Navigation Bar (Visible only on < lg screens) */}
      <nav
        aria-label={isEn ? 'Mobile navigation' : 'Мобильная навигация'}
        className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-1.5 z-40 flex items-center justify-around shadow-lg"
      >
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'overview' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{isEn ? 'Dashboard' : 'Главная'}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'map' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>{isEn ? 'Map' : 'Карта'}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('forecasts')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'forecasts' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{isEn ? 'Forecasts' : 'Прогнозы'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Menu className="w-4 h-4" />
          <span>{isEn ? 'Menu' : 'Меню'}</span>
        </button>
      </nav>
    </div>
  );
};
