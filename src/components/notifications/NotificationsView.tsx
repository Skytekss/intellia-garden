import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, BellOff, RotateCcw } from 'lucide-react';
import { NavigationTab, NotificationItem, NotificationFilterTab } from '../../types';
import { mockNotifications } from '../../data/mockNotifications';
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
  initialNotifications = mockNotifications,
  className = '',
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilterTab>('all');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isRead: true,
      }))
    );
  };

  // Open details modal
  const handleOpenDetails = (notification: NotificationItem) => {
    setNotifications((prev) =>
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
          title: 'Угрозы заболеваний не обнаружены',
          description:
            'В вашем саду не зафиксировано признаков заболеваний, парши или вредителей. Мониторинг продолжается в штатном режиме.',
        };
      case 'system':
        return {
          icon: CheckCircle2,
          title: 'Системных оповещений нет',
          description:
            'Все бортовые модули дронов, базовые станции и алгоритмы анализа данных функционируют стабильно.',
        };
      default:
        return {
          icon: BellOff,
          title: 'Уведомлений не найдено',
          description: 'В выбранной категории в настоящее время нет активных оповещений.',
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
            Уведомления
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Оперативные агрономические сводки, риски погоды и рекомендации ИИ
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

      {/* 3. Notifications List or Empty State */}
      <div className="space-y-3.5 min-w-0" data-testid="notifications-list">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3.5">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onNavigate={onNavigate}
                onOpenDetails={handleOpenDetails}
              />
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
              <span>Показать все уведомления</span>
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
