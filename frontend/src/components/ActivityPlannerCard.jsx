import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export const ActivityPlannerCard = ({ activities = [] }) => {
  const [selectedActivity, setSelectedActivity] = useState(0);

  if (!activities || activities.length === 0) return null;

  const current = activities[selectedActivity] || activities[0];

  const getScoreBadge = (score) => {
    if (score >= 80) {
      return {
        label: 'Optimal',
        badge: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      };
    }
    if (score >= 50) {
      return {
        label: 'Fair / Caution',
        badge: 'text-amber-300 bg-amber-500/20 border-amber-500/30',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      };
    }
    return {
      label: 'Not Recommended',
      badge: 'text-rose-300 bg-rose-500/20 border-rose-500/30',
      icon: <XCircle className="w-4 h-4 text-rose-400" />,
    };
  };

  const badgeInfo = getScoreBadge(current.score);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 mb-6 border border-cyan-500/20 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              AI Smart Activity & Sports Suitability
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Hourly Planner
              </span>
            </h3>
            <p className="text-xs text-slate-400">Atmospheric fitness, travel, and sports safety engine</p>
          </div>
        </div>
      </div>

      {/* Activity Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {activities.map((act, idx) => {
          const isSelected = selectedActivity === idx;
          return (
            <button
              key={act.id}
              onClick={() => setSelectedActivity(idx)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400/50 shadow-md shadow-cyan-500/10'
                  : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">{act.icon}</span>
                <span className="text-xs font-black text-white">{act.score}%</span>
              </div>
              <div className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                {act.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Activity Details Card */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        {/* Top Status Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{current.icon}</span>
            <div>
              <h4 className="text-sm font-extrabold text-white">{current.title}</h4>
              <p className="text-xs text-slate-400">Weather suitability index</p>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${badgeInfo.badge}`}>
            {badgeInfo.icon}
            <span>{current.score}% • {badgeInfo.label}</span>
          </div>
        </div>

        {/* Situational Advice */}
        <p className="text-xs text-slate-200 font-medium leading-relaxed">
          {current.advice}
        </p>

        {/* Optimal & Caution Windows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Recommended Window</div>
              <div>{current.bestWindow}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">Caution / Peak Risk Window</div>
              <div>{current.cautionWindow}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
