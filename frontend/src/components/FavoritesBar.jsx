import React from 'react';
import { Star, MapPin, Globe, Compass } from 'lucide-react';

export const FavoritesBar = ({
  favorites = [],
  currentCity = '',
  onSelectCity,
  onToggleFavorite,
  isFavorite = false,
  activeTab = 'all',
  onSelectTab,
  onOpenIndianStates,
}) => {
  return (
    <div className="glass-card rounded-2xl p-3.5 mb-6">
      {/* Category Tabs & Explore Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-white/10 mb-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => onSelectTab('all')}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Cities
          </button>
          <button
            onClick={() => onSelectTab('india')}
            className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 ${
              activeTab === 'india'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🇮🇳</span>
            <span>Indian Metros</span>
          </button>
          <button
            onClick={() => onSelectTab('global')}
            className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 ${
              activeTab === 'global'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Global Hubs</span>
          </button>
        </div>

        {/* Explore All 28 Indian States Button */}
        <button
          onClick={onOpenIndianStates}
          className="text-xs font-bold text-cyan-300 hover:text-cyan-200 bg-white/10 hover:bg-white/15 px-3 py-1 rounded-xl border border-white/10 flex items-center gap-1 transition-all"
        >
          <span>🇮🇳</span>
          <span>All Indian States</span>
          <span>→</span>
        </button>
      </div>

      {/* City Pills List */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {favorites.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No cities in this category</span>
          ) : (
            favorites.map((fav) => {
              const isSelected = fav.city_name.toLowerCase() === currentCity.toLowerCase();
              return (
                <button
                  key={fav.id || fav.city_name}
                  onClick={() => onSelectCity(fav.city_name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'glass-pill text-slate-300 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <span>{fav.city_name}</span>
                  {fav.state && fav.region === 'india' && (
                    <span className="text-[10px] text-cyan-200/80">({fav.state.split(' ')[0]})</span>
                  )}
                  {fav.country && fav.region !== 'india' && (
                    <span className="text-[10px] uppercase text-slate-400">({fav.country})</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Pin Current City Button */}
        {currentCity && (
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shrink-0 ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/30 hover:bg-amber-500/30'
                : 'glass-pill text-slate-300 border-white/10 hover:text-white hover:bg-white/15'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Pin to favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Pinned' : 'Pin City'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
