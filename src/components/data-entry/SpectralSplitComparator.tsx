import React, { useState, useRef, useCallback } from 'react';
import {
  GripVertical,
  Crosshair,
  Layers,
  Sparkles,
  Apple,
  TreePine,
  PieChart,
} from 'lucide-react';
import spectralAppleSample from '../../assets/spectral_apple_sample.jpg';
import gardenMapRef from '../../assets/garden_map_ref.jpg';
import { useApp } from '../../context/AppContext';

export type ComparisonPresetId = 'fruit-surface' | 'starch-test' | 'canopy-ortho';

interface PresetItem {
  id: ComparisonPresetId;
  labelRu: string;
  labelEn: string;
  icon: React.ElementType;
  baseImage: string;
  spectralMetric: string;
  spectralValue: string;
  descriptionRu: string;
  descriptionEn: string;
}

const PRESETS: PresetItem[] = [
  {
    id: 'fruit-surface',
    labelRu: 'Плод на ветке',
    labelEn: 'Fruit on Tree',
    icon: Apple,
    baseImage: spectralAppleSample,
    spectralMetric: 'NDVI Index',
    spectralValue: '0.78',
    descriptionRu: 'Сравнение оптического окрашивания антоцианами и распределения хлорофилла в кожице',
    descriptionEn: 'Comparison of optical anthocyanin blushing vs chlorophyll distribution in fruit peel',
  },
  {
    id: 'starch-test',
    labelRu: 'Йодно-крахмальный срез',
    labelEn: 'Starch Iodine Test',
    icon: PieChart,
    baseImage: spectralAppleSample,
    spectralMetric: 'Starch Hydr.',
    spectralValue: '6.4 / 10',
    descriptionRu: 'Сравнение оптического потемнения йода с автоматической сегментацией осахаривания',
    descriptionEn: 'Comparison of iodine darkening with automated starch hydrolysis segmentation',
  },
  {
    id: 'canopy-ortho',
    labelRu: 'Ортофото крон сада',
    labelEn: 'Orchard Canopy Ortho',
    icon: TreePine,
    baseImage: gardenMapRef,
    spectralMetric: 'Canopy NDVI',
    spectralValue: '0.84',
    descriptionRu: 'Сравнение естественного цвета листвы с вегетативным индексом плотности кроны',
    descriptionEn: 'Comparison of natural foliage color with canopy vegetative biomass index',
  },
];

export interface SpectralSplitComparatorProps {
  className?: string;
}

export const SpectralSplitComparator: React.FC<SpectralSplitComparatorProps> = ({
  className = '',
}) => {
  const { isEnglish } = useApp();
  const [activePreset, setActivePreset] = useState<ComparisonPresetId>('fruit-surface');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0..100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [inspectPoint, setInspectPoint] = useState<{ x: number; y: number } | null>({
    x: 48,
    y: 52,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const preset = PRESETS.find((p) => p.id === activePreset) || PRESETS[0];

  const updateSplitFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawPercent = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(5, Math.min(95, Math.round(rawPercent)));
    setSplitPos(clamped);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSplitFromClientX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateSplitFromClientX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updateSplitFromClientX(e.touches[0].clientX);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setInspectPoint({ x, y });
  };

  return (
    <div
      data-testid="spectral-split-comparator"
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-4 ${className}`}
    >
      {/* Top Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>
                {isEnglish
                  ? 'Dual-Channel Spectral Comparator'
                  : 'Двухканальный спектральный компаратор'}
              </span>
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              RGB / NDVI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEnglish ? preset.descriptionEn : preset.descriptionRu}
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div
          data-testid="comparator-presets"
          className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl self-start sm:self-auto shrink-0"
        >
          {PRESETS.map((p) => {
            const Icon = p.icon;
            const isSelected = p.id === activePreset;
            return (
              <button
                key={p.id}
                type="button"
                data-testid={`btn-preset-${p.id}`}
                onClick={() => setActivePreset(p.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{isEnglish ? p.labelEn : p.labelRu}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Split Viewport */}
      <div
        ref={containerRef}
        data-testid="split-viewport"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onClick={handleImageClick}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[420px] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-slate-950 shadow-inner border border-slate-200"
      >
        {/* Layer 1: Left Natural RGB Optics */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)`,
          }}
        >
          <img
            src={preset.baseImage}
            alt="RGB Natural Optics"
            className="w-full h-full object-cover"
            style={{
              filter: activePreset === 'starch-test' ? 'contrast(1.3) grayscale(0.5)' : 'none',
            }}
            draggable={false}
          />
          {/* Label Pill Left */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-md">
            {isEnglish ? 'RGB High-Res Optics' : 'Оптический RGB-спектр'}
          </div>
        </div>

        {/* Layer 2: Right NDVI False-Color Thermal/Spectral Layer */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            clipPath: `polygon(${splitPos}% 0, 100% 0, 100% 100%, ${splitPos}% 100%)`,
          }}
        >
          <img
            src={preset.baseImage}
            alt="NDVI Spectral Heatmap"
            className="w-full h-full object-cover"
            style={{
              filter:
                activePreset === 'canopy-ortho'
                  ? 'hue-rotate(90deg) saturate(2.4) contrast(1.2)'
                  : 'sepia(0.6) hue-rotate(85deg) saturate(3) contrast(1.4)',
            }}
            draggable={false}
          />
          {/* Spectral Gradient Tint Overlay */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-color pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(234,179,8,0.9) 0%, rgba(16,185,129,0.9) 55%, rgba(2,132,199,0.9) 100%)',
            }}
          />
          {/* Label Pill Right */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/85 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-emerald-400/40 shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isEnglish ? 'NDVI Thermal Spectrum' : 'Тепловой NDVI-спектр'}</span>
          </div>
        </div>

        {/* Vertical Draggable Splitter Divider */}
        <div
          data-testid="split-divider-line"
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] pointer-events-none"
          style={{ left: `${splitPos}%` }}
        >
          {/* Draggable Center Handle Pill */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-10 sm:w-9 sm:h-11 rounded-2xl bg-white text-slate-800 shadow-xl border border-slate-200/90 flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
            <GripVertical className="w-4 h-4 text-emerald-800" />
          </div>
        </div>

        {/* Point Inspector Crosshair Pin */}
        {inspectPoint && (
          <div
            data-testid="inspect-pin"
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-in zoom-in-75 duration-150"
            style={{ left: `${inspectPoint.x}%`, top: `${inspectPoint.y}%` }}
          >
            <div className="relative flex items-center justify-center">
              <Crosshair className="w-6 h-6 text-emerald-400 drop-shadow-md animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-white absolute" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar: Range Slider, Ratios & Point Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        {/* Slider & Split Position */}
        <div className="md:col-span-7 flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            {isEnglish ? 'Split Ratio:' : 'Шторка:'}
          </span>
          <input
            type="range"
            min={5}
            max={95}
            value={splitPos}
            onChange={(e) => setSplitPos(parseInt(e.target.value, 10))}
            aria-label="Split Position"
            data-testid="split-range-slider"
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
          <span
            data-testid="split-percentage-label"
            className="text-xs font-mono font-bold text-slate-700 shrink-0 min-w-[65px] text-right"
          >
            {splitPos}% / {100 - splitPos}%
          </span>
        </div>

        {/* Selected Inspection Point Telemetry */}
        <div className="md:col-span-5 flex items-center justify-between sm:justify-end gap-3 text-xs bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-slate-500 font-medium">
              {isEnglish ? 'Sample Point:' : 'Точка пробы:'}
            </span>
            <span className="font-mono font-bold text-slate-800">
              ({inspectPoint?.x ?? 50}%, {inspectPoint?.y ?? 50}%)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold">{preset.spectralMetric}:</span>
            <span
              data-testid="spectral-point-metric"
              className="px-2 py-0.5 rounded-md font-bold text-emerald-900 bg-emerald-100"
            >
              {preset.spectralValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
