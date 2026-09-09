import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Siren, 
  X, 
  Navigation, 
  UserCheck, 
  Radio,
  Clock,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useMine } from '../context/MineContext';

export function CollapseModal() {
  const { 
    collapseState,
    collapseModalOpen, 
    setCollapseModalOpen,
    markCollapseSafe,
    dispatchCollapseRescue,
    evacuateWorker,
    workers,
  } = useMine();

  const [confirmSafe, setConfirmSafe] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Elapsed timer
  useEffect(() => {
    if (!collapseState.active) { setElapsedTime(0); return; }
    const start = Date.now();
    const iv = setInterval(() => setElapsedTime(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [collapseState.active]);

  if (!collapseModalOpen) return null;

  const { zone, subZone, affectedWorkerIds, evacuatedWorkerIds, rescueDispatched, rescueTeam, zoneLocked, timestamp, active } = collapseState;
  const affectedWorkers = workers.filter(w => affectedWorkerIds.includes(w.id));
  const stillTrapped = affectedWorkerIds.filter(id => !evacuatedWorkerIds.includes(id));
  const allEvacuated = stillTrapped.length === 0 && affectedWorkerIds.length > 0;

  const formatElapsed = (s) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Evacuation route description
  const EVAC_ROUTE = [
    { label: 'Stope C-04', status: 'danger' },
    { label: 'Crosscut C-03', status: 'warning' },
    { label: 'Main Haulage Drift', status: 'safe' },
    { label: 'Incline Adit', status: 'safe' },
    { label: 'Surface Portal', status: 'safe' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden border-2 border-red-600 shadow-[0_0_80px_rgba(220,38,38,0.4)]">
        
        {/* EXTREME DANGER Header Bar */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 px-5 py-4 flex items-center justify-between relative overflow-hidden">
          {/* Animated hazard stripe */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
            backgroundSize: '28px 28px',
          }} />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 rounded-lg bg-red-600/40 border border-red-500/80 animate-pulse">
              <AlertTriangle className="w-7 h-7 text-red-200" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wider font-mono uppercase flex items-center gap-2">
                🚨 TUNNEL COLLAPSE — EXTREME DANGER
              </h2>
              <p className="text-red-200/80 text-xs font-mono">
                Structural emergency detected • {timestamp || '--:--:--'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCollapseModalOpen(false)}
            className="relative z-10 p-1.5 rounded-md text-red-300 hover:text-white hover:bg-red-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#0a0e14] p-5 space-y-5">

          {/* Zone Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-3">
              <div className="text-[10px] text-red-300/70 uppercase mb-1">Affected Zone</div>
              <div className="text-lg font-black text-red-400">{zone || '--'}</div>
              <div className="text-xs text-red-300/60">{subZone || '--'}</div>
            </div>
            <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-3">
              <div className="text-[10px] text-red-300/70 uppercase mb-1">Workers at Risk</div>
              <div className="text-lg font-black text-red-400">{affectedWorkerIds.length}</div>
              <div className="text-xs text-red-300/60">{stillTrapped.length} still in zone</div>
            </div>
            <div className={`rounded-xl p-3 border ${zoneLocked ? 'bg-red-950/40 border-red-500/50' : 'bg-emerald-950/40 border-emerald-500/50'}`}>
              <div className="text-[10px] uppercase mb-1" style={{ color: zoneLocked ? '#fca5a5cc' : '#6ee7b7cc' }}>Zone Lock</div>
              <div className="flex items-center justify-center gap-1.5">
                {zoneLocked ? <Lock className="w-5 h-5 text-red-400" /> : <Unlock className="w-5 h-5 text-emerald-400" />}
                <span className={`text-sm font-black ${zoneLocked ? 'text-red-400' : 'text-emerald-400'}`}>
                  {zoneLocked ? 'LOCKED' : 'OPEN'}
                </span>
              </div>
            </div>
            <div className="bg-industrial-900/80 border border-industrial-700 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase mb-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Elapsed</div>
              <div className="text-lg font-black text-amber-400 tabular-nums">{formatElapsed(elapsedTime)}</div>
            </div>
          </div>

          {/* Evacuation Route */}
          <div className="bg-industrial-950/80 border border-industrial-700 rounded-xl p-4">
            <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase mb-3 flex items-center gap-1.5">
              <Navigation className="w-4 h-4" /> Safe Evacuation Route
            </h3>
            <div className="flex items-center gap-1 flex-wrap font-mono text-xs">
              {EVAC_ROUTE.map((step, i) => (
                <React.Fragment key={i}>
                  <span className={`px-2.5 py-1.5 rounded-lg border font-semibold ${
                    step.status === 'danger' ? 'bg-red-950/60 border-red-500/60 text-red-300' :
                    step.status === 'warning' ? 'bg-amber-950/60 border-amber-500/60 text-amber-300' :
                    'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  }`}>
                    {step.label}
                  </span>
                  {i < EVAC_ROUTE.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              All workers directed toward Main Haulage Drift via emergency ventilation conduit
            </p>
          </div>

          {/* Workers in Zone */}
          <div className="bg-industrial-950/80 border border-industrial-700 rounded-xl p-4">
            <h3 className="text-xs font-mono font-bold text-red-300 uppercase mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Workers in Affected Zone ({affectedWorkerIds.length})
            </h3>
            {affectedWorkers.length > 0 ? (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {affectedWorkers.map(w => {
                  const isEvacuated = evacuatedWorkerIds.includes(w.id);
                  return (
                    <div key={w.id} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono ${
                      isEvacuated 
                        ? 'bg-emerald-950/30 border-emerald-500/30' 
                        : 'bg-red-950/30 border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isEvacuated ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                        <span className={`font-bold ${isEvacuated ? 'text-emerald-300' : 'text-red-300'}`}>{w.id}</span>
                        <span className="text-slate-400">{w.name}</span>
                        <span className="text-slate-500">• {w.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEvacuated ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                            <UserCheck className="w-3 h-3" /> EVACUATED
                          </span>
                        ) : (
                          <>
                            <span className="px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/50 text-[10px] font-bold animate-pulse">
                              EVACUATION REQUIRED
                            </span>
                            <button
                              onClick={() => evacuateWorker(w.id)}
                              className="px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/50 text-[10px] font-bold transition-colors"
                            >
                              CONFIRM EVAC
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 text-xs font-mono">No workers found in the affected zone.</p>
            )}
          </div>

          {/* Rescue Team Status */}
          <div className="bg-industrial-950/80 border border-industrial-700 rounded-xl p-4">
            <h3 className="text-xs font-mono font-bold text-amber-300 uppercase mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Rescue Operations
            </h3>
            {rescueDispatched ? (
              <div className="flex items-center gap-3 px-3 py-2.5 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs font-mono">
                <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <div className="text-amber-300 font-bold">{rescueTeam}</div>
                  <div className="text-slate-400 text-[10px]">Dispatched with SCBA, structural shoring, extraction equipment</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => dispatchCollapseRescue()}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Siren className="w-4 h-4" /> DISPATCH RESCUE EXTRACTION TEAM
              </button>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-industrial-900 border-t border-industrial-700 px-5 py-4 flex items-center justify-between gap-3">
          <div className="text-[10px] text-slate-500 font-mono max-w-sm">
            ⚠ PROTOTYPE SIMULATION — This scenario demonstrates structural emergency response workflow. 
            Not a real structural prediction system.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapseModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-industrial-800 hover:bg-industrial-750 text-slate-300 border border-industrial-700 text-xs font-mono font-semibold transition-colors"
            >
              MINIMIZE
            </button>

            {confirmSafe ? (
              <button
                onClick={() => { markCollapseSafe(); setConfirmSafe(false); }}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all animate-pulse"
              >
                <ShieldCheck className="w-4 h-4" /> CONFIRM: MARK ZONE SAFE
              </button>
            ) : (
              <button
                onClick={() => setConfirmSafe(true)}
                disabled={!allEvacuated && active}
                className={`px-5 py-2 rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all ${
                  !allEvacuated && active
                    ? 'bg-industrial-800 text-slate-500 border border-industrial-700 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> OVERRIDE: MARK ZONE SAFE
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
