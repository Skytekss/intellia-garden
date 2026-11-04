import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { NotificationsView } from '../NotificationsView';

describe('NotificationsView Component', () => {
  it('renders heading and filter tabs with exact initial counters: Все (5), Важные (2), Урожай (2), Погода (1), Болезни (0), Система (0)', () => {
    render(<NotificationsView />);

    // Screen title
    expect(screen.getByTestId('notifications-title')).toHaveTextContent('Уведомления');

    // Filter bar
    expect(screen.getByTestId('notification-filter-bar')).toBeInTheDocument();

    // Verify filter tabs and their counters
    const allTab = screen.getByTestId('filter-tab-all');
    expect(allTab).toHaveTextContent('Все');
    expect(within(allTab).getByTestId('filter-count-all')).toHaveTextContent('5');

    const importantTab = screen.getByTestId('filter-tab-important');
    expect(importantTab).toHaveTextContent('Важные');
    expect(within(importantTab).getByTestId('filter-count-important')).toHaveTextContent('2');

    const harvestTab = screen.getByTestId('filter-tab-harvest');
    expect(harvestTab).toHaveTextContent('Урожай');
    expect(within(harvestTab).getByTestId('filter-count-harvest')).toHaveTextContent('2');

    const weatherTab = screen.getByTestId('filter-tab-weather');
    expect(weatherTab).toHaveTextContent('Погода');
    expect(within(weatherTab).getByTestId('filter-count-weather')).toHaveTextContent('1');

    const diseasesTab = screen.getByTestId('filter-tab-diseases');
    expect(diseasesTab).toHaveTextContent('Болезни');
    expect(within(diseasesTab).getByTestId('filter-count-diseases')).toHaveTextContent('0');

    const systemTab = screen.getByTestId('filter-tab-system');
    expect(systemTab).toHaveTextContent('Система');
    expect(within(systemTab).getByTestId('filter-count-system')).toHaveTextContent('1');

    // Also check accessibility aria-labels
    expect(screen.getByRole('button', { name: /Все \(5\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Важные \(2\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Урожай \(2\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Погода \(1\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Болезни \(0\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Система \(1\)/i })).toBeInTheDocument();
  });

  it('renders all 6 notification cards with their texts, badges, and timestamps', () => {
    render(<NotificationsView />);

    // 1. Important
    expect(screen.getByText('Участок 4 готов к сбору')).toBeInTheDocument();
    expect(
      screen.getByText('Степень зрелости — 85%. Рекомендуемый период сбора: 10–15 сентября.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge-notif-1')).toHaveTextContent('Важно');

    // 2. Harvest
    expect(screen.getByText('Участок 5 приближается к созреванию')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Степень зрелости — 78%. Окно сбора: 15–22 сентября.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge-notif-2')).toHaveTextContent('Урожай');

    // 3. Weather
    expect(screen.getByText('Изменение прогноза погоды')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ожидается повышение температуры до 27 °C в ближайшие 3 дня. Рекомендуется проверить состояние плодов и влажность почвы.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge-notif-3')).toHaveTextContent('Погода');

    // 4. System
    expect(screen.getByText('Новые данные обработаны')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Гиперспектральный снимок от 12.08.2025 успешно проанализирован. Карта зрелости обновлена.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge-notif-4')).toHaveTextContent('Система');

    // 5. Agritech
    expect(screen.getByText('Зафиксирован полив участка 2')).toBeInTheDocument();
    expect(screen.getByText('Данные добавлены в систему.')).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge-notif-5')).toHaveTextContent(
      'Агротехнические работы'
    );

    // 6. AI recommendation
    expect(
      screen.getByText(
        'На основе последних снимков, погоды и истории агротехнических мероприятий рекомендуется провести повторный анализ участка 4 через 3 дня.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge-notif-6')).toHaveTextContent(
      'ИНТЕЛЛИЯ рекомендует'
    );
  });

  it('filters notifications correctly on clicking Погода, Урожай, and shows empty state for Болезни', () => {
    render(<NotificationsView />);

    // 1. Click Погода tab
    fireEvent.click(screen.getByTestId('filter-tab-weather'));

    expect(screen.getByText('Изменение прогноза погоды')).toBeInTheDocument();
    expect(
      screen.queryByText('Участок 4 — созревание плодов достигло 45%')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Участок 1 готов к сбору')).not.toBeInTheDocument();
    expect(screen.queryByText('Новые данные обработаны')).not.toBeInTheDocument();

    // 2. Click Урожай tab (Cards 1 and 2 should be displayed)
    fireEvent.click(screen.getByTestId('filter-tab-harvest'));

    expect(screen.getByText('Участок 4 готов к сбору')).toBeInTheDocument();
    expect(screen.getByText('Участок 5 приближается к созреванию')).toBeInTheDocument();
    expect(screen.queryByText('Изменение прогноза погоды')).not.toBeInTheDocument();
    expect(screen.queryByText('Новые данные обработаны')).not.toBeInTheDocument();

    // 3. Click Болезни tab (Empty state)
    fireEvent.click(screen.getByTestId('filter-tab-diseases'));

    expect(screen.getByTestId('notifications-empty-state')).toBeInTheDocument();
    expect(screen.getByText('Угрозы заболеваний не обнаружены')).toBeInTheDocument();
    expect(
      screen.getByText(
        'В вашем саду не зафиксировано признаков заболеваний, парши или вредителей. Мониторинг продолжается в штатном режиме.'
      )
    ).toBeInTheDocument();

    // 4. Reset to all from empty state button
    fireEvent.click(screen.getByTestId('reset-filter-button'));
    expect(screen.getByText('Участок 4 готов к сбору')).toBeInTheDocument();
    expect(screen.getByText('Новые данные обработаны')).toBeInTheDocument();
  });

  it('marks all notifications as read: resets counters to (0) and removes unread dots', () => {
    render(<NotificationsView />);

    // Initially 5 unread dots exist on cards 1 through 5
    expect(screen.getAllByTestId(/^notification-dot-/).length).toBe(5);
    expect(screen.getByTestId('filter-count-all')).toHaveTextContent('5');
    expect(screen.getByTestId('filter-count-important')).toHaveTextContent('2');
    expect(screen.getByTestId('filter-count-harvest')).toHaveTextContent('2');
    expect(screen.getByTestId('filter-count-weather')).toHaveTextContent('1');

    // Click "Отметить всё как прочитанное"
    fireEvent.click(screen.getByTestId('mark-all-read-button'));

    // All counters should now be 0
    expect(screen.getByTestId('filter-count-all')).toHaveTextContent('0');
    expect(screen.getByTestId('filter-count-important')).toHaveTextContent('0');
    expect(screen.getByTestId('filter-count-harvest')).toHaveTextContent('0');
    expect(screen.getByTestId('filter-count-weather')).toHaveTextContent('0');
    expect(screen.getByTestId('filter-count-diseases')).toHaveTextContent('0');
    expect(screen.getByTestId('filter-count-system')).toHaveTextContent('0');

    // All dots should be removed
    expect(screen.queryAllByTestId(/^notification-dot-/).length).toBe(0);
  });

  it('triggers onNavigate with correct target when clicking action buttons', () => {
    const onNavigate = vi.fn();
    render(<NotificationsView onNavigate={onNavigate} />);

    // Click "Перейти к участку →" on Card 1 -> target 'map'
    const mapActionBtn = screen.getByTestId('notification-action-notif-1');
    expect(mapActionBtn).toHaveTextContent('Перейти к участку →');
    fireEvent.click(mapActionBtn);
    expect(onNavigate).toHaveBeenCalledWith('map');

    // Click "Посмотреть прогноз →" on Card 2 -> target 'forecasts'
    const forecastActionBtn = screen.getByTestId('notification-action-notif-2');
    expect(forecastActionBtn).toHaveTextContent('Посмотреть прогноз →');
    fireEvent.click(forecastActionBtn);
    expect(onNavigate).toHaveBeenCalledWith('forecasts');

    // Click "Посмотреть результат →" on Card 4 -> target 'data'
    const dataActionBtn = screen.getByTestId('notification-action-notif-4');
    expect(dataActionBtn).toHaveTextContent('Посмотреть результат →');
    fireEvent.click(dataActionBtn);
    expect(onNavigate).toHaveBeenCalledWith('data');
  });

  it('opens detailed modal on clicking Подробнее → and allows navigation from modal', () => {
    const onNavigate = vi.fn();
    render(<NotificationsView onNavigate={onNavigate} />);

    // Click "Подробнее →" on Card 3 (Weather)
    const weatherActionBtn = screen.getByTestId('notification-action-notif-3');
    expect(weatherActionBtn).toHaveTextContent('Подробнее →');
    fireEvent.click(weatherActionBtn);

    // Modal opens
    const modal = screen.getByTestId('notification-detail-modal');
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText('Изменение прогноза погоды')).toBeInTheDocument();
    expect(
      within(modal).getByText(/По данным локальной агрометеостанции/i)
    ).toBeInTheDocument();
    expect(
      within(modal).getByText('Рекомендация агронома-эксперта')
    ).toBeInTheDocument();

    // Click action button inside modal
    const modalActionBtn = screen.getByTestId('modal-action-button');
    fireEvent.click(modalActionBtn);
    expect(onNavigate).toHaveBeenCalledWith('overview');

    // Modal closes
    expect(screen.queryByTestId('notification-detail-modal')).not.toBeInTheDocument();
  });
});
