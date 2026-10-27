import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardView } from '../DashboardView';

describe('DashboardView', () => {
  it('renders HeroBanner with title, subtitle and animated drone', () => {
    const handleNavigate = vi.fn();
    render(<DashboardView onNavigate={handleNavigate} />);

    // Check HeroBanner container
    const heroBanner = screen.getByTestId('hero-banner');
    expect(heroBanner).toBeInTheDocument();

    // Check Title and Subtitle
    expect(screen.getByRole('heading', { level: 1, name: /интеллия/i })).toBeInTheDocument();
    expect(
      screen.getByText(/прогнозирование сроков сбора урожая яблок/i)
    ).toBeInTheDocument();

    // Check Drone motion element
    expect(screen.getByTestId('hero-drone-motion')).toBeInTheDocument();
  });

  it('renders all 4 Bento data cards correctly', () => {
    const handleNavigate = vi.fn();
    render(<DashboardView onNavigate={handleNavigate} />);

    expect(screen.getByTestId('bento-grid')).toBeInTheDocument();

    // Verify 4 specific cards exist
    expect(screen.getByTestId('bento-card-drone')).toBeInTheDocument();
    expect(screen.getByTestId('bento-card-agritech')).toBeInTheDocument();
    expect(screen.getByTestId('bento-card-meteo')).toBeInTheDocument();
    expect(screen.getByTestId('bento-card-ai')).toBeInTheDocument();

    // Verify card headings
    expect(screen.getByRole('heading', { level: 3, name: /гиперспектральные данные с дрона/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /агротехнические данные/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /метеоданные/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /ai-аналитика/i })).toBeInTheDocument();
  });

  it('triggers onNavigate with "map" when CTA button is clicked', () => {
    const handleNavigate = vi.fn();
    render(<DashboardView onNavigate={handleNavigate} />);

    const ctaButton = screen.getByTestId('cta-go-to-map');
    expect(ctaButton).toBeInTheDocument();

    fireEvent.click(ctaButton);
    expect(handleNavigate).toHaveBeenCalledTimes(1);
    expect(handleNavigate).toHaveBeenCalledWith('map');
  });

  it('triggers onNavigate when clicking on Bento cards', () => {
    const handleNavigate = vi.fn();
    render(<DashboardView onNavigate={handleNavigate} />);

    // Drone card -> map
    const droneCard = screen.getByTestId('bento-card-drone');
    fireEvent.click(droneCard);
    expect(handleNavigate).toHaveBeenCalledWith('map');

    // Meteo card -> data
    const meteoCard = screen.getByTestId('bento-card-meteo');
    fireEvent.click(meteoCard);
    expect(handleNavigate).toHaveBeenCalledWith('data');
  });
});
