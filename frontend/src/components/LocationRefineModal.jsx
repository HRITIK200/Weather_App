import React, { useState } from 'react';
import {
  MapPin,
  X,
  Crosshair,
  Search,
  Check,
  Building2,
  Navigation,
  Sparkles,
  Info,
  Globe,
} from 'lucide-react';
import { searchLocations } from '../services/api';

// Curated global & national major hub benchmarks for instant 1-click calibration
const POPULAR_HUBS = [
  { name: 'New Delhi', subtitle: 'National Capital Territory, India', postcode: '110001', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', subtitle: 'Maharashtra, India', postcode: '400001', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', subtitle: 'Karnataka, India', postcode: '560001', lat: 12.9716, lon: 77.5946 },
  { name: 'Bijnor', subtitle: 'Bijnor District, Uttar Pradesh, India', postcode: '246701', lat: 29.3724, lon: 78.1358 },
  { name: 'Kolkata', subtitle: 'West Bengal, India', postcode: '700001', lat: 22.5726, lon: 88.3639 },
  { name: 'London', subtitle: 'Greater London, United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', subtitle: 'New York, United States', lat: 40.7128, lon: -74.0060 },
  { name: 'Dubai', subtitle: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
  { name: 'Tokyo', subtitle: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
];

export const LocationRefineModal = ({
  isOpen,
  onClose,
  currentLocationName,
  onSelectLocation,
  onTriggerGPS,
  isLocating,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [rememberPreference, setRememberPreference] = useState(true);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocations(val.trim());
      setSearchResults(results || []);
    } catch (err) {
      console.warn('Location search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (item) => {
    if (rememberPreference) {
      localStorage.setItem('preferred_weather_location', JSON.stringify({
        name: item.name,
        displayName: item.displayName || item.name,
        subtitle: item.subtitle,
        lat: item.lat,
        lon: item.lon,
        postcode: item.postcode,
        areaType: item.type || 'locality',
      }));
    }
    onSelectLocation(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-3xl w-full max-w-lg p-6 sm:p-7 relative border border-white/15 shadow-2xl overflow-hidden bg-slate-900/95 text-slate-100">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-10 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Change or Calibrate Location
              </h3>
              <p className="text-xs text-slate-400">
                Detect live GPS or search any city, town, village, or PIN code
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-Accuracy GPS Trigger (Google Weather-Grade) */}
        <div className="mt-4 relative z-10">
          <button
            type="button"
            onClick={() => {
              onTriggerGPS();
              onClose();
            }}
            disabled={isLocating}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600/30 via-teal-600/25 to-cyan-600/30 hover:from-emerald-600/40 hover:to-cyan-600/40 border border-emerald-400/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
          >
            <Crosshair className={`w-4 h-4 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring High-Precision GPS...' : '📍 Detect Live Coordinates (Hardware GPS / Wi-Fi)'}</span>
          </button>
        </div>

        {/* Precision Tip Banner */}
        <div className="mt-3.5 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-2.5 text-xs text-cyan-200/90 relative z-10">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-cyan-300">Google Weather Precision:</span> Device GPS provides pinpoint street-level accuracy. If your internet connection routes via a regional carrier gateway, use the search below to calibrate your exact locality or PIN code.
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="mt-4 relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search city, town, village, or PIN code worldwide..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
          </div>

          {/* Autocomplete Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded-2xl bg-slate-950/95 border border-white/15 divide-y divide-white/5 no-scrollbar shadow-2xl">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="p-2.5 hover:bg-cyan-500/15 cursor-pointer transition-colors text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white">{item.displayName || item.name}</span>
                    <span className="text-[10px] text-slate-400 block">{item.subtitle}</span>
                  </div>
                  {item.postcode && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      PIN {item.postcode}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Popular / Benchmark Locations */}
        <div className="mt-5 relative z-10">
          <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Popular & Benchmark Cities:</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold">1-Click Apply</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto no-scrollbar pr-1">
            {POPULAR_HUBS.map((hub, idx) => {
              const isSelected = currentLocationName?.toLowerCase().includes(hub.name.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(hub)}
                  className={`p-2.5 rounded-2xl border text-left transition-all text-xs flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/60 ring-1 ring-cyan-400/40 text-cyan-200'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {hub.name}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-200 shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate mt-1">
                    {hub.postcode ? `PIN ${hub.postcode}` : hub.subtitle.split(',')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Remember Preference Checkbox */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 relative z-10">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberPreference}
              onChange={(e) => setRememberPreference(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 bg-slate-900"
            />
            <span>Remember as my primary location</span>
          </label>
          <span className="text-[10px] text-slate-400">Loads automatically on return</span>
        </div>
      </div>
    </div>
  );
};
