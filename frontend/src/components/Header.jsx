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
    <header className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4 px-6 glass-card rounded-2xl mb-6 relative z-10">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
          <CloudSun className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-sky-300 bg-clip-text text-transparent">
            AeroCast
          </h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise Weather Intelligence</p>
        </div>
      </div>

      {/* Real-time Clock & System Status */}
      <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime}</span>
        </div>

        {/* Telemetry Trigger Badge */}
        <button
          onClick={onOpenTelemetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          title="Open Architecture & Telemetry Inspector"
        >
          <span className={`w-2 h-2 rounded-full ${dbStatus ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{dbStatus ? 'PostgreSQL Live' : 'Storage Active'}</span>
          <Activity className="w-3 h-3 text-cyan-400 ml-1" />
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Ambient Particles Toggle */}
        <button
          onClick={onToggleParticles}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
            particlesEnabled
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
          }`}
          title="Toggle ambient weather particle effects"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">FX</span>
        </button>

        {/* City Comparison Trigger */}
        <button
          onClick={onOpenCompare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all shadow-sm"
          title="Compare Weather Between Two Cities"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Compare</span>
        </button>

        {/* Share / Copy Briefing */}
        <button
          onClick={onShareBriefing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
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
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

        {/* °C / °F Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10">
          <button
            onClick={() => onToggleUnit('C')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              unit === 'C'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => onToggleUnit('F')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              unit === 'F'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>

        {/* History Drawer Trigger */}
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all shadow-sm"
          title="View Search History"
        >
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">History</span>
        </button>
      </div>
    </header>
  );
};
