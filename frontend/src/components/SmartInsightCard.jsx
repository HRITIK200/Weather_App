import React from 'react';
import { Sparkles, Shirt, Footprints, ShieldCheck } from 'lucide-react';

export const SmartInsightCard = ({ insight }) => {
  if (!insight) return null;

  const {
    summary,
    clothingTips = [],
    activityScore = 8,
    activityTip,
    comfortLevel,
  } = insight;

  // Compute color based on activity score
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (score >= 5) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 mb-6 border border-cyan-500/20 relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-md shadow-cyan-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              Smart Weather Intelligence
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                AI Insight
              </span>
            </h3>
            <p className="text-xs text-slate-400">Contextual daily guidance based on current metrics</p>
          </div>
        </div>

        {/* Comfort Level Tag */}
        {comfortLevel && (
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-cyan-300 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{comfortLevel}</span>
          </div>
        )}
      </div>

      {/* Natural Language Summary */}
      <p className="text-sm text-slate-200 leading-relaxed font-medium mb-5 bg-white/5 p-3.5 rounded-2xl border border-white/5">
        "{summary}"
      </p>

      {/* Grid: Clothing Advice & Activity Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Attire */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2.5">
            <Shirt className="w-4 h-4" />
            <span>Recommended Attire</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {clothingTips.map((tip, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outdoor Activity Rating */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <Footprints className="w-4 h-4" />
                <span>Outdoor Activity Index</span>
              </div>
              <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${getScoreColor(activityScore)}`}>
                {activityScore} / 10
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              {activityTip}
            </p>
          </div>

          {/* Progress bar visual */}
          <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${activityScore * 10}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
