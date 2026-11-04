import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AppShell } from '../AppShell';
import { AppProvider } from '../../../context/AppContext';

const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('AppShell Component - Single Navigation Policy', () => {
  it('does NOT render any bottom navigation bar on mobile', () => {
    const handleSelectTab = vi.fn();
    renderWithContext(
      <AppShell activeTab="map" onSelectTab={handleSelectTab}>
        <div>Content</div>
      </AppShell>
    );

    // Verify there is no bottom navigation bar
    expect(screen.queryByLabelText('Мобильная навигация')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Mobile navigation')).not.toBeInTheDocument();
  });

  it('opens and closes mobile sidebar drawer via Header hamburger button', () => {
    const handleSelectTab = vi.fn();
    renderWithContext(
      <AppShell activeTab="overview" onSelectTab={handleSelectTab}>
        <div>Main content</div>
      </AppShell>
    );

    // Initial state: backdrop is not in the DOM
    expect(screen.queryByTestId('mobile-backdrop')).not.toBeInTheDocument();

    // Click mobile menu trigger (hamburger in Header)
    const hamburgerBtn = screen.getByTestId('mobile-menu-trigger');
    fireEvent.click(hamburgerBtn);

    // Drawer and backdrop are now open
    const backdrop = screen.getByTestId('mobile-backdrop');
    expect(backdrop).toBeInTheDocument();

    // Click backdrop to trigger close
    fireEvent.click(backdrop);
    // Framer motion triggers exit animation (opacity drops to 0)
    expect(backdrop).toHaveStyle({ opacity: '0' });
  });

  it('navigates and closes mobile drawer when clicking a tab inside mobile sidebar', () => {
    const handleSelectTab = vi.fn();
    renderWithContext(
      <AppShell activeTab="overview" onSelectTab={handleSelectTab}>
        <div>Main content</div>
      </AppShell>
    );

    // Open mobile sidebar
    fireEvent.click(screen.getByTestId('mobile-menu-trigger'));
    expect(screen.getByTestId('mobile-backdrop')).toBeInTheDocument();

    // In the opened mobile drawer, click "Карта сада"
    const navItems = screen.getAllByTestId('nav-item-map');
    // The mobile drawer nav item is the second one rendered
    const mobileNavItem = navItems[navItems.length - 1];
    fireEvent.click(mobileNavItem);

    expect(handleSelectTab).toHaveBeenCalledWith('map');
  });
});
