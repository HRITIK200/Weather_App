import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Clock,
  History,
  ArrowRightLeft,
  Share2,
  Check,
  Activity,
  Sparkles,
} from 'lucide-react';

export const Header = ({
  unit,
  onToggleUnit,
  onOpenHistory,
  onOpenCompare,
  onOpenTelemetry,
  onToggleParticles,
  particlesEnabled,
  onShareBriefing,
  isCopied,
  dbStatus,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 glass-card rounded-3xl mb-6 relative z-30 border border-white/10 shadow-xl backdrop-blur-xl">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
            <CloudSun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
              AeroCast
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 font-semibold">Enterprise Weather Intelligence</p>
          </div>
        </div>

        {/* Mobile Clock Badge */}
        <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300 font-semibold">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Desktop Real-time Clock & System Status */}
      <div className="hidden lg:flex items-center gap-3 text-xs font-semibold text-slate-300">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentTime}</span>
        </div>

        {/* Telemetry Trigger Badge */}
        <button
          onClick={onOpenTelemetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          title="Open Architecture & Telemetry Inspector"
        >
          <span className={`w-2 h-2 rounded-full ${dbStatus ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-300">{dbStatus ? 'PostgreSQL Live' : 'Storage Active'}</span>
          <Activity className="w-3 h-3 text-emerald-400 ml-1" />
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
        {/* Ambient Particles Toggle */}
        <button
          onClick={onToggleParticles}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            particlesEnabled
              ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-rose-500/10'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
          }`}
          title="Toggle ambient weather particle effects"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">FX</span>
        </button>

        {/* City Comparison Trigger */}
        <button
          onClick={onOpenCompare}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/25 text-xs font-bold text-violet-300 transition-all shadow-sm"
          title="Compare Weather Between Two Cities"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden sm:inline">Compare</span>
        </button>

        {/* Share / Copy Briefing */}
        <button
          onClick={onShareBriefing}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            isCopied
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
              : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
          }`}
          title="Copy daily weather briefing to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

        {/* °C / °F Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10">
          <button
            onClick={() => onToggleUnit('C')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
              unit === 'C'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => onToggleUnit('F')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
              unit === 'F'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>

        {/* History Drawer Trigger */}
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-xs font-bold text-amber-300 transition-all shadow-sm"
          title="View Search History"
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">History</span>
        </button>
      </div>
    </header>
  );
};
