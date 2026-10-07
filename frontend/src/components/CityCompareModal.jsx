import React, { useState } from 'react';
import { X, ArrowRightLeft, Thermometer, Droplets, Wind, ShieldAlert, Loader2 } from 'lucide-react';
import { compareCities } from '../services/api';
import { formatTemperature } from '../utils/weatherUtils';

export const CityCompareModal = ({
  isOpen,
  onClose,
  defaultCity1 = 'Delhi',
  unit,
}) => {
  const [city1, setCity1] = useState(defaultCity1);
  const [city2, setCity2] = useState('Mumbai');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const quickPicks = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Chennai', 'Jaipur', 'London', 'Dubai'];

  const handleCompare = async () => {
    if (!city1.trim() || !city2.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await compareCities(city1.trim(), city2.trim());
      setComparison(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not compare the selected cities. Please check spelling.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#0D1527] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                City vs City Weather Comparison
              </h2>
              <p className="text-xs text-slate-400">Side-by-side atmospheric & AQI analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Input Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">First City</label>
            <input
              type="text"
              value={city1}
              onChange={(e) => setCity1(e.target.value)}
              placeholder="e.g. Delhi"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Second City</label>
            <input
              type="text"
              value={city2}
              onChange={(e) => setCity2(e.target.value)}
              placeholder="e.g. Mumbai"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            />
          </div>
        </div>

        {/* Quick Picks for City 2 */}
        <div className="mb-5">
          <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Quick Compare with:</div>
          <div className="flex flex-wrap gap-1.5">
            {quickPicks.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity2(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  city2.toLowerCase() === c.toLowerCase()
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCompare}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mb-5 active:scale-98"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Atmospheric Differentials...</span>
            </>
          ) : (
            <span>Compare Weather</span>
          )}
        </button>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        {/* Comparison Results Card */}
        {comparison && (
          <div className="space-y-4 animate-in fade-in">
            {/* Verdict Summary */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-semibold leading-relaxed">
              💡 {comparison.metrics.verdict}
            </div>

            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City 1 Card */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">
                    {comparison.city1.name}
                    <span className="text-xs text-slate-400 ml-1">({comparison.city1.country})</span>
                  </h3>
                  <img
                    src={`https://openweathermap.org/img/wn/${comparison.city1.icon}.png`}
                    alt=""
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="text-4xl font-black text-white mb-3">
                  {formatTemperature(comparison.city1.temp, unit)}
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Condition</span>
                    <span className="capitalize">{comparison.city1.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Humidity</span>
                    <span>{comparison.city1.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wind</span>
                    <span>{comparison.city1.wind_speed} km/h</span>
                  </div>
                  {comparison.city1.aqi && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Air Quality</span>
                      <span className="font-bold text-cyan-300">
                        {comparison.city1.aqi.label} (AQI {comparison.city1.aqi.index})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* City 2 Card */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">
                    {comparison.city2.name}
                    <span className="text-xs text-slate-400 ml-1">({comparison.city2.country})</span>
                  </h3>
                  <img
                    src={`https://openweathermap.org/img/wn/${comparison.city2.icon}.png`}
                    alt=""
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="text-4xl font-black text-white mb-3">
                  {formatTemperature(comparison.city2.temp, unit)}
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Condition</span>
                    <span className="capitalize">{comparison.city2.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Humidity</span>
                    <span>{comparison.city2.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wind</span>
                    <span>{comparison.city2.wind_speed} km/h</span>
                  </div>
                  {comparison.city2.aqi && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Air Quality</span>
                      <span className="font-bold text-cyan-300">
                        {comparison.city2.aqi.label} (AQI {comparison.city2.aqi.index})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
