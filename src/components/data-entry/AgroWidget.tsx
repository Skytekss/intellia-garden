import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Sprout,
  ShieldCheck,
  Scissors,
  Layers,
  Plus,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { AgroRecord, AgroOperationType } from '../../types';
import { AddAgroRecordModal } from './AddAgroRecordModal';
import { useApp } from '../../context/AppContext';
import { getLocalizedAgroRecords } from '../../context/localizedData';

interface AgroWidgetProps {
  records?: AgroRecord[];
  onAddRecord?: (record: AgroRecord) => void;
  className?: string;
}

export const AgroWidget: React.FC<AgroWidgetProps> = ({
  records: initialPropRecords,
  onAddRecord,
  className = '',
}) => {
  const { isEnglish, t } = useApp();

  const [records, setRecords] = useState<AgroRecord[]>(() =>
    initialPropRecords || getLocalizedAgroRecords(isEnglish) || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!initialPropRecords) {
      setRecords(getLocalizedAgroRecords(isEnglish) || []);
    }
  }, [isEnglish, initialPropRecords]);

  const handleCreateRecord = (newRecordData: Omit<AgroRecord, 'id'>) => {
    const newRecord: AgroRecord = {
      ...newRecordData,
      id: `agro-${Date.now()}`,
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    if (onAddRecord) {
      onAddRecord(newRecord);
    }
  };

  const getOperationIcon = (type: AgroOperationType) => {
    switch (type) {
      case 'Полив':
      case 'Irrigation':
        return (
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
        );
      case 'Удобрения':
      case 'Fertilization':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Sprout className="w-4 h-4" />
          </div>
        );
      case 'Обработка':
      case 'Treatment':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
      case 'Обрезка':
      case 'Pruning':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Scissors className="w-4 h-4" />
          </div>
        );
      case 'Прореживание плодов':
      case 'Fruit Thinning':
        return (
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div
      data-testid="agro-widget"
      className={`bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-800">
              {t('data.agro.title') || 'Агротехнические данные'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {records.length} {isEnglish ? 'records' : 'записи'}
          </span>
        </div>

        {/* Record list */}
        <div data-testid="agro-records-list" className="space-y-2.5">
          {records.map((record) => (
            <div
              key={record.id}
              data-testid={`agro-record-item-${record.id}`}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getOperationIcon(record.type)}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {record.title || record.type}
                  </p>
                  {record.sector && (
                    <p className="text-xs text-slate-400 truncate">{record.sector}</p>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                <span className="text-xs font-medium text-slate-500">{record.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Record Button */}
      <div className="mt-4 pt-2">
        <button
          type="button"
          data-testid="add-agro-record-button"
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2.5 border border-dashed border-emerald-300 text-emerald-800 hover:bg-emerald-50/50 hover:border-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>{isEnglish ? '+ Add Record' : '+ Добавить запись'}</span>
        </button>
      </div>

      {/* Add Record Modal */}
      <AddAgroRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRecord}
      />
    </div>
  );
};

export default AgroWidget;
