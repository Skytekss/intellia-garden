import React, { useState } from 'react';
import type { NavigationTab } from '../../types';
import { SupportCategoryId } from './types';
import { SupportCategoryCards } from './SupportCategoryCards';
import { FaqAccordion } from './FaqAccordion';
import { ContactChannels } from './ContactChannels';
import { SupportBanner } from './SupportBanner';
import { FeedbackModal } from './FeedbackModal';
import { ChatModal } from './ChatModal';

export interface SupportViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  className?: string;
}

export const SupportView: React.FC<SupportViewProps> = ({
  className = '',
}) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<string>('Вопрос по функционалу платформы');

  const handleSelectCategory = (categoryId: SupportCategoryId) => {
    if (categoryId === 'faq') {
      const faqElem = document.getElementById('faq-section');
      if (faqElem) {
        faqElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (categoryId === 'feedback') {
      setFeedbackCategory('Вопрос по функционалу платформы');
      setIsFeedbackOpen(true);
    } else if (categoryId === 'guides') {
      setFeedbackCategory('Вопрос по функционалу платформы');
      setIsFeedbackOpen(true);
    } else if (categoryId === 'videos') {
      setFeedbackCategory('Вопрос по функционалу платформы');
      setIsFeedbackOpen(true);
    }
  };

  const handleOpenFeedbackModal = () => {
    setFeedbackCategory('Вопрос по функционалу платформы');
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
          Поддержка
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-snug">
          Мы всегда рядом, чтобы помочь вам заботиться о вашем саде
        </p>
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
      <SupportBanner onOpenFeedback={handleOpenFeedbackModal} />

      {/* 5. Modals */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        initialCategory={feedbackCategory}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
