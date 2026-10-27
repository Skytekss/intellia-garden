import React from 'react';
import { Check } from 'lucide-react';
import { NotificationFilterTab } from '../../types';

export interface FilterTabConfig {
  id: NotificationFilterTab;
  label: string;
}

export const FILTER_TABS: FilterTabConfig[] = [
  { id: 'all', label: 'Все' },
  { id: 'important', label: 'Важные' },
  { id: 'harvest', label: 'Урожай' },
  { id: 'weather', label: 'Погода' },
  { id: 'diseases', label: 'Болезни' },
  { id: 'system', label: 'Система' },
];

export interface NotificationFilterBarProps {
  activeTab: NotificationFilterTab;
  onSelectTab: (tab: NotificationFilterTab) => void;
  counts: Record<NotificationFilterTab, number>;
  onMarkAllAsRead: () => void;
  className?: string;
}

export const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
  activeTab,
  onSelectTab,
  counts,
  onMarkAllAsRead,
  className = '',
}) => {
  return (
    <div
      data-testid="notification-filter-bar"
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0 ${className}`}
    >
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`filter-tab-${tab.id}`}
              aria-label={`${tab.label} (${count})`}
              onClick={() => onSelectTab(tab.id)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-[#05382b] text-white shadow-xs font-semibold'
                  : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 font-medium shadow-2xs'
              }`}
            >
              <span>{tab.label}</span>
              <span
                data-testid={`filter-count-${tab.id}`}
                className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold leading-none ${
                  isActive
                    ? 'bg-[#047857] text-white'
                    : 'bg-sky-50 text-sky-700 border border-sky-100/60'
                }`}
              >
                {count}
              </span>
              <span className="sr-only">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Mark All As Read Button */}
      <button
        type="button"
        data-testid="mark-all-read-button"
        onClick={onMarkAllAsRead}
        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/80 text-[#07503b] border border-emerald-200/70 shadow-2xs transition-all cursor-pointer active:scale-95 w-full sm:w-auto shrink-0"
      >
        <Check className="w-3.5 h-3.5 text-[#07503b] stroke-[2.5]" />
        <span>Отметить всё как прочитанное</span>
      </button>
    </div>
  );
};

export default NotificationFilterBar;
