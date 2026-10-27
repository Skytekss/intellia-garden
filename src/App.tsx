import React, { useState, useEffect, useCallback } from 'react';
import { NavigationTab } from './types';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { GardenMapView } from './components/map/GardenMapView';
import { DataEntryView } from './components/data-entry/DataEntryView';
import { ForecastsView } from './components/forecasts';
import { NotificationsView } from './components/notifications';
import { SettingsView } from './components/settings';
import { SupportView } from './components/support';
import { PlaceholderView } from './components/placeholder/PlaceholderView';

const VALID_TABS: NavigationTab[] = [
  'overview',
  'map',
  'data',
  'forecasts',
  'notifications',
  'settings',
  'support',
];

const STORAGE_TAB_KEY = 'intellia_active_tab';

const getInitialTab = (): NavigationTab => {
  if (typeof window !== 'undefined') {
    // 1. Check URL query param '?tab=...'
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab') as NavigationTab | null;
      if (tabParam && VALID_TABS.includes(tabParam)) {
        return tabParam;
      }
    } catch {
      // ignore
    }

    // 2. Check localStorage
    try {
      const savedTab = window.localStorage.getItem(STORAGE_TAB_KEY) as NavigationTab | null;
      if (savedTab && VALID_TABS.includes(savedTab)) {
        return savedTab;
      }
    } catch {
      // ignore
    }
  }
  return 'overview';
};

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(getInitialTab);

  const handleSelectTab = useCallback((tab: NavigationTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_TAB_KEY, tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({ tab }, '', `${url.pathname}${url.search}`);
      } catch {
        // ignore
      }
    }
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const tabParam = searchParams.get('tab') as NavigationTab | null;
        if (tabParam && VALID_TABS.includes(tabParam)) {
          setActiveTab(tabParam);
          window.localStorage.setItem(STORAGE_TAB_KEY, tabParam);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize initial URL with active tab if not present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (!searchParams.get('tab')) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', activeTab);
        window.history.replaceState({ tab: activeTab }, '', `${url.pathname}${url.search}`);
      }
    } catch {
      // ignore
    }
  }, [activeTab]);

  return (
    <AppShell activeTab={activeTab} onSelectTab={handleSelectTab}>
      {activeTab === 'overview' ? (
        <DashboardView onNavigate={handleSelectTab} />
      ) : activeTab === 'map' ? (
        <GardenMapView onNavigate={handleSelectTab} />
      ) : activeTab === 'data' ? (
        <DataEntryView onNavigate={handleSelectTab} />
      ) : activeTab === 'forecasts' ? (
        <ForecastsView onNavigate={handleSelectTab} />
      ) : activeTab === 'notifications' ? (
        <NotificationsView onNavigate={handleSelectTab} />
      ) : activeTab === 'settings' ? (
        <SettingsView onNavigate={handleSelectTab} />
      ) : activeTab === 'support' ? (
        <SupportView onNavigate={handleSelectTab} />
      ) : (
        <PlaceholderView
          tab={activeTab}
          onNavigateBack={() => handleSelectTab('overview')}
        />
      )}
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
