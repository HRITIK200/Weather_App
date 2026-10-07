import React, { useState } from 'react';
import { TrendingUp, Droplets, Info } from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const InteractiveChart = ({ hourly = [], unit }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!hourly || hourly.length < 2) return null;

  // Chart Dimensions
  const height = 180;
  const width = 640;
  const paddingX = 40;
  const paddingY = 35;

  const temps = hourly.map((h) => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempSpan = Math.max(1, maxTemp - minTemp);

  // Compute Coordinates for points
  const points = hourly.map((item, index) => {
    const x = paddingX + (index / (hourly.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((item.temp - minTemp) / tempSpan) * (height - 2 * paddingY);
    return { x, y, item, index };
  });

  // Construct smooth Bezier SVG curve
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - 10} L ${points[0].x} ${height - 10} Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[0];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 mb-6 overflow-hidden">
      {/* Title & Active Metric Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              24-Hour Temperature & Rain Trend
            </h3>
            <p className="text-xs text-slate-400">Interactive SVG atmospheric curve</p>
          </div>
        </div>

        {/* Hover Highlight Box */}
        {activePoint && (
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2">
            <span className="text-cyan-300">{activePoint.item.time}:</span>
            <span className="text-sm font-extrabold">{formatTemperature(activePoint.item.temp, unit)}</span>
            <span className="text-slate-400 capitalize">({activePoint.item.description})</span>
            {activePoint.item.pop > 0 && (
              <span className="flex items-center gap-0.5 text-cyan-400 font-bold ml-1">
                <Droplets className="w-3 h-3" />
                {activePoint.item.pop}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* SVG Canvas Track */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 overflow-visible select-none"
        >
          <defs>
            {/* Gradient Fill for Area */}
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>

            {/* Stroke Line Gradient */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Area under curve */}
          <path d={areaPath} fill="url(#curveGradient)" />

          {/* Curve Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Points & Tooltips */}
          {points.map((pt) => {
            const isHovered = hoveredIndex === pt.index;
            return (
              <g
                key={pt.index}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(pt.index)}
              >
                {/* Vertical hover indicator bar */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={pt.y}
                    x2={pt.x}
                    y2={height - 20}
                    stroke="rgba(255,255,255,0.3)"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                )}

                {/* Circle point */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  className={`transition-all duration-200 ${
                    isHovered
                      ? 'fill-white stroke-cyan-400 stroke-[3px] drop-shadow-md'
                      : 'fill-cyan-400 stroke-slate-900 stroke-2'
                  }`}
                />

                {/* Temperature label above point */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  className={`text-[11px] font-bold fill-white transition-opacity ${
                    isHovered ? 'opacity-100 font-extrabold' : 'opacity-85'
                  }`}
                >
                  {formatTemperature(pt.item.temp, unit)}
                </text>

                {/* Time label below chart */}
                <text
                  x={pt.x}
                  y={height - 5}
                  textAnchor="middle"
                  className={`text-[10px] font-medium fill-slate-400 transition-colors ${
                    isHovered ? 'fill-cyan-300 font-bold' : ''
                  }`}
                >
                  {pt.item.time}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2 border-t border-white/5 pt-2">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Hover over data points to inspect temperature curve and rain chances.
        </span>
        <span className="text-slate-300">
          Peak: <strong className="text-white">{formatTemperature(maxTemp, unit)}</strong> | Low: <strong className="text-white">{formatTemperature(minTemp, unit)}</strong>
        </span>
      </div>
    </div>
  );
};
