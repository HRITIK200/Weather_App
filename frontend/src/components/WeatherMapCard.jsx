import React from 'react';
import { Map, ExternalLink, Navigation } from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const WeatherMapCard = ({ weather, unit }) => {
  if (!weather || !weather.coord) return null;

  const { name, coord, temp, main } = weather;
  const { lat, lon } = coord;

  // OpenStreetMap embed URL with pin
  const bbox = `${lon - 0.15},${lat - 0.1},${lon + 0.15},${lat + 0.1}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;

  return (
    <div className="glass-card rounded-3xl p-6 mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Geographical Radar & Location
          </h3>
        </div>
        <a
          href={fullMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Open Full Map</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Map Embed Container */}
      <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10 shadow-inner">
        <iframe
          title={`Map of ${name}`}
          src={mapUrl}
          className="w-full h-full border-0 filter contrast-125 brightness-90"
          loading="lazy"
        />

        {/* Floating Weather Pin Overlay */}
        <div className="absolute bottom-3 left-3 px-3.5 py-2 rounded-xl glass-card border border-white/20 shadow-xl flex items-center gap-2.5 backdrop-blur-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{name}</span>
              <span className="text-cyan-300">• {formatTemperature(temp, unit)}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {lat.toFixed(2)}°N, {lon.toFixed(2)}°E
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
