import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { NotificationItem, NavigationTab } from '../../types';
import { useApp } from '../../context/AppContext';

export interface NotificationDetailModalProps {
  notification: NotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: NavigationTab) => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { isEnglish } = useApp();
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!notification) return null;

  const handleAction = () => {
    if (onNavigate) {
      onNavigate(notification.actionTarget);
    }
    onClose();
  };

  const metadataEntries = notification.details?.metadata
    ? Object.entries(notification.details.metadata)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notification-modal-title"
          data-testid="notification-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            data-testid="notification-modal-backdrop"
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden z-10 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                  {notification.badgeText}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{notification.timestamp}</span>
                </div>
              </div>

              <button
                type="button"
                data-testid="close-notification-modal"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label={isEnglish ? 'Close window' : 'Закрыть окно'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <h2
                id="notification-modal-title"
                className="text-lg font-bold text-slate-900 leading-snug"
              >
                {notification.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {notification.details?.fullText || notification.description}
              </p>

              {/* Recommendation Box */}
              {notification.details?.recommendation && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#07503b]">
                      {isEnglish ? 'Expert Agronomist Recommendation' : 'Рекомендация агронома-эксперта'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {notification.details.recommendation}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata Badges */}
              {metadataEntries.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {isEnglish ? 'Alert Parameters' : 'Параметры оповещения'}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {metadataEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                      >
                        <span className="block text-xs text-slate-400 font-medium">{key}</span>
                        <span className="block text-xs font-bold text-slate-800 mt-0.5">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/60 border-t border-slate-100">
              <button
                type="button"
                data-testid="modal-cancel-button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-600 transition-colors cursor-pointer"
              >
                {isEnglish ? 'Close' : 'Закрыть'}
              </button>

              <button
                type="button"
                data-testid="modal-action-button"
                onClick={handleAction}
                className="px-5 py-2 bg-[#07503b] hover:bg-[#096047] active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{notification.actionText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDetailModal;
