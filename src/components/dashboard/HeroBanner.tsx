import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Radio, ArrowUpRight } from 'lucide-react';
import heroBannerClean from '../../assets/hero_banner_clean.png';
import { NavigationTab } from '../../types';

export interface HeroBannerProps {
  onNavigate?: (tab: NavigationTab) => void;
  className?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigate,
  className = '',
}) => {
  return (
    <section
      data-testid="hero-banner"
      className={`relative w-full rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-lg border border-emerald-950/20 bg-[#05382b] text-white min-h-[300px] sm:min-h-[340px] flex items-center ${className}`}
    >
      {/* 1. Panoramic Sunset Orchard with Drone Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={heroBannerClean}
          alt="Яблоневый сад в золотой час с дроном"
          className="w-full h-full object-cover object-right sm:object-center"
        />
        {/* Soft edge darkening for mobile text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05382b] via-[#05382b]/80 to-transparent sm:via-transparent" />
      </div>

      {/* 2. Content Layout */}
      <div className="relative z-10 w-full min-w-0 px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        {/* Left Side: Branding, Titles, Descriptions, Metrics */}
        <div className="w-full min-w-0 sm:max-w-xl text-left">
          {/* Status Chip */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm mb-2.5 sm:mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Агроклиматический AI-мониторинг</span>
            <span className="hidden sm:inline text-emerald-300/40">•</span>
            <span className="hidden sm:inline text-emerald-200/80">Сезон 2025</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
            ИНТЕЛЛИЯ
          </h1>

          {/* Subtitle */}
          <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-emerald-200 mt-1.5 sm:mt-2.5 leading-snug">
            Прогнозирование сроков сбора урожая яблок
          </h2>

          {/* Detailed Description */}
          <p className="text-xs sm:text-sm text-slate-100/90 mt-2 sm:mt-3 leading-relaxed max-w-lg">
            Гиперспектральные данные, агротехника, метеоданные и ИИ — для точного прогнозирования зрелости и оптимальных сроков сбора плодов.
          </p>

          {/* Feature Badges */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 text-white font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Точность: 94.6%</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/35 backdrop-blur-md border border-white/15 text-white font-medium">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>5 секторов</span>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('map')}
                className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 hover:text-white transition-colors cursor-pointer"
              >
                <span>Интерактивная карта</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Drone telemetry floating badge positioned in the sky */}
        <div className="hidden md:flex flex-col items-end justify-center self-end md:self-auto mb-2 md:mb-0 mr-4 lg:mr-8">
          <motion.div
            data-testid="hero-drone-motion"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-xs text-emerald-200 font-medium backdrop-blur-md shadow-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Дрон в воздухе • Спектральная съемка</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
