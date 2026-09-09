import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Info,
  MapPin,
  Clock
} from 'lucide-react';
import { useMine } from '../context/MineContext';
import { RiskGauge } from './RiskGauge';

export function RiskEnginePanel() {
  const { selectedWorker } = useMine();

  if (!selectedWorker) return null;

  const {
    id,
    name,
    role,
    zone,
    subZone,
    riskScore,
    riskLevel,
    riskColor,
    riskContributors = [],
    lastSeen,
  } = selectedWorker;

  // Calculate sum of contributors
  const totalContributorsPoints = riskContributors.reduce((acc, c) => acc + c.points, 0);

  return (
    <div className="hud-panel rounded-xl p-4 md:p-5 flex flex-col border border-industrial-700/80 shadow-2xl relative h-full justify-between">
      {/* Panel Header */}
      <div className="flex items-start justify-between border-b border-industrial-700/70 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono uppercase">
              AI WORKER RISK ANALYSIS
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Live calculated risk telemetry for Worker <strong className="text-slate-200 font-semibold">{id}</strong>
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-xs font-bold text-amber-400">
            {id} • {name}
          </div>
          <div className="text-[10px] text-slate-400">
            {role}
          </div>
        </div>
      </div>

      {/* Main Analysis Display: Gauge + Contributors Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center flex-1">
        
        {/* Left: Circular Risk Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-industrial-900/60 rounded-xl p-4 border border-industrial-800/80 h-full">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            WORKER {id}
          </div>
          <RiskGauge 
            score={riskScore} 
            level={riskLevel} 
            color={riskColor} 
          />
          <div className="text-[11px] font-mono text-slate-400 mt-2 text-center flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Location:</span>
            <span className="text-slate-200 font-semibold">{zone} ({subZone})</span>
          </div>
        </div>

        {/* Right: Risk Contributors List */}
        <div className="md:col-span-7 flex flex-col h-full justify-between">
          <div className="bg-industrial-950 px-2.5 py-1 rounded border border-industrial-800 mb-2 flex items-center justify-between text-[10px] font-mono">
            <span className="text-cyan-400 font-bold">FUSION MODEL:</span>
            <span className="text-slate-400">Fixed Tunnel Node Gas + Smart-Vest Vitals</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              ACTIVE RISK CONTRIBUTORS:
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Score Impact Sum: <strong className="text-white font-bold">+{totalContributorsPoints}</strong>
            </span>
          </div>

          {/* List of active contributors */}
          <div className="space-y-2 flex-1">
            {riskContributors.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero elevated risk factors detected. Worker telemetry within normal parameters.</span>
              </div>
            ) : (
              riskContributors.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-industrial-900/90 border border-industrial-800 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      item.severity === 'CRITICAL' ? 'bg-red-400 animate-ping' :
                      item.severity === 'HIGH RISK' ? 'bg-orange-400' : 'bg-amber-400'
                    }`} />
                    <div>
                      <div className="text-slate-200 font-semibold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      item.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                      item.severity === 'HIGH RISK' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                      'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      +{item.points}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer status */}
          <div className="mt-3 pt-2 border-t border-industrial-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Updated: {lastSeen}
            </span>
            <span className="text-slate-300 font-semibold">Telemetry Feed Synchronized</span>
          </div>

        </div>

      </div>
    </div>
  );
}
