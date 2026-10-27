import React, { useState } from 'react';
import { NavigationTab } from './types';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { GardenMapView } from './components/map/GardenMapView';
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
