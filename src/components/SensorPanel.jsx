import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Flame, 
  CloudRain, 
  Footprints, 
  ShieldAlert, 
  MapPin, 
  Wifi, 
  BatteryMedium,
  Radio,
  Gauge,
  RadioTower,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useMine } from '../context/MineContext';
import { getSensorsForTunnel, getSensorNodeStatus } from '../utils/tunnelSensors';

export function SensorPanel() {
  const { selectedWorker, tunnelSensors } = useMine();
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'LAYER1' | 'LAYER2'

  if (!selectedWorker) return null;

  const {
    id,
    name,
    heartRate,
    spO2,
    bodyTemp,
    ambientTemp,
    methane,
    co,
    humidity,
    movement,
    fallDetected,
    zone,
    subZone,
    gateway,
    signalDbm,
    battery,
  } = selectedWorker;

  // Find nearest fixed tunnel sensor node
  const zoneSensors = tunnelSensors.filter(s => s.zone === zone);
  const subZoneSensor = tunnelSensors.find(s => s.tunnel === subZone) || zoneSensors[0] || tunnelSensors[0];

  // Status evaluations
  const hrStatus = heartRate > 120 || heartRate < 50 ? 'CRITICAL' : heartRate > 100 ? 'WARNING' : 'NORMAL';
  const spO2Status = spO2 < 85 ? 'CRITICAL' : spO2 < 92 ? 'WARNING' : 'NORMAL';
  const tempStatus = bodyTemp > 38.0 ? 'HIGH' : bodyTemp < 35.5 ? 'LOW' : 'NORMAL';

  return (
    <div className="hud-panel rounded-xl p-4 md:p-5 flex flex-col border border-industrial-700/80 shadow-2xl relative space-y-4">
      
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-industrial-700/70 pb-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <RadioTower className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono uppercase flex items-center gap-2">
              <span>DUAL-LAYER UNDERGROUND SENSING MATRIX</span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Decoupled Architecture: Fixed Tunnel Environmental Nodes + Worker Wearable Smart-Vest
            </p>
          </div>
        </div>

        {/* Layer Filter Tabs */}
        <div className="flex rounded-md bg-industrial-950 p-0.5 border border-industrial-700 font-mono text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'ALL' ? 'bg-industrial-700 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dual Layer View
          </button>
          <button
            onClick={() => setActiveTab('LAYER1')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'LAYER1' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fixed Tunnel Nodes
          </button>
          <button
            onClick={() => setActiveTab('LAYER2')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === 'LAYER2' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Worker Smart-Vest
          </button>
        </div>
      </div>

      {/* ================= LAYER 1: FIXED TUNNEL SENSOR NETWORK ================= */}
      {(activeTab === 'ALL' || activeTab === 'LAYER1') && (
        <div className="bg-industrial-950/90 rounded-xl p-3.5 border border-industrial-800 space-y-3">
          <div className="flex items-center justify-between border-b border-industrial-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px] border border-amber-500/30">
                SENSING LAYER 1
              </span>
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                FIXED TUNNEL ENVIRONMENTAL SENSOR NETWORK
              </h3>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Active Tunnel Nodes: <strong className="text-slate-200">{tunnelSensors.length} Nodes</strong>
            </div>
          </div>

          {/* Active Sensor Node Card for Selected Worker's Zone */}
          <div className="bg-industrial-900/90 p-3 rounded-lg border border-industrial-700/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-4 border-r border-industrial-800 pr-3">
              <div className="text-[10px] text-slate-400 font-mono uppercase">NEAREST ENVIRONMENTAL NODE</div>
              <div className="text-sm font-mono font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Node {subZoneSensor.id}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {subZoneSensor.zone} • Tunnel {subZoneSensor.tunnel}
              </div>
              <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> HARDWARE ONLINE
              </div>
            </div>

            {/* Gas Metrics for nearest fixed sensor node */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-industrial-950 border border-industrial-800">
                <div className="text-[10px] text-slate-400">Methane (CH₄)</div>
                <div className={`text-base font-bold telemetry-num mt-0.5 ${subZoneSensor.ch4 > 30 ? 'text-red-400 glow-red' : 'text-slate-100'}`}>
                  {subZoneSensor.ch4} <span className="text-[10px] font-normal text-slate-400">ppm</span>
                </div>
              </div>

              <div className="p-2 rounded bg-industrial-950 border border-industrial-800">
                <div className="text-[10px] text-slate-400">Carbon Monoxide (CO)</div>
                <div className={`text-base font-bold telemetry-num mt-0.5 ${subZoneSensor.co > 30 ? 'text-red-400 glow-red' : 'text-slate-100'}`}>
                  {subZoneSensor.co} <span className="text-[10px] font-normal text-slate-400">ppm</span>
                </div>
              </div>

              <div className="p-2 rounded bg-industrial-950 border border-industrial-800">
                <div className="text-[10px] text-slate-400">Oxygen (O₂)</div>
                <div className={`text-base font-bold telemetry-num mt-0.5 ${subZoneSensor.o2 < 19.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {subZoneSensor.o2}%
                </div>
              </div>

              <div className="p-2 rounded bg-industrial-950 border border-industrial-800">
                <div className="text-[10px] text-slate-400">Hydrogen Sulfide (H₂S)</div>
                <div className="text-base font-bold telemetry-num text-slate-200 mt-0.5">
                  {subZoneSensor.h2s} <span className="text-[10px] font-normal text-slate-400">ppm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Nodes Grid Pill Bar */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              ALL TUNNEL SENSOR NODES MATRIX ({zone}):
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {zoneSensors.map(s => {
                const status = getSensorNodeStatus(s);
                return (
                  <div 
                    key={s.id} 
                    className={`px-2 py-1 rounded border flex items-center gap-1.5 ${
                      status === 'EXTREME DANGER' || status === 'DANGER' 
                        ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse'
                        : status === 'WARNING'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                        : 'bg-industrial-900 border-industrial-800 text-slate-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      status === 'EXTREME DANGER' || status === 'DANGER' ? 'bg-red-400' :
                      status === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <span className="font-bold">{s.id}</span>
                    <span className="text-[10px] text-slate-400">({s.tunnel})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= LAYER 2: WORKER WEARABLE SMART-VEST NODE ================= */}
      {(activeTab === 'ALL' || activeTab === 'LAYER2') && (
        <div className="bg-industrial-950/90 rounded-xl p-3.5 border border-industrial-800 space-y-3">
          <div className="flex items-center justify-between border-b border-industrial-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold text-[10px] border border-cyan-500/30">
                SENSING LAYER 2
              </span>
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                WORKER WEARABLE SMART-VEST NODE #W-{id.replace('MG-', '')}
              </h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <BatteryMedium className={`w-3.5 h-3.5 ${battery < 25 ? 'text-red-400' : 'text-emerald-400'}`} />
                {battery}%
              </span>
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                {signalDbm} dBm
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Health Vitals */}
            <div className="bg-industrial-900/90 rounded-lg p-3 border border-industrial-800 space-y-2">
              <div className="text-[10px] font-mono font-bold text-red-400 flex items-center gap-1 uppercase border-b border-industrial-800 pb-1">
                <Activity className="w-3 h-3" /> PHYSIOLOGICAL VITALS
              </div>
              
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" /> Heart Rate:
                </span>
                <span className={`font-bold telemetry-num ${hrStatus === 'CRITICAL' ? 'text-red-400 glow-red' : 'text-slate-100'}`}>
                  {heartRate} BPM
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" /> SpO₂ Oxygen:
                </span>
                <span className={`font-bold telemetry-num ${spO2Status === 'CRITICAL' ? 'text-red-400 glow-red' : 'text-slate-100'}`}>
                  {spO2}%
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-orange-400" /> Core Temp:
                </span>
                <span className="font-bold telemetry-num text-slate-100">
                  {bodyTemp.toFixed(1)}°C
                </span>
              </div>
            </div>

            {/* Motion & Fall */}
            <div className="bg-industrial-900/90 rounded-lg p-3 border border-industrial-800 space-y-2">
              <div className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1 uppercase border-b border-industrial-800 pb-1">
                <Footprints className="w-3 h-3" /> IMU ACCELEROMETER
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Motion Status:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  movement === 'FALL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  movement === 'ERRATIC' ? 'bg-amber-500/20 text-amber-400' : 'text-emerald-400'
                }`}>
                  {movement}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Fall Detection:</span>
                <span className={`font-bold ${fallDetected ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {fallDetected ? 'IMPACT DETECTED' : 'CLEAR'}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">SOS Trigger:</span>
                <span className="text-slate-300 font-semibold">INACTIVE</span>
              </div>
            </div>

            {/* Tracking & Position */}
            <div className="bg-industrial-900/90 rounded-lg p-3 border border-industrial-800 space-y-2">
              <div className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1 uppercase border-b border-industrial-800 pb-1">
                <MapPin className="w-3 h-3" /> SPATIAL TRACKING
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Zone Position:</span>
                <span className="text-amber-300 font-bold">{zone} ({subZone})</span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Mesh Gateway:</span>
                <span className="text-cyan-300 font-semibold">{gateway}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Node Sync:</span>
                <span className="text-emerald-400 font-bold">100% ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
