import React from 'react';
import { Users, ShieldCheck, AlertTriangle, Flame, BellRing } from 'lucide-react';
import { useMine } from '../context/MineContext';

export function SummaryCards() {
  const { 
    totalWorkers, 
    safeCount, 
    warningCount, 
    criticalCount, 
    activeAlertsCount,
    filterStatus, 
    setFilterStatus 
  } = useMine();

  const cards = [
    {
      id: 'ALL',
      title: 'TOTAL WORKERS',
      value: totalWorkers,
      subtext: '42 ACTIVE ON SHIFT',
      icon: Users,
      color: 'blue',
      badgeClass: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      borderGlow: 'border-slate-700/60 hover:border-sky-500/50',
      activeClass: 'ring-2 ring-sky-500 border-sky-500 bg-sky-950/20',
      trend: '100% Monitored',
    },
    {
      id: 'SAFE',
      title: 'SAFE',
      value: safeCount,
      subtext: 'OPTIMAL BIOMETRICS',
      icon: ShieldCheck,
      color: 'emerald',
      badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      borderGlow: 'border-slate-700/60 hover:border-emerald-500/50',
      activeClass: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-950/20',
      trend: 'Normal Gas & HR',
    },
    {
      id: 'WARNING',
      title: 'WARNING',
      value: warningCount,
      subtext: 'ELEVATED TELEMETRY',
      icon: AlertTriangle,
      color: 'amber',
      badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      borderGlow: 'border-slate-700/60 hover:border-amber-500/50',
      activeClass: 'ring-2 ring-amber-500 border-amber-500 bg-amber-950/20',
      trend: 'Gas / Heart Alert',
    },
    {
      id: 'CRITICAL',
      title: 'CRITICAL',
      value: criticalCount,
      subtext: 'IMMEDIATE HAZARD',
      icon: Flame,
      color: 'red',
      badgeClass: 'text-red-400 bg-red-500/10 border-red-500/30',
      borderGlow: 'border-slate-700/60 hover:border-red-500/50',
      activeClass: 'ring-2 ring-red-500 border-red-500 bg-red-950/30',
      trend: 'Rescue Ready',
      pulse: criticalCount > 0,
    },
    {
      id: 'ALERTS',
      title: 'ACTIVE ALERTS',
      value: activeAlertsCount,
      subtext: 'REQUIRES ACTION',
      icon: BellRing,
      color: 'orange',
      badgeClass: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      borderGlow: 'border-slate-700/60 hover:border-orange-500/50',
      activeClass: 'ring-2 ring-orange-500 border-orange-500 bg-orange-950/20',
      trend: 'Real-time Feed',
      pulse: activeAlertsCount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = filterStatus === card.id;

        return (
          <div
            key={card.id}
            onClick={() => {
              if (card.id === 'ALERTS') {
                setFilterStatus('CRITICAL');
              } else {
                setFilterStatus(filterStatus === card.id ? 'ALL' : card.id);
              }
            }}
            role="button"
            tabIndex={0}
            className={`hud-panel rounded-lg p-3.5 cursor-pointer transition-all duration-200 relative overflow-hidden ${card.borderGlow} ${
              isActive ? card.activeClass : ''
            }`}
          >
            {/* Top Indicator Accent Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              card.color === 'blue' ? 'bg-sky-500' :
              card.color === 'emerald' ? 'bg-emerald-500' :
              card.color === 'amber' ? 'bg-amber-500' :
              card.color === 'red' ? 'bg-red-500' : 'bg-orange-500'
            }`} />

            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-md border ${card.badgeClass}`}>
                <Icon className={`w-4 h-4 ${card.pulse ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className={`text-3xl font-black font-mono tracking-tight telemetry-num ${
                card.color === 'red' ? 'text-red-400 glow-red' :
                card.color === 'amber' ? 'text-amber-400 glow-amber' :
                card.color === 'emerald' ? 'text-emerald-400 glow-green' :
                card.color === 'orange' ? 'text-orange-400' : 'text-slate-100'
              }`}>
                {card.value}
              </span>

              <span className="text-[10px] font-mono text-slate-400 truncate">
                {card.trend}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-industrial-800/80 flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span>{card.subtext}</span>
              {isActive && (
                <span className="text-[9px] font-mono uppercase text-sky-400 font-bold">
                  ACTIVE FILTER
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
