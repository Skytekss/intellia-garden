import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { SettingsView } from '../SettingsView';

describe('SettingsView Component', () => {
  it('renders page header and all core cards and banner', () => {
    render(<SettingsView />);

    // Page title
    expect(
      screen.getByRole('heading', { level: 1, name: 'Настройки' })
    ).toBeInTheDocument();

    // 5 main cards
    expect(screen.getByTestId('general-settings-card')).toBeInTheDocument();
    expect(screen.getByTestId('sensors-card')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-card')).toBeInTheDocument();
    expect(screen.getByTestId('data-management-card')).toBeInTheDocument();
    expect(screen.getByTestId('farm-profile-card')).toBeInTheDocument();

    // Support banner
    expect(screen.getByTestId('support-banner')).toBeInTheDocument();
  });

  it('allows changing general settings dropdowns (language, unit, timezone, date format)', () => {
    render(<SettingsView />);

    // Language
    const langSelect = screen.getByTestId('select-language') as HTMLSelectElement;
    expect(langSelect.value).toBe('Русский');
    fireEvent.change(langSelect, { target: { value: 'English' } });
    expect(langSelect.value).toBe('English');

    // Units
    const unitSelect = screen.getByTestId('select-measurement-unit') as HTMLSelectElement;
    expect(unitSelect.value).toBe('Метрическая (°C, мм, га)');
    fireEvent.change(unitSelect, { target: { value: 'Имперская (°F, дюймы, акры)' } });
    expect(unitSelect.value).toBe('Имперская (°F, дюймы, акры)');

    // Timezone
    const tzSelect = screen.getByTestId('select-timezone') as HTMLSelectElement;
    expect(tzSelect.value).toBe('(UTC+3) Москва');
    fireEvent.change(tzSelect, { target: { value: '(UTC+4) Самара' } });
    expect(tzSelect.value).toBe('(UTC+4) Самара');

    // Date format
    const dateFormatSelect = screen.getByTestId('select-date-format') as HTMLSelectElement;
    expect(dateFormatSelect.value).toBe('ДД.ММ.ГГГГ');
    fireEvent.change(dateFormatSelect, { target: { value: 'ГГГГ-ММ-ДД' } });
    expect(dateFormatSelect.value).toBe('ГГГГ-ММ-ДД');
  });

  it('displays all 4 hardware sensors and opens HardwareModal on click', async () => {
    render(<SettingsView />);

    // Check sensors card
    const sensorsCard = screen.getByTestId('sensors-card');
    expect(within(sensorsCard).getByText('Метеостанция')).toBeInTheDocument();
    expect(within(sensorsCard).getByText('Датчики влажности почвы')).toBeInTheDocument();
    expect(within(sensorsCard).getByText('Камеры')).toBeInTheDocument();
    expect(within(sensorsCard).getByText('Гиперспектральный модуль')).toBeInTheDocument();

    // Check status banner
    expect(screen.getByText('Все датчики работают нормально')).toBeInTheDocument();

    // Open Hardware modal via button
    const configureButton = screen.getByTestId('configure-hardware-button');
    fireEvent.click(configureButton);

    const hardwareModal = screen.getByTestId('hardware-modal');
    expect(hardwareModal).toBeInTheDocument();
    expect(
      within(hardwareModal).getByRole('heading', { level: 3, name: 'Датчики и оборудование' })
    ).toBeInTheDocument();

    // Verify models in modal
    expect(screen.getByText(/Davis Vantage Pro2 Plus/i)).toBeInTheDocument();
    expect(screen.getByText(/Sentek Drill & Drop/i)).toBeInTheDocument();
    expect(screen.getByText(/Hikvision Solar PTZ 4K/i)).toBeInTheDocument();
    expect(screen.getByText(/Cubert Ultris X20 Plus/i)).toBeInTheDocument();

    // Test refreshing sensors in modal
    const refreshButton = screen.getByTestId('refresh-hardware-button');
    fireEvent.click(refreshButton);
    expect(refreshButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByTestId('hardware-refresh-message')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Close modal
    const closeBtn = screen.getByTestId('close-hardware-modal');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('hardware-modal')).not.toBeInTheDocument();
    });
  });

  it('allows toggling notification preferences', () => {
    render(<SettingsView />);

    const harvestToggle = screen.getByTestId('toggle-harvestAndMaturity');
    expect(harvestToggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(harvestToggle);
    expect(harvestToggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(harvestToggle);
    expect(harvestToggle).toHaveAttribute('aria-checked', 'true');

    const weatherToggle = screen.getByTestId('toggle-weatherConditions');
    expect(weatherToggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(weatherToggle);
    expect(weatherToggle).toHaveAttribute('aria-checked', 'false');
  });

  it('handles data management toggles, retention select, and backup creation', async () => {
    render(<SettingsView />);

    // Auto sync toggle
    const autoSyncToggle = screen.getByTestId('toggle-auto-sync');
    expect(autoSyncToggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(autoSyncToggle);
    expect(autoSyncToggle).toHaveAttribute('aria-checked', 'false');

    // Retention period select
    const retentionSelect = screen.getByTestId('select-retention-period') as HTMLSelectElement;
    expect(retentionSelect.value).toBe('30 дней');
    fireEvent.change(retentionSelect, { target: { value: '60 дней' } });
    expect(retentionSelect.value).toBe('60 дней');

    // Backup button
    const backupButton = screen.getByTestId('create-backup-button');
    expect(backupButton).toHaveTextContent('Создать резервную копию');

    fireEvent.click(backupButton);
    expect(backupButton).toHaveTextContent('Создание...');

    await waitFor(() => {
      expect(backupButton).toHaveTextContent('Копия создана!');
    }, { timeout: 2000 });

    // Should also show toast
    expect(screen.getByTestId('settings-toast')).toBeInTheDocument();
  });

  it('allows opening EditFarmModal and updating farm profile details', async () => {
    render(<SettingsView />);

    // Verify initial farm profile
    expect(screen.getByText('Ферма «Золотой Сад»')).toBeInTheDocument();
    expect(screen.getByText('Площадь: 4.2 га')).toBeInTheDocument();
    expect(screen.getByText('Регион: Тульская область')).toBeInTheDocument();

    // Click edit button
    const editBtn = screen.getByTestId('edit-farm-button');
    fireEvent.click(editBtn);

    const editModal = screen.getByTestId('edit-farm-modal');
    expect(editModal).toBeInTheDocument();

    // Edit fields
    const nameInput = screen.getByTestId('farm-name-input');
    const areaInput = screen.getByTestId('farm-area-input');
    const regionInput = screen.getByTestId('farm-region-input');

    fireEvent.change(nameInput, { target: { value: 'Сады Придонья — Центр' } });
    fireEvent.change(areaInput, { target: { value: '8.5' } });
    fireEvent.change(regionInput, { target: { value: 'Волгоградская область' } });

    // Submit form
    const saveBtn = screen.getByTestId('save-farm-button');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('edit-farm-modal')).not.toBeInTheDocument();
    });

    // Verify updated values in profile card
    expect(screen.getByText('Сады Придонья — Центр')).toBeInTheDocument();
    expect(screen.getByText('Площадь: 8.5 га')).toBeInTheDocument();
    expect(screen.getByText('Регион: Волгоградская область')).toBeInTheDocument();

    // Verify success toast
    expect(screen.getByTestId('settings-toast')).toHaveTextContent(
      'Данные хозяйства «Сады Придонья — Центр» успешно обновлены!'
    );
  });

  it('validates farm profile form input in EditFarmModal', () => {
    render(<SettingsView />);

    const editBtn = screen.getByTestId('edit-farm-button');
    fireEvent.click(editBtn);

    const nameInput = screen.getByTestId('farm-name-input');
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveBtn = screen.getByTestId('save-farm-button');
    fireEvent.click(saveBtn);

    // Validation error should appear
    expect(screen.getByTestId('edit-farm-error')).toHaveTextContent(
      'Название хозяйства не может быть пустым'
    );
  });

  it('navigates to support when clicking button in SupportBanner', () => {
    const handleNavigate = vi.fn();
    render(<SettingsView onNavigate={handleNavigate} />);

    const supportBtn = screen.getByTestId('contact-support-button');
    fireEvent.click(supportBtn);

    expect(handleNavigate).toHaveBeenCalledWith('support');
  });
});
