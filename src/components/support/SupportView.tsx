import React, { useState } from 'react';
import type { NavigationTab } from '../../types';
import { SupportCategoryId } from './types';
import { SupportCategoryCards } from './SupportCategoryCards';
import { FaqAccordion } from './FaqAccordion';
import { ContactChannels } from './ContactChannels';
import { SupportBanner } from './SupportBanner';
import { FeedbackModal } from './FeedbackModal';
import { ChatModal } from './ChatModal';
import { GuidesModal } from './GuidesModal';
import { VideoTutorialsModal } from './VideoTutorialsModal';
import { useApp } from '../../context/AppContext';

export interface SupportViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  className?: string;
}

export const SupportView: React.FC<SupportViewProps> = ({
  onNavigate,
  className = '',
}) => {
  const { isEnglish, t } = useApp();
  const defaultCategory = isEnglish ? 'Platform functionality question' : 'Вопрос по функционалу платформы';
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<string>(defaultCategory);

  React.useEffect(() => {
    setFeedbackCategory(defaultCategory);
  }, [defaultCategory]);

  const handleSelectCategory = (categoryId: SupportCategoryId) => {
    if (categoryId === 'faq') {
      const faqElem = document.getElementById('faq-section');
      if (faqElem) {
        faqElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (categoryId === 'feedback') {
      setFeedbackCategory(defaultCategory);
      setIsFeedbackOpen(true);
    } else if (categoryId === 'guides') {
      setIsGuidesOpen(true);
    } else if (categoryId === 'videos') {
      setIsVideoOpen(true);
    }
  };

  const handleOpenFeedbackModal = () => {
    setFeedbackCategory(defaultCategory);
    setIsFeedbackOpen(true);
  };

  const handleOpenChatModal = () => {
    setIsChatOpen(true);
  };

  return (
    <div
      data-testid="support-view"
      className={`space-y-6 sm:space-y-8 w-full min-w-0 animate-in fade-in duration-300 ${className}`}
    >
      {/* 1. Header Section */}
      <div className="pb-1 border-b border-slate-200/60">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {t('nav.support') || 'Поддержка'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-snug">
          {isEnglish
            ? 'We are always by your side to help you care for your orchard'
            : 'Мы всегда рядом, чтобы помочь вам заботиться о вашем саде'}
        </p>
        {onNavigate && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5">
            <span className="text-xs text-slate-400">{isEnglish ? 'Quick links:' : 'Быстрый переход:'}</span>
            <button
              type="button"
              onClick={() => onNavigate('map')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              {isEnglish ? 'Garden Map' : 'Карта сада'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => onNavigate('data')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              {isEnglish ? 'Agro Data' : 'Данные'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              {isEnglish ? 'Settings' : 'Настройки'}
            </button>
          </div>
        )}
      </div>

      {/* 2. Top Row: 4 Category Cards */}
      <SupportCategoryCards onSelectCategory={handleSelectCategory} />

      {/* 3. Middle Row: FAQ (8 cols) + Contacts (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
        <div className="lg:col-span-8 min-w-0">
          <FaqAccordion />
        </div>

        <div className="lg:col-span-4 min-w-0">
          <ContactChannels onOpenChat={handleOpenChatModal} />
        </div>
      </div>

      {/* 4. Bottom Row: Banner with Bot & Slogan */}
      <SupportBanner
        onOpenChat={handleOpenChatModal}
        onOpenFeedback={handleOpenFeedbackModal}
      />

      {/* 5. Modals - mounted on demand to avoid background timers and state */}
      {isFeedbackOpen && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          initialCategory={feedbackCategory}
        />
      )}

      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {isGuidesOpen && (
        <GuidesModal
          isOpen={isGuidesOpen}
          onClose={() => setIsGuidesOpen(false)}
        />
      )}

      {isVideoOpen && (
        <VideoTutorialsModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </div>
  );
};
