import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Loader2, Mic, MicOff } from 'lucide-react';

export const SearchBar = ({ onSearch, onLocateMe, isLocating, recentCities = [] }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const cleaned = transcript.replace(/[.,?!]/g, '').trim();
          setQuery(cleaned);
          onSearch(cleaned);
          setShowDropdown(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

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

  const handleSelectRecent = (city) => {
    setQuery(city);
    onSearch(city);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder={
              isListening
                ? '🎙️ Listening... Speak city name now'
                : 'Search city, Indian state, or country (e.g. Mumbai, Delhi, Tokyo)...'
            }
            className={`w-full pl-12 pr-12 py-3.5 rounded-2xl glass-card text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all shadow-lg ${
              isListening ? 'border-rose-500/60 ring-2 ring-rose-500/40' : ''
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
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
              title="Voice Search (Speak city name)"
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
              <MapPin className="w-5 h-5" />
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

      {/* Recent Searches Dropdown */}
      {showDropdown && recentCities.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl glass-card border border-white/10 z-20 shadow-2xl backdrop-blur-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
              Recent Searches
            </div>
            <div className="flex flex-wrap gap-1.5 p-1">
              {recentCities.slice(0, 6).map((city, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectRecent(city)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
