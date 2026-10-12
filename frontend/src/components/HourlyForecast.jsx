import React, { useState, useRef, useEffect } from 'react';
import {
  Clock,
  Droplets,
  Wind,
  ChevronLeft,
  ChevronRight,
  Flame,
  Snowflake,
  Umbrella,
  History,
  Target,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const HourlyForecast = ({
  hourly = [],
  hourly1h = [],
  hourly3h = [],
  weather,
  unit,
}) => {
  const [intervalMode, setIntervalMode] = useState('1h'); // '1h' or '3h'
  const [filterMode, setFilterMode] = useState('upcoming'); // 'upcoming' | 'all' | 'past'
  const [selectedHour, setSelectedHour] = useState(null);
  const scrollRef = useRef(null);
  const currentCardRef = useRef(null);

  // Pick dataset based on interval mode
  const rawDataset =
    intervalMode === '1h'
      ? hourly1h && hourly1h.length > 0
        ? hourly1h
        : hourly
      : hourly3h && hourly3h.length > 0
      ? hourly3h
      : hourly;

  // Determine city local hour (0 - 23) from weather.local_time or fallback to browser local hour
  const currentLocalHour = React.useMemo(() => {
    if (weather?.local_time) {
      // Local time string: e.g. "1:02 PM", "01:02 PM", "13:02"
      const match = weather.local_time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (match) {
        let hr = parseInt(match[1], 10);
        const ampm = match[3]?.toUpperCase();
        if (ampm === 'PM' && hr < 12) hr += 12;
        if (ampm === 'AM' && hr === 12) hr = 0;
        return hr;
      }
    }
    return new Date().getHours();
  }, [weather?.local_time]);

  // Synchronize the dataset: Ensure the card matching the current local hour is flagged as NOW
  const synchronizedDataset = React.useMemo(() => {
    if (!rawDataset || rawDataset.length === 0) return [];

    let matchedIdx = -1;

    // 1. Try finding today's card matching currentLocalHour
    matchedIdx = rawDataset.findIndex(
      (h) => (h.dayLabel === 'Today' || !h.dayLabel) && h.hourOfDay === currentLocalHour
    );

    // 2. If not found, match by hourOfDay alone
    if (matchedIdx === -1) {
      matchedIdx = rawDataset.findIndex((h) => h.hourOfDay === currentLocalHour);
    }

    // 3. Fallback to existing isCurrent / isNow flag if present
    if (matchedIdx === -1) {
      matchedIdx = rawDataset.findIndex((h) => h.isCurrent || h.isNow);
    }

    if (matchedIdx === -1) matchedIdx = 0;

    return rawDataset.map((slot, idx) => ({
      ...slot,
      isCurrent: idx === matchedIdx,
      isNow: idx === matchedIdx,
      isPast: idx < matchedIdx,
      isFuture: idx > matchedIdx,
    }));
  }, [rawDataset, currentLocalHour]);

  // Filter dataset based on view mode (Upcoming, Full Timeline, or Earlier Today)
  const activeHourlyList = React.useMemo(() => {
    if (!synchronizedDataset || synchronizedDataset.length === 0) return [];

    if (filterMode === 'upcoming') {
      const upcoming = synchronizedDataset.filter((h) => !h.isPast);
      return upcoming.length > 0 ? upcoming : synchronizedDataset;
    }
    if (filterMode === 'past') {
      const past = synchronizedDataset.filter((h) => h.isPast || h.isCurrent);
      return past.length > 0 ? past : synchronizedDataset;
    }
    // 'all': full timeline
    return synchronizedDataset;
  }, [synchronizedDataset, filterMode]);

  // Find index of current hour
  const currentHourIndex = activeHourlyList.findIndex((h) => h.isCurrent || h.isNow);

  // Auto-scroll to Current Hour card on initial render or view change
  useEffect(() => {
    if (currentCardRef.current && scrollRef.current) {
      setTimeout(() => {
        currentCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }, 150);
    }
  }, [activeHourlyList, intervalMode, filterMode]);

  const handleCenterOnNow = () => {
    if (currentCardRef.current) {
      currentCardRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!rawDataset || rawDataset.length === 0) return null;

  // Compute peak high, low, and max rain across active list
  const temps = activeHourlyList.map((h) => h.temp);
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const maxTempSlot = activeHourlyList.find((h) => h.temp === maxTemp);
  const minTempSlot = activeHourlyList.find((h) => h.temp === minTemp);
  const maxRainSlot = [...activeHourlyList].sort((a, b) => (b.pop || 0) - (a.pop || 0))[0];

  const hasPastHours = synchronizedDataset.some((h) => h.isPast);

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 mb-6 overflow-hidden relative border border-white/10 shadow-2xl">
      {/* Multi-Tone Ambient Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Title, Interval Switcher & Navigation */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg shadow-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Hourly Forecast
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Hour Aligned
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Access previous hours earlier today or upcoming hours ahead
            </p>
          </div>
        </div>

        {/* View Mode & Interval Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          {/* Timeline View Filter */}
          <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterMode('upcoming')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterMode === 'upcoming'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              From Now
            </button>
            {hasPastHours && (
              <button
                type="button"
                onClick={() => setFilterMode('past')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  filterMode === 'past'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Earlier Today
              </button>
            )}
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterMode === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Day
            </button>
          </div>

          {/* 1h vs 3h Interval Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-xs font-bold">
            <button
              type="button"
              onClick={() => setIntervalMode('1h')}
              className={`px-2.5 py-1.5 rounded-xl transition-all ${
                intervalMode === '1h'
                  ? 'bg-white/20 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1h
            </button>
            <button
              type="button"
              onClick={() => setIntervalMode('3h')}
              className={`px-2.5 py-1.5 rounded-xl transition-all ${
                intervalMode === '3h'
                  ? 'bg-white/20 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3h
            </button>
          </div>

          {/* Center on Now button + Scroll Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCenterOnNow}
              className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1 text-xs font-bold shadow-sm"
              title="Jump directly to current hour"
            >
              <Target className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Now</span>
            </button>

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

      {/* Atmospheric Summary Metrics Strip with High-Contrast Multi-Tone Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5 text-xs font-semibold">
        {maxTempSlot && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-400/35 text-amber-200 shadow-sm backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              Peak: <strong>{formatTemperature(maxTemp, unit)}</strong> at {maxTempSlot.time}
            </span>
          </div>
        )}
        {minTempSlot && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-400/35 text-indigo-200 shadow-sm backdrop-blur-md">
            <Snowflake className="w-4 h-4 text-indigo-300 shrink-0" />
            <span className="truncate">
              Low: <strong>{formatTemperature(minTemp, unit)}</strong> at {minTempSlot.time}
            </span>
          </div>
        )}
        {maxRainSlot && (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-teal-500/20 to-emerald-500/10 border border-teal-400/35 text-teal-200 shadow-sm backdrop-blur-md">
            <Umbrella className="w-4 h-4 text-teal-300 shrink-0" />
            <span className="truncate">
              Max Rain: <strong>{maxRainSlot.pop || 0}%</strong> at {maxRainSlot.time}
            </span>
          </div>
        )}
      </div>

      {/* Horizontal Scrolling Card Track */}
      <div
        ref={scrollRef}
        className="relative z-10 flex items-stretch gap-3 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar select-none"
      >
        {activeHourlyList.map((item, idx) => {
          const isCurrent = item.isCurrent || item.isNow;
          const isPast = item.isPast;
          const isSelected = selectedHour?.time === item.time && selectedHour?.dayLabel === item.dayLabel;
          const pop = item.pop || 0;
          const isDayHour = (item.hourOfDay >= 6 && item.hourOfDay <= 18);

          return (
            <div
              key={idx}
              ref={isCurrent ? currentCardRef : null}
              onClick={() => setSelectedHour(item)}
              className={`flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-3xl shrink-0 w-28 sm:w-32 text-center transition-all cursor-pointer relative group border ${
                isCurrent
                  ? 'bg-gradient-to-b from-emerald-500/30 via-teal-900/50 to-slate-900/90 border-emerald-400 ring-2 ring-emerald-400/60 shadow-2xl shadow-emerald-500/40 scale-[1.04] z-20'
                  : isSelected
                  ? 'bg-gradient-to-b from-cyan-500/25 via-blue-900/40 to-slate-900/80 border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl scale-[1.02] z-10'
                  : isPast
                  ? 'bg-slate-900/65 border-white/10 opacity-75 hover:opacity-100 hover:bg-slate-800/70 hover:border-white/20'
                  : isDayHour
                  ? 'bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-slate-900/75 border-amber-400/25 shadow-lg shadow-amber-950/20 hover:border-amber-300/50 hover:bg-amber-500/20'
                  : 'bg-gradient-to-b from-indigo-600/20 via-purple-950/25 to-slate-900/80 border-indigo-400/25 shadow-lg shadow-indigo-950/30 hover:border-indigo-300/50 hover:bg-indigo-600/25'
              }`}
            >
              {/* Top Tag: Now / Past / Upcoming */}
              <div className="mb-1 w-full">
                {isCurrent ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-400 text-slate-950 shadow-md flex items-center justify-center gap-1 shrink-0 whitespace-nowrap mx-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping inline-block shrink-0" />
                    NOW
                  </span>
                ) : isPast ? (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-0.5">
                    <History className="w-2.5 h-2.5 text-slate-500" />
                    <span>Past</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
                    {isDayHour ? (
                      <Sun className="w-2.5 h-2.5 text-amber-400" />
                    ) : (
                      <Moon className="w-2.5 h-2.5 text-indigo-400" />
                    )}
                    <span>{item.dayLabel || 'Ahead'}</span>
                  </span>
                )}
              </div>

              {/* Exact Hour Label */}
              <div
                className={`text-sm font-extrabold tracking-tight ${
                  isCurrent ? 'text-emerald-300' : isPast ? 'text-slate-300' : 'text-white'
                }`}
              >
                {item.time}
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
              <div className="text-base sm:text-lg font-black text-white tracking-tight my-0.5">
                {formatTemperature(item.temp, unit)}
              </div>

              {/* Feels Like */}
              {item.feels_like !== undefined && (
                <div className="text-[10px] text-slate-400 font-medium truncate w-full">
                  Feels {formatTemperature(item.feels_like, unit)}
                </div>
              )}

              {/* Rain Risk Pill */}
              <div className="mt-2 w-full">
                {pop > 0 ? (
                  <div
                    className={`flex items-center justify-center gap-1 py-0.5 px-1.5 rounded-xl text-[10px] font-bold ${
                      pop > 50
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : pop > 20
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-teal-500/15 text-teal-300 border border-teal-500/20'
                    }`}
                  >
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{pop}%</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 py-0.5 font-semibold">
                    0% rain
                  </div>
                )}
              </div>

              {/* Wind Speed */}
              {item.wind_speed !== undefined && (
                <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-slate-400">
                  <Wind className="w-2.5 h-2.5 text-slate-500" />
                  <span>{item.wind_speed} km/h</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Hour Telemetry Detail Drawer */}
      {selectedHour && (
        <div className="relative z-10 mt-4 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <img
              src={`https://openweathermap.org/img/wn/${selectedHour.icon}.png`}
              alt={selectedHour.description}
              className="w-12 h-12 object-contain drop-shadow"
            />
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
                <span>{selectedHour.time} Snapshot</span>
                {selectedHour.isCurrent && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                    Present Hour
                  </span>
                )}
                {selectedHour.isPast && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-700 text-slate-300">
                    Recorded History
                  </span>
                )}
                <span className="capitalize text-amber-300 text-xs">
                  • {selectedHour.description}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Temperature: <strong>{formatTemperature(selectedHour.temp, unit)}</strong> (Feels like {formatTemperature(selectedHour.feels_like, unit)})
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
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
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition-colors ml-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
