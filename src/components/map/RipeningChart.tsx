import React from 'react';

export interface RipeningDataPoint {
  date: string;
  percent: number;
}

interface RipeningChartProps {
  history: RipeningDataPoint[];
  currentPercent?: number;
  className?: string;
}

export const RipeningChart: React.FC<RipeningChartProps> = ({
  history,
  currentPercent,
  className = '',
}) => {
  if (!history || history.length === 0) {
    return null;
  }

  const width = 340;
  const height = 150;
  const paddingX = 30;
  const paddingTop = 36;
  const paddingBottom = 30;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingTop - paddingBottom;

  const points = history.map((item, index) => {
    const x = paddingX + (index / (history.length - 1)) * plotWidth;
    // Map percent 0..100 to y
    const normalizedPercent = Math.max(0, Math.min(100, item.percent));
    const y = paddingTop + plotHeight - (normalizedPercent / 100) * plotHeight;
    return { ...item, x, y };
  });

  // Generate smooth cubic bezier SVG path
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

  const activeBadgeValue = currentPercent ?? lastPoint.percent;

  return (
    <div className={`w-full overflow-hidden ${className}`} data-testid="ripening-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
        aria-label="График динамики созревания"
      >
        <defs>
          <linearGradient id="ripeningFillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
            <stop offset="85%" stopColor="#10b981" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>

          <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#047857" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        <line
          x1={paddingX}
          y1={paddingTop}
          x2={width - paddingX}
          y2={paddingTop}
          stroke="#f1f5f9"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <line
          x1={paddingX}
          y1={paddingTop + plotHeight / 2}
          x2={width - paddingX}
          y2={paddingTop + plotHeight / 2}
          stroke="#f1f5f9"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <line
          x1={paddingX}
          y1={paddingTop + plotHeight}
          x2={width - paddingX}
          y2={paddingTop + plotHeight}
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Gradient fill under line */}
        <path
          d={areaPath}
          fill="url(#ripeningFillGradient)"
          className="transition-opacity duration-300"
        />

        {/* Smooth line */}
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, idx) => {
          const isLast = idx === points.length - 1;
          return (
            <g key={pt.date}>
              {/* Outer halo for last point */}
              {isLast && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  fill="#10b981"
                  fillOpacity="0.25"
                />
              )}
              {/* Point circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isLast ? '4.5' : '3.5'}
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth={isLast ? '2.5' : '2'}
              />
            </g>
          );
        })}

        {/* Active badge above the last point */}
        <g
          transform={`translate(${lastPoint.x - 22}, ${lastPoint.y - 30})`}
          filter="url(#badgeShadow)"
        >
          <path
            d="M 10 0 L 34 0 C 39.5 0 44 4.5 44 10 C 44 15.5 39.5 20 34 20 L 26 20 L 22 25 L 18 20 L 10 20 C 4.5 20 0 15.5 0 10 C 0 4.5 4.5 0 10 0 Z"
            fill="#d1fae5"
            stroke="#6ee7b7"
            strokeWidth="1"
          />
          <text
            x="22"
            y="14"
            textAnchor="middle"
            fill="#047857"
            fontSize="12"
            fontWeight="700"
            className="select-none font-sans"
          >
            {activeBadgeValue}%
          </text>
        </g>

        {/* Date labels on X axis */}
        {points.map((pt) => (
          <text
            key={`label-${pt.date}`}
            x={pt.x}
            y={height - 8}
            textAnchor="middle"
            fontSize="12"
            fill="#94a3b8"
            className="select-none font-medium"
          >
            {pt.date}
          </text>
        ))}
      </svg>
    </div>
  );
};
