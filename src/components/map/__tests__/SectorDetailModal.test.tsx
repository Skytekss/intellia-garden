import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SectorDetailModal } from '../SectorDetailModal';
import { AppProvider } from '../../../context/AppContext';
import { GardenSector } from '../../../types';

const mockSector: GardenSector = {
  id: 'sector-4',
  name: 'Участок 4',
  variety: 'Ред Делишес',
  maturityPercent: 85,
  status: 'ready',
  recommendedDate: '10 – 15 сентября',
  area: 4.8,
  brix: 14.5,
  firmnessKgCm2: 7.2,
  starchIndex: 5.5,
  soilMoisturePercent: 62,
  ndviIndex: 0.86,
  ripeningHistory: [
    { date: '01.08', percent: 60 },
    { date: '15.08', percent: 85 },
  ],
};

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('SectorDetailModal', () => {
  it('renders sector details and physicochemical metrics in view mode', () => {
    renderWithContext(
      <SectorDetailModal
        sector={mockSector}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByTestId('sector-detail-modal')).toBeInTheDocument();
    expect(screen.getByText(/Ред Делишес/i)).toBeInTheDocument();
    expect(screen.getByText('14.5')).toBeInTheDocument();
    expect(screen.getByText('7.2')).toBeInTheDocument();
    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getAllByText('62%').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('0.86')).toBeInTheDocument();
  });

  it('switches to inline edit mode, alters values and saves changes', () => {
    renderWithContext(
      <SectorDetailModal
        sector={mockSector}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    // Click edit button
    const editBtn = screen.getByTestId('edit-sector-metrics-btn');
    fireEvent.click(editBtn);

    // Verify inputs appear
    const brixInput = screen.getByTestId('input-brix') as HTMLInputElement;
    const firmnessInput = screen.getByTestId('input-firmness') as HTMLInputElement;

    expect(brixInput).toBeInTheDocument();
    expect(firmnessInput).toBeInTheDocument();
    expect(brixInput.value).toBe('14.5');

    // Change Brix value
    fireEvent.change(brixInput, { target: { value: '15.2' } });
    expect(brixInput.value).toBe('15.2');

    // Save changes
    const saveBtn = screen.getByTestId('save-sector-metrics-btn');
    fireEvent.click(saveBtn);

    // Check success alert
    expect(screen.getByTestId('save-success-alert')).toBeInTheDocument();
    expect(screen.queryByTestId('input-brix')).not.toBeInTheDocument();
  });

  it('cancels edit mode and discards uncommitted input changes', () => {
    renderWithContext(
      <SectorDetailModal
        sector={mockSector}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const editBtn = screen.getByTestId('edit-sector-metrics-btn');
    fireEvent.click(editBtn);

    const brixInput = screen.getByTestId('input-brix') as HTMLInputElement;
    fireEvent.change(brixInput, { target: { value: '18.9' } });

    const cancelBtn = screen.getByTestId('cancel-sector-metrics-btn');
    fireEvent.click(cancelBtn);

    // Back to view mode with original value
    expect(screen.queryByTestId('input-brix')).not.toBeInTheDocument();
    expect(screen.getByText('14.5')).toBeInTheDocument();
  });

  it('triggers export and displays feedback', () => {
    renderWithContext(
      <SectorDetailModal
        sector={mockSector}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const exportBtn = screen.getByRole('button', { name: /экспорт отчета/i });
    fireEvent.click(exportBtn);

    expect(screen.getByRole('button', { name: /отчет выгружен!/i })).toBeInTheDocument();
  });
});
