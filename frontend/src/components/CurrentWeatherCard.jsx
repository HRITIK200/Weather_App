import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Thermometer, Clock, Sparkles } from 'lucide-react';
import { formatTemperature, getConditionEmoji, getConditionAccents } from '../utils/weatherUtils';

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

  const accents = getConditionAccents(main || 'clear');

  // Temperature gradient styling based on warmth
  const tempGradient =
    temp >= 28
      ? 'from-amber-200 via-orange-100 to-amber-400'
      : temp >= 18
      ? 'from-white via-amber-100 to-orange-200'
      : temp >= 10
      ? 'from-white via-slate-100 to-sky-200'
      : 'from-sky-100 via-cyan-100 to-blue-300';

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-8 mb-6 relative overflow-hidden border border-white/10 shadow-2xl">
      {/* Dynamic Condition-Aware Ambient Lighting Orbs */}
      <div className={`absolute -top-24 -right-24 w-80 h-80 rounded-full ${accents.glow1} blur-3xl pointer-events-none transition-all duration-700`} />
      <div className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full ${accents.glow2} blur-3xl pointer-events-none transition-all duration-700`} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Left Column: Location, Local Time & Temperature */}
        <div className="text-center md:text-left w-full md:w-auto">
          {/* Location Badge with Multi-Tone Accents */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 mb-2.5 backdrop-blur-md shadow-sm flex-wrap justify-center md:justify-start">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-sm font-bold text-white tracking-wide">
              {weather.displayName || name}
            </span>
            {weather.areaType && (
              <span className="text-[10px] uppercase font-bold text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
                {weather.areaType}
              </span>
            )}
            {country && (
              <span className="text-xs uppercase font-extrabold text-amber-300 px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/30">
                {country}
              </span>
            )}
          </div>

          {/* Locality Subtitle & Postal Details */}
          {(weather.subtitle || weather.postcode) && (
            <div className="text-xs text-slate-300 font-medium mb-3 flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span>{weather.subtitle}</span>
              {weather.postcode && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/20">
                  PIN: {weather.postcode}
                </span>
              )}
              {weather.stationName && weather.stationName !== (weather.displayName || name) && (
                <span className="text-[10px] text-slate-400">
                  • Station: {weather.stationName}
                </span>
              )}
            </div>
          )}

          {/* Local City Time */}
          {local_time && (
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400 font-semibold mb-3">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Local Time: {local_time}</span>
            </div>
          )}

          {/* Big Radiant Temperature Hero */}
          <div className="flex items-baseline justify-center md:justify-start gap-3 my-1">
            <span className={`text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-b ${tempGradient} bg-clip-text text-transparent drop-shadow-2xl`}>
              {formatTemperature(temp, unit)}
            </span>
          </div>

          {/* Feels Like & High/Low Pills with Multi-Color Indicators */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 shadow-sm">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Feels like {formatTemperature(feels_like, unit)}
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shadow-sm">
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              High {formatTemperature(temp_max, unit)}
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 shadow-sm">
              <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
              Low {formatTemperature(temp_min, unit)}
            </span>
          </div>
        </div>

        {/* Right Column: Weather Icon & Condition Tagline */}
        <div className="flex flex-col items-center justify-center text-center shrink-0">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center animate-float">
            {iconUrl ? (
              <img
                src={iconUrl}
                alt={description}
                className="w-full h-full object-contain drop-shadow-2xl filter"
              />
            ) : (
              <span className="text-7xl sm:text-8xl">{getConditionEmoji(main)}</span>
            )}
          </div>

          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold capitalize text-white tracking-wide mt-1">
            {description}
          </div>
          <div className="text-xs uppercase font-extrabold tracking-widest text-amber-300/90 mt-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{main}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
