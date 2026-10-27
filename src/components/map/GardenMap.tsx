import React, { useState, useRef, useCallback } from 'react';
import { 
  BookOpen, 
  Layers, 
  Plus, 
  Minus, 
  Navigation 
} from 'lucide-react';
import { GardenSector } from '../../types';
import gardenMapRef from '../../assets/garden_map_ref.jpg';

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

  const getMaturityColor = (percent: number) => {
    if (percent >= 75) return '#059669'; // deep emerald
    if (percent >= 60) return '#d97706'; // amber
    return '#dc2626'; // red
  };

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
            </defs>

            {/* Sector Polygons */}
            {SECTOR_GEOMETRIES.map((geom) => {
              const isSelected = selectedSectorId === geom.id;
              const isHovered = hoveredSectorId === geom.id;

              return (
                <polygon
                  key={geom.id}
                  points={geom.polygon}
                  data-testid={`sector-polygon-${geom.id}`}
                  className="pointer-events-auto transition-all duration-200 cursor-pointer"
                  fill={
                    isSelected
                      ? 'rgba(16, 185, 129, 0.22)'
                      : isHovered
                      ? 'rgba(255, 255, 255, 0.18)'
                      : 'transparent'
                  }
                  stroke={
                    isSelected
                      ? '#ffffff'
                      : showLayers
                      ? isHovered
                        ? '#ffffff'
                        : 'rgba(255, 255, 255, 0.5)'
                      : 'transparent'
                  }
                  strokeWidth={isSelected ? '2.5' : isHovered ? '2' : showLayers ? '1.2' : '0'}
                  strokeDasharray={isSelected ? 'none' : showLayers ? '3 2' : 'none'}
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
              const percent = sectorData?.maturityPercent ?? 70;
              const maturityColor = getMaturityColor(percent);

              return (
                <g
                  key={`badge-${geom.id}`}
                  transform={`translate(${geom.badge.x}, ${geom.badge.y})`}
                  className="pointer-events-auto cursor-pointer transition-transform duration-150"
                  filter="url(#badgeShadowMap)"
                  onClick={() => onSelectSector(geom.id)}
                  onMouseEnter={() => setHoveredSectorId(geom.id)}
                  onMouseLeave={() => setHoveredSectorId(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Выбрать ${geom.name}, готовность ${percent}%`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
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
                    {geom.name}
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
          </svg>
        </div>
      </div>

      {/* Floating Toolbar: Lower-left position matching reference */}
      <div
        className="absolute left-3 sm:left-4 bottom-3 sm:bottom-4 z-20 flex flex-col items-center gap-1 p-1 sm:p-1.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/90 text-slate-700 pointer-events-auto"
        data-testid="map-toolbar"
      >
        {/* Toggle NDVI / RGB */}
        <button
          type="button"
          onClick={() => setMapMode((prev) => (prev === 'ndvi' ? 'rgb' : 'ndvi'))}
          title={mapMode === 'ndvi' ? 'Режим: Спектральный NDVI (клик для RGB)' : 'Режим: Ортофото RGB (клик для NDVI)'}
          aria-label="Переключить спектральный режим NDVI / RGB"
          data-testid="btn-toggle-mode"
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            mapMode === 'ndvi'
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Toggle Layers */}
        <button
          type="button"
          onClick={() => setShowLayers((prev) => !prev)}
          title={showLayers ? 'Скрыть контуры секторов' : 'Показать контуры секторов'}
          aria-label="Включить/выключить границы участков"
          data-testid="btn-toggle-layers"
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            showLayers
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'hover:bg-slate-100 text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        <div className="w-5 h-px bg-slate-200 my-0.5" />

        {/* Zoom In (+) */}
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          title="Приблизить (+)"
          aria-label="Приблизить карту"
          data-testid="btn-zoom-in"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out (-) */}
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          title="Отдалить (-)"
          aria-label="Отдалить карту"
          data-testid="btn-zoom-out"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Reset & Center */}
        <button
          type="button"
          onClick={handleResetCenter}
          title="Центрировать и сбросить зум"
          aria-label="Сбросить центрирование и масштаб"
          data-testid="btn-reset-center"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Status & Zoom Pill (Bottom Right, visible on sm+) */}
      <div className="hidden sm:flex absolute right-3.5 bottom-3.5 z-20 items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-xs">
          {Math.round(zoom * 100)}%
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200/80 text-xs font-semibold text-emerald-800 shadow-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {mapMode === 'ndvi' ? 'NDVI Спектр' : 'Ортофото RGB'}
        </div>
      </div>
    </div>
  );
};
