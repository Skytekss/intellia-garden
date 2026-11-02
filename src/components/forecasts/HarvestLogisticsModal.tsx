import React, { useState } from 'react';
import { X, Users, Truck, Package, Scale, Calendar, HelpCircle } from 'lucide-react';
import { GardenSector } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateHarvestLogistics, DEFAULT_LOGISTICS_PARAMS } from '../../utils/harvestLogistics';

export interface HarvestLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectors: GardenSector[];
}

export const HarvestLogisticsModal: React.FC<HarvestLogisticsModalProps> = ({
  isOpen,
  onClose,
  sectors,
}) => {
  const { isEnglish, farmProfile } = useApp();

  const [harvestWindowDays, setHarvestWindowDays] = useState<number>(
    DEFAULT_LOGISTICS_PARAMS.harvestWindowDays
  );
  const [pickerDailyNormKg, setPickerDailyNormKg] = useState<number>(
    DEFAULT_LOGISTICS_PARAMS.pickerDailyNormKg
  );
  const [avgYieldTonsPerHa, setAvgYieldTonsPerHa] = useState<number>(35);

  if (!isOpen) return null;

  const logistics = calculateHarvestLogistics(
    sectors,
    { harvestWindowDays, pickerDailyNormKg },
    avgYieldTonsPerHa
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logistics-modal-title"
      data-testid="harvest-logistics-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full p-4 sm:p-6 md:p-7 space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Truck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2
                id="logistics-modal-title"
                data-testid="logistics-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                {isEnglish
                  ? 'Harvest Logistics & Resource Planning'
                  : 'Расчет ресурсов и логистики сбора урожая'}
              </h2>
              <p className="text-xs text-slate-500">
                {farmProfile.name} • {logistics.totalAreaHa} {isEnglish ? 'ha in total' : 'га всего'}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="logistics-modal-close"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={isEnglish ? 'Close modal' : 'Закрыть окно'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Parameter Controls */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isEnglish ? 'Simulation Parameters' : 'Параметры уборочной кампании'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Harvest Window Days */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>{isEnglish ? 'Window (days):' : 'Срок уборки (дней):'}</span>
                <span className="font-bold text-emerald-800">{harvestWindowDays}</span>
              </label>
              <input
                type="range"
                min={7}
                max={35}
                step={1}
                value={harvestWindowDays}
                onChange={(e) => setHarvestWindowDays(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                data-testid="input-window-days"
              />
            </div>

            {/* 2. Picker Daily Norm */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>{isEnglish ? 'Picker norm (kg):' : 'Норма сборщика (кг):'}</span>
                <span className="font-bold text-emerald-800">{pickerDailyNormKg}</span>
              </label>
              <input
                type="range"
                min={400}
                max={1200}
                step={50}
                value={pickerDailyNormKg}
                onChange={(e) => setPickerDailyNormKg(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                data-testid="input-picker-norm"
              />
            </div>

            {/* 3. Average Yield */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>{isEnglish ? 'Yield (t/ha):' : 'Урожайность (т/га):'}</span>
                <span className="font-bold text-emerald-800">{avgYieldTonsPerHa}</span>
              </label>
              <input
                type="range"
                min={15}
                max={55}
                step={1}
                value={avgYieldTonsPerHa}
                onChange={(e) => setAvgYieldTonsPerHa(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                data-testid="input-avg-yield"
              />
            </div>
          </div>
        </div>

        {/* 4 Output KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card 1: Total Tons */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                {isEnglish ? 'Expected Yield' : 'Валовой сбор'}
              </span>
              <div
                data-testid="logistics-total-tons"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
              >
                {logistics.totalTonsExpected} {isEnglish ? 'tons' : 'тонн'}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                ~{logistics.dailyTonsToHarvest} {isEnglish ? 't/day pace' : 'т/сутки'}
              </span>
            </div>
          </div>

          {/* Card 2: Pickers Needed */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                {isEnglish ? 'Labor Crew Required' : 'Штат сборщиков'}
              </span>
              <div
                data-testid="logistics-pickers-needed"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
              >
                {logistics.pickersRequired} {isEnglish ? 'workers' : 'человек'}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {isEnglish ? 'in 1 continuous shift' : 'в 1 смену (8 ч)'}
              </span>
            </div>
          </div>

          {/* Card 3: Orchard Bins */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                {isEnglish ? 'Orchard Bins (400 kg)' : 'Контейнеры (400 кг)'}
              </span>
              <div
                data-testid="logistics-bins-needed"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
              >
                {logistics.binsRequired.toLocaleString()} {isEnglish ? 'pcs' : 'шт.'}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {isEnglish ? 'Standard wooden/plastic crates' : 'Деревянные/пластиковые ящики'}
              </span>
            </div>
          </div>

          {/* Card 4: Reefer Trucks */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                {isEnglish ? 'Reefer Trucks (20 t)' : 'Авторефрижераторы (20 т)'}
              </span>
              <div
                data-testid="logistics-trucks-needed"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
              >
                {logistics.refrigeratedTrucksRequired} {isEnglish ? 'trucks' : 'рейсов'}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {isEnglish ? 'For direct delivery / CA storage' : 'Для отгрузки / закладки в РГС'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <HelpCircle className="w-4 h-4" />
            <span>{isEnglish ? 'Norms calibrated for intensive apple orchards' : 'Нормы откалиброваны для интенсивных садов'}</span>
          </div>

          <button
            type="button"
            data-testid="btn-close-logistics"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isEnglish ? 'Done' : 'Готово'}
          </button>
        </div>
      </div>
    </div>
  );
};
