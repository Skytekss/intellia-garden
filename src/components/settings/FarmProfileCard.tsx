import React from 'react';
import { Home, Pencil } from 'lucide-react';
import { FarmProfileSettings } from '../../types';
import farmThumbImg from '../../assets/farm_thumb.jpg';

export interface FarmProfileCardProps {
  farm: FarmProfileSettings;
  onEdit: () => void;
}

export const FarmProfileCard: React.FC<FarmProfileCardProps> = ({
  farm,
  onEdit,
}) => {
  return (
    <div
      data-testid="farm-profile-card"
      className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 sm:p-6 space-y-4 hover:shadow-md transition-shadow min-w-0"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <Home className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            Профиль хозяйства
          </h2>
          <p className="text-xs text-slate-500 truncate">
            Информация о вашей ферме
          </p>
        </div>
      </div>

      {/* Profile details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 min-w-0">
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={farmThumbImg}
            alt={farm.name}
            className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl object-cover border border-slate-200/80 shadow-xs shrink-0 bg-slate-100"
            onError={(e) => {
              // Graceful fallback if image asset is missing
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {farm.name}
              </span>
              <button
                type="button"
                onClick={onEdit}
                aria-label="Редактировать название хозяйства"
                className="text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer shrink-0"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-500 truncate">
              Площадь: {farm.areaHa} га
            </p>
            <p className="text-xs text-slate-500 truncate">
              Регион: {farm.region}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="edit-farm-button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-center"
        >
          <Pencil className="w-3.5 h-3.5 text-slate-500" />
          <span>Редактировать</span>
        </button>
      </div>
    </div>
  );
};
