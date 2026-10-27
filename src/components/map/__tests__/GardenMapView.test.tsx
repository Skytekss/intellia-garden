import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { GardenMapView } from '../GardenMapView';

describe('GardenMapView Component', () => {
  it('renders farm title, survey date, and maturity legend', () => {
    render(<GardenMapView />);

    // Farm & Survey Date
    expect(screen.getByText('Ферма «Золотой Сад»')).toBeInTheDocument();
    expect(screen.getByText('12.08.2025')).toBeInTheDocument();

    // Maturity Legend
    const legend = screen.getByTestId('maturity-legend');
    expect(legend).toBeInTheDocument();
    expect(within(legend).getByText('Зрелость плодов')).toBeInTheDocument();
    expect(within(legend).getByText('Ниже')).toBeInTheDocument();
    expect(within(legend).getByText('Выше')).toBeInTheDocument();
  });

  it('renders all 5 garden sectors on the map', () => {
    render(<GardenMapView />);

    expect(screen.getByTestId('sector-badge-sector-1')).toBeInTheDocument();
    expect(screen.getByTestId('sector-badge-sector-2')).toBeInTheDocument();
    expect(screen.getByTestId('sector-badge-sector-3')).toBeInTheDocument();
    expect(screen.getByTestId('sector-badge-sector-4')).toBeInTheDocument();
    expect(screen.getByTestId('sector-badge-sector-5')).toBeInTheDocument();

    // Sector polygons
    expect(screen.getByTestId('sector-polygon-sector-1')).toBeInTheDocument();
    expect(screen.getByTestId('sector-polygon-sector-2')).toBeInTheDocument();
    expect(screen.getByTestId('sector-polygon-sector-3')).toBeInTheDocument();
    expect(screen.getByTestId('sector-polygon-sector-4')).toBeInTheDocument();
    expect(screen.getByTestId('sector-polygon-sector-5')).toBeInTheDocument();
  });

  it('defaults to Sector 4 in the detail panel', () => {
    render(<GardenMapView />);

    const panel = screen.getByTestId('sector-detail-panel');
    expect(within(panel).getByText('Участок 4')).toBeInTheDocument();
    expect(within(panel).getByText('Ред Делишес')).toBeInTheDocument();
    expect(within(panel).getByText('5.1 га')).toBeInTheDocument();
    expect(within(panel).getAllByText('85%').length).toBeGreaterThanOrEqual(1);
    expect(within(panel).getByText('10 – 15 сентября')).toBeInTheDocument();
  });

  it('updates detail panel when clicking a different sector badge or polygon', () => {
    render(<GardenMapView />);

    // Click on Sector 1 badge
    const sector1Badge = screen.getByTestId('sector-badge-sector-1');
    fireEvent.click(sector1Badge);

    const panel = screen.getByTestId('sector-detail-panel');
    expect(within(panel).getByText('Участок 1')).toBeInTheDocument();
    expect(within(panel).getByText('Гала')).toBeInTheDocument();
    expect(within(panel).getByText('4.8 га')).toBeInTheDocument();
    expect(within(panel).getAllByText('45%').length).toBeGreaterThanOrEqual(1);
    expect(within(panel).getByText('25 сентября – 5 октября')).toBeInTheDocument();

    // Click on Sector 2 polygon
    const sector2Polygon = screen.getByTestId('sector-polygon-sector-2');
    fireEvent.click(sector2Polygon);

    expect(within(panel).getByText('Участок 2')).toBeInTheDocument();
    expect(within(panel).getByText('Фуджи')).toBeInTheDocument();
    expect(within(panel).getAllByText('52%').length).toBeGreaterThanOrEqual(1);
  });

  it('supports zoom in, zoom out, and reset centering in the toolbar', () => {
    render(<GardenMapView />);

    const zoomControls = screen.getByTestId('map-zoom-controls');
    const zoomInBtn = screen.getByTestId('btn-zoom-in');
    const zoomOutBtn = screen.getByTestId('btn-zoom-out');
    const resetBtn = screen.getByTestId('btn-reset-center');

    // Default zoom is 100%
    expect(within(zoomControls).getByText('100%')).toBeInTheDocument();
    expect(zoomOutBtn).toBeDisabled();

    // Click Zoom In
    fireEvent.click(zoomInBtn);
    expect(within(zoomControls).getByText('125%')).toBeInTheDocument();
    expect(zoomOutBtn).not.toBeDisabled();

    // Click Zoom In again
    fireEvent.click(zoomInBtn);
    expect(within(zoomControls).getByText('150%')).toBeInTheDocument();

    // Click Reset
    fireEvent.click(resetBtn);
    expect(within(zoomControls).getByText('100%')).toBeInTheDocument();
  });

  it('toggles map mode and layers in the toolbar', () => {
    render(<GardenMapView />);

    const modeBtn = screen.getByTestId('btn-toggle-mode');
    const layersBtn = screen.getByTestId('btn-toggle-layers');

    expect(screen.getByText('NDVI Спектр')).toBeInTheDocument();

    // Switch to RGB
    fireEvent.click(modeBtn);
    expect(screen.getByText('Ортофото RGB')).toBeInTheDocument();

    // Switch back to NDVI
    fireEvent.click(modeBtn);
    expect(screen.getByText('NDVI Спектр')).toBeInTheDocument();

    // Toggle layers
    fireEvent.click(layersBtn);
    expect(layersBtn).toBeInTheDocument();
  });

  it('opens and closes the agro-analytics modal when clicking "Подробнее"', async () => {
    render(<GardenMapView />);

    // Modal should not be in DOM initially
    expect(screen.queryByTestId('sector-detail-modal')).not.toBeInTheDocument();

    // Click "Подробнее" button
    const detailsBtn = screen.getByTestId('sector-details-btn');
    fireEvent.click(detailsBtn);

    // Modal is now open
    const modal = screen.getByTestId('sector-detail-modal');
    expect(modal).toBeInTheDocument();

    // Verify modal content
    expect(within(modal).getByText(/Участок 4 — сорт «Ред Делишес»/)).toBeInTheDocument();
    expect(within(modal).getByText('Сахаристость')).toBeInTheDocument();
    expect(within(modal).getByText('Плотность мякоти')).toBeInTheDocument();
    expect(within(modal).getByText('Крахмальный тест')).toBeInTheDocument();
    expect(within(modal).getByText('Влажность почвы')).toBeInTheDocument();
    expect(within(modal).getByText('Индекс NDVI')).toBeInTheDocument();
    expect(within(modal).getByText(/Рекомендации AI-агронома/)).toBeInTheDocument();

    // Close modal via close button
    const closeBtn = screen.getByTestId('modal-close-btn');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('sector-detail-modal')).not.toBeInTheDocument();
    });
  });

  it('closes the modal on Escape key press', async () => {
    render(<GardenMapView />);

    const detailsBtn = screen.getByTestId('sector-details-btn');
    fireEvent.click(detailsBtn);

    expect(screen.getByTestId('sector-detail-modal')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByTestId('sector-detail-modal')).not.toBeInTheDocument();
    });
  });
});
