import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { AgroOperationType, AgroRecord } from '../../types';

interface AddAgroRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: Omit<AgroRecord, 'id'>) => void;
}

const OPERATION_TYPES: AgroOperationType[] = [
  'Полив',
  'Удобрения',
  'Обработка',
  'Обрезка',
  'Прореживание плодов',
];

const SECTORS = [
  'Все участки',
  'Участок 1 (Гала)',
  'Участок 2 (Фуджи)',
  'Участок 3 (Голден)',
  'Участок 4 (Ред Делишес)',
  'Участок 5 (Гала)',
];

export const AddAgroRecordModal: React.FC<AddAgroRecordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<AgroOperationType>('Полив');
  const [date, setDate] = useState('2025-08-12');
  const [sector, setSector] = useState('Все участки');
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('Полив');

  useEffect(() => {
    setTitle(type);
  }, [type]);

  // Handle ESC key to close modal
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format date from YYYY-MM-DD to DD.MM.YYYY if needed
    let formattedDate = date;
    if (date.includes('-')) {
      const parts = date.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    }

    onSubmit({
      type,
      title: title.trim() || type,
      date: formattedDate,
      sector,
      notes: notes.trim() || undefined,
    });

    // Reset fields
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="agro-modal-title"
          data-testid="add-agro-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            data-testid="agro-modal-backdrop"
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden z-10 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  +
                </div>
                <div>
                  <h3 id="agro-modal-title" className="text-sm font-bold text-slate-800">
                    Добавить агротехническую запись
                  </h3>
                  <p className="text-xs text-slate-500">Внесите данные об операции в журнал сада</p>
                </div>
              </div>

              <button
                type="button"
                data-testid="close-agro-modal"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Закрыть окно"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Operation Type */}
              <div>
                <label
                  htmlFor="operation-type-select"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Тип агрооперации
                </label>
                <select
                  id="operation-type-select"
                  data-testid="operation-type-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as AgroOperationType)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
                >
                  {OPERATION_TYPES.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title / Description */}
              <div>
                <label
                  htmlFor="operation-title-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Название операции
                </label>
                <input
                  id="operation-title-input"
                  data-testid="operation-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например, Полив или Внесение калия"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              {/* Date and Sector in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="operation-date-input"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Дата выполнения
                  </label>
                  <input
                    id="operation-date-input"
                    data-testid="operation-date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="operation-sector-select"
                    className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Участок
                  </label>
                  <select
                    id="operation-sector-select"
                    data-testid="operation-sector-select"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
                  >
                    {SECTORS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="operation-notes-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Примечания и расходные материалы
                </label>
                <textarea
                  id="operation-notes-input"
                  data-testid="operation-notes-input"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Укажите препарат, дозировку или условия проведения..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  data-testid="cancel-agro-modal"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-600 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  data-testid="submit-agro-record"
                  className="px-5 py-2.5 bg-[#07503b] hover:bg-[#096047] active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Добавить запись</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddAgroRecordModal;
