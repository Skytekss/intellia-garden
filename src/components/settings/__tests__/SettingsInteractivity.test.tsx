import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { App } from '../../../App';

describe('Settings Interactivity & Reactive App State', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('switches language between Russian and English across the entire app', () => {
    render(<App />);

    const sidebar = screen.getByTestId('app-sidebar');

    // 1. Initially in Russian
    expect(within(sidebar).getByText('Главная')).toBeInTheDocument();
    expect(within(sidebar).getByText('Карта сада')).toBeInTheDocument();

    // 2. Navigate to Settings
    fireEvent.click(screen.getByTestId('nav-item-settings'));
    expect(screen.getByTestId('settings-view')).toBeInTheDocument();

    // 3. Switch Language to English
    const langSelect = screen.getByTestId('select-language');
    expect(langSelect).toHaveValue('Русский');

    fireEvent.change(langSelect, { target: { value: 'English' } });
    expect(langSelect).toHaveValue('English');

    // 4. Verify Sidebar & Header updated to English
    expect(within(sidebar).getByText('Dashboard')).toBeInTheDocument();
    expect(within(sidebar).getByText('Garden Map')).toBeInTheDocument();
    expect(screen.getByText('System Settings')).toBeInTheDocument();
    expect(screen.getByText('Interface Language')).toBeInTheDocument();
    expect(screen.getByText('Measurement Units')).toBeInTheDocument();
    expect(screen.getByText('Timezone')).toBeInTheDocument();
    expect(screen.getByText('Date Format')).toBeInTheDocument();

    // 5. Switch back to Russian
    fireEvent.change(langSelect, { target: { value: 'Русский' } });
    expect(langSelect).toHaveValue('Русский');
    expect(within(sidebar).getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Основные настройки')).toBeInTheDocument();
  });

  it('switches measurement units between Metric and Imperial and updates temperature and area units', () => {
    render(<App />);

    // Navigate to Settings
    fireEvent.click(screen.getByTestId('nav-item-settings'));

    // Check initial Weather Widget temperature in Metric (+18°C)
    const weatherWidget = screen.getByTestId('sidebar-weather-widget');
    expect(within(weatherWidget).getByText('+18°C')).toBeInTheDocument();

    // Switch Measurement Unit to Imperial
    const unitSelect = screen.getByTestId('select-measurement-unit');
    fireEvent.change(unitSelect, { target: { value: 'Имперская (°F, дюймы, акры)' } });

    // Weather Widget temperature should now be in Fahrenheit (18°C = 64°F)
    expect(within(weatherWidget).getByText('64°F')).toBeInTheDocument();

    // Farm Profile Card should show area in acres (22 ha * 2.471 ≈ 54.4 акров)
    const farmCard = screen.getByTestId('farm-profile-card');
    expect(within(farmCard).getByText(/54\.4 акров/)).toBeInTheDocument();

    // Switch back to Metric
    fireEvent.change(unitSelect, { target: { value: 'Метрическая (°C, мм, га)' } });
    expect(within(weatherWidget).getByText('+18°C')).toBeInTheDocument();
    expect(within(farmCard).getByText(/22 га/)).toBeInTheDocument();
  });

  it('allows editing farm profile and immediately updates Header and FarmProfileCard globally', async () => {
    render(<App />);

    // Initial farm name in Header
    const farmSelector = screen.getByTestId('farm-selector-button');
    expect(farmSelector).toHaveTextContent('Ферма «Золотой Сад»');

    // Initial subtitle in Header
    const header = screen.getByTestId('app-header');
    expect(header).toHaveTextContent('Тульская область • Площадь: 22 га');

    // Go to Settings
    fireEvent.click(screen.getByTestId('nav-item-settings'));

    // Click "Редактировать"
    const editBtn = screen.getByTestId('edit-farm-button');
    fireEvent.click(editBtn);

    const modal = screen.getByTestId('edit-farm-modal');
    expect(modal).toBeInTheDocument();

    // Change Name, Area, Region
    const nameInput = screen.getByTestId('farm-name-input');
    const areaInput = screen.getByTestId('farm-area-input');
    const regionInput = screen.getByTestId('farm-region-input');

    fireEvent.change(nameInput, { target: { value: 'Агрохолдинг «Яблочный Рай»' } });
    fireEvent.change(areaInput, { target: { value: '35.5' } });
    fireEvent.change(regionInput, { target: { value: 'Липецкая область' } });

    // Save
    const saveBtn = screen.getByTestId('save-farm-button');
    fireEvent.click(saveBtn);

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByTestId('edit-farm-modal')).not.toBeInTheDocument();
    });

    // Toast feedback appears
    expect(screen.getByTestId('settings-toast')).toHaveTextContent(
      'Данные хозяйства «Агрохолдинг «Яблочный Рай»» успешно обновлены!'
    );

    // Farm Profile Card updated
    const farmCard = screen.getByTestId('farm-profile-card');
    expect(within(farmCard).getByText('Агрохолдинг «Яблочный Рай»')).toBeInTheDocument();
    expect(within(farmCard).getByText(/35\.5 га/)).toBeInTheDocument();
    expect(within(farmCard).getByText(/Липецкая область/)).toBeInTheDocument();

    // Header immediately updated globally!
    expect(farmSelector).toHaveTextContent('Агрохолдинг «Яблочный Рай»');
    expect(header).toHaveTextContent('Липецкая область • Площадь: 35.5 га');

    // Navigate to Dashboard — Header remains updated!
    fireEvent.click(screen.getByTestId('nav-item-overview'));
    expect(farmSelector).toHaveTextContent('Агрохолдинг «Яблочный Рай»');
    expect(header).toHaveTextContent('Липецкая область • Площадь: 35.5 га');
  });

  it('allows changing timezone and date format in settings', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('nav-item-settings'));

    const tzSelect = screen.getByTestId('select-timezone');
    expect(tzSelect).toHaveValue('(UTC+3) Москва');

    fireEvent.change(tzSelect, { target: { value: '(UTC+0) Лондон' } });
    expect(tzSelect).toHaveValue('(UTC+0) Лондон');

    const dateFormatSelect = screen.getByTestId('select-date-format');
    expect(dateFormatSelect).toHaveValue('ДД.ММ.ГГГГ');

    fireEvent.change(dateFormatSelect, { target: { value: 'ГГГГ-ММ-ДД' } });
    expect(dateFormatSelect).toHaveValue('ГГГГ-ММ-ДД');
  });

  it('displays zero Russian text in English mode across all views', () => {
    render(<App />);

    // 1. Switch to English in Settings
    fireEvent.click(screen.getByTestId('nav-item-settings'));
    const langSelect = screen.getByTestId('select-language');
    fireEvent.change(langSelect, { target: { value: 'English' } });

    // Helper to extract Russian words
    const findRussianWords = (element: HTMLElement) => {
      const text = element.textContent || '';
      const matches = text.match(/[а-яА-ЯёЁ]{2,}/g) || [];
      return Array.from(new Set(matches));
    };

    // Check views
    const views = [
      { tab: 'nav-item-overview', testId: 'dashboard-view', name: 'Dashboard' },
      { tab: 'nav-item-map', testId: 'garden-map-view', name: 'Garden Map' },
      { tab: 'nav-item-data', testId: 'data-entry-view', name: 'Data Entry' },
      { tab: 'nav-item-forecasts', testId: 'forecasts-view', name: 'Forecasts' },
      { tab: 'nav-item-notifications', testId: 'notifications-view', name: 'Notifications' },
      { tab: 'nav-item-support', testId: 'support-view', name: 'Support' },
      { tab: 'nav-item-settings', testId: 'settings-view', name: 'Settings' },
    ];

    for (const view of views) {
      fireEvent.click(screen.getByTestId(view.tab));
      const el = screen.getByTestId(view.testId);
      const russianWords = findRussianWords(el);
      expect(russianWords, `Found Russian words on ${view.name}: ${russianWords.join(', ')}`).toEqual([]);
    }
  });
});
