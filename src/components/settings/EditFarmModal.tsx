import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, MapPin, Maximize2, Save } from 'lucide-react';
import { FarmProfileSettings } from '../../types';

export interface EditFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFarm: FarmProfileSettings;
  onSave: (updated: FarmProfileSettings) => void;
}

export const EditFarmModal: React.FC<EditFarmModalProps> = ({
  isOpen,
  onClose,
  currentFarm,
  onSave,
}) => {
  const [name, setName] = useState(currentFarm.name);
  const [areaHa, setAreaHa] = useState<number | string>(currentFarm.areaHa);
  const [region, setRegion] = useState(currentFarm.region);
  const [error, setError] = useState<string | null>(null);

  // Sync state when currentFarm changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentFarm.name);
      setAreaHa(currentFarm.areaHa);
      setRegion(currentFarm.region);
      setError(null);
    }
  }, [isOpen, currentFarm]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const parsedArea = Number(areaHa);
    const trimmedRegion = region.trim();

    if (!trimmedName) {
      setError('Название хозяйства не может быть пустым');
      return;
    }

    if (isNaN(parsedArea) || parsedArea <= 0) {
      setError('Укажите корректную площадь хозяйства (> 0 га)');
      return;
    }

    if (!trimmedRegion) {
      setError('Укажите регион расположения хозяйства');
      return;
    }

    onSave({
      ...currentFarm,
      name: trimmedName,
      areaHa: parsedArea,
      region: trimmedRegion,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            data-testid="edit-farm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-farm-title"
            data-testid="edit-farm-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="edit-farm-title"
                    className="text-sm sm:text-base font-bold text-slate-900"
                  >
                    Редактирование профиля хозяйства
                  </h3>
                  <p className="text-xs text-slate-500">
                    Обновите основные параметры сада
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-testid="close-edit-farm-modal"
                onClick={onClose}
                aria-label="Закрыть окно"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div
                  data-testid="edit-farm-error"
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium"
                >
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="farm-name-input"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Название хозяйства</span>
                </label>
                <input
                  id="farm-name-input"
                  data-testid="farm-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например: Ферма «Золотой Сад»"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Area */}
              <div className="space-y-1.5">
                <label
                  htmlFor="farm-area-input"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Площадь сада (в гектарах)</span>
                </label>
                <input
                  id="farm-area-input"
                  data-testid="farm-area-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={areaHa}
                  onChange={(e) => setAreaHa(e.target.value)}
                  placeholder="4.2"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Region */}
              <div className="space-y-1.5">
                <label
                  htmlFor="farm-region-input"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Регион расположения</span>
                </label>
                <input
                  id="farm-region-input"
                  data-testid="farm-region-input"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Например: Тульская область"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  data-testid="cancel-edit-farm-button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  data-testid="save-farm-button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Сохранить изменения</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
