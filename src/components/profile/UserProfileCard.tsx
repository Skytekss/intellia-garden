import React from 'react';
import { UserCheck, Pencil, Mail, Phone, Send, Sparkles, Radio, Sprout, Palmtree, User } from 'lucide-react';
import { UserProfile, UserStatus } from '../../types';
import { useApp } from '../../context/AppContext';

export interface UserProfileCardProps {
  profile: UserProfile;
  onEdit: () => void;
  className?: string;
}

const STATUS_MAP: Record<
  UserStatus,
  { labelRu: string; labelEn: string; dot: string; badge: string; icon: React.ElementType }
> = {
  online: {
    labelRu: 'В сети (Офис)',
    labelEn: 'Online (Office)',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    icon: Radio,
  },
  field: {
    labelRu: 'В саду (Полевой выезд)',
    labelEn: 'In Field (Scouting)',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
    icon: Sprout,
  },
  vacation: {
    labelRu: 'В отпуске',
    labelEn: 'On Vacation',
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-800 border-sky-200/80',
    icon: Palmtree,
  },
  offline: {
    labelRu: 'Не в сети',
    labelEn: 'Offline',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: User,
  },
};

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  onEdit,
  className = '',
}) => {
  const { isEnglish } = useApp();
  const statusInfo = STATUS_MAP[profile.status] || STATUS_MAP.online;
  const displayName = isEnglish && profile.fullNameEn ? profile.fullNameEn : profile.fullName;
  const displayRole = isEnglish && profile.roleEn ? profile.roleEn : profile.role;
  const displaySpecialization =
    isEnglish && profile.specializationEn ? profile.specializationEn : profile.specialization;
  const displayStatusNote =
    (isEnglish && profile.statusNoteEn ? profile.statusNoteEn : profile.statusNote) ||
    (isEnglish ? statusInfo.labelEn : statusInfo.labelRu);

  const displayInitials = isEnglish
    ? (profile.fullNameEn
        ? `${profile.fullNameEn.split(' ')[0][0]}${profile.fullNameEn.split(' ')[1]?.[0] || ''}`.toUpperCase()
        : 'EB')
    : (profile.initials || 'ЕБ');

  return (
    <div
      data-testid="user-profile-card"
      className={`bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4 hover:shadow-md transition-shadow min-w-0 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {isEnglish ? 'Agronomist Profile' : 'Профиль агронома'}
            </h2>
            <p className="text-xs text-slate-500 truncate">
              {isEnglish ? 'Personal account credentials and contact info' : 'Учетные данные и рабочие контакты'}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="edit-user-profile-button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Pencil className="w-3.5 h-3.5 text-slate-500" />
          <span>{isEnglish ? 'Edit' : 'Редактировать'}</span>
        </button>
      </div>

      {/* Profile Details */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1 min-w-0">
        {/* Avatar */}
        <div className="relative shrink-0 self-start sm:self-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={displayName}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-slate-200/80 shadow-xs"
            />
          ) : (
            <div
              className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr ${
                profile.avatarGradient || 'from-emerald-800 to-teal-600'
              } text-white font-extrabold text-lg sm:text-xl flex items-center justify-center shadow-xs border border-white/60`}
            >
              {displayInitials}
            </div>
          )}
          {/* Status badge dot */}
          <span
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-white ${statusInfo.dot}`}
            title={displayStatusNote}
          />
        </div>

        {/* Identity & Status */}
        <div className="min-w-0 space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {displayName}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
              <span className="truncate">{displayStatusNote}</span>
            </span>
          </div>

          <p className="text-xs font-semibold text-emerald-800 truncate">{displayRole}</p>

          {displaySpecialization && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate pt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{displaySpecialization}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Grid */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 text-slate-700 min-w-0">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{profile.email}</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 text-slate-700 min-w-0">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{profile.phone}</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 text-slate-700 min-w-0">
          <Send className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{profile.telegram || (isEnglish ? 'No Telegram' : 'Не указан')}</span>
        </div>
      </div>
    </div>
  );
};
