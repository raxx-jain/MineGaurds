import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  Server, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Database,
  ArrowRightLeft,
  Activity
} from 'lucide-react';
import { useMine } from '../context/MineContext';

export function CommunicationPanel() {
  const { 
    gateways, 
    isNetworkDegraded, 
    setIsNetworkDegraded, 
    totalWorkers 
  } = useMine();

  const connectedCount = isNetworkDegraded ? 28 : 40;
  const strength = isNetworkDegraded ? '44%' : '92%';

  return (
    <div className="hud-panel rounded-xl p-4 md:p-5 flex flex-col border border-industrial-700/80 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-industrial-700/70 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono uppercase">
              UNDERGROUND COMMUNICATION
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Resilient Mesh &amp; Subterranean Gateway Infrastructure
            </p>
          </div>
        </div>

        {/* Toggle Simulation Button */}
        <button
          onClick={() => setIsNetworkDegraded(!isNetworkDegraded)}
          className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border transition-colors ${
            isNetworkDegraded
              ? 'bg-amber-950/60 text-amber-300 border-amber-500/50 hover:bg-amber-900/60'
              : 'bg-industrial-800 text-slate-300 border-industrial-700 hover:text-white'
          }`}
          title="Simulate Underground Mesh Disruption"
        >
          {isNetworkDegraded ? 'RESTORE ONLINE' : 'SIMULATE PACKET LOSS'}
        </button>
      </div>

      {/* Gateways Status Grid */}
      <div className="space-y-2 mb-4 font-mono text-xs">
        {gateways.map((gw, idx) => {
          const isOffline = isNetworkDegraded && idx === 2; // Gateway 03 offline in degraded scenario
          return (
            <div
              key={gw.id}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                isOffline
                  ? 'bg-red-950/30 border-red-500/40 text-red-300'
                  : 'bg-industrial-900/80 border-industrial-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${
                  isOffline ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
                }`} />
                <div>
                  <div className="font-bold">{gw.name}</div>
                  <div className="text-[10px] text-slate-400">{gw.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div className="hidden sm:block">
                  <span className="text-[10px] text-slate-400">LATENCY:</span>
                  <span className="ml-1 text-slate-200">{isOffline ? 'TIMEOUT' : `${gw.latencyMs}ms`}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isOffline
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}>
                  {isOffline ? 'DEGRADED' : 'ONLINE'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 gap-2 bg-industrial-950/80 p-3 rounded-lg border border-industrial-800 font-mono text-xs mb-3">
        <div>
          <span className="text-slate-400 text-[10px]">WORKERS CONNECTED</span>
          <div className="text-lg font-bold text-slate-100">
            {connectedCount} <span className="text-slate-400 text-xs font-normal">/ {totalWorkers}</span>
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-[10px]">NETWORK STRENGTH</span>
          <div className={`text-lg font-bold ${isNetworkDegraded ? 'text-amber-400' : 'text-emerald-400'}`}>
            {strength}
          </div>
        </div>
      </div>

      {/* Resilient Store-and-Forward Notice (Shown during packet loss / degraded mesh) */}
      {isNetworkDegraded ? (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 text-xs font-mono text-amber-200 flex items-start gap-2.5 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-amber-300">NETWORK DEGRADED</div>
            <p className="text-[11px] text-amber-300/90 mt-0.5">
              Emergency data will be stored and forwarded when connection is restored. Local wearable flash buffers active.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded-lg bg-industrial-900/60 border border-industrial-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Store-and-Forward Mesh Protocol: Standby
          </span>
          <span className="text-emerald-400 font-semibold">Resilient</span>
        </div>
      )}
    </div>
  );
}
