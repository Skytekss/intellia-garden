import React from 'react';
import { ArrowRight, Headphones } from 'lucide-react';
import { NavigationTab } from '../../types';

export interface SupportBannerProps {
  onNavigate?: (tab: NavigationTab) => void;
}

export const SupportBanner: React.FC<SupportBannerProps> = ({ onNavigate }) => {
  return (
    <div
      data-testid="support-banner"
      className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow min-w-0"
    >
      {/* Left: AI badge & message */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-full bg-[#05382b] text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 ring-2 ring-emerald-500/20 shadow-xs">
          AI
        </div>

        <div className="min-w-0 space-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            ИНТЕЛЛИЯ всегда рядом
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
            Мы постоянно улучшаем алгоритмы, чтобы ваш сад приносил больше урожая. Если у вас есть вопросы или предложения — напишите нам в поддержку.
          </p>
        </div>
      </div>

      {/* Right: CTA button */}
      <button
        type="button"
        data-testid="contact-support-button"
        onClick={() => onNavigate?.('support')}
        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer shadow-xs shrink-0 self-start md:self-center group"
      >
        <Headphones className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-700 transition-colors" />
        <span>Связаться с поддержкой</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
      </button>
    </div>
  );
};
