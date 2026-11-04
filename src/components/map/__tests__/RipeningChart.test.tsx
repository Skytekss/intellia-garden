import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RipeningChart } from '../RipeningChart';

describe('RipeningChart Component', () => {
  const sampleHistory = [
    { date: '01.08', percent: 35 },
    { date: '08.08', percent: 48 },
    { date: '15.08', percent: 58 },
    { date: '22.08', percent: 66 },
    { date: '28.08', percent: 72 },
  ];

  it('renders SVG chart container and dates on the X axis', () => {
    render(<RipeningChart history={sampleHistory} />);

    expect(screen.getByTestId('ripening-chart')).toBeInTheDocument();
    expect(screen.getByText('01.08')).toBeInTheDocument();
    expect(screen.getByText('08.08')).toBeInTheDocument();
    expect(screen.getByText('15.08')).toBeInTheDocument();
    expect(screen.getByText('22.08')).toBeInTheDocument();
    expect(screen.getByText('28.08')).toBeInTheDocument();
  });

  it('renders the active maturity percent badge', () => {
    render(<RipeningChart history={sampleHistory} currentPercent={72} />);

    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('renders null when history is empty', () => {
    const { container } = render(<RipeningChart history={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('updates tooltip upon hovering over data points and resets on mouse leave', () => {
    render(<RipeningChart history={sampleHistory} currentPercent={72} />);

    // Hover on the first point (01.08: 35%)
    const firstPointButton = screen.getByLabelText('01.08: 35%');
    fireEvent.mouseEnter(firstPointButton);

    expect(screen.getByText('35%')).toBeInTheDocument();

    // Hover on another point (15.08: 58%)
    const midPointButton = screen.getByLabelText('15.08: 58%');
    fireEvent.mouseEnter(midPointButton);

    expect(screen.getByText('58%')).toBeInTheDocument();

    // Mouse leave resets to idle state showing currentPercent (72%)
    const chartContainer = screen.getByTestId('ripening-chart');
    fireEvent.mouseLeave(chartContainer);

    expect(screen.getByText('72%')).toBeInTheDocument();
  });
});
