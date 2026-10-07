import React, { useState } from 'react';
import { X, MapPin, Search, Sparkles } from 'lucide-react';

export const IndianStatesDrawer = ({
  isOpen,
  onClose,
  indianCities = [],
  onSelectCity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = indianCities.filter(
    (c) =>
      c.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.state && c.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0D1527] border-l border-white/10 h-full p-6 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              Indian States & Metros
            </h2>
            <p className="text-xs text-slate-400">Direct weather access across India</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search state or city (e.g. Maharashtra, Jaipur)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
        </div>

        {/* States & Cities List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No matching Indian state or city found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id || item.city_name}
                onClick={() => {
                  onSelectCity(item.city_name);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.city_name}
                    </div>
                    {item.state && (
                      <div className="text-xs text-slate-400">
                        {item.state}
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Weather →
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
