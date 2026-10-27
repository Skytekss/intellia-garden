import React, { useState } from 'react';
import { NavigationTab } from './types';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlaceholderView } from './components/placeholder/PlaceholderView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  return (
    <AppShell activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'overview' ? (
        <DashboardView onNavigate={setActiveTab} />
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
