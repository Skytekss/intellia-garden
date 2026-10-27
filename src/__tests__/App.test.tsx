import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';

describe('App Root Component - All Screens Integration', () => {
  it('renders DashboardView by default when activeTab is overview', () => {
    render(<App />);

    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('bento-grid')).toBeInTheDocument();
    expect(screen.getByTestId('cta-go-to-map')).toBeInTheDocument();
  });

  it('switches to interactive garden map view when clicking CTA button', () => {
    render(<App />);

    const ctaButton = screen.getByTestId('cta-go-to-map');
    fireEvent.click(ctaButton);

    expect(screen.getByTestId('garden-map-view')).toBeInTheDocument();
    expect(screen.getByTestId('garden-map-container')).toBeInTheDocument();
    expect(screen.getByTestId('sector-detail-panel')).toBeInTheDocument();

    // Return to dashboard
    const overviewNav = screen.getByTestId('nav-item-overview');
    fireEvent.click(overviewNav);
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
  });

  it('navigates to data entry view when clicking data tab in sidebar', () => {
    render(<App />);

    const dataNav = screen.getByTestId('nav-item-data');
    fireEvent.click(dataNav);

    expect(screen.getByTestId('data-entry-view')).toBeInTheDocument();
    expect(screen.getByTestId('hyperspectral-upload-card')).toBeInTheDocument();
    expect(screen.getByTestId('agro-widget')).toBeInTheDocument();
    expect(screen.getByTestId('meteo-widget')).toBeInTheDocument();
  });

  it('navigates to forecasts view when clicking forecasts in sidebar', () => {
    render(<App />);

    const forecastsNav = screen.getByTestId('nav-item-forecasts');
    fireEvent.click(forecastsNav);

    expect(screen.getByTestId('forecasts-view')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-kpi-cards')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-table')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-ai-card')).toBeInTheDocument();
  });

  it('navigates to notifications view when clicking notifications in sidebar', () => {
    render(<App />);

    const notificationsNav = screen.getByTestId('nav-item-notifications');
    fireEvent.click(notificationsNav);

    expect(screen.getByTestId('notifications-view')).toBeInTheDocument();
    expect(screen.getByTestId('notification-filter-bar')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-list')).toBeInTheDocument();
  });

  it('navigates to settings view when clicking settings in sidebar', () => {
    render(<App />);

    const settingsNav = screen.getByTestId('nav-item-settings');
    fireEvent.click(settingsNav);

    expect(screen.getByTestId('settings-view')).toBeInTheDocument();
    expect(screen.getByTestId('general-settings-card')).toBeInTheDocument();
    expect(screen.getByTestId('sensors-card')).toBeInTheDocument();
  });

  it('navigates to support view when clicking support in sidebar', () => {
    render(<App />);

    const supportNav = screen.getByTestId('nav-item-support');
    fireEvent.click(supportNav);

    expect(screen.getByTestId('support-view')).toBeInTheDocument();
    expect(screen.getByTestId('support-category-cards')).toBeInTheDocument();
    expect(screen.getByTestId('faq-accordion')).toBeInTheDocument();
    expect(screen.getByTestId('contact-channels')).toBeInTheDocument();
  });

  it('allows selecting different farms in Header dropdown', () => {
    render(<App />);

    const farmSelector = screen.getByTestId('farm-selector-button');
    expect(farmSelector).toHaveTextContent('Ферма «Золотой Сад»');

    fireEvent.click(farmSelector);
    expect(screen.getByTestId('farm-dropdown-menu')).toBeInTheDocument();

    const secondFarmOption = screen.getByText('Участок «Яблоневый Яр»');
    fireEvent.click(secondFarmOption);

    expect(farmSelector).toHaveTextContent('Участок «Яблоневый Яр»');
  });
});
