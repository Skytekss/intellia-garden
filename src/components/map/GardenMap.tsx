import React, { useState, useRef, useCallback } from 'react';
import { 
  Plus, 
  Minus, 
  Navigation,
  Eye,
  EyeOff,
  Radio
} from 'lucide-react';
import { GardenSector } from '../../types';
import { getMaturityColor } from '../../data/mockData';
import gardenMapRef from '../../assets/garden_map_ref.jpg';
import { useApp } from '../../context/AppContext';

export { getMaturityColor };

interface GardenMapProps {
  sectors: GardenSector[];
  selectedSectorId: string;
  onSelectSector: (sectorId: string) => void;
  className?: string;
}

interface SectorGeometry {
  id: string;
  name: string;
  polygon: string;
  badge: { x: number; y: number };
}

const SECTOR_GEOMETRIES: SectorGeometry[] = [
  {
    id: 'sector-1',
    name: 'Участок 1',
    polygon: '5,88 122,62 126,178 2,235',
    badge: { x: 66, y: 79 },
  },
  {
    id: 'sector-2',
    name: 'Участок 2',
    polygon: '112,60 240,36 254,122 146,148',
    badge: { x: 260, y: 70 },
  },
  {
    id: 'sector-3',
    name: 'Участок 3',
    polygon: '162,154 338,112 356,186 198,226',
    badge: { x: 369, y: 140 },
  },
  {
    id: 'sector-4',
    name: 'Участок 4',
    polygon: '206,234 366,188 390,268 265,318',
    badge: { x: 351, y: 258 },
  },
  {
    id: 'sector-5',
    name: 'Участок 5',
    polygon: '30,235 126,175 180,270 140,315 45,265',
    badge: { x: 122, y: 244 },
  },
];

export const GardenMap: React.FC<GardenMapProps> = ({
  sectors,
  selectedSectorId,
  onSelectSector,
  className = '',
}) => {
  const { isEnglish } = useApp();
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredSectorId, setHoveredSectorId] = useState<string | null>(null);
  const [showLayers, setShowLayers] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<'ndvi' | 'rgb'>('ndvi');

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(2, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, +(prev - 0.25).toFixed(2));
      if (next === 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetCenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag / Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || zoom <= 1) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Limit pan range
      const maxPan = 160 * (zoom - 1);
      setPan({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY)),
      });
    },
    [isDragging, zoom, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const sectorMap = new Map(sectors.map((s) => [s.id, s]));

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-900 select-none shadow-xs border border-slate-200/80 ${className}`}
      style={{ aspectRatio: '428 / 345' }}
      data-testid="garden-map-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoomable / Pannable Map Layer */}
      <div
        className="w-full h-full min-w-0 transition-transform duration-150 ease-out"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="relative w-full h-full min-w-0">
          {/* Base Raster Image */}
          <img
            src={gardenMapRef}
            alt="Ортофотоплан яблоневого сада"
            className="w-full h-full object-cover transition-all duration-300"
            style={{
              filter: mapMode === 'rgb' ? 'sepia(0.3) saturate(1.4) hue-rotate(50deg)' : 'none',
            }}
            draggable={false}
          />

          {/* Interactive SVG Overlay */}
          <svg
            viewBox="0 0 428 345"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-label="Схема секторов сада"
          >
            <defs>
              {/* Active sector neon glow */}
              <filter id="activeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ffffff" floodOpacity="0.9" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.8" />
              </filter>

              {/* Badge shadow */}
              <filter id="badgeShadowMap" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
              </filter>

              {/* Selected Badge glowing shadow */}
              <filter id="badgeShadowSelected" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#047857" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Sector Polygons */}
            {SECTOR_GEOMETRIES.map((geom) => {
              const isSelected = selectedSectorId === geom.id;
              const isHovered = hoveredSectorId === geom.id;
              const sectorData = sectorMap.get(geom.id);
              const percent = sectorData?.maturityPercent ?? 60;
              const maturityColor = getMaturityColor(percent);

              return (
                <polygon
                  key={geom.id}
                  points={geom.polygon}
                  data-testid={`sector-polygon-${geom.id}`}
                  className="pointer-events-auto transition-all duration-200 cursor-pointer"
                  fill={
                    isSelected
                      ? 'rgba(16, 185, 129, 0.24)'
                      : isHovered
                      ? 'rgba(255, 255, 255, 0.20)'
                      : showLayers
                      ? `${maturityColor}12` // subtle tint
                      : 'transparent'
                  }
                  stroke={
                    isSelected
                      ? '#ffffff'
                      : showLayers
                      ? isHovered
                        ? '#ffffff'
                        : 'rgba(255, 255, 255, 0.65)'
                      : 'transparent'
                  }
                  strokeWidth={isSelected ? '2.5' : isHovered ? '2' : showLayers ? '1.2' : '0'}
                  strokeDasharray={isSelected ? 'none' : showLayers ? '4 2' : 'none'}
                  filter={isSelected ? 'url(#activeGlow)' : undefined}
                  onClick={() => onSelectSector(geom.id)}
                  onMouseEnter={() => setHoveredSectorId(geom.id)}
                  onMouseLeave={() => setHoveredSectorId(null)}
                />
              );
            })}

            {/* Interactive Sector Badges */}
            {SECTOR_GEOMETRIES.map((geom) => {
              const isSelected = selectedSectorId === geom.id;
              const isHovered = hoveredSectorId === geom.id;
              const sectorData = sectorMap.get(geom.id);
              const percent = sectorData?.maturityPercent ?? 60;
              const maturityColor = getMaturityColor(percent);

              return (
                <g
                  key={`badge-${geom.id}`}
                  transform={`translate(${geom.badge.x}, ${geom.badge.y})`}
                  className="pointer-events-auto cursor-pointer transition-transform duration-150 outline-none focus:outline-none focus-visible:outline-none"
                  style={{ outline: 'none' }}
                  filter={isSelected ? 'url(#badgeShadowSelected)' : 'url(#badgeShadowMap)'}
                  onClick={() => onSelectSector(geom.id)}
                  onMouseDown={(e) => {
                    // Prevent default to stop browser from setting SVG DOM focus outline on mouse click
                    e.preventDefault();
                  }}
                  onMouseEnter={() => setHoveredSectorId(geom.id)}
                  onMouseLeave={() => setHoveredSectorId(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Выбрать ${geom.name}, готовность ${percent}%`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSector(geom.id);
                    }
                  }}
                  data-testid={`sector-badge-${geom.id}`}
                >
                  {/* Badge Background Card */}
                  <rect
                    x="-35"
                    y="-19"
                    width="70"
                    height="38"
                    rx="8"
                    fill="#ffffff"
                    stroke={isSelected ? '#047857' : isHovered ? '#10b981' : '#e2e8f0'}
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-colors"
                    style={{ outline: 'none' }}
                  />

                  {/* Title: Участок N */}
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="#1e293b"
                    className="select-none font-sans"
                  >
                    {isEnglish ? geom.name.replace('Участок', 'Sector') : geom.name}
                  </text>

                  {/* Value: XX% */}
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill={maturityColor}
                    className="select-none font-sans"
                  >
                    {percent}%
                  </text>
                </g>
              );
            })}

            {/* Animated Drone Survey Indicator positioned at selected sector */}
            {(() => {
              const currentGeom = SECTOR_GEOMETRIES.find((g) => g.id === selectedSectorId) || SECTOR_GEOMETRIES[3];
              return (
                <g
                  transform={'translate(' + (currentGeom.badge.x - 36) + ', ' + (currentGeom.badge.y - 24) + ')'}
                  className="pointer-events-none transition-transform duration-500 ease-out"
                >
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                  <circle cx="0" cy="0" r="8" fill="rgba(5, 56, 43, 0.85)" stroke="#10b981" strokeWidth="1.2" />
                  <path
                    d="M -4 -4 L 4 4 M 4 -4 L -4 4"
                    stroke="#ffffff"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <circle cx="0" cy="0" r="2" fill="#34d399" />
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* --- 1. NEW TOP FLOATING TOOLBAR: Clear layer mode & contours toggle --- */}
      <div
        className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto"
        data-testid="map-toolbar"
      >
        {/* Layer Mode Segmented Controller */}
        <div className="flex items-center p-1 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/90">
          <button
            type="button"
            onClick={() => setMapMode((prev) => (prev === 'ndvi' ? 'rgb' : 'ndvi'))}
            data-testid="btn-toggle-mode"
            title={isEnglish ? 'Toggle mode: NDVI Spectrum / RGB Orthophoto' : 'Переключить режим: NDVI Спектр / Ортофото RGB'}
            aria-label={isEnglish ? 'Toggle spectral mode' : 'Переключить спектральный режим'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-[#07503b] text-white shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {isEnglish
                ? mapMode === 'ndvi'
                  ? 'NDVI Spectrum'
                  : 'RGB Orthophoto'
                : mapMode === 'ndvi'
                ? 'NDVI Спектр'
                : 'Ортофото RGB'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMapMode((prev) => (prev === 'ndvi' ? 'rgb' : 'ndvi'))}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            {isEnglish
              ? mapMode === 'ndvi'
                ? '→ RGB Orthophoto'
                : '→ NDVI Spectrum'
              : mapMode === 'ndvi'
              ? '→ Ортофото RGB'
              : '→ NDVI Спектр'}
          </button>
        </div>

        {/* Contour Boundaries Toggle Button */}
        <button
          type="button"
          onClick={() => setShowLayers((prev) => !prev)}
          data-testid="btn-toggle-layers"
          title={
            isEnglish
              ? showLayers
                ? 'Hide sector contours'
                : 'Show sector boundaries'
              : showLayers
              ? 'Скрыть контуры секторов'
              : 'Показать границы секторов'
          }
          className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md shadow-md border text-xs font-semibold transition-all cursor-pointer ${
            showLayers
              ? 'border-emerald-500/60 text-emerald-900 bg-emerald-50/90 shadow-xs'
              : 'border-slate-200/90 text-slate-600 hover:bg-slate-100/80'
          }`}
        >
          {showLayers ? (
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>
            {isEnglish
              ? `Contours: ${showLayers ? 'On' : 'Hidden'}`
              : `Контуры: ${showLayers ? 'Вкл' : 'Скрыты'}`}
          </span>
        </button>
      </div>

      {/* --- 2. BOTTOM-RIGHT NAVIGATION & ZOOM CONTROLS --- */}
      <div
        className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 flex items-center gap-1 p-1 sm:p-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/90 text-slate-700 pointer-events-auto"
        data-testid="map-zoom-controls"
      >
        {/* Zoom Out (-) */}
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          title={isEnglish ? 'Zoom out' : 'Отдалить карту'}
          aria-label={isEnglish ? 'Zoom out' : 'Отдалить карту'}
          data-testid="btn-zoom-out"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Zoom Level Indicator */}
        <span className="px-2 text-xs font-bold text-slate-800 min-w-[42px] text-center select-none">
          {Math.round(zoom * 100)}%
        </span>

        {/* Zoom In (+) */}
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          title={isEnglish ? 'Zoom in' : 'Приблизить карту'}
          aria-label={isEnglish ? 'Zoom in' : 'Приблизить карту'}
          data-testid="btn-zoom-in"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-slate-200 mx-0.5" />

        {/* Reset & Center Button */}
        <button
          type="button"
          onClick={handleResetCenter}
          title={isEnglish ? 'Reset zoom and re-center' : 'Сбросить масштаб и центрировать'}
          aria-label={isEnglish ? 'Reset zoom and re-center' : 'Сбросить масштаб и центрировать'}
          data-testid="btn-reset-center"
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEnglish ? 'Reset' : 'Сброс'}</span>
        </button>
      </div>

      {/* --- 3. BOTTOM-LEFT TELEMETRY BADGE --- */}
      <div className="hidden md:flex absolute left-3.5 bottom-3.5 z-20 items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium pointer-events-none shadow-lg">
        <Radio className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          {isEnglish
            ? 'UAV Survey • 5 cm/px • DJI Mavic 3M'
            : 'Съемка БПЛА • 5 см/пикс • DJI Mavic 3M'}
        </span>
      </div>
    </div>
  );
};
