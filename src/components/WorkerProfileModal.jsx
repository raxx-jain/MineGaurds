import React from 'react';
import { 
  User, 
  X, 
  Heart, 
  Activity, 
  Thermometer, 
  Flame, 
  Footprints, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert, 
  Battery, 
  Radio, 
  Calendar, 
  LifeBuoy,
  PhoneCall,
  Clock
} from 'lucide-react';
import { useMine } from '../context/MineContext';

export function WorkerProfileModal() {
  const { 
    workerProfileModalOpen, 
    setWorkerProfileModalOpen, 
    selectedWorker, 
    alerts, 
    setRescueModalOpen,
    tunnelSensors,
  } = useMine();

  if (!workerProfileModalOpen || !selectedWorker) return null;

  const {
    id,
    name,
    role,
    zone,
    subZone,
    heartRate,
    spO2,
    bodyTemp,
    ambientTemp,
    methane,
    co,
    humidity,
    movement,
    fallDetected,
    battery,
    gateway,
    signalDbm,
    lastSeen,
    shift,
    ppeEquipped,
    riskScore,
    riskLevel,
    riskColor,
  } = selectedWorker;

  // Filter alerts relevant to this worker
  const workerAlerts = alerts.filter((a) => a.workerId === id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="hud-panel rounded-2xl w-full max-w-2xl border-2 border-industrial-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-industrial-900 px-6 py-4 border-b border-industrial-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-industrial-800 border border-industrial-700 flex items-center justify-center text-amber-400 font-mono font-bold text-lg">
              {id.replace('MG-', '')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-mono font-black text-white">{name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-industrial-800 text-amber-300 font-mono border border-industrial-700 font-bold">
                  {id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {role} • Shift: {shift}
              </p>
            </div>
          </div>

          <button
            onClick={() => setWorkerProfileModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-industrial-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
          
          {/* Status & Risk Summary Bar */}
          <div className="bg-industrial-950 p-4 rounded-xl border border-industrial-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">OPERATIONAL STATUS</div>
              <div className="text-lg font-bold mt-0.5" style={{ color: riskColor }}>
                {riskLevel}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">AI RISK SCORE</div>
              <div className="text-2xl font-black" style={{ color: riskColor }}>
                {riskScore} <span className="text-xs text-slate-500 font-sans font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Biometrics & Atmosphere Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-industrial-900/90 p-3 rounded-lg border border-industrial-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400" /> HEART RATE
              </span>
              <div className={`text-lg font-bold mt-1 ${heartRate > 115 ? 'text-red-400' : 'text-slate-100'}`}>
                {heartRate} BPM
              </div>
            </div>

            <div className="bg-industrial-900/90 p-3 rounded-lg border border-industrial-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> SpO₂ OXYGEN
              </span>
              <div className={`text-lg font-bold mt-1 ${spO2 < 90 ? 'text-red-400' : 'text-slate-100'}`}>
                {spO2}%
              </div>
            </div>

            <div className="bg-industrial-900/90 p-3 rounded-lg border border-industrial-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-orange-400" /> BODY TEMP
              </span>
              <div className="text-lg font-bold text-slate-100 mt-1">
                {bodyTemp.toFixed(1)}°C
              </div>
            </div>

            <div className="bg-industrial-900/90 p-3 rounded-lg border border-industrial-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> GAS LEVELS
              </span>
              <div className={`text-sm font-bold mt-1 ${methane > 40 ? 'text-red-400' : 'text-slate-100'}`}>
                CH₄: {methane} | CO: {co}
              </div>
            </div>
          </div>

          {/* Hardware & Sensing Architecture Badge */}
          <div className="bg-industrial-900 p-3 rounded-xl border border-cyan-500/30 flex flex-col gap-1.5">
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>HARDWARE SENSING DEPLOYMENT</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px]">DECOUPLED LAYERS</span>
            </div>
            <div className="text-[11px] text-slate-200 font-bold">
              Sensors: Worker Wearable Smart-Vest Node #W-{id.replace('MG-', '')} (Vitals + IMU Motion + SOS)
            </div>
            <div className="text-[10px] text-slate-400">
              Nearest Environmental Sensor Node: <strong className="text-amber-300 font-mono">Node C04-S03</strong> — CH₄: {methane} ppm | CO: {co} ppm | O₂: 18.5%
            </div>
          </div>

          {/* Kinematics, Location & Device Health */}
          <div className="bg-industrial-950 p-4 rounded-xl border border-industrial-800 space-y-3">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              TELEMETRY LOGISTICS &amp; POSITION
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400">Underground Zone:</span>
                <div className="text-amber-300 font-bold mt-0.5">{zone} → Sub-Zone {subZone}</div>
              </div>
              <div>
                <span className="text-slate-400">Movement &amp; Posture:</span>
                <div className="text-slate-200 font-bold mt-0.5">
                  {movement} {fallDetected ? '(FALL DETECTED)' : ''}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Gateway Node:</span>
                <div className="text-cyan-300 font-semibold mt-0.5">{gateway} ({signalDbm} dBm)</div>
              </div>
              <div>
                <span className="text-slate-400">Smart Helmet Battery:</span>
                <div className="text-slate-200 font-semibold mt-0.5">{battery}% Remaining</div>
              </div>
            </div>
          </div>

          {/* Recent Event Log */}
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> RECENT TELEMETRY ALERTS &amp; EVENTS
            </div>

            <div className="space-y-2">
              {workerAlerts.length === 0 ? (
                <div className="p-3 rounded bg-industrial-900 text-slate-500 text-center">
                  No critical incidents recorded for this worker during current shift.
                </div>
              ) : (
                workerAlerts.map((a) => (
                  <div
                    key={a.id}
                    className="p-2.5 rounded-lg bg-industrial-900 border border-industrial-800 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="text-slate-400 font-bold mr-2">{a.time}</span>
                      <span className="text-slate-200">{a.message}</span>
                    </div>
                    <span className="text-red-400 font-bold">{a.severity}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-industrial-900 px-6 py-4 border-t border-industrial-800 flex items-center justify-between gap-3">
          <button
            onClick={() => setWorkerProfileModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-industrial-800 hover:bg-industrial-750 text-slate-300 text-xs font-mono font-medium transition-colors"
          >
            CLOSE
          </button>

          {riskScore >= 75 && (
            <button
              onClick={() => {
                setWorkerProfileModalOpen(false);
                setRescueModalOpen(true);
              }}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow"
            >
              <LifeBuoy className="w-4 h-4" /> START RESCUE PROTOCOL
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
