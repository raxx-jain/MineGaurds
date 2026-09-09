import React from 'react';
import { Bell, AlertOctagon, AlertTriangle, Info, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { useMine } from '../context/MineContext';

export function AlertFeed({ onFocusMap }) {
  const { alerts, setSelectedWorkerId, acknowledgeAlert } = useMine();

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            CRITICAL
          </span>
        );
      case 'HIGH RISK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
            HIGH RISK
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/40">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="hud-panel rounded-xl p-4 md:p-5 flex flex-col border border-industrial-700/80 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-industrial-700/70 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono uppercase">
              LIVE ALERTS FEED
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Chronological safety event audit stream with immediate worker linkage
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          AUTO-UPDATING STREAM
        </span>
      </div>

      {/* Alerts list */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs font-mono">
            No active emergency alerts recorded.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => {
                setSelectedWorkerId(alert.workerId);
                if (onFocusMap) onFocusMap(alert.workerId);
              }}
              className={`p-3 rounded-lg border text-xs font-mono cursor-pointer transition-all hover:border-slate-500 ${
                alert.severity === 'CRITICAL'
                  ? 'bg-red-950/30 border-red-500/40 hover:bg-red-950/40'
                  : alert.severity === 'HIGH RISK'
                  ? 'bg-orange-950/20 border-orange-500/30 hover:bg-orange-950/30'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/30'
                  : 'bg-industrial-900 border-industrial-800'
              } ${alert.acknowledged ? 'opacity-60' : 'opacity-100'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px] font-bold">
                    {alert.time}
                  </span>
                  <span className="text-amber-400 font-black">
                    {alert.workerId}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    ({alert.workerName})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getSeverityBadge(alert.severity)}
                  {!alert.acknowledged && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        acknowledgeAlert(alert.id);
                      }}
                      className="text-[10px] text-slate-400 hover:text-emerald-400 px-1.5 py-0.5 rounded bg-industrial-800"
                      title="Acknowledge this alert"
                    >
                      Ack
                    </button>
                  )}
                </div>
              </div>

              <div className="text-slate-200 font-medium text-[11px]">
                {alert.message}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 pt-1 border-t border-industrial-800/60">
                <span>{alert.zone}</span>
                <span className="text-cyan-400 flex items-center gap-0.5">
                  Inspect <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
