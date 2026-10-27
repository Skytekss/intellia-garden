import React from 'react';
import { Leaf, ArrowRight, MapPin } from 'lucide-react';
import { NavigationTab } from '../../types';
import { useApp } from '../../context/AppContext';

export interface CTABarProps {
  onNavigate: (tab: NavigationTab) => void;
  className?: string;
}

export const CTABar: React.FC<CTABarProps> = ({
  onNavigate,
  className = '',
}) => {
  const { isEnglish } = useApp();

  return (
    <div className={`w-full ${className}`}>
      <button
        type="button"
        data-testid="cta-go-to-map"
        onClick={() => onNavigate('map')}
        className="w-full bg-[#07503b] hover:bg-[#096047] active:scale-[0.995] text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg shadow-emerald-950/15 transition-all duration-200 cursor-pointer group text-left"
        aria-label={isEnglish ? 'Go to Garden Map' : 'Перейти к карте сада'}
      >
        {/* Left Side: Leaf icon & Titles */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-emerald-300 group-hover:scale-105 group-hover:bg-white/15 transition-all">
            <Leaf className="w-6 h-6" />
          </div>

          <div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{isEnglish ? 'Go to Garden Map' : 'Перейти к карте сада'}</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                {isEnglish ? 'Interactive' : 'Интерактивно'}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-emerald-200/80 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {isEnglish ? 'Visualization of 5 sectors' : 'Визуализация 5 секторов'}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">
                {isEnglish ? 'Apple varieties & maturity progress' : 'Сорта яблок и процент готовности'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Arrow button circle */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-emerald-900 group-hover:translate-x-1 transition-all duration-200 shrink-0 ml-3">
          <ArrowRight className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
};
