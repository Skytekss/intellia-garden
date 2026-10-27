import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  it('renders branding logo, title and subtitle', () => {
    const handleSelectTab = vi.fn();
    render(<Sidebar activeTab="overview" onSelectTab={handleSelectTab} />);

    expect(screen.getByText('ИНТЕЛЛИЯ')).toBeInTheDocument();
    expect(screen.getByText('Умные решения для вашего сада')).toBeInTheDocument();
  });

  it('renders all main navigation items', () => {
    const handleSelectTab = vi.fn();
    render(<Sidebar activeTab="overview" onSelectTab={handleSelectTab} />);

    expect(screen.getByTestId('nav-item-overview')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-map')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-data')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-forecasts')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-settings')).toBeInTheDocument();

    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Карта сада')).toBeInTheDocument();
    expect(screen.getByText('Данные')).toBeInTheDocument();
    expect(screen.getByText('Прогнозы')).toBeInTheDocument();
    expect(screen.getByText('Уведомления')).toBeInTheDocument();
    expect(screen.getByText('Настройки')).toBeInTheDocument();
  });

  it('highlights the active tab with active background class', () => {
    const handleSelectTab = vi.fn();
    const { rerender } = render(
      <Sidebar activeTab="overview" onSelectTab={handleSelectTab} />
    );

    const overviewItem = screen.getByTestId('nav-item-overview');
    expect(overviewItem.className).toContain('bg-[#047857]');

    // Change active tab to map
    rerender(<Sidebar activeTab="map" onSelectTab={handleSelectTab} />);
    const mapItem = screen.getByTestId('nav-item-map');
    expect(mapItem.className).toContain('bg-[#047857]');
    expect(screen.getByTestId('nav-item-overview').className).not.toContain('bg-[#047857]');
  });

  it('calls onSelectTab when clicking menu items', () => {
    const handleSelectTab = vi.fn();
    render(<Sidebar activeTab="overview" onSelectTab={handleSelectTab} />);

    fireEvent.click(screen.getByTestId('nav-item-map'));
    expect(handleSelectTab).toHaveBeenCalledWith('map');

    fireEvent.click(screen.getByTestId('nav-item-forecasts'));
    expect(handleSelectTab).toHaveBeenCalledWith('forecasts');
  });

  it('renders support item and triggers onSelectTab with "support"', () => {
    const handleSelectTab = vi.fn();
    render(<Sidebar activeTab="overview" onSelectTab={handleSelectTab} />);

    const supportItem = screen.getByTestId('nav-item-support');
    expect(supportItem).toBeInTheDocument();
    expect(screen.getByText('Поддержка')).toBeInTheDocument();

    fireEvent.click(supportItem);
    expect(handleSelectTab).toHaveBeenCalledWith('support');
  });

  it('renders the weather widget at the bottom of sidebar', () => {
    const handleSelectTab = vi.fn();
    render(<Sidebar activeTab="overview" onSelectTab={handleSelectTab} />);

    const weatherWidget = screen.getByTestId('sidebar-weather-widget');
    expect(weatherWidget).toBeInTheDocument();
    expect(screen.getByText(/18°C/)).toBeInTheDocument();
    expect(screen.getByText(/Ясно, без осадков/)).toBeInTheDocument();
  });
});
