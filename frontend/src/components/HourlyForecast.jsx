import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const HourlyForecast = ({ hourly = [], unit }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="glass-card rounded-3xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          24-Hour Forecast
        </h3>
      </div>

      {/* Horizontal Scrolling Card Track */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth">
        {hourly.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 shrink-0 w-24 text-center transition-all glass-card-hover"
          >
            {/* Time Label */}
            <span className="text-xs font-semibold text-slate-300">
              {item.time}
            </span>

            {/* Weather Icon */}
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}.png`}
              alt={item.description}
              className="w-11 h-11 object-contain my-1"
            />

            {/* Precipitation Chance */}
            {item.pop > 0 ? (
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-cyan-400 my-0.5">
                <Droplets className="w-2.5 h-2.5" />
                {item.pop}%
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 my-0.5">--</span>
            )}

            {/* Temperature */}
            <span className="text-sm font-bold text-white mt-1">
              {formatTemperature(item.temp, unit)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
