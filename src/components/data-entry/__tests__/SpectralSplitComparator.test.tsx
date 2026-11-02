import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SpectralSplitComparator } from '../SpectralSplitComparator';
import { AppProvider } from '../../../context/AppContext';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('SpectralSplitComparator Component', () => {
  it('renders comparator title, preset buttons and default 50% split ratio', () => {
    renderWithContext(<SpectralSplitComparator />);

    expect(screen.getByTestId('spectral-split-comparator')).toBeInTheDocument();
    expect(screen.getByText('Двухканальный спектральный компаратор')).toBeInTheDocument();

    // Check all 3 presets
    expect(screen.getByTestId('btn-preset-fruit-surface')).toBeInTheDocument();
    expect(screen.getByTestId('btn-preset-starch-test')).toBeInTheDocument();
    expect(screen.getByTestId('btn-preset-canopy-ortho')).toBeInTheDocument();

    // Split ratio label
    expect(screen.getByTestId('split-percentage-label')).toHaveTextContent('50% / 50%');
  });

  it('adjusts split ratio using range slider', () => {
    renderWithContext(<SpectralSplitComparator />);

    const slider = screen.getByTestId('split-range-slider');
    fireEvent.change(slider, { target: { value: '75' } });

    expect(screen.getByTestId('split-percentage-label')).toHaveTextContent('75% / 25%');
  });

  it('switches presets and updates spectral metrics', () => {
    renderWithContext(<SpectralSplitComparator />);

    const starchBtn = screen.getByTestId('btn-preset-starch-test');
    fireEvent.click(starchBtn);

    expect(screen.getByTestId('spectral-point-metric')).toHaveTextContent('6.4 / 10');

    const canopyBtn = screen.getByTestId('btn-preset-canopy-ortho');
    fireEvent.click(canopyBtn);

    expect(screen.getByTestId('spectral-point-metric')).toHaveTextContent('0.84');
  });

  it('sets inspection pin on viewport click', () => {
    renderWithContext(<SpectralSplitComparator />);

    const viewport = screen.getByTestId('split-viewport');
    fireEvent.click(viewport, { clientX: 200, clientY: 150 });

    expect(screen.getByTestId('inspect-pin')).toBeInTheDocument();
  });
});
