import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { App } from '../App';

describe('App Root Component', () => {
  it('renders DashboardView by default when activeTab is overview', () => {
    render(<App />);

    // Should render HeroBanner on overview
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('bento-grid')).toBeInTheDocument();
    expect(screen.getByTestId('cta-go-to-map')).toBeInTheDocument();
  });

  it('switches to real interactive map view when clicking CTA button', () => {
    render(<App />);

    const ctaButton = screen.getByTestId('cta-go-to-map');
    fireEvent.click(ctaButton);

    // Live GardenMapView should now be visible
    const gardenMapView = screen.getByTestId('garden-map-view');
    expect(gardenMapView).toBeInTheDocument();
    expect(screen.getByTestId('garden-map-container')).toBeInTheDocument();
    expect(screen.getByTestId('sector-detail-panel')).toBeInTheDocument();

    // Click Overview navigation item in sidebar to return to dashboard
    const overviewNav = screen.getByTestId('nav-item-overview');
    fireEvent.click(overviewNav);

    // Dashboard should be back
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
  });

  it('navigates to data entry view when clicking data tab in sidebar', () => {
    render(<App />);

    const dataNav = screen.getByTestId('nav-item-data');
    fireEvent.click(dataNav);

    // Live DataEntryView should now be visible
    expect(screen.getByTestId('data-entry-view')).toBeInTheDocument();
    expect(screen.getByTestId('hyperspectral-upload-card')).toBeInTheDocument();
    expect(screen.getByTestId('agro-widget')).toBeInTheDocument();
    expect(screen.getByTestId('meteo-widget')).toBeInTheDocument();
  });

  it('navigates to support view when clicking support in sidebar', () => {
    render(<App />);

    const supportNav = screen.getByTestId('nav-item-support');
    fireEvent.click(supportNav);

    const placeholderView = screen.getByTestId('placeholder-view');
    expect(placeholderView).toBeInTheDocument();
    expect(
      within(placeholderView).getByRole('heading', { level: 2, name: 'Агрономическая поддержка' })
    ).toBeInTheDocument();
  });

  it('allows selecting different farms in Header dropdown', () => {
    render(<App />);

    const farmSelector = screen.getByTestId('farm-selector-button');
    expect(farmSelector).toHaveTextContent('Ферма «Золотой Сад»');

    // Open dropdown
    fireEvent.click(farmSelector);
    expect(screen.getByTestId('farm-dropdown-menu')).toBeInTheDocument();

    // Select second farm
    const secondFarmOption = screen.getByText('Участок «Яблоневый Яр»');
    fireEvent.click(secondFarmOption);

    // Selector now reflects the new selection
    expect(farmSelector).toHaveTextContent('Участок «Яблоневый Яр»');
  });
});
