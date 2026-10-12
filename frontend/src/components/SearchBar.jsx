import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  X,
  Loader2,
  Mic,
  Compass,
  Building2,
  Globe2,
  Sparkles,
  Navigation2,
  Hash,
} from 'lucide-react';
import { searchLocations } from '../services/api';

// Curated geographic frontiers & remote corners
const CORNER_PRESETS = [
  {
    category: '🇮🇳 Extreme Indian Corners & Villages',
    items: [
      { name: 'Siachen Glacier Base Camp', subtitle: 'Nubra, Leh, Ladakh', lat: 35.43, lon: 77.09, type: 'Northernmost Frontier' },
      { name: 'Kibithu', subtitle: 'Anjaw, Arunachal Pradesh', lat: 28.28, lon: 97.02, type: 'Easternmost Point' },
      { name: 'Sir Creek', subtitle: 'Kutch, Gujarat', lat: 23.93, lon: 68.29, type: 'Westernmost Border' },
      { name: 'Kanyakumari', subtitle: 'Cape Comorin, Tamil Nadu', lat: 8.08, lon: 77.54, type: 'Southernmost Mainland' },
      { name: 'Mawlynnong', subtitle: 'East Khasi Hills, Meghalaya', lat: 25.20, lon: 91.92, type: 'Cleanest Village in Asia' },
      { name: 'Spiti Valley (Kaza)', subtitle: 'Lahaul & Spiti, Himachal Pradesh', lat: 32.22, lon: 78.07, type: 'High Altitude Valley' },
      { name: 'Rohini Sector 7', subtitle: 'North West Delhi, Delhi', postcode: '110085', lat: 28.70, lon: 77.12, type: 'Delhi Locality' },
      { name: 'Dharavi', subtitle: 'Mumbai, Maharashtra', lat: 19.04, lon: 72.86, type: 'Mumbai Locality' },
      { name: 'Hinjawadi Phase 1', subtitle: 'Pune, Maharashtra', postcode: '411057', lat: 18.59, lon: 73.73, type: 'Tech Hub' },
      { name: 'Indiranagar', subtitle: 'Bengaluru, Karnataka', postcode: '560038', lat: 12.98, lon: 77.64, type: 'Bangalore Locality' },
    ],
  },
  {
    category: '🌍 World Extreme Corners',
    items: [
      { name: 'Longyearbyen, Svalbard', subtitle: 'Arctic Archipelago, Norway', lat: 78.22, lon: 15.65, type: 'Northernmost Town' },
      { name: 'Ushuaia', subtitle: 'Tierra del Fuego, Argentina', lat: -54.80, lon: -68.30, type: 'Southernmost City' },
      { name: 'Reykjavik', subtitle: 'Capital Region, Iceland', lat: 64.15, lon: -21.94, type: 'Geothermal Capital' },
      { name: 'Honolulu', subtitle: 'Oahu, Hawaii, USA', lat: 21.31, lon: -157.86, type: 'Mid-Pacific Outpost' },
      { name: 'Alice Springs', subtitle: 'Northern Territory, Australia', lat: -23.70, lon: 133.88, type: 'Red Centre Outback' },
    ],
  },
];

export const SearchBar = ({
  onSearch,
  onSelectLocation,
  onLocateMe,
  isLocating,
  recentCities = [],
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingGeo, setIsSearchingGeo] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [selectedCornerTab, setSelectedCornerTab] = useState(0);

  const debounceTimeout = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Debounced search for small areas, villages, PIN codes, and sectors
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    const clean = query.trim();
    if (clean.length < 2) {
      setSuggestions([]);
      setIsSearchingGeo(false);
      return;
    }

    setIsSearchingGeo(true);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const results = await searchLocations(clean);
        setSuggestions(results || []);
      } catch (err) {
        console.warn('Location geocoding warning:', err);
        setSuggestions([]);
      } finally {
        setIsSearchingGeo(false);
      }
    }, 280);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const cleaned = transcript.replace(/[.,?!]/g, '').trim();
          setQuery(cleaned);
          onSearch(cleaned);
          setShowDropdown(false);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.displayName || item.name);
    setShowDropdown(false);
    if (onSelectLocation) {
      onSelectLocation(item);
    } else {
      onSearch(item.name);
    }
  };

  const handleSelectPresetCorner = (item) => {
    setQuery(item.name);
    setShowDropdown(false);
    if (onSelectLocation) {
      onSelectLocation({
        name: item.name,
        subtitle: item.subtitle,
        type: item.type,
        lat: item.lat,
        lon: item.lon,
        postcode: item.postcode,
      });
    } else {
      onSearch(item.name);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearchingGeo ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={
              isListening
                ? '🎙️ Listening... Speak city, village, or area now'
                : 'Search any village, sector, PIN code (e.g. 110085, 560034), or global corner...'
            }
            className={`w-full pl-12 pr-12 py-3.5 rounded-2xl glass-card text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all shadow-lg ${
              isListening ? 'border-rose-500/60 ring-2 ring-rose-500/40' : ''
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-3">
          {/* Voice Search Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-3.5 rounded-2xl glass-card transition-all shadow-lg active:scale-95 ${
                isListening
                  ? 'bg-rose-500/30 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'hover:bg-white/20 text-cyan-400 hover:text-cyan-300'
              }`}
              title="Voice Search (Speak place name)"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}

          {/* GPS Location Button */}
          <button
            type="button"
            onClick={onLocateMe}
            disabled={isLocating}
            className="p-3.5 rounded-2xl glass-card hover:bg-white/20 text-cyan-400 hover:text-cyan-300 transition-all shadow-lg disabled:opacity-50 active:scale-95"
            title="Use current GPS location"
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation2 className="w-5 h-5" />
            )}
          </button>

          {/* Search Submit */}
          <button
            type="submit"
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 active:scale-95 shrink-0"
          >
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Quick Search Helper Hint */}
      <div className="flex items-center justify-between px-3 mt-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Hyper-local search enabled: villages, colonies, sectors, PIN codes & world corners</span>
        </div>
        <button
          type="button"
          onClick={() => setShowDropdown(true)}
          className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline shrink-0 ml-2"
        >
          Explore Corners
        </button>
      </div>

      {/* Dropdown: Autocomplete Suggestions + Corner Explorer + Recent Searches */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-3 p-3 rounded-3xl glass-card border border-white/15 z-40 shadow-2xl backdrop-blur-2xl max-h-[480px] overflow-y-auto space-y-4">
            {/* 1. Live Geocoded Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Exact Area & Locality Matches ({suggestions.length})</span>
                </div>
                <div className="divide-y divide-white/5 mt-1">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-all flex items-start gap-3 group"
                    >
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all mt-0.5">
                        {item.type === 'postal_code' ? (
                          <Hash className="w-4 h-4 text-amber-400" />
                        ) : item.type === 'district' || item.type === 'city' ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white group-hover:text-cyan-300">
                            {item.name}
                          </span>
                          {item.type && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/10 text-cyan-300 border border-white/10">
                              {item.type}
                            </span>
                          )}
                          {item.postcode && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/20">
                              PIN: {item.postcode}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          {item.subtitle || item.displayName}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Coords: {item.lat.toFixed(3)}°N, {item.lon.toFixed(3)}°E
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Explore Corners of India & World Presets */}
            <div>
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explore Remote Corners & Hamlets</span>
                </div>
                <div className="flex gap-1">
                  {CORNER_PRESETS.map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedCornerTab(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedCornerTab === idx
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {idx === 0 ? '🇮🇳 India' : '🌍 World'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                {CORNER_PRESETS[selectedCornerTab].items.map((corner, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => handleSelectPresetCorner(corner)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/5 text-left transition-all group flex items-start justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{corner.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{corner.subtitle}</div>
                    </div>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shrink-0 ml-2">
                      {corner.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Recent Searches */}
            {recentCities.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Recent Searches
                </div>
                <div className="flex flex-wrap gap-1.5 px-2 mt-1">
                  {recentCities.slice(0, 8).map((city, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuery(city);
                        onSearch(city);
                        setShowDropdown(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{city}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

