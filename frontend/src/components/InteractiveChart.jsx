import React, { useState } from 'react';
import { TrendingUp, Droplets, Wind, Sparkles, Activity, Info } from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const InteractiveChart = ({
  hourly = [],
  hourly1h = [],
  hourly3h = [],
  unit,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [intervalMode, setIntervalMode] = useState('1h');
  const [activeMetric, setActiveMetric] = useState('temp'); // 'temp' | 'pop' | 'wind'

  // Select active dataset
  const activeHourly =
    intervalMode === '1h'
      ? hourly1h && hourly1h.length > 0
        ? hourly1h
        : hourly
      : hourly3h && hourly3h.length > 0
      ? hourly3h
      : hourly;

  if (!activeHourly || activeHourly.length < 2) return null;

  // Chart Dimensions
  const height = 190;
  const width = 680;
  const paddingX = 40;
  const paddingY = 40;

  // Metric extraction
  const metricValues = activeHourly.map((h) => {
    if (activeMetric === 'pop') return h.pop || 0;
    if (activeMetric === 'wind') return h.wind_speed || 0;
    return h.temp;
  });

  const minVal = Math.min(...metricValues);
  const maxVal = Math.max(...metricValues);
  const valSpan = Math.max(1, maxVal - minVal);

  // Compute Coordinates for points
  const points = activeHourly.map((item, index) => {
    const val = metricValues[index];
    const x = paddingX + (index / (activeHourly.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / valSpan) * (height - 2 * paddingY);
    return { x, y, item, index, val };
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

  const formatMetricDisplay = (val) => {
    if (activeMetric === 'pop') return `${val}% Rain`;
    if (activeMetric === 'wind') return `${val} km/h`;
    return formatTemperature(val, unit);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 mb-6 overflow-hidden relative">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Title + Resolution Toggle + Metric Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                24-Hour Atmospheric Curve
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {intervalMode === '1h' ? '1-Hour (24 Pts)' : '3-Hour (8 Pts)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive mathematical Bezier visualization with scrub telemetry
            </p>
          </div>
        </div>

        {/* Action Controls: Metric Tabs + Interval Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-between lg:justify-end">
          {/* Metric Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveMetric('temp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeMetric === 'temp'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Temp
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('pop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeMetric === 'pop'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rain %
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('wind')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeMetric === 'wind'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wind
            </button>
          </div>

          {/* Interval Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setIntervalMode('1h')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                intervalMode === '1h'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1h
            </button>
            <button
              type="button"
              onClick={() => setIntervalMode('3h')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                intervalMode === '3h'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3h
            </button>
          </div>
        </div>
      </div>

      {/* Scrub Highlight Card Banner */}
      {activePoint && (
        <div className="mb-3 px-4 py-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-cyan-300 font-bold">{activePoint.item.time}:</span>
            <span className="text-sm font-black text-white">
              {formatMetricDisplay(activePoint.val)}
            </span>
            <span className="text-slate-400 capitalize">({activePoint.item.description})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-300">
              Temp: <strong>{formatTemperature(activePoint.item.temp, unit)}</strong>
            </span>
            {activePoint.item.pop > 0 && (
              <span className="text-cyan-400 flex items-center gap-1 font-bold">
                <Droplets className="w-3 h-3" />
                {activePoint.item.pop}%
              </span>
            )}
            <span className="text-slate-400">
              Wind: {activePoint.item.wind_speed} km/h
            </span>
          </div>
        </div>
      )}

      {/* SVG Canvas Track */}
      <div className="relative w-full overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 overflow-visible select-none"
        >
          <defs>
            {/* Gradient Fill for Area */}
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
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

          {/* Scrub Cursor Line on Hover */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingY - 10}
              x2={activePoint.x}
              y2={height - 20}
              stroke="#22d3ee"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.8"
            />
          )}

          {/* Data Points on Curve */}
          {points.map((pt) => {
            const isHovered = hoveredIndex === pt.index;
            const isMin = pt.val === minVal;
            const isMax = pt.val === maxVal;

            return (
              <g
                key={pt.index}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(pt.index)}
              >
                {/* Hit target */}
                <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                {/* Point ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6.5 : isMin || isMax ? 4.5 : 2.5}
                  fill={isHovered ? '#22d3ee' : isMax ? '#fbbf24' : isMin ? '#60a5fa' : '#ffffff'}
                  stroke="#0f172a"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  className="transition-all"
                />

                {/* Min / Max Peak Badges */}
                {(isMax || isMin || isHovered) && (
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill={isMax ? '#fcd34d' : isMin ? '#93c5fd' : '#ffffff'}
                    fontSize={isHovered ? 12 : 10}
                    fontWeight="bold"
                    className="drop-shadow-sm pointer-events-none"
                  >
                    {formatMetricDisplay(pt.val)}
                  </text>
                )}

                {/* X-Axis Hour Labels (smartly spaced) */}
                {(points.length <= 12 || pt.index % 2 === 0 || isHovered) && (
                  <text
                    x={pt.x}
                    y={height - 6}
                    textAnchor="middle"
                    fill={isHovered ? '#22d3ee' : '#94a3b8'}
                    fontSize="10"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    className="pointer-events-none"
                  >
                    {pt.item.time}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2 border-t border-white/5 pt-2">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Hover over data points to inspect curve, temperature, and atmospheric readings.
        </span>
        <span className="text-slate-300">
          Peak: <strong className="text-white">{formatMetricDisplay(maxVal)}</strong> | Low: <strong className="text-white">{formatMetricDisplay(minVal)}</strong>
        </span>
      </div>
    </div>
  );
};
