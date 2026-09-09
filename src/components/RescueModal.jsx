import React, { useState } from 'react';
import { 
  LifeBuoy, 
  AlertTriangle, 
  MapPin, 
  Radio, 
  CheckCircle2, 
  Send, 
  X, 
  Clock, 
  ShieldAlert, 
  Navigation,
  Check,
  Compass,
  Zap
} from 'lucide-react';
import { useMine } from '../context/MineContext';

export function RescueModal() {
  const { 
    rescueModalOpen, 
    setRescueModalOpen, 
    selectedWorker, 
    rescueState, 
    dispatchRescue, 
    markWorkerFound 
  } = useMine();

  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('Rescue Team Alpha (Station 1)');

  if (!rescueModalOpen || !selectedWorker) return null;

  const handleDispatch = () => {
    dispatchRescue(selectedTeam);
    setDispatchSuccess(true);
  };

  const handleFound = () => {
    markWorkerFound();
    setDispatchSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="hud-panel-danger rounded-2xl w-full max-w-2xl border-2 border-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-950/70 px-6 py-4 border-b border-red-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600 text-white animate-pulse">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-black tracking-wider text-white uppercase flex items-center gap-2">
                RESCUE OPERATION ACTIVE
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500 text-white font-bold animate-ping">
                  EMERGENCY
                </span>
              </h2>
              <p className="text-xs text-red-300 font-sans">
                Emergency extraction protocol engaged for high-risk underground worker
              </p>
            </div>
          </div>

          <button
            onClick={() => setRescueModalOpen(false)}
            className="p-1 rounded-md text-red-300 hover:text-white hover:bg-red-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Success Banner when team dispatched */}
          {dispatchSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-sm font-mono flex items-center justify-between animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">Rescue team dispatched successfully.</span>
              </div>
              <span className="text-xs text-emerald-400">ETA: {rescueState.estimatedEta}</span>
            </div>
          )}

          {/* Worker Telemetry Status Card */}
          <div className="bg-industrial-900/90 rounded-xl p-4 border border-industrial-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px]">AFFECTED WORKER</span>
              <div className="text-base font-bold text-amber-400 mt-0.5">
                {selectedWorker.id}
              </div>
              <div className="text-[11px] text-slate-300">{selectedWorker.name}</div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px]">LOCATION</span>
              <div className="text-base font-bold text-slate-100 mt-0.5">
                {selectedWorker.zone}
              </div>
              <div className="text-[11px] text-amber-300">Zone {selectedWorker.subZone}</div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px]">WORKER STATUS</span>
              <div className="text-base font-black text-red-400 mt-0.5">
                {selectedWorker.riskLevel}
              </div>
              <div className="text-[10px] text-red-300">
                SpO₂: {selectedWorker.spO2}% | HR: {selectedWorker.heartRate}
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px]">RISK EVALUATION</span>
              <div className="text-base font-black text-red-400 mt-0.5">
                {selectedWorker.riskScore} / 100
              </div>
              <div className="text-[10px] text-slate-400">Last Signal: {selectedWorker.lastSeen}</div>
            </div>
          </div>

          {/* Rescue Navigation & Route Logistics */}
          <div className="bg-industrial-950/90 rounded-xl p-4 border border-industrial-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-industrial-800 pb-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Navigation className="w-4 h-4" /> SUGGESTED RESCUE ROUTE
              </span>
              <span className="text-amber-400 font-semibold">EST. DISTANCE: 380 METERS</span>
            </div>

            <div className="space-y-2 text-slate-300 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">1</span>
                <span>Enter via <strong>Surface Adit Portal</strong> → Descend Main Haulage Drift (14° Incline).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">2</span>
                <span>Proceed past Central Junction (Gateway 01) → Transition into <strong>Tunnel C Lower Crosscut</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold">3</span>
                <span><strong>Atmospheric Warning:</strong> High CH₄ / CO detected past C-02. Self-Contained Breathing Apparatus (SCBA) required.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-industrial-800 grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1 text-slate-400">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nearest Gateway:</span>
                <strong className="text-slate-200">{selectedWorker.gateway} (42m away)</strong>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Estimated Transit:</span>
                <strong className="text-amber-300">~3m 45s</strong>
              </div>
            </div>
          </div>

          {/* Rescue Team Selector */}
          <div className="space-y-1.5 font-mono text-xs">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> ASSIGNED RAPID RESCUE UNIT
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-industrial-900 border border-industrial-700 rounded-lg p-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-red-500"
            >
              <option value="Rescue Team Alpha (Station 1)">Rescue Team Alpha (Station 1 - Draeger Oxygen Equipped)</option>
              <option value="Rescue Team Bravo (Shaft Incline)">Rescue Team Bravo (Shaft Incline - Extraction Stretcher)</option>
              <option value="Autonomous UG Rescue Drone Delta">Autonomous UG Rescue Drone Delta (Air Supply Delivery)</option>
            </select>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-industrial-900/90 px-6 py-4 border-t border-industrial-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setRescueModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-industrial-800 hover:bg-industrial-750 text-slate-300 text-xs font-mono font-medium transition-colors"
          >
            CANCEL
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFound}
              className="px-4 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" /> MARK WORKER FOUND
            </button>

            <button
              onClick={handleDispatch}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" /> DISPATCH RESCUE TEAM
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
