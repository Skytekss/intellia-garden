import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ForecastsView } from '../ForecastsView';

describe('ForecastsView Component', () => {
  it('renders the header title and all 3 sub-tabs', () => {
    render(<ForecastsView />);

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

  it('renders all 3 KPI cards with values 12 – 25 сентября, 68%, 92%', () => {
    render(<ForecastsView />);

    // KPI cards container
    const kpiCards = screen.getByTestId('forecast-kpi-cards');
    expect(kpiCards).toBeInTheDocument();

    // Card 1: Средняя дата сбора
    const cardHarvestDate = screen.getByTestId('kpi-card-harvest-date');
    expect(cardHarvestDate).toHaveTextContent('Средняя дата сбора');
    expect(cardHarvestDate).toHaveTextContent('12 – 25 сентября');
    expect(cardHarvestDate).toHaveTextContent('(по саду)');

    // Card 2: Готовность плодов
    const cardFruitReadiness = screen.getByTestId('kpi-card-fruit-readiness');
    expect(cardFruitReadiness).toHaveTextContent('Готовность плодов');
    expect(cardFruitReadiness).toHaveTextContent('64%');
    expect(cardFruitReadiness).toHaveTextContent('(в среднем)');

    // Card 3: Точность прогноза
    const cardForecastAccuracy = screen.getByTestId('kpi-card-forecast-accuracy');
    expect(cardForecastAccuracy).toHaveTextContent('Точность прогноза');
    expect(cardForecastAccuracy).toHaveTextContent('92%');
    expect(cardForecastAccuracy).toHaveTextContent('(по прошлым сезонам)');
  });

  it('renders the table «Рекомендованные даты сбора» and its 5 sector rows with correct varieties and dates', () => {
    render(<ForecastsView />);

    // Table title
    const tableTitle = screen.getByTestId('forecast-table-title');
    expect(tableTitle).toHaveTextContent('Рекомендованные даты сбора');

    // 5 Rows in table
    const row1 = screen.getByTestId('forecast-row-forecast-1');
    const row2 = screen.getByTestId('forecast-row-forecast-2');
    const row3 = screen.getByTestId('forecast-row-forecast-3');
    const row4 = screen.getByTestId('forecast-row-forecast-4');
    const row5 = screen.getByTestId('forecast-row-forecast-5');

    // Row 1: Участок 1, Гала, 45%, 25 сентября – 5 октября
    expect(row1).toHaveTextContent('Участок 1');
    expect(row1).toHaveTextContent('Гала');
    expect(row1).toHaveTextContent('45%');
    expect(row1).toHaveTextContent('25 сентября – 5 октября');

    // Row 2: Участок 2, Фуджи, 52%, 20 – 28 сентября
    expect(row2).toHaveTextContent('Участок 2');
    expect(row2).toHaveTextContent('Фуджи');
    expect(row2).toHaveTextContent('52%');
    expect(row2).toHaveTextContent('20 – 28 сентября');

    // Row 3: Участок 3, Голден, 60%, 18 – 25 сентября
    expect(row3).toHaveTextContent('Участок 3');
    expect(row3).toHaveTextContent('Голден');
    expect(row3).toHaveTextContent('60%');
    expect(row3).toHaveTextContent('18 – 25 сентября');

    // Row 4: Участок 4, Ред Делишес, 85%, 10 – 15 сентября
    expect(row4).toHaveTextContent('Участок 4');
    expect(row4).toHaveTextContent('Ред Делишес');
    expect(row4).toHaveTextContent('85%');
    expect(row4).toHaveTextContent('10 – 15 сентября');

    // Row 5: Участок 5, Гала, 78%, 15 – 22 сентября
    expect(row5).toHaveTextContent('Участок 5');
    expect(row5).toHaveTextContent('Гала');
    expect(row5).toHaveTextContent('78%');
    expect(row5).toHaveTextContent('15 – 22 сентября');
  });

  it('renders the AI card and explanation matching the design', () => {
    render(<ForecastsView />);

    const aiCard = screen.getByTestId('forecast-ai-card');
    expect(aiCard).toBeInTheDocument();

    const aiBadge = screen.getByTestId('forecast-ai-badge');
    expect(aiBadge).toHaveTextContent('AI');

    const aiHeading = screen.getByTestId('forecast-ai-heading');
    expect(aiHeading).toHaveTextContent('Искусственный интеллект:');

    const aiDescription = screen.getByTestId('forecast-ai-description');
    expect(aiDescription).toHaveTextContent(
      'Учитывает данные с дрона, историю агротехнических мероприятий и прогнозы погоды для точного расчёта срока сбора.'
    );
  });

  it('switches subtabs correctly to «Карта зрелости» and «Рекомендации» and back to «Сроки сбора»', () => {
    const handleNavigate = vi.fn();
    render(<ForecastsView onNavigate={handleNavigate} />);

    // Initially on «Сроки сбора»
    expect(screen.getByTestId('subtab-content-harvest-dates')).toBeInTheDocument();

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
    expect(screen.getByText(/Участок 4 \(Ред Делишес\) — старт сбора 10 – 15 сентября/i)).toBeInTheDocument();

    // Switch back to «Сроки сбора»
    const harvestDatesTab = screen.getByTestId('subtab-harvest-dates');
    fireEvent.click(harvestDatesTab);

    expect(screen.getByTestId('subtab-content-harvest-dates')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-table-title')).toBeInTheDocument();
  });

  it('filters rows in the table when search query is typed', () => {
    render(<ForecastsView />);

    const searchInput = screen.getByTestId('forecast-table-search');

    // Filter by variety "Фуджи"
    fireEvent.change(searchInput, { target: { value: 'Фуджи' } });

    expect(screen.getByTestId('forecast-row-forecast-2')).toBeInTheDocument();
    expect(screen.queryByTestId('forecast-row-forecast-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('forecast-row-forecast-3')).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByTestId('forecast-row-forecast-1')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-2')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-3')).toBeInTheDocument();

    // Search by sector name "Участок 4"
    fireEvent.change(searchInput, { target: { value: 'Участок 4' } });
    expect(screen.getByTestId('forecast-row-forecast-4')).toBeInTheDocument();
    expect(screen.queryByTestId('forecast-row-forecast-1')).not.toBeInTheDocument();
  });

  it('filters rows by variety using select filter', () => {
    render(<ForecastsView />);

    const varietyFilter = screen.getByTestId('forecast-table-variety-filter');

    // Filter by "Голден"
    fireEvent.change(varietyFilter, { target: { value: 'Голден' } });

    expect(screen.getByTestId('forecast-row-forecast-3')).toBeInTheDocument();
    expect(screen.queryByTestId('forecast-row-forecast-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('forecast-row-forecast-2')).not.toBeInTheDocument();

    // Reset to "all"
    fireEvent.change(varietyFilter, { target: { value: 'all' } });
    expect(screen.getByTestId('forecast-row-forecast-1')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-2')).toBeInTheDocument();
    expect(screen.getByTestId('forecast-row-forecast-3')).toBeInTheDocument();
  });

  it('opens detailed row summary when clicking on a row', () => {
    render(<ForecastsView />);

    const row1 = screen.getByTestId('forecast-row-forecast-1');
    fireEvent.click(row1);

    // Detail summary appears
    const detailSummary = screen.getByTestId('forecast-row-detail-summary');
    expect(detailSummary).toBeInTheDocument();
    expect(detailSummary).toHaveTextContent('Детализация: Участок 1 (Гала)');
    expect(detailSummary).toHaveTextContent('25 сентября – 5 октября');

    // Clicking again toggles it off
    fireEvent.click(row1);
    expect(screen.queryByTestId('forecast-row-detail-summary')).not.toBeInTheDocument();
  });
});
