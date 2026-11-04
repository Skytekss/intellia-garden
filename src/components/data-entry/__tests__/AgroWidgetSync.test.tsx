import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AgroWidget } from '../AgroWidget';
import { AppProvider, useApp } from '../../../context/AppContext';

// Helper component that displays Sector 1 biometrics alongside AgroWidget
const BiometricsObserver: React.FC = () => {
  const { sectors, unreadNotificationsCount, notifications } = useApp();
  const sector1 = sectors.find((s) => s.id === 'sector-1');

  return (
    <div>
      <div data-testid="observer-sector1-moisture">{sector1?.soilMoisturePercent}</div>
      <div data-testid="observer-sector1-brix">{sector1?.brix}</div>
      <div data-testid="observer-unread-count">{unreadNotificationsCount}</div>
      <div data-testid="observer-latest-notif-title">{notifications[0]?.title}</div>
      <AgroWidget />
    </div>
  );
};

describe('AgroWidget Living Sync - Biometrics & Notifications Impact', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('updates sector soil moisture and adds notification when creating irrigation operation', async () => {
    render(
      <AppProvider>
        <BiometricsObserver />
      </AppProvider>
    );

    const initialMoisture = Number(screen.getByTestId('observer-sector1-moisture').textContent);
    const initialUnread = Number(screen.getByTestId('observer-unread-count').textContent);

    // Open Add Agro Record Modal
    fireEvent.click(screen.getByTestId('add-agro-record-button'));
    expect(screen.getByTestId('add-agro-modal')).toBeInTheDocument();

    // Fill form: Irrigation for Sector 1
    fireEvent.change(screen.getByTestId('operation-type-select'), { target: { value: 'Полив' } });
    fireEvent.change(screen.getByTestId('operation-title-input'), { target: { value: 'Капельный полив Участка 1' } });
    fireEvent.change(screen.getByTestId('operation-date-input'), { target: { value: '2025-08-16' } });
    fireEvent.change(screen.getByTestId('operation-sector-select'), { target: { value: 'Участок 1 (Гала)' } });

    // Submit
    fireEvent.click(screen.getByTestId('submit-agro-record'));

    await waitFor(() => {
      expect(screen.queryByTestId('add-agro-modal')).not.toBeInTheDocument();
    });

    // Check that sector 1 moisture increased
    const updatedMoisture = Number(screen.getByTestId('observer-sector1-moisture').textContent);
    expect(updatedMoisture).toBeGreaterThan(initialMoisture);

    // Check that notification was added and unread count incremented
    const updatedUnread = Number(screen.getByTestId('observer-unread-count').textContent);
    expect(updatedUnread).toBe(initialUnread + 1);
    expect(screen.getByTestId('observer-latest-notif-title')).toHaveTextContent('Капельный полив Участка 1');
  });

  it('updates sector brix when creating fertilizer operation', async () => {
    render(
      <AppProvider>
        <BiometricsObserver />
      </AppProvider>
    );

    const initialBrix = Number(screen.getByTestId('observer-sector1-brix').textContent);

    // Open Modal
    fireEvent.click(screen.getByTestId('add-agro-record-button'));

    // Fill form: Fertilizer for Sector 1
    fireEvent.change(screen.getByTestId('operation-type-select'), { target: { value: 'Удобрения' } });
    fireEvent.change(screen.getByTestId('operation-title-input'), { target: { value: 'Внесение калия' } });
    fireEvent.change(screen.getByTestId('operation-sector-select'), { target: { value: 'Участок 1 (Гала)' } });

    fireEvent.click(screen.getByTestId('submit-agro-record'));

    await waitFor(() => {
      expect(screen.queryByTestId('add-agro-modal')).not.toBeInTheDocument();
    });

    const updatedBrix = Number(screen.getByTestId('observer-sector1-brix').textContent);
    expect(updatedBrix).toBeGreaterThan(initialBrix);
  });

  it('supports expanding record details and interactive deletion with confirmation', async () => {
    render(
      <AppProvider>
        <BiometricsObserver />
      </AppProvider>
    );

    // Initial records list
    const recordsList = screen.getByTestId('agro-records-list');
    expect(recordsList).toBeInTheDocument();

    // Click on the first record item to expand details
    const toggleBtn = screen.getByTestId('toggle-record-agro-1');
    fireEvent.click(toggleBtn);

    // Verify details panel is visible
    expect(screen.getByTestId('agro-record-details-agro-1')).toBeInTheDocument();
    const deleteBtn = screen.getByTestId('delete-record-btn-agro-1');
    expect(deleteBtn).toBeInTheDocument();

    // Click delete -> shows confirmation
    fireEvent.click(deleteBtn);
    expect(screen.getByTestId('confirm-delete-btn-agro-1')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-delete-btn-agro-1')).toBeInTheDocument();

    // Confirm delete
    fireEvent.click(screen.getByTestId('confirm-delete-btn-agro-1'));

    // Record agro-1 should be removed
    expect(screen.queryByTestId('agro-record-item-agro-1')).not.toBeInTheDocument();
  });
});
