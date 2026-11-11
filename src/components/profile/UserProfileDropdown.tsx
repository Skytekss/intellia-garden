import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Settings,
  Bell,
  Pencil,
  Check,
  Sprout,
  Palmtree,
  Radio,
  Users,
} from 'lucide-react';
import { UserStatus, NavigationTab } from '../../types';
import { DEMO_USERS } from '../../data/mockSettings';
import { useApp } from '../../context/AppContext';

export interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditModal: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

const STATUS_CONFIG: Record<
  UserStatus,
  {
    labelRu: string;
    labelEn: string;
    dotColor: string;
    badgeBg: string;
    badgeText: string;
    icon: React.ElementType;
  }
> = {
  online: {
    labelRu: 'В сети (Лаборатория)',
    labelEn: 'Online (Office / Lab)',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 border-emerald-200/80',
    badgeText: 'text-emerald-800',
    icon: Radio,
  },
  field: {
    labelRu: 'В саду (Полевой осмотр)',
    labelEn: 'In Field (Scouting)',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50 border-amber-200/80',
    badgeText: 'text-amber-800',
    icon: Sprout,
  },
  vacation: {
    labelRu: 'В отпуске / Выходной',
    labelEn: 'On Vacation',
    dotColor: 'bg-sky-500',
    badgeBg: 'bg-sky-50 border-sky-200/80',
    badgeText: 'text-sky-800',
    icon: Palmtree,
  },
  offline: {
    labelRu: 'Не в сети',
    labelEn: 'Offline',
    dotColor: 'bg-slate-400',
    badgeBg: 'bg-slate-100 border-slate-200',
    badgeText: 'text-slate-600',
    icon: User,
  },
};

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  isOpen,
  onClose,
  onOpenEditModal,
  onNavigate,
}) => {
  const { userProfile, updateUserProfile, setUserStatus, isEnglish } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const currentStatusConfig = STATUS_CONFIG[userProfile.status] || STATUS_CONFIG.online;
  const displayName = isEnglish && userProfile.fullNameEn ? userProfile.fullNameEn : userProfile.fullName;
  const displayRole = isEnglish && userProfile.roleEn ? userProfile.roleEn : userProfile.role;
  const displayStatusNote =
    (isEnglish && userProfile.statusNoteEn ? userProfile.statusNoteEn : userProfile.statusNote) ||
    (isEnglish ? currentStatusConfig.labelEn : currentStatusConfig.labelRu);
  const displayInitials = isEnglish
    ? (userProfile.fullNameEn
        ? `${userProfile.fullNameEn.split(' ')[0][0]}${userProfile.fullNameEn.split(' ')[1]?.[0] || ''}`.toUpperCase()
        : 'EB')
    : (userProfile.initials || 'ЕБ');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          data-testid="user-profile-dropdown"
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-4 z-50 text-slate-800"
          role="menu"
          aria-label={isEnglish ? 'User Profile Menu' : 'Меню профиля пользователя'}
        >
          {/* 1. Header Profile Summary */}
          <div className="flex items-start gap-3 pb-3.5 border-b border-slate-100 min-w-0">
            {/* Avatar Preview */}
            <div className="relative shrink-0">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={displayName}
                  className="w-12 h-12 rounded-2xl object-cover shadow-xs border border-slate-200"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${
                    userProfile.avatarGradient || 'from-emerald-800 to-teal-600'
                  } text-white font-extrabold text-sm flex items-center justify-center shadow-xs border border-white/40`}
                >
                  {displayInitials}
                </div>
              )}
              {/* Status Dot */}
              <span
                data-testid="profile-status-indicator"
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white ${currentStatusConfig.dotColor}`}
                title={isEnglish ? currentStatusConfig.labelEn : currentStatusConfig.labelRu}
              />
            </div>

            {/* Name, Role & Email */}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 truncate">{displayName}</h3>
              <p className="text-xs text-emerald-800 font-medium truncate">{displayRole}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{userProfile.email}</p>
            </div>
          </div>

          {/* 2. Current Status Banner */}
          <div className="py-3 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-500">
                {isEnglish ? 'Work Status' : 'Рабочий статус'}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${currentStatusConfig.badgeBg} ${currentStatusConfig.badgeText}`}
              >
                {displayStatusNote}
              </span>
            </div>

            {/* Quick Status Pill Selector */}
            <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Work status selector">
              {(['online', 'field', 'vacation'] as UserStatus[]).map((statusKey) => {
                const config = STATUS_CONFIG[statusKey];
                const isActive = userProfile.status === statusKey;
                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => setUserStatus(statusKey)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/60'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    <span className="truncate">
                      {statusKey === 'online'
                        ? isEnglish ? 'Office' : 'Офис'
                        : statusKey === 'field'
                        ? isEnglish ? 'In Field' : 'В саду'
                        : isEnglish ? 'Vacation' : 'Отпуск'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Primary Actions */}
          <div className="py-2 space-y-0.5 border-b border-slate-100">
            <button
              type="button"
              data-testid="dropdown-edit-profile-btn"
              onClick={() => {
                onClose();
                onOpenEditModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/70 transition-colors cursor-pointer text-left"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                <Pencil className="w-3.5 h-3.5" />
              </div>
              <span className="flex-1">{isEnglish ? 'Edit Profile & Avatar' : 'Редактировать профиль и аватар'}</span>
            </button>

            {onNavigate && (
              <>
                <button
                  type="button"
                  data-testid="dropdown-settings-btn"
                  onClick={() => {
                    onClose();
                    onNavigate('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1">{isEnglish ? 'System Settings' : 'Настройки системы'}</span>
                </button>

                <button
                  type="button"
                  data-testid="dropdown-notifications-btn"
                  onClick={() => {
                    onClose();
                    onNavigate('notifications');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <span className="flex-1">{isEnglish ? 'Notification Center' : 'Центр уведомлений'}</span>
                </button>
              </>
            )}
          </div>

          {/* 4. Switch User Demo Preset */}
          <div className="pt-2.5">
            <div className="flex items-center gap-1.5 px-2 mb-1.5 text-slate-400">
              <Users className="w-3 h-3" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {isEnglish ? 'Switch Agronomist (Demo)' : 'Сменить агронома (Демо)'}
              </span>
            </div>

            <div className="space-y-1">
              {DEMO_USERS.map((demo) => {
                const isCurrent = userProfile.id === demo.id;
                const demoName = isEnglish && demo.fullNameEn ? demo.fullNameEn : demo.fullName;
                const demoRole = isEnglish && demo.roleEn ? demo.roleEn : demo.role;

                return (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => {
                      updateUserProfile(demo);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                      isCurrent
                        ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/70'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${demo.avatarGradient} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                      >
                        {demo.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate leading-tight">{demoName}</p>
                        <p className="text-xs text-slate-400 truncate leading-tight font-normal">{demoRole}</p>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
