import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const DailyForecast = ({ daily = [], unit }) => {
  if (!daily || daily.length === 0) return null;

  // Find min and max for all 5 days to normalize progress bar
  const allMins = daily.map((d) => d.temp_min);
  const allMaxs = daily.map((d) => d.temp_max);
  const absoluteMin = Math.min(...allMins);
  const absoluteMax = Math.max(...allMaxs);
  const tempRange = Math.max(1, absoluteMax - absoluteMin);

  return (
    <div className="glass-card rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          5-Day Forecast
        </h3>
      </div>

      <div className="space-y-3">
        {daily.map((item, idx) => {
          // Progress bar calculation for Apple-style temperature range
          const leftPercent = Math.max(0, ((item.temp_min - absoluteMin) / tempRange) * 100);
          const widthPercent = Math.max(12, ((item.temp_max - item.temp_min) / tempRange) * 100);

          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-medium glass-card-hover"
            >
              {/* Day Name */}
              <span className="w-14 text-white font-bold shrink-0">
                {idx === 0 ? 'Today' : item.day}
              </span>

              {/* Weather Icon & Rain % */}
              <div className="flex items-center gap-2 w-28 shrink-0">
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                  alt={item.description}
                  className="w-8 h-8 object-contain"
                />
                {item.pop > 0 ? (
                  <span className="text-xs font-semibold text-cyan-400 flex items-center gap-0.5">
                    <Droplets className="w-3 h-3" />
                    {item.pop}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">0%</span>
                )}
              </div>

              {/* Low Temp */}
              <span className="w-12 text-right text-slate-400 font-semibold shrink-0">
                {formatTemperature(item.temp_min, unit)}
              </span>

              {/* Visual Temperature Range Bar (Apple Weather style) */}
              <div className="flex-1 max-w-xs mx-2 h-2 rounded-full bg-white/10 relative overflow-hidden hidden sm:block">
                <div
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 shadow-sm"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>

              {/* High Temp */}
              <span className="w-12 text-right text-white font-bold shrink-0">
                {formatTemperature(item.temp_max, unit)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
