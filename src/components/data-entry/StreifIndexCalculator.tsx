import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  CheckCircle2,
  Sparkles,
  Save,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateStreifIndex } from '../../utils/streifIndex';
import { getLocalizedSectors } from '../../context/localizedData';

export interface StreifIndexCalculatorProps {
  className?: string;
  onApplied?: (sectorName: string, si: number) => void;
}

export const StreifIndexCalculator: React.FC<StreifIndexCalculatorProps> = ({
  className = '',
  onApplied,
}) => {
  const { isEnglish, sectors: rawSectors, updateSector, addAgroRecord } = useApp();
  const sectors = getLocalizedSectors(isEnglish, rawSectors);

  const [selectedSectorId, setSelectedSectorId] = useState<string>(
    sectors[0]?.id || 'sector-4'
  );

  const activeSector = sectors.find((s) => s.id === selectedSectorId) || sectors[0];

  // Sliders state initialized from active sector
  const [firmness, setFirmness] = useState<number>(activeSector?.firmnessKgCm2 ?? 7.2);
  const [brix, setBrix] = useState<number>(activeSector?.brix ?? 13.8);
  const [starch, setStarch] = useState<number>(activeSector?.starchIndex ?? 6.5);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);

  // Sync sliders when switching sector dropdown
  useEffect(() => {
    const sector = sectors.find((s) => s.id === selectedSectorId);
    if (sector) {
      setFirmness(sector.firmnessKgCm2);
      setBrix(sector.brix);
      setStarch(sector.starchIndex);
      setIsSavedSuccess(false);
    }
  }, [selectedSectorId]);

  const result = calculateStreifIndex(firmness, brix, starch, isEnglish);

  const handleApplyToSector = () => {
    if (!activeSector) return;

    // Estimate updated maturity percent from Streif Index
    let computedMaturity = 75;
    if (result.index >= 0.09) {
      computedMaturity = Math.max(45, Math.min(65, Math.round(75 - (result.index - 0.09) * 200)));
    } else if (result.index >= 0.06) {
      computedMaturity = Math.max(70, Math.min(88, Math.round(88 - (result.index - 0.06) * 600)));
    } else {
      computedMaturity = Math.max(90, Math.min(100, Math.round(95 + (0.06 - result.index) * 200)));
    }

    updateSector(activeSector.id, {
      firmnessKgCm2: firmness,
      brix,
      starchIndex: starch,
      maturityPercent: computedMaturity,
    });

    addAgroRecord({
      type: isEnglish ? 'Testing' : 'Анализ',
      title: isEnglish
        ? `Streif Index Lab Test: SI = ${result.index}`
        : `Лабораторный замер индекса Стрейфа: SI = ${result.index}`,
      date: new Date().toLocaleDateString(isEnglish ? 'en-US' : 'ru-RU'),
      sector: activeSector.name,
      sectorId: activeSector.id,
      notes: isEnglish
        ? `Firmness: ${firmness} kg/cm², Brix: ${brix}°, Starch: ${starch}/10 (${result.categoryLabelEn})`
        : `Плотность: ${firmness} кг/см², Brix: ${brix}°, Крахмал: ${starch}/10 (${result.categoryLabel})`,
    });

    setIsSavedSuccess(true);
    if (onApplied) {
      onApplied(activeSector.name, result.index);
    }

    setTimeout(() => {
      setIsSavedSuccess(false);
    }, 4000);
  };

  // Percentage on 0.00 -> 0.15 scale for gauge pointer
  const gaugePercent = Math.min(100, Math.max(0, (result.index / 0.15) * 100));

  return (
    <div
      data-testid="streif-index-calculator"
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <Calculator className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {isEnglish
                  ? 'Streif Ripening Index Calculator (SI)'
                  : 'Лабораторный калькулятор индекса Стрейфа (SI)'}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                ISO / CTIFL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEnglish
                ? 'Standard index of technological maturity for storage planning'
                : 'Международный стандарт технологической зрелости для определения лежкости'}
            </p>
          </div>
        </div>

        {/* Sector Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="streif-sector-select" className="text-xs font-medium text-slate-500">
            {isEnglish ? 'Sector:' : 'Участок:'}
          </label>
          <select
            id="streif-sector-select"
            value={selectedSectorId}
            onChange={(e) => setSelectedSectorId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.variety})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sliders Grid: 3 Biometric Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slider 1: Firmness (F) */}
        <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              {isEnglish ? 'Pulp Firmness (F)' : 'Плотность мякоти (F)'}
            </span>
            <span
              data-testid="value-firmness"
              className="px-2 py-0.5 rounded-md font-mono font-bold bg-white text-emerald-900 border border-slate-200"
            >
              {firmness.toFixed(1)} {isEnglish ? 'kg/cm²' : 'кг/см²'}
            </span>
          </div>
          <input
            type="range"
            min={4.0}
            max={10.0}
            step={0.1}
            value={firmness}
            onChange={(e) => setFirmness(parseFloat(e.target.value))}
            aria-label="Firmness"
            data-testid="slider-firmness"
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>4.0 ({isEnglish ? 'Soft' : 'Мягкое'})</span>
            <span>10.0 ({isEnglish ? 'Crisp' : 'Твердое'})</span>
          </div>
        </div>

        {/* Slider 2: Soluble Solids / Sugar (R) */}
        <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              {isEnglish ? 'Sugar Brix (R)' : 'Сахаристость Brix (R)'}
            </span>
            <span
              data-testid="value-brix"
              className="px-2 py-0.5 rounded-md font-mono font-bold bg-white text-emerald-900 border border-slate-200"
            >
              {brix.toFixed(1)} °Bx
            </span>
          </div>
          <input
            type="range"
            min={9.0}
            max={17.0}
            step={0.1}
            value={brix}
            onChange={(e) => setBrix(parseFloat(e.target.value))}
            aria-label="Brix"
            data-testid="slider-brix"
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>9.0 ({isEnglish ? 'Low' : 'Низкая'})</span>
            <span>17.0 ({isEnglish ? 'High' : 'Сладкое'})</span>
          </div>
        </div>

        {/* Slider 3: Starch Conversion Index (S) */}
        <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              {isEnglish ? 'Starch Scale (S)' : 'Крахмальный тест (S)'}
            </span>
            <span
              data-testid="value-starch"
              className="px-2 py-0.5 rounded-md font-mono font-bold bg-white text-emerald-900 border border-slate-200"
            >
              {starch.toFixed(1)} / 10
            </span>
          </div>
          <input
            type="range"
            min={1.0}
            max={10.0}
            step={0.5}
            value={starch}
            onChange={(e) => setStarch(parseFloat(e.target.value))}
            aria-label="Starch Index"
            data-testid="slider-starch"
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>1 (100% {isEnglish ? 'Starch' : 'Крахмал'})</span>
            <span>10 ({isEnglish ? 'Full Sugars' : 'Осахарено'})</span>
          </div>
        </div>
      </div>

      {/* Visual Dynamic Streif Index Gauge Meter */}
      <div className="bg-slate-50/60 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>{isEnglish ? 'Streif Index Spectrum Gauge' : 'Шкала диапазона индекса Стрейфа'}</span>
          <span className="font-mono text-emerald-800 font-bold">SI = {result.index}</span>
        </div>

        {/* Color zone bar */}
        <div className="relative h-3 w-full rounded-full overflow-hidden flex bg-slate-200">
          {/* Zone 1: < 0.06 (40% width) */}
          <div className="h-full w-[40%] bg-gradient-to-r from-amber-400 to-amber-500" title="< 0.06 (Срочная реализация)" />
          {/* Zone 2: 0.06 - 0.09 (20% width) */}
          <div className="h-full w-[20%] bg-gradient-to-r from-emerald-500 to-teal-500" title="0.06 - 0.09 (Торговые сети)" />
          {/* Zone 3: >= 0.09 (40% width) */}
          <div className="h-full w-[40%] bg-gradient-to-r from-teal-600 to-emerald-800" title=">= 0.09 (Длительное ULO/DCA)" />
        </div>

        {/* Dynamic Indicator Pointer */}
        <div className="relative h-4 w-full">
          <motion.div
            className="absolute top-0 -ml-1.5 w-3 h-3 bg-slate-900 border-2 border-white rounded-full shadow-md"
            animate={{ left: `${gaugePercent}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        </div>

        {/* Zone Labels */}
        <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-0.5">
          <span>&lt; 0.06 ({isEnglish ? 'Fast sale' : 'Прямая реализация'})</span>
          <span className="text-center">0.06 – 0.09 ({isEnglish ? 'Retail (3-5 mo)' : 'Сети 3-5 мес.'})</span>
          <span className="text-right">&ge; 0.09 ({isEnglish ? 'ULO/DCA (9-11 mo)' : 'Камеры ULO/DCA'})</span>
        </div>
      </div>

      {/* Result Card: Formula Display, SI Score & Storage Guidance */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Formula Breakdown */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600 font-mono">
              <span className="text-slate-400">SI = F / (R × S) = </span>
              <span>{firmness.toFixed(1)} / ({brix.toFixed(1)} × {starch.toFixed(1)}) = </span>
            </div>
            <motion.div
              data-testid="streif-score-badge"
              key={result.index}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="px-3 py-1 rounded-xl text-base sm:text-lg font-black font-mono shadow-xs text-white"
              style={{ backgroundColor: result.color }}
            >
              SI = {result.index}
            </motion.div>
          </div>

          {/* Classification Pill with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={result.category}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              data-testid="streif-category-badge"
              className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${result.badgeClass}`}
            >
              {isEnglish ? result.categoryLabelEn : result.categoryLabel}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Agronomic Recommendation */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/70 pt-3">
          {isEnglish ? result.recommendationEn : result.recommendation}
        </p>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <HelpCircle className="w-4 h-4" />
            <span>
              {isEnglish
                ? `Estimated storage potential: up to ${result.maxStorageMonths} months in ULO atmosphere`
                : `Потенциал хранения: до ${result.maxStorageMonths} мес. в контролируемой атмосфере`}
            </span>
          </div>

          <motion.button
            type="button"
            data-testid="btn-apply-streif"
            onClick={handleApplyToSector}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs ${
              isSavedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#07503b] hover:bg-[#096047] text-white'
            }`}
          >
            {isSavedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{isEnglish ? 'Applied to Sector!' : 'Замер привязан к сектору!'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>
                  {isEnglish
                    ? `Save & Apply to ${activeSector?.name}`
                    : `Привязать к ${activeSector?.name}`}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
