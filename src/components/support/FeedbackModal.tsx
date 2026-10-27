import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, MessageSquareText, AlertCircle } from 'lucide-react';
import { FeedbackFormData } from './types';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

const CATEGORY_OPTIONS = [
  'Вопрос по функционалу платформы',
  'Техническая ошибка / Баг в системе',
  'Калибровка данных зрелости плодов',
  'Загрузка KML-контуров и ортофотопланов',
  'Консультация с агрономом',
  'Другое',
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
}) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    category: initialCategory || CATEGORY_OPTIONS[0],
    subject: '',
    message: '',
    email: 'agronomist@goldengarden.ru',
    phone: '',
  });

  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setErrors({});
      if (initialCategory) {
        setFormData((prev) => ({ ...prev, category: initialCategory }));
      }
    }
  }, [isOpen, initialCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { subject?: string; message?: string } = {};
    if (!formData.subject.trim()) {
      newErrors.subject = 'Укажите тему обращения';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Введите текст сообщения';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Сообщение должно содержать не менее 10 символов';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 400);
  };

  return (
    <div
      data-testid="feedback-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Backdrop click area */}
      <div
        className="absolute inset-0"
        data-testid="feedback-modal-backdrop"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-[#f4f7f6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#07503b] flex items-center justify-center shrink-0">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="feedback-modal-title"
                className="text-lg font-bold text-slate-900 leading-tight"
              >
                Написать в поддержку
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Мы ответим вам в течение 2 часов
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="feedback-modal-close"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Закрыть окно"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {isSuccess ? (
            <div
              data-testid="feedback-success-state"
              className="py-8 text-center flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Обращение успешно отправлено!
              </h4>
              <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full mt-2">
                Заявка #2048 принята в работу
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-sm">
                Специалист агрономической поддержки свяжется с вами по указанному email: {formData.email}.
              </p>
              <button
                type="button"
                data-testid="feedback-success-close-button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                Готово
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label
                  htmlFor="feedback-category"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Категория вопроса
                </label>
                <select
                  id="feedback-category"
                  data-testid="feedback-category-select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition-colors"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="feedback-subject"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Тема обращения *
                </label>
                <input
                  id="feedback-subject"
                  type="text"
                  data-testid="feedback-subject-input"
                  placeholder="Например: Не сходится Brix на участке 2"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2 transition-colors ${
                    errors.subject
                      ? 'border-red-400 focus:ring-red-400/30'
                      : 'border-slate-200 focus:ring-emerald-600/40 focus:border-emerald-600'
                  }`}
                />
                {errors.subject && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="feedback-message"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Описание проблемы или вопроса *
                </label>
                <textarea
                  id="feedback-message"
                  rows={4}
                  data-testid="feedback-message-textarea"
                  placeholder="Опишите подробно, с чем возникла сложность..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-white text-slate-800 focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.message
                      ? 'border-red-400 focus:ring-red-400/30'
                      : 'border-slate-200 focus:ring-emerald-600/40 focus:border-emerald-600'
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div>
                <label
                  htmlFor="feedback-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Контактный Email для ответа
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  data-testid="feedback-email-input"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="feedback-submit-button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] active:scale-[0.99] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Отправка...' : 'Отправить обращение'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
