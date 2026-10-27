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

  it('switches to map view placeholder when clicking CTA button', () => {
    render(<App />);

    const ctaButton = screen.getByTestId('cta-go-to-map');
    fireEvent.click(ctaButton);

    // Placeholder for map should now be visible
    const placeholderView = screen.getByTestId('placeholder-view');
    expect(placeholderView).toBeInTheDocument();
    expect(
      within(placeholderView).getByRole('heading', { level: 2, name: 'Интерактивная карта сада' })
    ).toBeInTheDocument();

    // Click back button to return to overview
    const backButton = screen.getByTestId('placeholder-back-button');
    fireEvent.click(backButton);

    // Dashboard should be back
    expect(screen.getByTestId('hero-banner')).toBeInTheDocument();
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
