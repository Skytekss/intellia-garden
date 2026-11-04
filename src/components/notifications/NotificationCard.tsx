import React from 'react';
import { motion } from 'motion/react';
import {
  Apple,
  Sprout,
  Sun,
  Plane,
  Droplets,
} from 'lucide-react';
import { NotificationItem, NavigationTab } from '../../types';
import { useApp } from '../../context/AppContext';

export interface NotificationCardProps {
  notification: NotificationItem;
  onNavigate?: (tab: NavigationTab) => void;
  onOpenDetails?: (notification: NotificationItem) => void;
  className?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onNavigate,
  onOpenDetails,
  className = '',
}) => {
  const { isEnglish, markNotificationRead } = useApp();
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationRead(notification.id);
    if (notification.actionText.includes('Подробнее') || notification.actionText.includes('Details')) {
      if (onOpenDetails) {
        onOpenDetails(notification);
      } else if (onNavigate) {
        onNavigate(notification.actionTarget);
      }
    } else if (onNavigate) {
      onNavigate(notification.actionTarget);
    }
  };

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(notification);
    }
  };

  // Icon configuration
  const renderIcon = () => {
    switch (notification.iconType) {
      case 'apple':
        return (
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 shadow-xs border border-red-100/60">
            <Apple className="w-6 h-6 fill-red-500/20" />
          </div>
        );
      case 'harvest':
        return (
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100/60">
            <Sprout className="w-6 h-6" />
          </div>
        );
      case 'weather':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 shadow-xs border border-amber-100/60">
            <Sun className="w-6 h-6 fill-amber-500/20" />
          </div>
        );
      case 'system':
        return (
          <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center shrink-0 shadow-xs border border-sky-100/60">
            <Plane className="w-6 h-6 -rotate-45" />
          </div>
        );
      case 'agritech':
        return (
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 shadow-xs border border-teal-100/60">
            <Droplets className="w-6 h-6" />
          </div>
        );
      case 'ai':
        return (
          <div className="w-12 h-12 rounded-full bg-[#05382b] text-white flex items-center justify-center shrink-0 shadow-xs border border-emerald-900/40">
            <span className="text-xs font-black tracking-wider uppercase text-emerald-300">AI</span>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
        );
    }
  };

  // Badge styles
  const getBadgeClass = () => {
    switch (notification.category) {
      case 'important':
        return 'bg-red-50 text-red-700 border-red-200/80';
      case 'harvest':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'weather':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'system':
        return 'bg-sky-50 text-sky-800 border-sky-200/80';
      case 'agritech':
        return 'bg-teal-50 text-teal-800 border-teal-200/80';
      case 'ai':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300/80 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Dot styles
  const getDotClass = () => {
    switch (notification.dotColor) {
      case 'red':
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'green':
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      case 'amber':
        return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'blue':
        return 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]';
      case 'teal':
        return 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]';
      default:
        return 'bg-emerald-500';
    }
  };

  const showDot = !notification.isRead && notification.dotColor && notification.dotColor !== 'none';

  return (
    <motion.div
      data-testid={`notification-card-${notification.id}`}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={handleCardClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow cursor-pointer select-none w-full min-w-0 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
        {/* Left and Middle Content */}
        <div className="flex items-start gap-3.5 sm:gap-4 w-full min-w-0 flex-1">
          {renderIcon()}

          <div className="flex-1 min-w-0">
            {/* Category Badge & Timestamp on mobile */}
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1.5">
              <span
                data-testid={`notification-badge-${notification.id}`}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeClass()}`}
              >
                {notification.badgeText}
              </span>

              {/* Mobile timestamp and dot */}
              <div className="flex sm:hidden items-center gap-1.5 shrink-0">
                <span className="text-xs text-slate-400 font-normal">
                  {notification.timestamp}
                </span>
                {showDot && (
                  <span
                    data-testid={`mobile-dot-${notification.id}`}
                    aria-label={isEnglish ? 'Unread' : 'Непрочитано'}
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDotClass()}`}
                  />
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
              {notification.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed break-words">
              {notification.description}
            </p>
          </div>
        </div>

        {/* Right Section (Desktop Timestamp, Dot, and Action Button) */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0 sm:self-stretch pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Desktop timestamp and dot */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-normal">
              {notification.timestamp}
            </span>
            {showDot && (
              <span
                data-testid={`notification-dot-${notification.id}`}
                aria-label={isEnglish ? 'Unread' : 'Непрочитано'}
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDotClass()}`}
              />
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            data-testid={`notification-action-${notification.id}`}
            onClick={handleActionClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#07503b] hover:bg-[#096047] active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
          >
            {notification.actionText}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
