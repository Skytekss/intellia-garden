import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { HyperspectralUploadCard } from '../HyperspectralUploadCard';
import { AppProvider } from '../../../context/AppContext';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('HyperspectralUploadCard Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders upload drop zone, drone model select, channels, and 1-click test flight button', () => {
    renderWithContext(<HyperspectralUploadCard />);

    expect(screen.getByTestId('hyperspectral-upload-card')).toBeInTheDocument();
    expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
    expect(screen.getByTestId('btn-load-test-flight')).toBeInTheDocument();
    expect(screen.getByTestId('drone-model-select')).toBeInTheDocument();
    expect(screen.getByTestId('channel-checkbox-RGB')).toBeChecked();
    expect(screen.getByTestId('channel-checkbox-NIR')).toBeChecked();
  });

  it('loads test flight orthomosaic on 1-click button and shows file item and AI analysis trigger', () => {
    renderWithContext(<HyperspectralUploadCard />);

    const loadTestBtn = screen.getByTestId('btn-load-test-flight');
    fireEvent.click(loadTestBtn);

    expect(screen.getByTestId('uploaded-files-list')).toBeInTheDocument();
    expect(screen.getByText('DJI_20250814_multispectral_sector4.tif')).toBeInTheDocument();
    expect(screen.getByTestId('btn-run-ai-analysis')).toBeInTheDocument();
  });

  it('simulates AI detection and displays metrics card upon completion', async () => {
    renderWithContext(<HyperspectralUploadCard />);

    // Load sample file
    fireEvent.click(screen.getByTestId('btn-load-test-flight'));

    // Trigger AI analysis
    const runAnalysisBtn = screen.getByTestId('btn-run-ai-analysis');
    fireEvent.click(runAnalysisBtn);

    // Should show in-progress scanning telemetry
    expect(screen.getByTestId('ai-analysis-progress')).toBeInTheDocument();

    // Advance fake timers through all scanning steps
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Verify AI Detection results card appeared
    expect(screen.getByTestId('ai-detection-results')).toBeInTheDocument();
    expect(screen.getByTestId('metric-fruit-count')).toHaveTextContent('42');
    expect(screen.getByTestId('metric-avg-calibre')).toHaveTextContent('73.5');
    expect(screen.getByTestId('metric-avg-ndvi')).toHaveTextContent('0.82');
    expect(screen.getByTestId('metric-chlorophyll')).toHaveTextContent('0.74');
  });

  it('saves analysis to survey flight history and triggers feedback state', async () => {
    renderWithContext(<HyperspectralUploadCard />);

    // Load sample & advance analysis
    fireEvent.click(screen.getByTestId('btn-load-test-flight'));
    fireEvent.click(screen.getByTestId('btn-run-ai-analysis'));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const saveHistoryBtn = screen.getByTestId('btn-save-survey-history');
    expect(saveHistoryBtn).toBeInTheDocument();

    fireEvent.click(saveHistoryBtn);

    expect(screen.getByText('Внесено в историю облетов!')).toBeInTheDocument();
  });

  it('allows resetting analysis and clearing files', async () => {
    renderWithContext(<HyperspectralUploadCard />);

    fireEvent.click(screen.getByTestId('btn-load-test-flight'));
    fireEvent.click(screen.getByTestId('btn-run-ai-analysis'));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const resetBtn = screen.getByTestId('btn-reset-analysis');
    fireEvent.click(resetBtn);

    expect(screen.queryByTestId('ai-detection-results')).not.toBeInTheDocument();
    expect(screen.queryByTestId('uploaded-files-list')).not.toBeInTheDocument();
  });
});
