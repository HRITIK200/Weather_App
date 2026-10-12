import React, { useState } from 'react';
import { Calendar, Droplets, ChevronDown, ChevronUp, Wind, Thermometer, ShieldCheck } from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const DailyForecast = ({ daily = [], unit }) => {
  const [expandedDayIndex, setExpandedDayIndex] = useState(null);

  if (!daily || daily.length === 0) return null;

  // Find min and max for all 5 days to normalize progress bar
  const allMins = daily.map((d) => d.temp_min);
  const allMaxs = daily.map((d) => d.temp_max);
  const absoluteMin = Math.min(...allMins);
  const absoluteMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, absoluteMax - absoluteMin);

  const toggleExpand = (idx) => {
    setExpandedDayIndex(expandedDayIndex === idx ? null : idx);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 mb-6 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              5-Day Meteorological Outlook
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Extended synoptic range with temperature scale bars
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline-block">
          Click any day for details
        </span>
      </div>

      <div className="space-y-3">
        {daily.map((item, idx) => {
          const isToday = idx === 0;
          const isExpanded = expandedDayIndex === idx;

          // Progress bar calculation for Apple-style temperature range
          const leftPercent = Math.max(0, ((item.temp_min - absoluteMin) / tempRange) * 100);
          const widthPercent = Math.max(15, ((item.temp_max - item.temp_min) / tempRange) * 100);

          return (
            <div
              key={idx}
              className={`rounded-2xl transition-all border ${
                isExpanded
                  ? 'bg-white/10 border-cyan-400/50 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Main Row */}
              <div
                onClick={() => toggleExpand(idx)}
                className="flex items-center justify-between gap-3 p-3.5 sm:p-4 text-sm font-medium cursor-pointer select-none"
              >
                {/* Day Name & Indicator */}
                <div className="w-20 shrink-0">
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <span>{isToday ? 'Today' : item.day}</span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.date ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                  </div>
                </div>

                {/* Weather Icon, Condition & Rain % */}
                <div className="flex items-center gap-2.5 w-36 sm:w-44 shrink-0">
                  <img
                    src={`https://openweathermap.org/img/wn/${item.icon || '01d'}.png`}
                    alt={item.description}
                    className="w-9 h-9 object-contain drop-shadow"
                  />
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-200 capitalize truncate">
                      {item.description}
                    </div>
                    {item.pop > 0 ? (
                      <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-0.5">
                        <Droplets className="w-2.5 h-2.5" />
                        {item.pop}% rain
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Dry</span>
                    )}
                  </div>
                </div>

                {/* Low Temp */}
                <span className="w-12 text-right text-slate-400 font-bold shrink-0">
                  {formatTemperature(item.temp_min, unit)}
                </span>

                {/* Visual Temperature Range Bar (Apple Weather style) */}
                <div className="flex-1 max-w-xs mx-3 h-2 rounded-full bg-slate-800/80 relative overflow-hidden hidden sm:block border border-white/5">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 shadow-sm"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                {/* High Temp */}
                <span className="w-12 text-right text-white font-extrabold shrink-0">
                  {formatTemperature(item.temp_max, unit)}
                </span>

                {/* Expand Chevron */}
                <div className="text-slate-400 hover:text-white shrink-0 ml-1">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Expanded Day Diagnostics Drawer */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                      Spread: <strong>{Math.round(item.temp_max - item.temp_min)}°</strong> variation
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      Precipitation Risk: <strong>{item.pop}%</strong>
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-white/10 text-cyan-300 font-semibold border border-white/10">
                    {item.pop > 50 ? '🌧️ Umbrella Advised' : item.temp_max > 30 ? '☀️ Sunscreen Recommended' : '✨ Pleasant Outlook'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
