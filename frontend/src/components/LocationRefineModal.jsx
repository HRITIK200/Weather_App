import React, { useState } from 'react';
import {
  MapPin,
  X,
  Crosshair,
  Search,
  Check,
  Building,
  Navigation,
  Sparkles,
  Info,
} from 'lucide-react';
import { searchLocations } from '../services/api';

const NEARBY_TOWNS = [
  { name: 'Bijnor', subtitle: 'Bijnor, Uttar Pradesh', postcode: '246701', lat: 29.3724, lon: 78.1358, isPrimary: true },
  { name: 'Chandpur', subtitle: 'Bijnor District, Uttar Pradesh', postcode: '246725', lat: 29.1333, lon: 78.2667 },
  { name: 'Najibabad', subtitle: 'Bijnor District, Uttar Pradesh', postcode: '246763', lat: 29.6100, lon: 78.3400 },
  { name: 'Dhampur', subtitle: 'Bijnor District, Uttar Pradesh', postcode: '246761', lat: 29.3100, lon: 78.5100 },
  { name: 'Kiratpur', subtitle: 'Bijnor District, Uttar Pradesh', postcode: '246731', lat: 29.5100, lon: 78.2000 },
  { name: 'Nagina', subtitle: 'Bijnor District, Uttar Pradesh', postcode: '246762', lat: 29.4400, lon: 78.4300 },
  { name: 'Haldaur', subtitle: 'Bijnor District, Uttar Pradesh', postcode: '246726', lat: 29.3000, lon: 78.2800 },
  { name: 'Muzaffarnagar', subtitle: 'Muzaffarnagar, Uttar Pradesh', postcode: '251001', lat: 29.4700, lon: 77.7000 },
  { name: 'Meerut', subtitle: 'Meerut, Uttar Pradesh', postcode: '250001', lat: 28.9845, lon: 77.7064 },
  { name: 'Moradabad', subtitle: 'Moradabad, Uttar Pradesh', postcode: '244001', lat: 28.8350, lon: 78.7733 },
  { name: 'Haridwar', subtitle: 'Haridwar, Uttarakhand', postcode: '249401', lat: 29.9457, lon: 78.1642 },
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
      <div className="glass-card rounded-3xl w-full max-w-lg p-6 sm:p-7 relative border border-white/15 shadow-2xl overflow-hidden bg-slate-900/90 text-slate-100">
        {/* Ambient Top Glow */}
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
                Refine Your Exact Location
              </h3>
              <p className="text-xs text-slate-400">
                Pinpoint your exact town, tehsil, village, or PIN code
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

        {/* Explanatory Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200/90 relative z-10">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">ISP Telecom Routing Notice:</span> Telecom towers (Jio, Airtel, Vi) in Bijnor and neighboring tehsils route internet IP traffic through the regional gateway in Meerut. Select your real town below to fix this.
          </div>
        </div>

        {/* High-Accuracy GPS Trigger */}
        <div className="mt-4 relative z-10">
          <button
            type="button"
            onClick={() => {
              onTriggerGPS();
              onClose();
            }}
            disabled={isLocating}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-cyan-600/30 hover:from-emerald-600/40 hover:to-cyan-600/40 border border-emerald-400/40 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
          >
            <Crosshair className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>{isLocating ? 'Scanning Device Coordinates...' : 'Detect Via Device Hardware GPS'}</span>
          </button>
        </div>

        {/* Instant Search Bar */}
        <div className="mt-4 relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search town, village, or PIN code (e.g. Bijnor, 246701)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
          </div>

          {/* Autocomplete Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto rounded-2xl bg-slate-950/90 border border-white/15 divide-y divide-white/5 no-scrollbar">
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

        {/* 1-Click Nearby UP / Bijnor Towns */}
        <div className="mt-5 relative z-10">
          <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center justify-between">
            <span>Recommended Towns in Bijnor & Western UP:</span>
            <span className="text-[10px] text-cyan-400 font-semibold">1-Click Apply</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto no-scrollbar pr-1">
            {NEARBY_TOWNS.map((town, idx) => {
              const isSelected = currentLocationName?.toLowerCase().includes(town.name.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(town)}
                  className={`p-2.5 rounded-2xl border text-left transition-all text-xs flex flex-col justify-between group ${
                    town.isPrimary
                      ? 'bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-slate-900/60 border-amber-400/50 shadow-md ring-1 ring-amber-400/30'
                      : isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/60 ring-1 ring-cyan-400/40 text-cyan-200'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`font-black ${town.isPrimary ? 'text-amber-300' : 'text-white'}`}>
                      {town.name}
                    </span>
                    {town.isPrimary && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shrink-0">
                        Exact
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate mt-1">
                    PIN {town.postcode}
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
          <span className="text-[10px] text-slate-400">Loads instantly on every visit</span>
        </div>
      </div>
    </div>
  );
};
