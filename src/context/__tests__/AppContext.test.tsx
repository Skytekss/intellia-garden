import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '../AppContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppContext - Living State & Multi-Farm SSOT', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('initializes with default farm "golden-orchard" and 5 sectors', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    expect(result.current.currentFarmId).toBe('golden-orchard');
    expect(result.current.currentFarm.name).toBe('Ферма «Золотой Сад»');
    expect(result.current.farms.length).toBe(3);
    expect(result.current.sectors.length).toBe(5);
    expect(result.current.unreadNotificationsCount).toBeGreaterThan(0);
  });

  it('switches farm correctly to "apple-ravine" and updates sectors and records', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => {
      result.current.setCurrentFarmId('apple-ravine');
    });

    expect(result.current.currentFarmId).toBe('apple-ravine');
    expect(result.current.currentFarm.name).toBe('Участок «Яблоневый Яр»');
    expect(result.current.farmProfile.name).toBe('Участок «Яблоневый Яр»');
    expect(result.current.farmProfile.areaHa).toBe(16.5);
    // Verifying varieties of the new farm
    expect(result.current.sectors[0].variety).toBe('Антоновка');
    expect(result.current.sectors[1].variety).toBe('Семиренко');
  });

  it('updates sector biometrics and triggers notification when adding irrigation agro-record', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    const initialMoisture = result.current.sectors[0].soilMoisturePercent;
    const initialUnread = result.current.unreadNotificationsCount;

    act(() => {
      result.current.addAgroRecord({
        type: 'Полив',
        title: 'Капельный полив',
        date: '10.08.2025',
        sector: 'Участок 1',
        sectorId: 'sector-1',
        notes: 'Плановое орошение',
      });
    });

    // Check that sector 1 soil moisture increased
    const updatedSector = result.current.sectors.find((s) => s.id === 'sector-1');
    expect(updatedSector?.soilMoisturePercent).toBeGreaterThan(initialMoisture);

    // Check that notification was added
    expect(result.current.unreadNotificationsCount).toBe(initialUnread + 1);
    expect(result.current.notifications[0].category).toBe('agritech');
  });

  it('updates brix and maturity history when adding fertilizer agro-record', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    const initialBrix = result.current.sectors[1].brix;
    const initialHistoryLength = result.current.sectors[1].ripeningHistory.length;

    act(() => {
      result.current.addAgroRecord({
        type: 'Удобрения',
        title: 'Внесение калийных комплексов',
        date: '12.08.2025',
        sector: 'Участок 2',
        sectorId: 'sector-2',
        notes: 'Калийный концентрат для сахаристости',
      });
    });

    const updatedSector = result.current.sectors.find((s) => s.id === 'sector-2');
    expect(updatedSector?.brix).toBeGreaterThan(initialBrix);
    expect(updatedSector?.ripeningHistory.length).toBe(initialHistoryLength + 1);
  });

  it('handles notification read and mark all as read correctly', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    const firstNotifId = result.current.notifications[0].id;

    act(() => {
      result.current.markNotificationRead(firstNotifId);
    });

    const targetNotif = result.current.notifications.find((n) => n.id === firstNotifId);
    expect(targetNotif?.isRead).toBe(true);

    act(() => {
      result.current.markAllNotificationsRead();
    });

    expect(result.current.unreadNotificationsCount).toBe(0);
    expect(result.current.notifications.every((n) => n.isRead)).toBe(true);
  });
});
