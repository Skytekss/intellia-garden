import React from 'react';

export type SupportCategoryId = 'faq' | 'guides' | 'videos' | 'feedback';

export interface SupportCategoryItem {
  id: SupportCategoryId;
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export type ContactChannelType = 'email' | 'phone' | 'chat' | 'telegram';

export interface ContactChannelItem {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  href?: string;
  type: ContactChannelType;
  icon: React.ElementType;
}

export interface FeedbackFormData {
  category: string;
  subject: string;
  message: string;
  email: string;
  phone?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
}

export interface GuideArticle {
  id: string;
  title: string;
  category: 'uav' | 'spectral' | 'map' | 'hardware';
  categoryLabel: string;
  readTimeMinutes: number;
  summary: string;
  steps: GuideStep[];
  updatedAt: string;
}

export interface VideoChapter {
  timecode: string;
  seconds: number;
  title: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  category: 'overview' | 'drone' | 'forecasts' | 'map';
  categoryLabel: string;
  description: string;
  chapters: VideoChapter[];
}

