import React from 'react';
import { HeroBanner } from './HeroBanner';
import { BentoCards } from './BentoCards';
import { CTABar } from './CTABar';
import { NavigationTab } from '../../types';

export interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  className?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  className = '',
}) => {
  const handleSelectBentoCard = (categoryId: string) => {
    if (categoryId === 'drone' || categoryId === 'ai') {
      onNavigate('map');
    } else if (categoryId === 'agritech' || categoryId === 'meteo') {
      onNavigate('data');
    }
  };

  return (
    <div
      data-testid="dashboard-view"
      className={`space-y-6 w-full min-w-0 animate-in fade-in duration-300 ${className}`}
    >
      {/* 1. Hero Banner with golden hour background & animated drone */}
      <HeroBanner onNavigate={onNavigate} />

      {/* 2. 4 Bento Data Cards (Drone, Agritech, Meteo, AI) */}
      <BentoCards onSelectCard={handleSelectBentoCard} />

      {/* 3. CTA Bar: "Перейти к карте сада" */}
      <CTABar onNavigate={onNavigate} />
    </div>
  );
};
