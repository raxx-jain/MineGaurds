import React from 'react';
import { AlertOctagon, LifeBuoy, CheckCircle2, MapPin, Activity, Flame, ShieldAlert, AlertTriangle, Lock, Users, Navigation } from 'lucide-react';
import { useMine } from '../context/MineContext';

export function EmergencyBanner({ onFocusMap }) {
  const { 
    workers, 
    selectedWorkerId,
    setSelectedWorkerId,
    setRescueModalOpen, 
    alerts, 
    acknowledgeAlert,
    collapseState,
    setCollapseModalOpen,
  } = useMine();

  // ==================== TUNNEL COLLAPSE BANNER ====================
  if (collapseState.active) {
    const { zone, subZone, affectedWorkerIds, evacuatedWorkerIds, zoneLocked } = collapseState;
    const stillTrapped = affectedWorkerIds.filter(id => !evacuatedWorkerIds.includes(id));
    const allEvacuated = stillTrapped.length === 0 && affectedWorkerIds.length > 0;

    return (
      <div className="rounded-xl relative overflow-hidden transition-all duration-300 border-2 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.3)]">
        {/* Animated hazard tape top stripe */}
        <div className="h-2 w-full" style={{
          background: 'repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 20px, #f59e0b 20px, #f59e0b 40px)',
          animation: 'hazardScroll 1s linear infinite',
        }} />
        <style>{`@keyframes hazardScroll { from { background-position: 0 0; } to { background-position: 40px 0; } }`}</style>

        <div className="bg-gradient-to-r from-red-950/95 via-red-900/90 to-red-950/95 px-5 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Left: Collapse Alert */}
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-lg bg-red-600/30 border border-red-500/60 text-red-400 mt-0.5 relative">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded font-mono text-sm font-black tracking-wider uppercase bg-red-600 text-white animate-pulse shadow-lg">
                    🚨 TUNNEL COLLAPSE DETECTED
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-mono text-xs font-bold">
                    EXTREME DANGER
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-xs text-red-200/90 font-mono">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    Zone: <strong className="text-white">{zone}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    Tunnel: <strong className="text-white">{subZone}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Workers at Risk: <strong className="text-red-300">{affectedWorkerIds.length}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                    {zoneLocked ? (
                      <strong className="text-red-300">ZONE LOCKED</strong>
                    ) : (
                      <strong className="text-emerald-300">ZONE OPEN</strong>
                    )}
                  </span>
                </div>

                <div className="mt-2 text-xs font-mono font-bold tracking-wider">
                  {allEvacuated ? (
                    <span className="text-emerald-400">✅ ALL WORKERS EVACUATED — Zone remains locked pending structural clearance</span>
                  ) : (
                    <span className="text-red-300 animate-pulse">⚠ ACTION: EVACUATE ZONE IMMEDIATELY — {stillTrapped.length} workers still inside</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-end">
              <button
                onClick={() => {
                  if (onFocusMap) onFocusMap();
                }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-industrial-800/80 hover:bg-industrial-750 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold tracking-wider transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>VIEW ROUTE</span>
              </button>

              <button
                onClick={() => setCollapseModalOpen(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/40 text-xs font-mono font-bold tracking-wider uppercase transition-all transform hover:scale-[1.02]"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>COLLAPSE COMMAND</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==================== STANDARD CRITICAL WORKER BANNER ====================
  const criticalWorker = workers.find(w => w.riskScore >= 80 && (w.fallDetected || w.spO2 < 88 || w.methane > 40 || w.sos)) 
    || workers.find(w => w.riskLevel === 'CRITICAL');

  if (!criticalWorker) {
    return null;
  }

  const activeAlert = alerts.find(a => a.workerId === criticalWorker.id && !a.acknowledged);

  return (
    <div className="hud-panel-danger rounded-xl p-4 md:p-5 relative overflow-hidden transition-all duration-300 border-2 border-red-500/60 shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-lg bg-red-600/20 border border-red-500/50 text-red-400 mt-0.5 animate-pulse">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono text-xs font-black tracking-wider uppercase bg-red-600 text-white">
                🚨 CRITICAL ALERT
              </span>
              <span className="font-mono text-base font-bold text-red-200">
                WORKER {criticalWorker.id} ({criticalWorker.name})
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 font-mono">
                RISK SCORE: <strong className="text-red-400 font-black">{criticalWorker.riskScore}/100</strong>
              </span>
            </div>

            <p className="text-sm font-semibold text-red-200 mt-1">
              Possible suffocation / toxic atmospheric exposure &amp; medical emergency detected.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-red-300/90 font-mono">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Methane: <strong className="text-white">{criticalWorker.methane} ppm</strong> / CO: <strong className="text-white">{criticalWorker.co} ppm</strong>
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-red-400" />
                SpO₂: <strong className="text-white">{criticalWorker.spO2}%</strong> (Hypoxic)
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                HR: <strong className="text-white">{criticalWorker.heartRate} BPM</strong>
              </span>
              {criticalWorker.fallDetected && (
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/40">
                  ⚠️ FALL DETECTED
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Location:</span>
              <strong className="text-amber-300 font-semibold">{criticalWorker.zone} → Zone {criticalWorker.subZone}</strong>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Gateway: {criticalWorker.gateway}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-end">
          {activeAlert && (
            <button
              onClick={() => acknowledgeAlert(activeAlert.id)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-industrial-800 hover:bg-industrial-750 text-slate-200 border border-slate-700 text-xs font-mono font-semibold tracking-wider transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ACKNOWLEDGE</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedWorkerId(criticalWorker.id);
              if (onFocusMap) onFocusMap(criticalWorker.id);
            }}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-industrial-800 hover:bg-industrial-750 text-sky-300 border border-sky-500/40 text-xs font-mono font-semibold tracking-wider transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>VIEW LOCATION</span>
          </button>

          <button
            onClick={() => {
              setSelectedWorkerId(criticalWorker.id);
              setRescueModalOpen(true);
            }}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/40 text-xs font-mono font-bold tracking-wider uppercase transition-all transform hover:scale-[1.02]"
          >
            <LifeBuoy className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span>START RESCUE</span>
          </button>
        </div>

      </div>
    </div>
  );
}
