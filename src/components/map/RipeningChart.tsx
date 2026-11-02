import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

export interface RipeningDataPoint {
  date: string;
  percent: number;
}

interface RipeningChartProps {
  history: RipeningDataPoint[];
  currentPercent?: number;
  className?: string;
}

export const getMaturityStage = (
  percent: number,
  isEnglish: boolean = false
): { text: string; color: string; bg: string } => {
  if (percent >= 75) {
    return {
      text: isEnglish ? 'Ready for Harvest' : 'Готов к сбору',
      color: '#047857',
      bg: '#d1fae5',
    };
  }
  if (percent >= 60) {
    return {
      text: isEnglish ? 'Active Ripening' : 'Активное созревание',
      color: '#b45309',
      bg: '#fef3c7',
    };
  }
  return {
    text: isEnglish ? 'Early Phase' : 'Ранняя фаза',
    color: '#0369a1',
    bg: '#e0f2fe',
  };
};

export const RipeningChart: React.FC<RipeningChartProps> = ({
  history,
  currentPercent,
  className = '',
}) => {
  const { isEnglish } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!history || history.length === 0) {
    return null;
  }

  // Dimensions with room for Y-axis steps and top tooltip
  const width = 360;
  const height = 175;
  const paddingLeft = 44;
  const paddingRight = 24;
  const paddingTop = 36;
  const paddingBottom = 30;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Step ranking along Y axis (0%, 25%, 50%, 75%, 100%)
  const ySteps = [
    { value: 100, label: '100%' },
    { value: 75, label: '75%' },
    { value: 50, label: '50%' },
    { value: 25, label: '25%' },
    { value: 0, label: '0%' },
  ];

  const points = history.map((item, index) => {
    const x = paddingLeft + (index / (history.length - 1)) * plotWidth;
    const normalizedPercent = Math.max(0, Math.min(100, item.percent));
    const y = paddingTop + plotHeight - (normalizedPercent / 100) * plotHeight;
    return { ...item, x, y };
  });

  // Smooth cubic bezier path
  const generateSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx.toFixed(1)} ${p0.y.toFixed(1)}, ${cx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)} ${paddingTop + plotHeight} L ${firstPoint.x.toFixed(1)} ${paddingTop + plotHeight} Z`;

  // Determine active point to highlight
  const activeIndex = hoveredIndex ?? points.length - 1;
  const activePoint = points[activeIndex] || lastPoint;
  const activePercent = hoveredIndex !== null ? activePoint.percent : (currentPercent ?? lastPoint.percent);
  const stage = getMaturityStage(activePercent, isEnglish);

  // Compute safe tooltip position (keep inside SVG bounds)
  const tooltipX = Math.max(65, Math.min(width - 65, activePoint.x));
  const tooltipY = Math.max(26, activePoint.y - 12);

  return (
    <div
      className={`w-full overflow-hidden select-none ${className}`}
      data-testid="ripening-chart"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        aria-label={
          isEnglish
            ? 'Interactive fruit ripening dynamics chart with step rankings'
            : 'Интерактивный график динамики созревания с ранжированием'
        }
      >
        <defs>
          {/* Gradient area under curve */}
          <linearGradient id="ripeningFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#10b981" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>

          {/* Glow shadow for hover badge */}
          <filter id="interactiveTooltipShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#047857" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* --- Y-Axis Step Rankings & Horizontal Grid Lines --- */}
        {ySteps.map((step) => {
          const yPos = paddingTop + plotHeight - (step.value / 100) * plotHeight;
          const isBase = step.value === 0;
          return (
            <g key={`step-${step.value}`}>
              {/* Y Axis Label */}
              <text
                x={paddingLeft - 8}
                y={yPos + 3.5}
                textAnchor="end"
                fontSize="12"
                fontWeight="500"
                fill="#94a3b8"
                className="select-none font-sans"
              >
                {step.label}
              </text>

              {/* Grid Line */}
              <line
                x1={paddingLeft}
                y1={yPos}
                x2={width - paddingRight}
                y2={yPos}
                stroke={isBase ? '#cbd5e1' : '#e2e8f0'}
                strokeDasharray={isBase ? undefined : '3 3'}
                strokeWidth={isBase ? '1.2' : '0.8'}
              />
            </g>
          );
        })}

        {/* Gradient fill under curve with motion */}
        <motion.path
          d={areaPath}
          fill="url(#ripeningFillGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="pointer-events-none"
        />

        {/* Smooth ripening line with motion pathLength */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#059669"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="pointer-events-none"
        />

        {/* Vertical Crosshair Line on hover or active point */}
        <line
          x1={activePoint.x}
          y1={paddingTop}
          x2={activePoint.x}
          y2={paddingTop + plotHeight}
          stroke="#10b981"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          strokeOpacity={hoveredIndex !== null ? '0.9' : '0.4'}
          className="pointer-events-none transition-all duration-150"
        />

        {/* Data points with interactive hit areas and motion entrance */}
        {points.map((pt, idx) => {
          const isPointActive = idx === activeIndex;

          return (
            <g
              key={pt.date}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => setHoveredIndex(idx)}
              role="button"
              tabIndex={0}
              aria-label={`${pt.date}: ${pt.percent}%`}
            >
              {/* Invisible large touch/hover target */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="16"
                fill="transparent"
              />

              {/* Halo ring for active/hovered point */}
              {isPointActive && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="9"
                  fill="#10b981"
                  fillOpacity="0.25"
                  className="animate-pulse"
                />
              )}

              {/* Visible Point Circle with motion scale */}
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={isPointActive ? '5' : '3.5'}
                fill="#ffffff"
                stroke="#059669"
                strokeWidth={isPointActive ? '2.5' : '2'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25, delay: 0.1 + idx * 0.05 }}
                className="transition-colors duration-150"
              />
            </g>
          );
        })}

        {/* Floating Tooltip (Interactive on hover, or default badge when idle) */}
        {hoveredIndex !== null ? (
          <motion.g
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            transform={`translate(${tooltipX}, ${tooltipY})`}
            filter="url(#interactiveTooltipShadow)"
            className="pointer-events-none"
          >
            <rect
              x="-56"
              y="-22"
              width="112"
              height="26"
              rx="8"
              fill="#ffffff"
              stroke={stage.color}
              strokeWidth="1.2"
            />
            <polygon points="-4,4 4,4 0,8" fill="#ffffff" />
            <text x="-48" y="-5" fontSize="12" fontWeight="600" fill="#64748b" className="font-sans">
              {activePoint.date}
            </text>
            <text x="48" y="-5" textAnchor="end" fontSize="12" fontWeight="800" fill={stage.color} className="font-sans">
              {activePercent}%
            </text>
          </motion.g>
        ) : (
          <g
            transform={`translate(${lastPoint.x - 22}, ${lastPoint.y - 30})`}
            filter="url(#interactiveTooltipShadow)"
            className="pointer-events-none"
          >
            <path
              d="M 10 0 L 34 0 C 39.5 0 44 4.5 44 10 C 44 15.5 39.5 20 34 20 L 26 20 L 22 25 L 18 20 L 10 20 C 4.5 20 0 15.5 0 10 C 0 4.5 4.5 0 10 0 Z"
              fill={stage.bg}
              stroke={stage.color}
              strokeWidth="1"
            />
            <text
              x="22"
              y="14"
              textAnchor="middle"
              fill={stage.color}
              fontSize="12"
              fontWeight="700"
              className="select-none font-sans"
            >
              {activePercent}%
            </text>
          </g>
        )}

        {/* X Axis Date labels with active highlight */}
        {points.map((pt, idx) => {
          const isDateActive = idx === activeIndex;
          return (
            <text
              key={`label-${pt.date}`}
              x={pt.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="12"
              fontWeight={isDateActive ? '700' : '500'}
              fill={isDateActive ? '#047857' : '#94a3b8'}
              className="select-none font-sans cursor-pointer transition-colors"
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              {pt.date}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
