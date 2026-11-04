import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DataEntryView } from '../DataEntryView';
import { AppProvider } from '../../../context/AppContext';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('DataEntryView Component', () => {
  it('renders all key elements, headers, subtabs, upload zone, sample card, and widgets', () => {
    renderWithContext(<DataEntryView />);

    // Header & Sub-tabs
    expect(screen.getByRole('heading', { level: 2, name: /Ввод/ })).toBeInTheDocument();
    expect(screen.getByTestId('subtab-spectral')).toHaveTextContent('Гиперспектральные данные');
    expect(screen.getByTestId('subtab-agro')).toHaveTextContent('Агротехнические данные');
    expect(screen.getByTestId('subtab-meteo')).toHaveTextContent('Метеоданные');

    // Hyperspectral Upload Card & Drop Zone
    expect(screen.getByTestId('hyperspectral-upload-card')).toBeInTheDocument();
    expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
    expect(screen.getByText('Загрузите снимки')).toBeInTheDocument();
    expect(screen.getByText(/Перетащите файлы/)).toBeInTheDocument();
    expect(screen.getByTestId('select-files-button')).toHaveTextContent('Выбрать файлы');

    // Spectral Sample Card
    expect(screen.getByTestId('spectral-sample-card')).toBeInTheDocument();
    expect(screen.getByText('Пример снимка')).toBeInTheDocument();
    expect(screen.getByText(/Индекс/)).toBeInTheDocument();
    expect(screen.getByTestId('maturity-gradient-bar')).toBeInTheDocument();
    expect(screen.getByText('1.0')).toBeInTheDocument();
    expect(screen.getByText('0.0')).toBeInTheDocument();

    // Survey Date & Drone Model Inputs
    const dateInput = screen.getByTestId('survey-date-input') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-08-12');

    const droneSelect = screen.getByTestId('drone-model-select') as HTMLSelectElement;
    expect(droneSelect.value).toBe('DJI Mavic 3M');

    // Spectral Channels Checkboxes
    const rgbCheckbox = screen.getByTestId('channel-checkbox-RGB') as HTMLInputElement;
    const nirCheckbox = screen.getByTestId('channel-checkbox-NIR') as HTMLInputElement;
    const redEdgeCheckbox = screen.getByTestId('channel-checkbox-Red Edge') as HTMLInputElement;
    const swirCheckbox = screen.getByTestId('channel-checkbox-SWIR') as HTMLInputElement;

    expect(rgbCheckbox.checked).toBe(true);
    expect(nirCheckbox.checked).toBe(true);
    expect(redEdgeCheckbox.checked).toBe(true);
    expect(swirCheckbox.checked).toBe(true);

    // Agro Widget with initial records
    expect(screen.getByTestId('agro-widget')).toBeInTheDocument();
    expect(screen.getByText('Полив')).toBeInTheDocument();
    expect(screen.getByText('05.07.2025')).toBeInTheDocument();
    expect(screen.getByText('Удобрения')).toBeInTheDocument();
    expect(screen.getByText('15.06.2025')).toBeInTheDocument();
    expect(screen.getByText('Обработка')).toBeInTheDocument();
    expect(screen.getByText('28.06.2025')).toBeInTheDocument();
    expect(screen.getByTestId('add-agro-record-button')).toBeInTheDocument();

    // Meteo Widget with indicators
    expect(screen.getByTestId('meteo-widget')).toBeInTheDocument();
    expect(screen.getByText('22 °C')).toBeInTheDocument();
    expect(screen.getByText('0 мм')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByTestId('import-meteo-button')).toBeInTheDocument();

    // Save and Continue button
    expect(screen.getByTestId('save-and-continue-button')).toHaveTextContent('Сохранить и Продолжить');
  });

  it('allows file selection via input file and shows uploaded files list with remove capability', () => {
    renderWithContext(<DataEntryView />);

    const fileInput = screen.getByTestId('file-upload-input');
    const mockFile1 = new File(['fake drone spectral data 1'], 'ortho_band_rgb.tif', {
      type: 'image/tiff',
    });
    const mockFile2 = new File(['fake drone spectral data 2'], 'nir_index_matrix.tif', {
      type: 'image/tiff',
    });

    // Trigger file change event
    fireEvent.change(fileInput, { target: { files: [mockFile1, mockFile2] } });

    // Both files should now be visible in the uploaded files list
    expect(screen.getByTestId('uploaded-files-list')).toBeInTheDocument();
    expect(screen.getByText('ortho_band_rgb.tif')).toBeInTheDocument();
    expect(screen.getByText('nir_index_matrix.tif')).toBeInTheDocument();
    expect(screen.getByText('Выбрано файлов: 2')).toBeInTheDocument();

    // Remove first file
    const removeBtn0 = screen.getByTestId('remove-file-0');
    fireEvent.click(removeBtn0);

    // Only second file should remain
    expect(screen.queryByText('ortho_band_rgb.tif')).not.toBeInTheDocument();
    expect(screen.getByText('nir_index_matrix.tif')).toBeInTheDocument();
    expect(screen.getByText('Выбрано файлов: 1')).toBeInTheDocument();
  });

  it('toggles spectral channel checkboxes when clicked', () => {
    renderWithContext(<DataEntryView />);

    const rgbCheckbox = screen.getByTestId('channel-checkbox-RGB') as HTMLInputElement;
    expect(rgbCheckbox.checked).toBe(true);

    // Uncheck RGB
    fireEvent.click(rgbCheckbox);
    expect(rgbCheckbox.checked).toBe(false);

    // Check RGB again
    fireEvent.click(rgbCheckbox);
    expect(rgbCheckbox.checked).toBe(true);

    // Uncheck SWIR
    const swirCheckbox = screen.getByTestId('channel-checkbox-SWIR') as HTMLInputElement;
    fireEvent.click(swirCheckbox);
    expect(swirCheckbox.checked).toBe(false);
  });

  it('allows selecting different drone models and survey dates', () => {
    renderWithContext(<DataEntryView />);

    const droneSelect = screen.getByTestId('drone-model-select') as HTMLSelectElement;
    fireEvent.change(droneSelect, { target: { value: 'AgEagle eBee X' } });
    expect(droneSelect.value).toBe('AgEagle eBee X');

    const dateInput = screen.getByTestId('survey-date-input') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2025-08-20' } });
    expect(dateInput.value).toBe('2025-08-20');
  });

  it('opens modal, fills form, and adds a new agro record to the list with toast feedback', async () => {
    renderWithContext(<DataEntryView />);

    // Click "+ Добавить запись"
    const addRecordBtn = screen.getByTestId('add-agro-record-button');
    fireEvent.click(addRecordBtn);

    // Modal should be open
    expect(screen.getByTestId('add-agro-modal')).toBeInTheDocument();
    expect(screen.getByText('Добавить агротехническую запись')).toBeInTheDocument();

    // Fill the modal form
    const typeSelect = screen.getByTestId('operation-type-select');
    fireEvent.change(typeSelect, { target: { value: 'Обрезка' } });

    const titleInput = screen.getByTestId('operation-title-input');
    fireEvent.change(titleInput, { target: { value: 'Летняя чеканка побегов' } });

    const dateInput = screen.getByTestId('operation-date-input');
    fireEvent.change(dateInput, { target: { value: '2025-08-14' } });

    const sectorSelect = screen.getByTestId('operation-sector-select');
    fireEvent.change(sectorSelect, { target: { value: 'Участок 1' } });

    const notesInput = screen.getByTestId('operation-notes-input');
    fireEvent.change(notesInput, { target: { value: 'Осветление кроны для инсоляции плодов' } });

    // Submit form
    const submitBtn = screen.getByTestId('submit-agro-record');
    fireEvent.click(submitBtn);

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByTestId('add-agro-modal')).not.toBeInTheDocument();
    });

    // New item should be present in agro list
    expect(screen.getByText('Летняя чеканка побегов')).toBeInTheDocument();
    expect(screen.getByText('14.08.2025')).toBeInTheDocument();

    // Toast notification should be displayed
    expect(screen.getByTestId('toast-notification')).toHaveTextContent(
      'Запись «Летняя чеканка побегов» успешно добавлена в агрожурнал!'
    );
  });

  it('cancels modal without adding a record when clicking cancel or close button', async () => {
    renderWithContext(<DataEntryView />);

    // Open modal
    fireEvent.click(screen.getByTestId('add-agro-record-button'));
    expect(screen.getByTestId('add-agro-modal')).toBeInTheDocument();

    // Click cancel button
    fireEvent.click(screen.getByTestId('cancel-agro-modal'));
    await waitFor(() => {
      expect(screen.queryByTestId('add-agro-modal')).not.toBeInTheDocument();
    });

    // Open modal again and close with X button
    fireEvent.click(screen.getByTestId('add-agro-record-button'));
    expect(screen.getByTestId('add-agro-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-agro-modal'));
    await waitFor(() => {
      expect(screen.queryByTestId('add-agro-modal')).not.toBeInTheDocument();
    });
  });

  it('triggers import action and shows success notification when clicking import meteo data', () => {
    renderWithContext(<DataEntryView />);

    const importBtn = screen.getByTestId('import-meteo-button');
    fireEvent.click(importBtn);

    // Toast feedback should appear
    expect(screen.getByTestId('toast-notification')).toHaveTextContent(
      'Метеоданные успешно синхронизированы с метеостанцией!'
    );
  });

  it('calls onNavigate callback and shows toast when clicking "Сохранить и Продолжить →"', () => {
    const handleNavigate = vi.fn();
    renderWithContext(<DataEntryView onNavigate={handleNavigate} />);

    const continueBtn = screen.getByTestId('save-and-continue-button');
    fireEvent.click(continueBtn);

    // onNavigate should have been called
    expect(handleNavigate).toHaveBeenCalledWith('forecasts');

    // Toast feedback should appear
    expect(screen.getByTestId('toast-notification')).toBeInTheDocument();
  });

  it('allows switching subtabs between spectral, agro, and meteo and shows corresponding views', () => {
    renderWithContext(<DataEntryView />);

    const spectralTab = screen.getByTestId('subtab-spectral');
    const agroTab = screen.getByTestId('subtab-agro');
    const meteoTab = screen.getByTestId('subtab-meteo');

    // Initial state: spectral
    expect(screen.getByTestId('subtab-spectral-content')).toBeInTheDocument();
    expect(screen.getByTestId('hyperspectral-upload-card')).toBeInTheDocument();

    // Switch to Agro subtab
    fireEvent.click(agroTab);
    expect(agroTab).toHaveClass('border-emerald-700');
    expect(screen.getByTestId('subtab-agro-content')).toBeInTheDocument();
    expect(screen.getByTestId('streif-index-calculator')).toBeInTheDocument();

    // Switch to Meteo subtab
    fireEvent.click(meteoTab);
    expect(meteoTab).toHaveClass('border-emerald-700');
    expect(screen.getByTestId('subtab-meteo-content')).toBeInTheDocument();
    expect(screen.getByTestId('meteo-advanced-station')).toBeInTheDocument();

    // Switch back to Spectral
    fireEvent.click(spectralTab);
    expect(spectralTab).toHaveClass('border-emerald-700');
    expect(screen.getByTestId('subtab-spectral-content')).toBeInTheDocument();
  });

  it('respects URL query parameter subtab for deep linking', () => {
    // Set query string to ?subtab=agro
    window.history.replaceState(null, '', '/?subtab=agro');
    renderWithContext(<DataEntryView />);

    expect(screen.getByTestId('subtab-agro-content')).toBeInTheDocument();
    expect(screen.getByTestId('streif-index-calculator')).toBeInTheDocument();

    // Reset URL
    window.history.replaceState(null, '', '/');
  });
});
