import React, { useState, useRef } from 'react';
import {
  Clock,
  Droplets,
  Wind,
  ChevronLeft,
  ChevronRight,
  Flame,
  Snowflake,
  Umbrella,
  Sparkles,
} from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const HourlyForecast = ({
  hourly = [],
  hourly1h = [],
  hourly3h = [],
  unit,
}) => {
  const [intervalMode, setIntervalMode] = useState('1h'); // '1h' or '3h'
  const [selectedHour, setSelectedHour] = useState(null);
  const scrollRef = useRef(null);

  // Pick dataset based on mode with robust fallbacks
  const activeHourlyList =
    intervalMode === '1h'
      ? hourly1h && hourly1h.length > 0
        ? hourly1h
        : hourly
      : hourly3h && hourly3h.length > 0
      ? hourly3h
      : hourly;

  if (!activeHourlyList || activeHourlyList.length === 0) return null;

  // Compute peak high, low, and max rain
  const temps = activeHourlyList.map((h) => h.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const maxTempSlot = activeHourlyList.find((h) => h.temp === maxTemp);
  const minTempSlot = activeHourlyList.find((h) => h.temp === minTemp);
  const maxRainSlot = [...activeHourlyList].sort((a, b) => (b.pop || 0) - (a.pop || 0))[0];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 mb-6 overflow-hidden relative">
      {/* Ambient Radial Highlights */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and 1-Hour vs 3-Hour Interval Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Hourly Forecast
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {intervalMode === '1h' ? '1-Hour Intervals' : '3-Hour Intervals'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {intervalMode === '1h'
                ? 'Detailed consecutive hourly atmospheric timeline'
                : 'Standard 3-hour synoptic meteorological intervals'}
            </p>
          </div>
        </div>

        {/* Interval Selector Toggle + Scroll Arrows */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* 1h vs 3h Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setIntervalMode('1h')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                intervalMode === '1h'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Every 1 Hour
            </button>
            <button
              type="button"
              onClick={() => setIntervalMode('3h')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                intervalMode === '3h'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Every 3 Hours
            </button>
          </div>

          {/* Scroll Nav Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all active:scale-95 border border-white/10"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all active:scale-95 border border-white/10"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Atmospheric Summary Pills */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5 text-xs font-semibold">
        {maxTempSlot && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              Peak: <strong>{formatTemperature(maxTemp, unit)}</strong> at {maxTempSlot.time}
            </span>
          </div>
        )}
        {minTempSlot && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
            <Snowflake className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">
              Low: <strong>{formatTemperature(minTemp, unit)}</strong> at {minTempSlot.time}
            </span>
          </div>
        )}
        {maxRainSlot && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            <Umbrella className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">
              Rain Chance: <strong>{maxRainSlot.pop}%</strong> at {maxRainSlot.time}
            </span>
          </div>
        )}
      </div>

      {/* Horizontal Scrolling Card Track */}
      <div
        ref={scrollRef}
        className="relative z-10 flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar"
      >
        {activeHourlyList.map((item, idx) => {
          const isNow = idx === 0;
          const isSelected = selectedHour?.time === item.time;
          const pop = item.pop || 0;

          return (
            <div
              key={idx}
              onClick={() => setSelectedHour(item)}
              className={`flex flex-col items-center justify-between p-4 rounded-3xl shrink-0 w-28 text-center transition-all cursor-pointer relative group border ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-500/25 to-blue-600/30 border-cyan-400 ring-2 ring-cyan-400/30 shadow-xl shadow-cyan-500/20 scale-[1.02]'
                  : isNow
                  ? 'bg-white/15 border-cyan-400/50 shadow-lg'
                  : 'bg-white/5 hover:bg-white/15 border-white/10 hover:border-white/20'
              }`}
            >
              {/* "Now" or Top Time Badge */}
              <div className="mb-1">
                {isNow ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-cyan-400 text-slate-900 shadow-sm animate-pulse">
                    Now
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                    {item.time}
                  </span>
                )}
              </div>

              {/* Weather Icon */}
              <div className="relative my-1">
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon || '01d'}.png`}
                  alt={item.description}
                  className="w-12 h-12 object-contain drop-shadow group-hover:scale-110 transition-transform"
                />
              </div>

              {/* Temperature */}
              <div className="text-base font-black text-white tracking-tight my-0.5">
                {formatTemperature(item.temp, unit)}
              </div>

              {/* Feels Like Subtitle */}
              {item.feels_like !== undefined && (
                <div className="text-[10px] text-slate-400 font-medium">
                  Feels {formatTemperature(item.feels_like, unit)}
                </div>
              )}

              {/* Precipitation Pill */}
              <div className="mt-2 w-full">
                {pop > 0 ? (
                  <div className="flex items-center justify-center gap-1 py-1 px-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/20 text-[10px] font-bold text-cyan-300">
                    <Droplets className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{pop}%</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 py-1 font-semibold">
                    0% rain
                  </div>
                )}
              </div>

              {/* Wind Speed / Humidity Mini Metric */}
              {item.wind_speed !== undefined && (
                <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-slate-400">
                  <Wind className="w-2.5 h-2.5 text-slate-400" />
                  <span>{item.wind_speed} km/h</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Hour Telemetry Detail Modal/Banner */}
      {selectedHour && (
        <div className="relative z-10 mt-4 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <img
              src={`https://openweathermap.org/img/wn/${selectedHour.icon}.png`}
              alt={selectedHour.description}
              className="w-10 h-10 object-contain"
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Detailed Snapshot: {selectedHour.time}</span>
                <span className="capitalize text-cyan-300 text-xs">
                  • {selectedHour.description}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Temperature: <strong>{formatTemperature(selectedHour.temp, unit)}</strong> (Feels like {formatTemperature(selectedHour.feels_like, unit)})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              💧 Rain: {selectedHour.pop || 0}%
            </span>
            {selectedHour.humidity && (
              <span className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Humidity: {selectedHour.humidity}%
              </span>
            )}
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-white/10">
              💨 Wind: {selectedHour.wind_speed || 0} km/h
            </span>
            <button
              type="button"
              onClick={() => setSelectedHour(null)}
              className="text-xs text-slate-400 hover:text-white underline ml-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

