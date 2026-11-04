import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NavigationTab, FarmProfile } from '../../types';
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
      <div className="flex-1 lg:pl-[260px] flex flex-col min-w-0 w-full overflow-x-hidden">
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
    </div>
  );
};
