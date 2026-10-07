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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* 1. Wind Card */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-cyan-400" />
            Wind & Direction
          </span>
          <span className="text-white font-bold">{compassDir}</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl font-extrabold text-white">{wind_speed}</span>
          <span className="text-sm font-semibold text-slate-400">km/h</span>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
          <div
            className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-500"
            style={{ transform: `rotate(${wind_deg}deg)` }}
          >
            <Navigation2 className="w-3 h-3 text-cyan-400 fill-cyan-400" />
          </div>
          <span>Heading {wind_deg}° ({compassDir})</span>
        </div>
      </div>

      {/* 2. Humidity Card */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" />
            Humidity
          </span>
          <span className="text-white font-bold">{humidity}%</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl font-extrabold text-white">{humidity}</span>
          <span className="text-sm font-semibold text-slate-400">%</span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          {humidity > 70
            ? 'High moisture, feels humid'
            : humidity < 35
            ? 'Dry air conditions'
            : 'Comfortable humidity level'}
        </p>
      </div>

      {/* 3. Visibility Card */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-cyan-400" />
            Visibility
          </span>
          <span className="text-white font-bold">{visibility} km</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl font-extrabold text-white">{visibility}</span>
          <span className="text-sm font-semibold text-slate-400">km</span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          {visibility >= 10
            ? 'Perfect clarity, no haze'
            : visibility >= 5
            ? 'Moderate visibility'
            : 'Low visibility alert'}
        </p>
      </div>

      {/* 4. Pressure Card */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Air Pressure
          </span>
          <span className="text-white font-bold">{pressure} hPa</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl font-extrabold text-white">{pressure}</span>
          <span className="text-sm font-semibold text-slate-400">hPa</span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          {pressure > 1013 ? 'High barometric pressure' : 'Low barometric pressure'}
        </p>
      </div>

      {/* 5. Sunrise & Sunset Card */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <Sunrise className="w-4 h-4 text-amber-400" />
            Sun Schedule
          </span>
          <span className="text-cyan-400 font-bold">{daylight_progress}% day</span>
        </div>
        <div className="flex items-center justify-between my-2 text-xs">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-slate-400">Sunrise</div>
              <div className="font-bold text-white text-sm">{sunrise || '--:--'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-slate-400">Sunset</div>
              <div className="font-bold text-white text-sm">{sunset || '--:--'}</div>
            </div>
            <Sunset className="w-4 h-4 text-orange-400" />
          </div>
        </div>
        {/* Daylight progress bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-1 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            style={{ width: `${daylight_progress}%` }}
          />
        </div>
      </div>

      {/* 6. Cloudiness Card */}
      <div className="glass-card rounded-2xl p-5 glass-card-hover flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span className="flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-cyan-400" />
            Cloud Coverage
          </span>
          <span className="text-white font-bold">{cloudiness}%</span>
        </div>
        <div className="flex items-baseline gap-2 my-1">
          <span className="text-3xl font-extrabold text-white">{cloudiness}</span>
          <span className="text-sm font-semibold text-slate-400">%</span>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          {cloudiness > 80
            ? 'Complete cloud overcast'
            : cloudiness > 40
            ? 'Partly cloudy sky'
            : 'Clear skies prevail'}
        </p>
      </div>
    </div>
  );
};
