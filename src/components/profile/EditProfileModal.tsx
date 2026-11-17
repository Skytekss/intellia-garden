import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  User,
  Mail,
  Phone,
  Send,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { UserStatus } from '../../types';
import { useApp } from '../../context/AppContext';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (message: string) => void;
}

const GRADIENT_PRESETS = [
  { id: 'emerald-teal', label: 'Изумрудный', labelEn: 'Emerald Teal', class: 'from-emerald-800 to-teal-600' },
  { id: 'forest-amber', label: 'Золотая осень', labelEn: 'Golden Orchard', class: 'from-emerald-900 to-amber-600' },
  { id: 'blue-cyan', label: 'Спектральный', labelEn: 'Spectral Blue', class: 'from-blue-700 to-cyan-500' },
  { id: 'amber-emerald', label: 'Спелое яблоко', labelEn: 'Ripe Apple', class: 'from-amber-700 to-emerald-600' },
  { id: 'deep-leaf', label: 'Глубокий лист', labelEn: 'Deep Leaf', class: 'from-emerald-950 to-green-700' },
];

const ROLE_PRESETS = [
  { ru: 'Главный агроном', en: 'Chief Agronomist' },
  { ru: 'Агроном по защите садов', en: 'Plant Protection Agronomist' },
  { ru: 'Оператор БПЛА / Агроскаут', en: 'UAV Operator / Agroscout' },
  { ru: 'Менеджер хранения и сбыта', en: 'Storage & Logistics Manager' },
  { ru: 'Управляющий отделением сада', en: 'Orchard Block Manager' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
}) => {
  const { userProfile, updateUserProfile, isEnglish } = useApp();

  // Form states
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [fullNameEn, setFullNameEn] = useState(userProfile.fullNameEn || '');
  const [role, setRole] = useState(userProfile.role);
  const [roleEn, setRoleEn] = useState(userProfile.roleEn || '');
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [telegram, setTelegram] = useState(userProfile.telegram || '');
  const [specialization, setSpecialization] = useState(userProfile.specialization);
  const [status, setStatus] = useState<UserStatus>(userProfile.status);
  const [statusNote, setStatusNote] = useState(userProfile.statusNote || '');
  const [avatarGradient, setAvatarGradient] = useState(userProfile.avatarGradient);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(userProfile.avatarUrl);

  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or userProfile changes
  useEffect(() => {
    if (isOpen) {
      setFullName(userProfile.fullName);
      setFullNameEn(userProfile.fullNameEn || '');
      setRole(userProfile.role);
      setRoleEn(userProfile.roleEn || '');
      setEmail(userProfile.email);
      setPhone(userProfile.phone);
      setTelegram(userProfile.telegram || '');
      setSpecialization(userProfile.specialization);
      setStatus(userProfile.status);
      setStatusNote(userProfile.statusNote || '');
      setAvatarGradient(userProfile.avatarGradient);
      setAvatarUrl(userProfile.avatarUrl);
      setError(null);
    }
  }, [isOpen, userProfile]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Compute live preview initials
  const previewInitials = React.useMemo(() => {
    const trimmed = (isEnglish && fullNameEn ? fullNameEn : fullName).trim();
    if (!trimmed) return 'ЕБ';
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }, [fullName, fullNameEn, isEnglish]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(isEnglish ? 'Please upload a valid image file.' : 'Пожалуйста, выберите файл изображения.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError(isEnglish ? 'File size must be under 3MB.' : 'Размер файла не должен превышать 3 МБ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError(isEnglish ? 'Please enter a valid full name.' : 'Пожалуйста, укажите корректные имя и фамилию.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(isEnglish ? 'Please enter a valid email address.' : 'Укажите корректный адрес электронной почты.');
      return;
    }

    updateUserProfile({
      fullName: fullName.trim(),
      fullNameEn: fullNameEn.trim() || fullName.trim(),
      initials: previewInitials,
      role: role.trim(),
      roleEn: roleEn.trim() || role.trim(),
      email: email.trim(),
      phone: phone.trim(),
      telegram: telegram.trim() ? (telegram.trim().startsWith('@') ? telegram.trim() : `@${telegram.trim()}`) : '',
      specialization: specialization.trim(),
      status,
      statusNote: statusNote.trim(),
      avatarGradient,
      avatarUrl,
    });

    const successMsg = isEnglish ? 'Profile updated successfully!' : 'Данные профиля успешно сохранены!';
    if (onSaveSuccess) {
      onSaveSuccess(successMsg);
    }
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onClose}
            data-testid="edit-profile-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 my-auto text-slate-800 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            data-testid="edit-profile-modal"
          >
            {/* Modal Header */}
            <div className="px-6 py-4.5 bg-gradient-to-r from-[#05382b] to-[#07503b] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-emerald-300">
                  <User className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h2 id="edit-profile-title" className="text-base sm:text-lg font-bold leading-tight">
                    {isEnglish ? 'Edit Agronomist Profile' : 'Редактирование профиля агронома'}
                  </h2>
                  <p className="text-xs text-emerald-200/70 mt-0.5">
                    {isEnglish ? 'Manage personal info, avatar and status' : 'Управление персональными данными, аватаром и статусом'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-emerald-200/70 hover:text-white hover:bg-emerald-800/40 transition-colors cursor-pointer"
                aria-label={isEnglish ? 'Close' : 'Закрыть'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Error Notice */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Live Avatar Builder */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isEnglish ? 'Avatar & Appearance' : 'Аватар и оформление'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {isEnglish ? 'Preview & Color stops' : 'Превью и градиенты'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {/* Live Avatar Preview */}
                  <div className="relative shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${avatarGradient} text-white font-extrabold text-2xl flex items-center justify-center shadow-md border-2 border-white/60`}
                      >
                        {previewInitials}
                      </div>
                    )}
                  </div>

                  {/* Controls: Color Gradients & Photo Upload */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">
                        {isEnglish ? 'Gradient Preset:' : 'Градиент инициалов:'}
                      </span>
                    </div>

                    {/* Gradient Swatches */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {GRADIENT_PRESETS.map((preset) => {
                        const isSelected = avatarGradient === preset.class && !avatarUrl;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setAvatarGradient(preset.class);
                              setAvatarUrl(undefined);
                            }}
                            title={isEnglish ? preset.labelEn : preset.label}
                            className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${preset.class} transition-all cursor-pointer relative shadow-xs flex items-center justify-center ${
                              isSelected ? 'ring-2 ring-emerald-600 ring-offset-2 scale-110' : 'hover:scale-105'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Upload / Remove buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        data-testid="profile-photo-input"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isEnglish ? 'Upload Photo' : 'Загрузить фото'}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isEnglish ? 'Remove' : 'Удалить'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEnglish ? 'Full Name (RU)' : 'Имя и фамилия'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Елизавета Белова"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                    data-testid="input-full-name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEnglish ? 'Position / Role' : 'Должность'}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Главный агроном"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                      data-testid="input-role"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Roles Quick Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">{isEnglish ? 'Presets:' : 'Пресеты:'}</span>
                {ROLE_PRESETS.map((p) => {
                  const label = isEnglish ? p.en : p.ru;
                  return (
                    <button
                      key={p.ru}
                      type="button"
                      onClick={() => {
                        setRole(p.ru);
                        setRoleEn(p.en);
                      }}
                      className="text-xs px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 transition-colors cursor-pointer"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Section 3: Contact Details (Email, Phone, Telegram) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.belova@intellia.agro"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEnglish ? 'Phone' : 'Телефон'}</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (916) 842-19-04"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Telegram</span>
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@eliza_agronomy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                    data-testid="input-telegram"
                  />
                </div>
              </div>

              {/* Section 4: Specialization & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEnglish ? 'Agronomic Specialization' : 'Специализация'}</span>
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Интенсивные сады, капельный полив"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                    data-testid="input-specialization"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {isEnglish ? 'Work Status & Location Note' : 'Статус и местоположение'}
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as UserStatus)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-hidden focus:border-emerald-600 shrink-0 cursor-pointer"
                      data-testid="select-status"
                    >
                      <option value="online">{isEnglish ? 'Online' : 'В сети (Офис)'}</option>
                      <option value="field">{isEnglish ? 'In Field' : 'В саду (Поле)'}</option>
                      <option value="vacation">{isEnglish ? 'Vacation' : 'В отпуске'}</option>
                      <option value="offline">{isEnglish ? 'Offline' : 'Не в сети'}</option>
                    </select>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder={isEnglish ? 'e.g. Central Lab' : 'напр. Сектор 4'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {isEnglish ? 'Cancel' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  data-testid="save-profile-btn"
                  className="px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEnglish ? 'Save Changes' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
