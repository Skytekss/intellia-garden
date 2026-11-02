import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AppProvider } from '../../../context/AppContext';
import { Header } from '../../layout/Header';
import { NotificationsView } from '../NotificationsView';
import { AgroWidget } from '../../data-entry/AgroWidget';

const FullIntegrationApp: React.FC = () => {
  return (
    <AppProvider>
      <Header activeTab="notifications" onNavigate={() => {}} />
      <NotificationsView />
      <div className="hidden">
        <AgroWidget />
      </div>
    </AppProvider>
  );
};

describe('Notifications & Header Real-time Living Sync', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('synchronizes Header badge with NotificationsView: mark all as read removes badge, adding agro-record restores badge', async () => {
    render(<FullIntegrationApp />);

    // 1. Initial state: badge is visible on Header
    const initialBadge = screen.getByTestId('header-notifications-badge');
    expect(initialBadge).toBeInTheDocument();
    expect(Number(initialBadge.textContent)).toBeGreaterThan(0);

    // 2. Click "Прочитать все" in NotificationsView
    const markAllBtn = screen.getByTestId('mark-all-read-button');
    fireEvent.click(markAllBtn);

    // Badge on Header should immediately disappear
    await waitFor(() => {
      expect(screen.queryByTestId('header-notifications-badge')).not.toBeInTheDocument();
    });

    // 3. Add an agro record (simulating field work)
    fireEvent.click(screen.getByTestId('add-agro-record-button'));
    fireEvent.change(screen.getByTestId('operation-type-select'), { target: { value: 'Полив' } });
    fireEvent.change(screen.getByTestId('operation-title-input'), { target: { value: 'Экстренный полив Сектора 1' } });
    fireEvent.change(screen.getByTestId('operation-sector-select'), { target: { value: 'Участок 1 (Гала)' } });
    fireEvent.click(screen.getByTestId('submit-agro-record'));

    // 4. Header badge should reappear with count 1
    await waitFor(() => {
      const newBadge = screen.getByTestId('header-notifications-badge');
      expect(newBadge).toBeInTheDocument();
      expect(newBadge.textContent).toBe('1');
    });

    // 5. Click the newly created notification card to read it
    const newNotifCard = screen.getByText('Агротехническая операция: Экстренный полив Сектора 1');
    fireEvent.click(newNotifCard);

    // Close detail modal
    expect(screen.getByTestId('notification-detail-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-notification-modal'));

    // Badge should be gone again
    await waitFor(() => {
      expect(screen.queryByTestId('header-notifications-badge')).not.toBeInTheDocument();
    });
  });
});
