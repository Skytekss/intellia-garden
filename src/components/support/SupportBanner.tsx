import React from 'react';
import { ArrowRight, Leaf, MessageCircle, Mail } from 'lucide-react';
import supportBotImg from '../../assets/support_bot.jpg';
import { useApp } from '../../context/AppContext';

export interface SupportBannerProps {
  onOpenFeedback?: () => void;
  onOpenChat?: () => void;
  className?: string;
}

export const SupportBanner: React.FC<SupportBannerProps> = ({
  onOpenFeedback,
  onOpenChat,
  className = '',
}) => {
  const { isEnglish } = useApp();
  const handlePrimaryClick = onOpenChat || onOpenFeedback;

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
            alt={isEnglish ? 'INTELLIA AI Assistant' : 'AI Ассистент ИНТЕЛЛИЯ'}
            data-testid="support-bot-avatar"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
          <span
            title={isEnglish ? 'Online' : 'Онлайн'}
            className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {isEnglish ? 'Need Help?' : 'Нужна помощь?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed break-words">
            {isEnglish
              ? 'Our specialists and AI assistant are always ready to answer your questions and solve any issue.'
              : 'Наши специалисты и AI-ассистент всегда готовы ответить на ваши вопросы и помочь решить любую проблему.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
            <button
              type="button"
              data-testid="support-banner-cta-button"
              onClick={handlePrimaryClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {onOpenChat ? (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>{isEnglish ? 'Start Live Chat' : 'Открыть чат с ассистентом'}</span>
                </>
              ) : (
                <>
                  <span>{isEnglish ? 'Contact Support' : 'Написать в поддержку'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {onOpenChat && onOpenFeedback && (
              <button
                type="button"
                data-testid="support-banner-secondary-button"
                onClick={onOpenFeedback}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-300/80 text-emerald-950 bg-white/80 hover:bg-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs hover:border-emerald-400"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isEnglish ? 'Submit Ticket' : 'Оставить заявку'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Stylized script slogan with Leaf icon */}
      <div className="flex items-center justify-center md:justify-end gap-2.5 z-10 shrink-0">
        <span
          data-testid="support-slogan"
          className="font-serif italic text-2xl sm:text-3xl text-[#05382b] font-medium tracking-wide select-none drop-shadow-xs"
        >
          {isEnglish ? 'Have a fruitful harvest!' : 'Успешного урожая!'}
        </span>
        <Leaf className="w-7 h-7 text-emerald-600 shrink-0 transform -rotate-12 animate-pulse" />
      </div>
    </div>
  );
};
