import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, FileText, CheckCircle2, ClipboardList } from 'lucide-react';
import { AgroOperationType, AgroRecord } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddAgroRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: Omit<AgroRecord, 'id'>) => void;
}

const OPERATION_TYPES_RU: AgroOperationType[] = [
  'Полив',
  'Удобрения',
  'Обработка',
  'Обрезка',
  'Прореживание плодов',
];

const OPERATION_TYPES_EN: AgroOperationType[] = [
  'Irrigation',
  'Fertilization',
  'Treatment',
  'Pruning',
  'Fruit Thinning',
];

const SECTORS_RU = [
  'Все участки',
  'Участок 1 (Гала)',
  'Участок 2 (Фуджи)',
  'Участок 3 (Голден)',
  'Участок 4 (Ред Делишес)',
  'Участок 5 (Гала)',
];

const SECTORS_EN = [
  'All Sectors',
  'Sector 1 (Gala)',
  'Sector 2 (Fuji)',
  'Sector 3 (Golden Delicious)',
  'Sector 4 (Red Delicious)',
  'Sector 5 (Gala)',
];

export const AddAgroRecordModal: React.FC<AddAgroRecordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { isEnglish } = useApp();

  const operationTypes = isEnglish ? OPERATION_TYPES_EN : OPERATION_TYPES_RU;
  const sectorsList = isEnglish ? SECTORS_EN : SECTORS_RU;

  const [type, setType] = useState<AgroOperationType>(operationTypes[0]);
  const [date, setDate] = useState('2025-08-12');
  const [sector, setSector] = useState(sectorsList[0]);
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState(operationTypes[0]);

  useEffect(() => {
    setType(operationTypes[0]);
    setTitle(operationTypes[0]);
    setSector(sectorsList[0]);
  }, [isEnglish]);

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

    // Format date from YYYY-MM-DD to DD.MM.YYYY
    let formattedDate = date;
    if (date.includes('-')) {
      const parts = date.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    }

    onSubmit({
      type,
      title: title || type,
      date: formattedDate,
      sector: sector !== (isEnglish ? 'All Sectors' : 'Все участки') ? sector : undefined,
      notes: notes || undefined,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-testid="add-agro-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg z-10 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="agro-modal-title" className="text-sm font-bold text-slate-800">
                    {isEnglish ? 'Add Agrotechnical Record' : 'Добавить агротехническую запись'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isEnglish
                      ? 'Record operation details into the garden log'
                      : 'Внесите данные об операции в журнал сада'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-testid="close-agro-modal"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label={isEnglish ? 'Close' : 'Закрыть окно'}
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
                  {isEnglish ? 'Operation Type' : 'Тип агрооперации'}
                </label>
                <select
                  id="operation-type-select"
                  data-testid="operation-type-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as AgroOperationType)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
                >
                  {operationTypes.map((op) => (
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
                  {isEnglish ? 'Operation Title' : 'Название операции'}
                </label>
                <input
                  id="operation-title-input"
                  data-testid="operation-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    isEnglish
                      ? 'e.g. Irrigation or Calcium application'
                      : 'Например, Полив или Внесение калия'
                  }
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
                    {isEnglish ? 'Execution Date' : 'Дата выполнения'}
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
                    {isEnglish ? 'Sector' : 'Участок'}
                  </label>
                  <select
                    id="operation-sector-select"
                    data-testid="operation-sector-select"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
                  >
                    {sectorsList.map((sec) => (
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
                  {isEnglish ? 'Notes & Consumables' : 'Примечания и расходные материалы'}
                </label>
                <textarea
                  id="operation-notes-input"
                  data-testid="operation-notes-input"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    isEnglish
                      ? 'Specify dosage, product, or microclimate context...'
                      : 'Укажите препарат, дозировку или условия проведения...'
                  }
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
                  {isEnglish ? 'Cancel' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  data-testid="submit-agro-record"
                  className="px-5 py-2.5 bg-[#07503b] hover:bg-[#096047] active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEnglish ? 'Add Record' : 'Добавить запись'}</span>
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
