import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Header } from '../Header';
import { AppProvider } from '../../../context/AppContext';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('Header Component - Living State & Sync', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('renders active tab title and farm name', () => {
    renderWithContext(<Header activeTab="overview" />);

    expect(screen.getByTestId('page-title')).toHaveTextContent('Сводка по саду');
    expect(screen.getByTestId('farm-selector-button')).toHaveTextContent('Ферма «Золотой Сад»');
  });

  it('displays notification badge with unread count and navigates on click', () => {
    const handleNavigate = vi.fn();
    renderWithContext(<Header activeTab="overview" onNavigate={handleNavigate} />);

    const badge = screen.getByTestId('header-notifications-badge');
    expect(badge).toBeInTheDocument();
    expect(Number(badge.textContent)).toBeGreaterThan(0);

    const button = screen.getByTestId('header-notifications-button');
    fireEvent.click(button);
    expect(handleNavigate).toHaveBeenCalledWith('notifications');
  });

  it('opens farm dropdown and allows selecting another farm', () => {
    renderWithContext(<Header activeTab="map" />);

    const farmBtn = screen.getByTestId('farm-selector-button');
    fireEvent.click(farmBtn);

    expect(screen.getByTestId('farm-dropdown-menu')).toBeInTheDocument();
    const secondFarmOption = screen.getByText('Участок «Яблоневый Яр»');
    fireEvent.click(secondFarmOption);

    expect(farmBtn).toHaveTextContent('Участок «Яблоневый Яр»');
  });
});
