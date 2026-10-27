import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
