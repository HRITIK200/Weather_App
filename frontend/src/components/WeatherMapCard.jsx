import React, { useState } from 'react';
import { Map, ExternalLink, Navigation, Compass, Globe2, Crosshair, ArrowRight } from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

const RADAR_CORNER_PRESETS = [
  { label: '🇮🇳 Siachen (North)', lat: 35.43, lon: 77.09 },
  { label: '🇮🇳 Kibithu (East)', lat: 28.28, lon: 97.02 },
  { label: '🇮🇳 Sir Creek (West)', lat: 23.93, lon: 68.29 },
  { label: '🇮🇳 Kanyakumari (South)', lat: 8.08, lon: 77.54 },
  { label: '🌍 Ushuaia', lat: -54.80, lon: -68.30 },
  { label: '🌍 Svalbard (Arctic)', lat: 78.22, lon: 15.65 },
];

export const WeatherMapCard = ({ weather, unit, onSelectCoords }) => {
  const [showCoordExplorer, setShowCoordExplorer] = useState(false);
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [coordError, setCoordError] = useState('');

  if (!weather || !weather.coord) return null;

  const { name, displayName, coord, temp, main } = weather;
  const { lat, lon } = coord;

  // OpenStreetMap embed URL with pin
  const bbox = `${lon - 0.15},${lat - 0.1},${lon + 0.15},${lat + 0.1}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;

  const handleCustomCoordSubmit = (e) => {
    e.preventDefault();
    setCoordError('');
    const parsedLat = parseFloat(customLat);
    const parsedLon = parseFloat(customLon);

    if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      setCoordError('Latitude must be between -90 and 90');
      return;
    }
    if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) {
      setCoordError('Longitude must be between -180 and 180');
      return;
    }

    if (onSelectCoords) {
      onSelectCoords(parsedLat, parsedLon, `Coordinate (${parsedLat.toFixed(2)}, ${parsedLon.toFixed(2)})`);
      setShowCoordExplorer(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Geographical Radar & Corner Explorer
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCoordExplorer(!showCoordExplorer)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>{showCoordExplorer ? 'Close Explorer' : 'Explore Any Coordinates'}</span>
          </button>
          <a
            href={fullMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <span>Full OSM</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Coordinate Jump Drawer */}
      {showCoordExplorer && (
        <div className="mb-4 p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl animate-in fade-in">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-white">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Jump to Any Latitude & Longitude on Earth</span>
          </div>
          <form onSubmit={handleCustomCoordSubmit} className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[120px]">
              <input
                type="number"
                step="any"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                placeholder="Lat (-90 to 90)"
                className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400 border border-white/10"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <input
                type="number"
                step="any"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
                placeholder="Lon (-180 to 180)"
                className="w-full px-3 py-2 rounded-xl bg-white/10 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-400 border border-white/10"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Scan Weather</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {coordError && (
            <p className="text-rose-400 text-[11px] mt-1.5 font-semibold">{coordError}</p>
          )}

          {/* Quick Corner Preset Chips */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Quick Radar Points:
            </span>
            {RADAR_CORNER_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (onSelectCoords) {
                    onSelectCoords(preset.lat, preset.lon, preset.label);
                    setShowCoordExplorer(false);
                  }
                }}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-medium text-slate-300 hover:text-cyan-300 transition-all border border-white/5"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
              <span>{displayName || name}</span>
              <span className="text-cyan-300">• {formatTemperature(temp, unit)}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

