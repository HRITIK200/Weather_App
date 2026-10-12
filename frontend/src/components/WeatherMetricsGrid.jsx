import React from 'react';
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Cloud,
  Navigation2,
  Compass,
} from 'lucide-react';
import { getCompassDirection } from '../utils/weatherUtils';

export const WeatherMetricsGrid = ({ weather }) => {
  if (!weather) return null;

  const {
    wind_speed = 0,
    wind_deg = 0,
    humidity = 0,
    visibility = 10,
    pressure = 1013,
    sunrise,
    sunset,
    daylight_progress = 50,
    cloudiness = 0,
  } = weather;

  const compassDir = getCompassDirection(wind_deg);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
      {/* 1. Wind & Direction Card (Teal & Mint Accent) */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between border-t-2 border-t-teal-400/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5 text-teal-300">
            <Wind className="w-4 h-4 text-teal-400" />
            Wind & Direction
          </span>
          <span className="text-white font-extrabold px-2 py-0.5 rounded-md bg-white/10">{compassDir}</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl sm:text-4xl font-black text-white">{wind_speed}</span>
          <span className="text-sm font-bold text-slate-400">km/h</span>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
          <div
            className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center transition-transform duration-500"
            style={{ transform: `rotate(${wind_deg}deg)` }}
          >
            <Navigation2 className="w-3 h-3 text-teal-300 fill-teal-300" />
          </div>
          <span>Bearing {wind_deg}° ({compassDir})</span>
        </div>
      </div>

      {/* 2. Humidity Card (Azure & Sky Accent) */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between border-t-2 border-t-sky-400/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5 text-sky-300">
            <Droplets className="w-4 h-4 text-sky-400" />
            Humidity
          </span>
          <span className="text-white font-extrabold px-2 py-0.5 rounded-md bg-white/10">{humidity}%</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl sm:text-4xl font-black text-white">{humidity}</span>
          <span className="text-sm font-bold text-slate-400">%</span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          {humidity > 70
            ? 'High moisture, feels humid'
            : humidity < 35
            ? 'Dry air conditions'
            : 'Comfortable humidity balance'}
        </p>
      </div>

      {/* 3. Visibility Card (Emerald & Mint Accent) */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between border-t-2 border-t-emerald-400/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5 text-emerald-300">
            <Eye className="w-4 h-4 text-emerald-400" />
            Visibility
          </span>
          <span className="text-white font-extrabold px-2 py-0.5 rounded-md bg-white/10">{visibility} km</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl sm:text-4xl font-black text-white">{visibility}</span>
          <span className="text-sm font-bold text-slate-400">km</span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          {visibility >= 10
            ? 'Crystal clear horizon'
            : visibility >= 5
            ? 'Moderate haze or mist'
            : 'Low visibility hazard'}
        </p>
      </div>

      {/* 4. Barometric Pressure (Purple & Amethyst Accent) */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between border-t-2 border-t-purple-400/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5 text-purple-300">
            <Gauge className="w-4 h-4 text-purple-400" />
            Atmospheric Pressure
          </span>
          <span className="text-white font-extrabold px-2 py-0.5 rounded-md bg-white/10">{pressure} hPa</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl sm:text-4xl font-black text-white">{pressure}</span>
          <span className="text-sm font-bold text-slate-400">hPa</span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          {pressure > 1013
            ? 'High pressure (stable weather)'
            : 'Low pressure (storm system possible)'}
        </p>
      </div>

      {/* 5. Sunrise & Sunset Card (Warm Solar Gold Accent) */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between border-t-2 border-t-amber-400/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Sunrise className="w-4 h-4 text-amber-400" />
            Solar Cycle
          </span>
          <span className="text-amber-300 font-extrabold">{daylight_progress}% day</span>
        </div>

        {/* Progress Bar of Daylight */}
        <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden my-2 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${daylight_progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-1 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" />
            {sunrise || '06:00 AM'}
          </span>
          <span className="flex items-center gap-1">
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
            {sunset || '06:30 PM'}
          </span>
        </div>
      </div>

      {/* 6. Cloudiness Card (Indigo & Lavender Accent) */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between border-t-2 border-t-indigo-400/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5 text-indigo-300">
            <Cloud className="w-4 h-4 text-indigo-400" />
            Cloud Cover
          </span>
          <span className="text-white font-extrabold px-2 py-0.5 rounded-md bg-white/10">{cloudiness}%</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl sm:text-4xl font-black text-white">{cloudiness}</span>
          <span className="text-sm font-bold text-slate-400">%</span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          {cloudiness > 80
            ? 'Dense cloud ceiling'
            : cloudiness > 40
            ? 'Scattered passing clouds'
            : 'Sunny and mostly open sky'}
        </p>
      </div>
    </div>
  );
};
