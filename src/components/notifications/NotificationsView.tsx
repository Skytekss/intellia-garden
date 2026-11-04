import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, BellOff, RotateCcw } from 'lucide-react';
import { NavigationTab, NotificationItem, NotificationFilterTab } from '../../types';
import { useApp } from '../../context/AppContext';
import { getLocalizedNotifications } from '../../context/localizedData';
import { NotificationCard } from './NotificationCard';
import { NotificationFilterBar } from './NotificationFilterBar';
import { NotificationDetailModal } from './NotificationDetailModal';

export interface NotificationsViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  initialNotifications?: NotificationItem[];
  className?: string;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onNavigate,
  initialNotifications,
  className = '',
}) => {
  const {
    isEnglish,
    t,
    notifications: contextNotifications,
    notificationSettings,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const [rawNotifications, setRawNotifications] = useState<NotificationItem[]>(() =>
    initialNotifications || contextNotifications
  );

  useEffect(() => {
    if (initialNotifications) {
      setRawNotifications(initialNotifications);
    } else if (contextNotifications) {
      setRawNotifications(contextNotifications);
    }
  }, [initialNotifications, contextNotifications]);

  const notifications = getLocalizedNotifications(isEnglish, rawNotifications);

  const [activeFilter, setActiveFilter] = useState<NotificationFilterTab>('all');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCategoryMuted = (cat: NotificationFilterTab): boolean => {
    if (cat === 'harvest' && notificationSettings?.harvestAndMaturity === false) return true;
    if (cat === 'weather' && notificationSettings?.weatherConditions === false) return true;
    if (cat === 'system' && notificationSettings?.systemUpdates === false) return true;
    return false;
  };

  // Compute counters
  const counts: Record<NotificationFilterTab, number> = {
    all: notifications.filter((n) => !n.isRead).length,
    important: notifications.filter((n) => !n.isRead && n.filterCategories?.includes('important')).length,
    harvest: notifications.filter((n) => !n.isRead && n.filterCategories?.includes('harvest')).length,
    weather: notifications.filter((n) => !n.isRead && n.filterCategories?.includes('weather')).length,
    diseases: notifications.filter((n) => !n.isRead && n.filterCategories?.includes('diseases')).length,
    system: notifications.filter((n) => !n.isRead && n.filterCategories?.includes('system')).length,
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.filterCategories?.includes(activeFilter);
  });

  // Mark all as read
  const handleMarkAllAsRead = () => {
    markAllNotificationsRead();
    setRawNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Open details modal
  const handleOpenDetails = (notification: NotificationItem) => {
    markNotificationRead(notification.id);
    setRawNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  // Empty state title and message
  const getEmptyStateContent = () => {
    switch (activeFilter) {
      case 'diseases':
        return {
          icon: ShieldCheck,
          title: isEnglish ? 'No disease threats detected' : 'Угрозы заболеваний не обнаружены',
          description:
            isEnglish
              ? 'No signs of diseases, scab, or pests have been detected in your orchard. Monitoring continues normally.'
              : 'В вашем саду не зафиксировано признаков заболеваний, парши или вредителей. Мониторинг продолжается в штатном режиме.',
        };
      case 'system':
        return {
          icon: CheckCircle2,
          title: isEnglish ? 'No system alerts' : 'Системных оповещений нет',
          description:
            isEnglish
              ? 'All onboard drone modules, base stations, and data analysis algorithms are operating stably.'
              : 'Все бортовые модули дронов, базовые станции и алгоритмы анализа данных функционируют стабильно.',
        };
      default:
        return {
          icon: BellOff,
          title: isEnglish ? 'No notifications found' : 'Уведомлений не найдено',
          description: isEnglish
            ? 'There are currently no active alerts in the selected category.'
            : 'В выбранной категории в настоящее время нет активных оповещений.',
        };
    }
  };

  const emptyState = getEmptyStateContent();
  const EmptyIcon = emptyState.icon;

  return (
    <div
      data-testid="notifications-view"
      className={`space-y-6 w-full min-w-0 ${className}`}
    >
      {/* 1. Header with Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            data-testid="notifications-title"
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            {t('notif.title') || 'Уведомления'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isEnglish
              ? 'Operational agronomical briefings, weather risks, and AI recommendations'
              : 'Оперативные агрономические сводки, риски погоды и рекомендации ИИ'}
          </p>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <NotificationFilterBar
        activeTab={activeFilter}
        onSelectTab={setActiveFilter}
        counts={counts}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Muted Category Notice */}
      {isCategoryMuted(activeFilter) && (
        <div
          data-testid="category-muted-notice"
          className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <BellOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isEnglish
                ? 'Notifications for this category are muted in Settings'
                : 'Оповещения для этой категории отключены в Настройках'}
            </span>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              {isEnglish ? 'Settings →' : 'Настройки →'}
            </button>
          )}
        </div>
      )}

      {/* 3. Notifications List or Empty State */}
      <div className="space-y-3.5 min-w-0" data-testid="notifications-list">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3.5">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="animate-in fade-in duration-200"
              >
                <NotificationCard
                  notification={notification}
                  onNavigate={onNavigate}
                  onOpenDetails={handleOpenDetails}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            data-testid="notifications-empty-state"
            className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4 shadow-2xs">
              <EmptyIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {emptyState.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed">
              {emptyState.description}
            </p>
            <button
              type="button"
              data-testid="reset-filter-button"
              onClick={() => setActiveFilter('all')}
              className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-[#07503b] border border-emerald-200/70 text-xs font-semibold rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEnglish ? 'Show all notifications' : 'Показать все уведомления'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Details Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default NotificationsView;
