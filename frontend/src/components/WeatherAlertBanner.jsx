import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

export const WeatherAlertBanner = ({ alerts = [] }) => {
  const [dismissedIds, setDismissedIds] = useState([]);

  if (!alerts || alerts.length === 0) return null;

  const activeAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));
  if (activeAlerts.length === 0) return null;

  const handleDismiss = (id) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-3 mb-6">
      {activeAlerts.map((alert) => {
        const isDanger = alert.severity === 'danger';
        return (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 ${
              isDanger
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-100 shadow-rose-950/30'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-100 shadow-amber-950/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  isDanger ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {isDanger ? (
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-wide flex items-center gap-2">
                  <span>{alert.title}</span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-black/30 border border-white/10">
                    Active Advisory
                  </span>
                </h4>
                <p className="text-xs mt-1 leading-relaxed opacity-90">{alert.message}</p>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(alert.id)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all shrink-0"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
