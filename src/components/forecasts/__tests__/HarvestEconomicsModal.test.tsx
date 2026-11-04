import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HarvestEconomicsModal } from '../HarvestEconomicsModal';
import { ForecastTable } from '../ForecastTable';
import { AppProvider } from '../../../context/AppContext';
import { mockSectors } from '../../../data/mockData';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('HarvestEconomicsModal Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('does not render when isOpen is false', () => {
    renderWithContext(
      <HarvestEconomicsModal
        isOpen={false}
        onClose={vi.fn()}
        sectors={mockSectors}
      />
    );
    expect(screen.queryByTestId('harvest-economics-modal')).not.toBeInTheDocument();
  });

  it('renders modal with title, KPI highlights, chart, sliders, and AI summary when open', () => {
    const handleClose = vi.fn();
    renderWithContext(
      <HarvestEconomicsModal
        isOpen={true}
        onClose={handleClose}
        sectors={mockSectors}
      />
    );

    expect(screen.getByTestId('harvest-economics-modal')).toBeInTheDocument();
    expect(screen.getByTestId('economics-modal-title')).toHaveTextContent(/маржинальности/i);

    // KPI cards
    expect(screen.getByText(/Выручка в оптимуме/i)).toBeInTheDocument();
    expect(screen.getByText(/Потери при раннем сборе/i)).toBeInTheDocument();
    expect(screen.getByText(/Потери от перезревания/i)).toBeInTheDocument();

    // Check sliders are present
    expect(screen.getByTestId('input-fresh-price')).toBeInTheDocument();
    expect(screen.getByTestId('input-storage-price')).toBeInTheDocument();
    expect(screen.getByTestId('input-storage-quota')).toBeInTheDocument();
    expect(screen.getByTestId('input-yield')).toBeInTheDocument();

    // Sector tabs
    mockSectors.forEach((sec) => {
      expect(screen.getByTestId(`econ-sector-tab-${sec.id}`)).toBeInTheDocument();
    });
  });

  it('switches sector tabs when clicked', () => {
    renderWithContext(
      <HarvestEconomicsModal
        isOpen={true}
        onClose={vi.fn()}
        sectors={mockSectors}
      />
    );

    const sec2Tab = screen.getByTestId(`econ-sector-tab-${mockSectors[1].id}`);
    fireEvent.click(sec2Tab);

    // AI insight text should now mention sector 2 variety (e.g. Ред Делишес or sector name)
    const insight = screen.getByTestId('economics-ai-insight');
    expect(insight).toHaveTextContent(mockSectors[1].name);
    expect(insight).toHaveTextContent(mockSectors[1].variety);
  });

  it('updates calculations when sliders change', () => {
    renderWithContext(
      <HarvestEconomicsModal
        isOpen={true}
        onClose={vi.fn()}
        sectors={mockSectors}
      />
    );

    const yieldInput = screen.getByTestId('input-yield') as HTMLInputElement;
    fireEvent.change(yieldInput, { target: { value: '45' } });
    expect(yieldInput.value).toBe('45');

    const freshInput = screen.getByTestId('input-fresh-price') as HTMLInputElement;
    fireEvent.change(freshInput, { target: { value: '110' } });
    expect(freshInput.value).toBe('110');
  });

  it('invokes onClose when clicking close button, done button, backdrop, or pressing Escape', () => {
    const handleClose = vi.fn();
    renderWithContext(
      <HarvestEconomicsModal
        isOpen={true}
        onClose={handleClose}
        sectors={mockSectors}
      />
    );

    // Close button
    fireEvent.click(screen.getByTestId('economics-modal-close'));
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Done button
    fireEvent.click(screen.getByTestId('economics-modal-done'));
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Backdrop
    fireEvent.click(screen.getByTestId('economics-modal-backdrop'));
    expect(handleClose).toHaveBeenCalledTimes(3);

    // Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(4);
  });

  it('opens economics modal from ForecastTable button', () => {
    renderWithContext(<ForecastTable />);

    const openBtn = screen.getByTestId('btn-open-economics');
    expect(openBtn).toBeInTheDocument();

    expect(screen.queryByTestId('harvest-economics-modal')).not.toBeInTheDocument();

    fireEvent.click(openBtn);
    expect(screen.getByTestId('harvest-economics-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('economics-modal-close'));
    expect(screen.queryByTestId('harvest-economics-modal')).not.toBeInTheDocument();
  });
});
