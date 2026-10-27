import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import supportBotImg from '../../assets/support_bot.jpg';

export interface SupportBannerProps {
  onOpenFeedback: () => void;
  className?: string;
}

export const SupportBanner: React.FC<SupportBannerProps> = ({
  onOpenFeedback,
  className = '',
}) => {
  return (
    <div
      data-testid="support-banner"
      className={`bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-100/60 border border-emerald-200/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xs min-w-0 ${className}`}
    >
      {/* Decorative background circle */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

      {/* Left Column: Avatar + Text + Button */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left z-10 min-w-0 max-w-2xl">
        <div className="relative shrink-0">
          <img
            src={supportBotImg}
            alt="AI Ассистент ИНТЕЛЛИЯ"
            data-testid="support-bot-avatar"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
          <span
            title="Онлайн"
            className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Нужна помощь?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed break-words">
            Наши специалисты всегда готовы ответить на ваши вопросы и помочь решить любую проблему.
          </p>

          <div className="mt-4">
            <button
              type="button"
              data-testid="support-banner-cta-button"
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Написать в поддержку</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Stylized script slogan with Leaf icon */}
      <div className="flex items-center justify-center md:justify-end gap-2.5 z-10 shrink-0">
        <span
          data-testid="support-slogan"
          className="font-serif italic text-2xl sm:text-3xl text-[#05382b] font-medium tracking-wide select-none drop-shadow-xs"
        >
          Успешного урожая!
        </span>
        <Leaf className="w-7 h-7 text-emerald-600 shrink-0 transform -rotate-12 animate-pulse" />
      </div>
    </div>
  );
};
