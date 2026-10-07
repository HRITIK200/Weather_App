import React, { useState } from 'react';
import { Wind, ShieldAlert, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

export const AirQualityCard = ({ aqi }) => {
  const [selectedPersona, setSelectedPersona] = useState('general');

  if (!aqi) return null;

  const {
    index = 1,
    label = 'Good',
    status = 'Clean Air',
    description,
    healthAdvice,
    components = {},
  } = aqi;

  // Persona-specific health tailored advisories
  const getPersonaGuidance = (persona, idx) => {
    switch (persona) {
      case 'athletes':
        if (idx >= 4) {
          return {
            title: 'Athletes & High-Exertion Warning',
            advice: 'Heavy cardiovascular breathing pulls particulate matter deep into the lungs. Shift runs/cardio to an indoor gym.',
            maxOutdoor: 'Avoid vigorous outdoor workouts',
          };
        }
        if (idx === 3) {
          return {
            title: 'Moderate Aerobic Impact',
            advice: 'Limit high-intensity outdoor intervals to under 45 minutes. Hydrate well.',
            maxOutdoor: 'Up to 45 mins outdoor training',
          };
        }
        return {
          title: 'Optimal Aerobic Quality',
          advice: 'Clean air conditions. Full outdoor sports and marathon training approved.',
          maxOutdoor: 'Unlimited outdoor training',
        };

      case 'respiratory':
        if (idx >= 3) {
          return {
            title: 'Asthma & Respiratory Alert',
            advice: 'Elevated PM2.5 and Ozone can trigger bronchospasms. Keep your rescue inhaler handy and wear an N95 mask outside.',
            maxOutdoor: 'Stay indoors if wheezing occurs',
          };
        }
        return {
          title: 'Low Respiratory Risk',
          advice: 'Air pollution levels are within safe baseline ranges for sensitive airways.',
          maxOutdoor: 'Normal outdoor activities',
        };

      case 'vulnerable':
        if (idx >= 4) {
          return {
            title: 'Children & Senior Citizen Advisory',
            advice: 'Young lungs and older cardiovascular systems are most vulnerable. Restrict outdoor playground and park exposure.',
            maxOutdoor: 'Keep visits brief (< 20 mins)',
          };
        }
        return {
          title: 'Comfortable for All Ages',
          advice: 'Safe conditions for children’s school activities and senior walks.',
          maxOutdoor: 'Normal outdoor time',
        };

      default:
        return {
          title: 'General Population Advice',
          advice: healthAdvice,
          maxOutdoor: idx >= 4 ? 'Minimize prolonged outdoor exposure' : 'No restrictions',
        };
    }
  };

  const personaInfo = getPersonaGuidance(selectedPersona, index);

  // Color mapping based on AQI index
  const getBadgeStyle = (idx) => {
    switch (idx) {
      case 1:
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30';
      case 2:
        return 'text-sky-300 bg-sky-500/20 border-sky-500/30';
      case 3:
        return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      case 4:
        return 'text-orange-300 bg-orange-500/20 border-orange-500/30';
      case 5:
        return 'text-rose-300 bg-rose-500/20 border-rose-500/30';
      default:
        return 'text-cyan-300 bg-cyan-500/20 border-cyan-500/30';
    }
  };

  const getMeterGradient = (idx) => {
    switch (idx) {
      case 1:
        return 'from-emerald-400 to-teal-500';
      case 2:
        return 'from-teal-400 to-sky-500';
      case 3:
        return 'from-sky-400 to-amber-500';
      case 4:
        return 'from-amber-400 to-orange-500';
      case 5:
        return 'from-orange-400 to-rose-600';
      default:
        return 'from-cyan-400 to-blue-500';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 mb-6 border border-cyan-500/20 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-md">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Air Quality Index (AQI)
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Live Sensor Data
              </span>
            </h3>
            <p className="text-xs text-slate-400">Atmospheric particulate & pollutant analysis</p>
          </div>
        </div>

        {/* AQI Status Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-bold tracking-wide ${getBadgeStyle(index)}`}>
          <span>AQI Level {index} • {label}</span>
        </div>
      </div>

      {/* Visual AQI Level Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
          <span>Good (1)</span>
          <span>Fair (2)</span>
          <span>Moderate (3)</span>
          <span>Poor (4)</span>
          <span>Very Poor (5)</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getMeterGradient(index)} transition-all duration-700 shadow-sm`}
            style={{ width: `${(index / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Health Persona Selector Tabs */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tailor Health Advice by Persona:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'general', label: '🚶 General Public' },
            { id: 'athletes', label: '🏃 Athletes / Runners' },
            { id: 'respiratory', label: '🫁 Asthma / Sensitive' },
            { id: 'vulnerable', label: '👶 Kids & Seniors' },
          ].map((persona) => (
            <button
              key={persona.id}
              onClick={() => setSelectedPersona(persona.id)}
              className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all border text-center ${
                selectedPersona === persona.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {persona.label}
            </button>
          ))}
        </div>
      </div>

      {/* Personalized Health Advisory Box */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 flex items-start gap-3">
        {index >= 4 ? (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="text-xs text-slate-200 flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-white">{personaInfo.title}</span>
            <span className="text-[11px] font-semibold text-cyan-300 px-2 py-0.5 rounded-md bg-white/5">
              Limit: {personaInfo.maxOutdoor}
            </span>
          </div>
          <div className="leading-relaxed text-slate-300">{personaInfo.advice}</div>
        </div>
      </div>

      {/* Pollutant Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400">PM2.5</div>
          <div className="text-base font-extrabold text-white mt-0.5">{components.pm2_5 ?? '--'}</div>
          <div className="text-[9px] text-slate-500 uppercase">µg/m³</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400">PM10</div>
          <div className="text-base font-extrabold text-white mt-0.5">{components.pm10 ?? '--'}</div>
          <div className="text-[9px] text-slate-500 uppercase">µg/m³</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400">O3 (Ozone)</div>
          <div className="text-base font-extrabold text-white mt-0.5">{components.o3 ?? '--'}</div>
          <div className="text-[9px] text-slate-500 uppercase">µg/m³</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400">NO2</div>
          <div className="text-base font-extrabold text-white mt-0.5">{components.no2 ?? '--'}</div>
          <div className="text-[9px] text-slate-500 uppercase">µg/m³</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400">SO2</div>
          <div className="text-base font-extrabold text-white mt-0.5">{components.so2 ?? '--'}</div>
          <div className="text-[9px] text-slate-500 uppercase">µg/m³</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[11px] font-semibold text-slate-400">CO</div>
          <div className="text-base font-extrabold text-white mt-0.5">{components.co ?? '--'}</div>
          <div className="text-[9px] text-slate-500 uppercase">µg/m³</div>
        </div>
      </div>
    </div>
  );
};
