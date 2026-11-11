import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../../../context/AppContext';
import { Header } from '../../layout/Header';
import { SettingsView } from '../../settings/SettingsView';

describe('User Profile Feature & Interactivity', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders interactive avatar button in Header and opens dropdown popover on click', () => {
    render(
      <AppProvider>
        <Header activeTab="overview" />
      </AppProvider>
    );

    const profileButton = screen.getByTestId('user-profile-button');
    expect(profileButton).toBeInTheDocument();
    expect(profileButton).toHaveAttribute('aria-expanded', 'false');

    // Shows default user initials and status dot
    expect(screen.getByText('ЕБ')).toBeInTheDocument();
    expect(screen.getByTestId('header-user-status-dot')).toHaveClass('bg-emerald-500');

    // Click to open popover
    fireEvent.click(profileButton);
    expect(profileButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('user-profile-dropdown')).toBeInTheDocument();
    expect(screen.getByText('e.belova@intellia.agro')).toBeInTheDocument();
  });

  it('allows switching work status in 1 click from dropdown', () => {
    render(
      <AppProvider>
        <Header activeTab="overview" />
      </AppProvider>
    );

    // Open dropdown
    fireEvent.click(screen.getByTestId('user-profile-button'));
    expect(screen.getByTestId('user-profile-dropdown')).toBeInTheDocument();

    // Click 'В саду' (field)
    const fieldButton = screen.getByRole('button', { name: /В саду/i });
    fireEvent.click(fieldButton);

    // Status dot updates to amber
    expect(screen.getByTestId('header-user-status-dot')).toHaveClass('bg-amber-500');
  });

  it('allows switching demo agronomist preset in dropdown', () => {
    render(
      <AppProvider>
        <Header activeTab="overview" />
      </AppProvider>
    );

    // Open dropdown
    fireEvent.click(screen.getByTestId('user-profile-button'));

    // Click Mikhail Sorokin demo preset
    const mikhailBtn = screen.getByRole('button', { name: /Михаил Сорокин/i });
    fireEvent.click(mikhailBtn);

    // Header now reflects Mikhail
    expect(screen.getAllByText('МС').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Михаил Сорокин').length).toBeGreaterThan(0);
  });

  it('opens EditProfileModal and updates profile credentials and persists to localStorage', async () => {
    render(
      <AppProvider>
        <Header activeTab="overview" />
      </AppProvider>
    );

    // Open dropdown
    fireEvent.click(screen.getByTestId('user-profile-button'));

    // Click edit profile
    const editBtn = screen.getByTestId('dropdown-edit-profile-btn');
    fireEvent.click(editBtn);

    // Modal appears
    const modal = screen.getByTestId('edit-profile-modal');
    expect(modal).toBeInTheDocument();

    // Change full name
    const nameInput = screen.getByTestId('input-full-name');
    fireEvent.change(nameInput, { target: { value: 'Екатерина Романова' } });

    // Change phone
    const phoneInput = screen.getByTestId('input-phone');
    fireEvent.change(phoneInput, { target: { value: '+7 (999) 111-22-33' } });

    // Submit form
    const saveBtn = screen.getByTestId('save-profile-btn');
    fireEvent.click(saveBtn);

    // Modal closes and header displays updated user
    await waitFor(() => {
      expect(screen.queryByTestId('edit-profile-modal')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Екатерина Романова')).toBeInTheDocument();
    expect(screen.getByText('ЕР')).toBeInTheDocument();

    // LocalStorage check
    const stored = JSON.parse(localStorage.getItem('intellia_user_profile') || '{}');
    expect(stored.fullName).toBe('Екатерина Романова');
    expect(stored.phone).toBe('+7 (999) 111-22-33');
  });

  it('validates empty name in EditProfileModal', () => {
    render(
      <AppProvider>
        <Header activeTab="overview" />
      </AppProvider>
    );

    fireEvent.click(screen.getByTestId('user-profile-button'));
    fireEvent.click(screen.getByTestId('dropdown-edit-profile-btn'));

    const nameInput = screen.getByTestId('input-full-name');
    fireEvent.change(nameInput, { target: { value: '   ' } });

    fireEvent.click(screen.getByTestId('save-profile-btn'));

    expect(screen.getByText(/Пожалуйста, укажите корректные имя и фамилию/i)).toBeInTheDocument();
    expect(screen.getByTestId('edit-profile-modal')).toBeInTheDocument();
  });

  it('renders UserProfileCard on SettingsView and allows editing', async () => {
    render(
      <AppProvider>
        <SettingsView />
      </AppProvider>
    );

    expect(screen.getByTestId('user-profile-card')).toBeInTheDocument();
    expect(screen.getByText('Елизавета Белова')).toBeInTheDocument();

    const editBtn = screen.getByTestId('edit-user-profile-button');
    fireEvent.click(editBtn);

    expect(screen.getByTestId('edit-profile-modal')).toBeInTheDocument();
  });

  it('closes dropdown when Escape key is pressed', async () => {
    render(
      <AppProvider>
        <Header activeTab="overview" />
      </AppProvider>
    );

    const button = screen.getByTestId('user-profile-button');
    fireEvent.click(button);
    expect(screen.getByTestId('user-profile-dropdown')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByTestId('user-profile-dropdown')).not.toBeInTheDocument();
    });
  });
});
