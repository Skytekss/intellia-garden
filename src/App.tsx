import React, { useState } from 'react';
import { NavigationTab } from './types';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { GardenMapView } from './components/map/GardenMapView';
import { DataEntryView } from './components/data-entry/DataEntryView';
import { ForecastsView } from './components/forecasts';
import { NotificationsView } from './components/notifications';
import { SettingsView } from './components/settings';
import { SupportView } from './components/support';
import { PlaceholderView } from './components/placeholder/PlaceholderView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab') as NavigationTab | null;
      if (tabParam && ['overview', 'map', 'data', 'forecasts', 'notifications', 'settings', 'support'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'overview';
  });

  return (
    <AppShell activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'overview' ? (
        <DashboardView onNavigate={setActiveTab} />
      ) : activeTab === 'map' ? (
        <GardenMapView onNavigate={setActiveTab} />
      ) : activeTab === 'data' ? (
        <DataEntryView onNavigate={setActiveTab} />
      ) : activeTab === 'forecasts' ? (
        <ForecastsView onNavigate={setActiveTab} />
      ) : activeTab === 'notifications' ? (
        <NotificationsView onNavigate={setActiveTab} />
      ) : activeTab === 'settings' ? (
        <SettingsView onNavigate={setActiveTab} />
      ) : activeTab === 'support' ? (
        <SupportView onNavigate={setActiveTab} />
      ) : (
        <PlaceholderView
          tab={activeTab}
          onNavigateBack={() => setActiveTab('overview')}
        />
      )}
    </AppShell>
  );
};

export default App;
