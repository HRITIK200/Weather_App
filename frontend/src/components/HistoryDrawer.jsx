import React from 'react';
import { X, Trash2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { formatTemperature } from '../utils/weatherUtils';

export const HistoryDrawer = ({
  isOpen,
  onClose,
  history = [],
  onSelectCity,
  onDeleteHistoryItem,
  unit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md bg-[#0D1527] border-l border-white/10 h-full p-6 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Search History
            </h2>
            <p className="text-xs text-slate-400">Database-persisted query records</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No search history recorded yet.
            </div>
          ) : (
            history.map((item) => {
              const dateStr = item.searched_at
                ? new Date(item.searched_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                >
                  {/* Click to search */}
                  <div
                    onClick={() => {
                      onSelectCity(item.city_name);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                  >
                    {item.icon ? (
                      <img
                        src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                        alt=""
                        className="w-10 h-10 object-contain shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-cyan-400" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{item.city_name}</span>
                        {item.country && (
                          <span className="text-[10px] uppercase text-slate-400 font-semibold">
                            {item.country}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 capitalize flex items-center gap-2">
                        <span>{item.weather_desc}</span>
                        <span>•</span>
                        <span className="text-[11px] text-slate-500">{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Temp & Delete button */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-white">
                      {formatTemperature(item.temperature, unit)}
                    </span>
                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete search log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
