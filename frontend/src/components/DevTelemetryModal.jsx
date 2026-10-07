import React, { useState, useEffect } from 'react';
import { X, Activity, Server, Database, Cpu, HardDrive, RefreshCw, CheckCircle2 } from 'lucide-react';
import { checkSystemHealth } from '../services/api';

export const DevTelemetryModal = ({ isOpen, onClose }) => {
  const [telemetry, setTelemetry] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const [testing, setTesting] = useState(false);

  const fetchTelemetry = async () => {
    try {
      setTesting(true);
      const start = performance.now();
      const res = await checkSystemHealth();
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setTelemetry(res);
    } catch (err) {
      console.warn('Telemetry fetch error:', err);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTelemetry();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#0B111E] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                System Telemetry & Architecture Diagnostics
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Tech Lead View
                </span>
              </h2>
              <p className="text-xs text-slate-400">Live observability metrics, database pool, and runtime telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          {/* 1. API Roundtrip Latency */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                API Roundtrip Latency
              </span>
              <button
                onClick={fetchTelemetry}
                disabled={testing}
                className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"
                title="Refresh ping benchmark"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-black text-white">{latencyMs ?? '--'}</span>
              <span className="text-xs font-bold text-emerald-400">ms (Network Ping)</span>
            </div>
            <p className="text-[11px] text-slate-400">Express route handler + CORS proxy overhead</p>
          </div>

          {/* 2. Database Connection Pool Status */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                Database Engine
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                telemetry?.database?.connected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {telemetry?.database?.connected ? 'Online' : 'Fallback Active'}
              </span>
            </div>
            <div className="text-base font-extrabold text-white my-2">
              PostgreSQL (node-postgres pool)
            </div>
            <p className="text-[11px] text-slate-400">
              Mode: <strong className="text-slate-200">{telemetry?.database?.mode || 'Resilient Fallback'}</strong>
            </p>
          </div>

          {/* 3. Node.js Memory Heap */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-amber-400" />
                Memory Heap (V8)
              </span>
              <span className="text-white font-bold">{telemetry?.telemetry?.memory?.heapUsedMB ?? '--'} MB</span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl font-black text-white">
                {telemetry?.telemetry?.memory?.heapUsedMB ?? '--'}
              </span>
              <span className="text-xs text-slate-400">/ {telemetry?.telemetry?.memory?.heapTotalMB ?? '--'} MB total</span>
            </div>
            <p className="text-[11px] text-slate-400">
              RSS Resident Set: {telemetry?.telemetry?.memory?.rssMB ?? '--'} MB
            </p>
          </div>

          {/* 4. Runtime & Architecture */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-400" />
                Runtime & Traffic
              </span>
              <span className="text-indigo-300 font-bold">{telemetry?.runtime?.node || 'Node v20'}</span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-2xl font-black text-white">{telemetry?.telemetry?.totalRequests ?? 1}</span>
              <span className="text-xs text-slate-400">Requests Serviced</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Uptime: {telemetry?.uptime ? `${Math.round(telemetry.uptime / 60)} mins` : '< 1 min'}
            </p>
          </div>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Security Flow</span>
          </h4>
          <div className="text-xs text-slate-300 font-mono bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
            <div>[Client: React 18 + Vite] → Proxy: /api/* → [Express Server]</div>
            <div>[Express Server] → Hidden API Key → [OpenWeatherMap 2.5 + AQI]</div>
            <div>[Express Server] → Parameterized SQL ($1, $2) → [PostgreSQL Pool]</div>
            <div>[Resilience Layer] → If DB unavailable → In-Memory Graceful Fallback</div>
          </div>
        </div>
      </div>
    </div>
  );
};
