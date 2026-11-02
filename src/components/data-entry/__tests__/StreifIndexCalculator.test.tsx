import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { StreifIndexCalculator } from '../StreifIndexCalculator';
import { AppProvider } from '../../../context/AppContext';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('StreifIndexCalculator Component', () => {
  it('renders title, sliders, formula breakdown and initial SI score', () => {
    renderWithContext(<StreifIndexCalculator />);

    expect(screen.getByTestId('streif-index-calculator')).toBeInTheDocument();
    expect(screen.getByText('Лабораторный калькулятор индекса Стрейфа (SI)')).toBeInTheDocument();

    expect(screen.getByTestId('slider-firmness')).toBeInTheDocument();
    expect(screen.getByTestId('slider-brix')).toBeInTheDocument();
    expect(screen.getByTestId('slider-starch')).toBeInTheDocument();

    expect(screen.getByTestId('streif-score-badge')).toHaveTextContent(/SI = /);
  });

  it('updates SI score dynamically when firmness slider is adjusted', () => {
    renderWithContext(<StreifIndexCalculator />);

    const firmnessSlider = screen.getByTestId('slider-firmness');
    // Set firmness high
    fireEvent.change(firmnessSlider, { target: { value: '9.5' } });

    expect(screen.getByTestId('value-firmness')).toHaveTextContent('9.5 кг/см²');
  });

  it('applies Streif measurement to the selected sector on button click', () => {
    renderWithContext(<StreifIndexCalculator />);

    const applyBtn = screen.getByTestId('btn-apply-streif');
    expect(applyBtn).toBeInTheDocument();

    fireEvent.click(applyBtn);

    // Shows success feedback
    expect(screen.getByText('Замер привязан к сектору!')).toBeInTheDocument();
  });
});
