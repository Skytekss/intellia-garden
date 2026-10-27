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
