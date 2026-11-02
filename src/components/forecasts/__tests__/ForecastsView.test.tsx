import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ForecastsView } from '../ForecastsView';
import { AppProvider } from '../../../context/AppContext';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('ForecastsView Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('renders the header title and all 3 sub-tabs', () => {
    renderWithContext(<ForecastsView />);

    // Title «Прогнозы»
    const title = screen.getByTestId('forecasts-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Прогнозы');

    // Sub-tabs bar
    const subtabsBar = screen.getByTestId('forecasts-subtabs-bar');
    expect(subtabsBar).toBeInTheDocument();

    // Check all 3 tabs are present
    const maturityTab = screen.getByTestId('subtab-maturity-map');
    const harvestDatesTab = screen.getByTestId('subtab-harvest-dates');
    const recommendationsTab = screen.getByTestId('subtab-recommendations');

    expect(maturityTab).toHaveTextContent('Карта зрелости');
    expect(harvestDatesTab).toHaveTextContent('Сроки сбора');
    expect(recommendationsTab).toHaveTextContent('Рекомендации');

    // By default, «Сроки сбора» is active
    expect(harvestDatesTab).toHaveAttribute('aria-selected', 'true');
    expect(maturityTab).toHaveAttribute('aria-selected', 'false');
    expect(recommendationsTab).toHaveAttribute('aria-selected', 'false');
  });

  it('renders all 3 KPI cards with values', () => {
    renderWithContext(<ForecastsView />);

    const kpiCards = screen.getByTestId('forecast-kpi-cards');
    expect(kpiCards).toBeInTheDocument();

    const cardHarvestDate = screen.getByTestId('kpi-card-harvest-date');
    expect(cardHarvestDate).toHaveTextContent('Средняя дата сбора');
    expect(cardHarvestDate).toHaveTextContent('12 – 25 сентября');

    const cardFruitReadiness = screen.getByTestId('kpi-card-fruit-readiness');
    expect(cardFruitReadiness).toHaveTextContent('Готовность плодов');

    const cardForecastAccuracy = screen.getByTestId('kpi-card-forecast-accuracy');
    expect(cardForecastAccuracy).toHaveTextContent('Точность прогноза');
    expect(cardForecastAccuracy).toHaveTextContent('92%');
  });

  it('renders the table «Рекомендованные даты сбора» and sector rows', () => {
    renderWithContext(<ForecastsView />);

    const tableTitle = screen.getByTestId('forecast-table-title');
    expect(tableTitle).toHaveTextContent('Рекомендованные даты сбора');

    expect(screen.getByTestId('forecast-row-forecast-1')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-2')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-3')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-4')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-5')).toBeInTheDocument();
  });

  it('renders What-If simulator widget and updates simulation parameters', () => {
    renderWithContext(<ForecastsView />);

    // Check What-If widget
    const whatIfWidget = screen.getByTestId('whatif-simulator-widget');
    expect(whatIfWidget).toBeInTheDocument();

    const statusBadge = screen.getByTestId('simulation-status-badge');
    expect(statusBadge).toHaveTextContent('Базовый (Норма)');

    // Move temperature slider to +2.0°C
    const slider = screen.getByTestId('temp-anomaly-slider');
    fireEvent.change(slider, { target: { value: '2' } });

    expect(screen.getByTestId('temp-anomaly-value')).toHaveTextContent('+2°C');
    expect(screen.getByTestId('simulation-status-badge')).toHaveTextContent('Сценарий активен');

    // Shift badge indicates earlier harvest
    expect(screen.getByTestId('simulation-shift-badge')).toHaveTextContent('На 3 дн. раньше');

    // Reset button should now be visible and functional
    const resetBtn = screen.getByTestId('btn-reset-simulation');
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);

    expect(screen.getByTestId('simulation-status-badge')).toHaveTextContent('Базовый (Норма)');
    expect(screen.getByTestId('temp-anomaly-value')).toHaveTextContent('0°C');
  });

  it('switches precipitation conditions in What-If widget', () => {
    renderWithContext(<ForecastsView />);

    const dryBtn = screen.getByTestId('rain-btn-dry');
    const heavyBtn = screen.getByTestId('rain-btn-heavy');

    // Click Heavy Rain
    fireEvent.click(heavyBtn);
    expect(heavyBtn).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('simulation-status-badge')).toHaveTextContent('Сценарий активен');
    expect(screen.getByTestId('simulation-shift-badge')).toHaveTextContent('На 2 дн. позже');

    // Click Drought
    fireEvent.click(dryBtn);
    expect(dryBtn).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('simulation-shift-badge')).toHaveTextContent('На 1 дн. раньше');
  });

  it('opens and interacts with the Harvest Logistics Modal', () => {
    renderWithContext(<ForecastsView />);

    // Open logistics modal via button in table header
    const openLogisticsBtn = screen.getByTestId('btn-open-logistics');
    fireEvent.click(openLogisticsBtn);

    const modal = screen.getByTestId('harvest-logistics-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByTestId('logistics-modal-title')).toHaveTextContent('Расчет ресурсов и логистики сбора урожая');

    // Check KPI values inside modal
    expect(screen.getByTestId('logistics-total-tons')).toBeInTheDocument();
    expect(screen.getByTestId('logistics-pickers-needed')).toBeInTheDocument();
    expect(screen.getByTestId('logistics-bins-needed')).toBeInTheDocument();
    expect(screen.getByTestId('logistics-trucks-needed')).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByTestId('logistics-modal-close');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('harvest-logistics-modal')).not.toBeInTheDocument();
  });

  it('opens and closes the Harvest Report Modal with printable preview', () => {
    renderWithContext(<ForecastsView />);

    const openReportBtn = screen.getByTestId('btn-print-report');
    fireEvent.click(openReportBtn);

    const reportModal = screen.getByTestId('harvest-report-modal');
    expect(reportModal).toBeInTheDocument();
    expect(screen.getByText('Предпросмотр агрономического отчета')).toBeInTheDocument();

    // Check print button inside
    expect(screen.getByTestId('report-print-btn')).toBeInTheDocument();

    // Close report modal
    const closeBtn = screen.getByTestId('report-close-btn');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('harvest-report-modal')).not.toBeInTheDocument();
  });

  it('renders the AI card and adapts dynamically to simulation state', () => {
    renderWithContext(<ForecastsView />);

    const aiCard = screen.getByTestId('forecast-ai-card');
    expect(aiCard).toBeInTheDocument();

    const aiHeading = screen.getByTestId('forecast-ai-heading');
    expect(aiHeading).toHaveTextContent('Искусственный интеллект:');

    // Simulate heat anomaly
    const slider = screen.getByTestId('temp-anomaly-slider');
    fireEvent.change(slider, { target: { value: '3' } });

    // AI heading should adapt
    expect(aiHeading).toHaveTextContent('Рекомендация AI по активному сценарию:');
    expect(screen.getByTestId('forecast-ai-description')).toHaveTextContent(/риск осыпания/i);
  });

  it('switches subtabs correctly to «Карта зрелости» and «Рекомендации»', () => {
    const handleNavigate = vi.fn();
    renderWithContext(<ForecastsView onNavigate={handleNavigate} />);

    // Click «Карта зрелости»
    const maturityTab = screen.getByTestId('subtab-maturity-map');
    fireEvent.click(maturityTab);

    expect(screen.getByTestId('forecast-maturity-preview')).toBeInTheDocument();
    expect(screen.getByText('Спектральная карта созревания')).toBeInTheDocument();

    // Click CTA to open full map
    const openFullMapBtn = screen.getByTestId('cta-open-full-map');
    fireEvent.click(openFullMapBtn);
    expect(handleNavigate).toHaveBeenCalledWith('map');

    // Click «Рекомендации»
    const recommendationsTab = screen.getByTestId('subtab-recommendations');
    fireEvent.click(recommendationsTab);

    expect(screen.getByTestId('forecast-recommendations-panel')).toBeInTheDocument();
    expect(screen.getByText('AI-Агрорекомендации')).toBeInTheDocument();
  });

  it('filters rows in the table when search query is typed', () => {
    renderWithContext(<ForecastsView />);

    const searchInput = screen.getByTestId('forecast-table-search');

    // Filter by variety "Фуджи"
    fireEvent.change(searchInput, { target: { value: 'Фуджи' } });

    expect(screen.getByTestId('forecast-row-forecast-2')).toBeInTheDocument();
    expect(screen.queryByTestId('forecast-row-forecast-1')).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByTestId('forecast-row-forecast-1')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-2')).toBeInTheDocument();
  });

  it('filters rows by variety using select filter', () => {
    renderWithContext(<ForecastsView />);

    const varietyFilter = screen.getByTestId('forecast-table-variety-filter');

    // Filter by "Голден"
    fireEvent.change(varietyFilter, { target: { value: 'Голден' } });

    expect(screen.getByTestId('forecast-row-forecast-3')).toBeInTheDocument();
    expect(screen.queryByTestId('forecast-row-forecast-1')).not.toBeInTheDocument();

    // Reset to "all"
    fireEvent.change(varietyFilter, { target: { value: 'all' } });
    expect(screen.getByTestId('forecast-row-forecast-1')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-2')).toBeInTheDocument();
  });

  it('opens detailed row summary when clicking on a row', () => {
    renderWithContext(<ForecastsView />);

    const row1 = screen.getByTestId('forecast-row-forecast-1');
    fireEvent.click(row1);

    const detailSummary = screen.getByTestId('forecast-row-detail-summary');
    expect(detailSummary).toBeInTheDocument();
    expect(detailSummary).toHaveTextContent('Детализация: Участок 1 (Гала)');

    // Clicking again toggles it off
    fireEvent.click(row1);
    expect(screen.queryByTestId('forecast-row-detail-summary')).not.toBeInTheDocument();
  });
});
