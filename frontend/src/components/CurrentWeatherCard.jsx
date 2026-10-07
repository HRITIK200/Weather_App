import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Thermometer, Clock } from 'lucide-react';
import { formatTemperature, getConditionEmoji } from '../utils/weatherUtils';

export const CurrentWeatherCard = ({ weather, unit }) => {
  if (!weather) return null;

  const {
    name,
    country,
    temp,
    temp_min,
    temp_max,
    feels_like,
    description,
    main,
    icon,
    local_time,
  } = weather;

  const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@4x.png`
    : null;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Column: Location & Temperature */}
        <div className="text-center md:text-left">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 mb-3">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              {name}
            </span>
            {country && (
              <span className="text-xs uppercase font-semibold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                {country}
              </span>
            )}
          </div>

          {/* Local City Time */}
          {local_time && (
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400 font-medium mb-4">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Local Time: {local_time}</span>
            </div>
          )}

          {/* Big Temperature Hero */}
          <div className="flex items-baseline justify-center md:justify-start gap-3">
            <span className="text-7xl sm:text-8xl font-black tracking-tighter text-white drop-shadow-lg">
              {formatTemperature(temp, unit)}
            </span>
          </div>

          {/* Feels Like & High/Low Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-3 text-xs font-semibold">
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-300">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Feels like {formatTemperature(feels_like, unit)}
            </span>

            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-emerald-300">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              High {formatTemperature(temp_max, unit)}
            </span>

            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-blue-300">
              <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
              Low {formatTemperature(temp_min, unit)}
            </span>
          </div>
        </div>

        {/* Right Column: Weather Icon & Condition Tagline */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center animate-float">
            {iconUrl ? (
              <img
                src={iconUrl}
                alt={description}
                className="w-full h-full object-contain drop-shadow-2xl filter"
              />
            ) : (
              <span className="text-7xl">{getConditionEmoji(main)}</span>
            )}
          </div>

          <div className="text-xl sm:text-2xl font-bold capitalize text-white tracking-wide mt-1">
            {description}
          </div>
          <div className="text-xs uppercase font-semibold tracking-widest text-cyan-400/90 mt-0.5">
            {main}
          </div>
        </div>
      </div>
    </div>
  );
};
