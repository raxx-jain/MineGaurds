import React from 'react';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Flame, 
  Heart, 
  Activity, 
  Thermometer, 
  Footprints, 
  Bell, 
  Sparkles,
  CheckCircle,
  X,
  Mountain
} from 'lucide-react';
import { useMine } from '../context/MineContext';

export function SimulatorControl({ isOpen, onClose }) {
  const { 
    workers, 
    selectedWorkerId, 
    setSelectedWorkerId, 
    selectedWorker, 
    updateSelectedWorker, 
    triggerDemoEmergency, 
    resetSimulation, 
    isDemoRunning, 
    demoStep,
    triggerCollapseDemo,
    collapseState,
  } = useMine();

  if (!isOpen || !selectedWorker) return null;

  const {
    methane,
    co,
    heartRate,
    spO2,
    bodyTemp,
    movement,
    fallDetected,
    sos,
    riskScore,
    riskLevel,
  } = selectedWorker;

  // Preset scenarios for SIH presenter
  const applyPreset = (preset) => {
    switch (preset) {
      case 'NORMAL':
        updateSelectedWorker({
          methane: 8,
          co: 5,
          heartRate: 74,
          spO2: 98,
          bodyTemp: 36.7,
          movement: 'NORMAL',
          fallDetected: false,
          sos: false,
        });
        break;
      case 'GAS':
        updateSelectedWorker({
          methane: 72,
          co: 65,
          heartRate: 108,
          spO2: 93,
          bodyTemp: 37.4,
          movement: 'NORMAL',
          fallDetected: false,
          sos: false,
        });
        break;
      case 'HYPOXIA':
        updateSelectedWorker({
          methane: 45,
          co: 35,
          heartRate: 124,
          spO2: 83,
          bodyTemp: 37.8,
          movement: 'ERRATIC',
          fallDetected: false,
          sos: false,
        });
        break;
      case 'FALL':
        updateSelectedWorker({
          methane: 68,
          co: 62,
          heartRate: 125,
          spO2: 82,
          bodyTemp: 38.1,
          movement: 'FALL',
          fallDetected: true,
          sos: false,
        });
        break;
      case 'SOS':
        updateSelectedWorker({
          sos: true,
          movement: 'STATIONARY',
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="hud-panel rounded-2xl w-full max-w-2xl border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-industrial-900 px-6 py-4 border-b border-industrial-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase flex items-center gap-2">
                SIH PRESENTER SENSOR SIMULATOR
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  LIVE INTERACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Real-time two-way simulation of underground environmental and biometric telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-industrial-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable controls */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Target Worker Selector & Live Score Card */}
          <div className="bg-industrial-950 p-4 rounded-xl border border-industrial-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="w-full sm:w-auto flex-1">
              <label className="text-slate-400 block mb-1 text-[11px] font-semibold">
                TARGET UNDERGROUND WORKER
              </label>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full bg-industrial-900 border border-industrial-700 rounded-lg p-2 text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-500"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.id} • {w.name} ({w.zone} - {w.subZone}) [{w.riskLevel}]
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center sm:text-right bg-industrial-900/80 p-2.5 rounded-lg border border-industrial-700/60 min-w-36">
              <div className="text-[10px] text-slate-400 uppercase">CALCULATED RISK</div>
              <div className={`text-2xl font-black ${
                riskScore > 80 ? 'text-red-400' :
                riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {riskScore} <span className="text-xs font-sans text-slate-400 font-normal">/100</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedWorker.badgeClass}`}>
                {riskLevel}
              </span>
            </div>
          </div>

          {/* Preset Quick Actions for Judges */}
          <div>
            <label className="text-slate-400 block mb-2 text-xs font-mono font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> QUICK DEMO PRESETS (1-CLICK TESTING)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
              <button
                onClick={() => applyPreset('NORMAL')}
                className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-colors"
              >
                Normal Safe
              </button>
              <button
                onClick={() => applyPreset('GAS')}
                className="p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-500/40 text-[11px] font-semibold transition-colors"
              >
                Toxic Gas Leak
              </button>
              <button
                onClick={() => applyPreset('HYPOXIA')}
                className="p-2 rounded-lg bg-orange-950/40 hover:bg-orange-900/50 text-orange-300 border border-orange-500/40 text-[11px] font-semibold transition-colors"
              >
                Hypoxia (Low SpO₂)
              </button>
              <button
                onClick={() => applyPreset('FALL')}
                className="p-2 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/50 text-[11px] font-semibold transition-colors"
              >
                Fall &amp; Trauma
              </button>
              <button
                onClick={() => applyPreset('SOS')}
                className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-colors shadow"
              >
                SOS Panic
              </button>
            </div>
          </div>

          {/* Interactive Range Sliders */}
          <div className="space-y-4 bg-industrial-950/80 p-4 rounded-xl border border-industrial-800 font-mono text-xs">
            
            {/* Methane Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Methane Gas (CH₄)
                </span>
                <span className={`font-bold ${methane > 40 ? 'text-red-400' : 'text-slate-100'}`}>
                  {methane} ppm {methane > 40 ? '(HAZARD)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={methane}
                onChange={(e) => updateSelectedWorker({ methane: Number(e.target.value) })}
                className="w-full accent-amber-400 bg-industrial-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0 ppm (Safe)</span>
                <span>25 (Warning)</span>
                <span>50+ (Danger)</span>
                <span>100 ppm</span>
              </div>
            </div>

            {/* Carbon Monoxide Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Carbon Monoxide (CO)
                </span>
                <span className={`font-bold ${co > 40 ? 'text-red-400' : 'text-slate-100'}`}>
                  {co} ppm {co > 40 ? '(LETHAL)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={co}
                onChange={(e) => updateSelectedWorker({ co: Number(e.target.value) })}
                className="w-full accent-orange-500 bg-industrial-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>0 ppm</span>
                <span>25 (Elevated)</span>
                <span>50+ (Toxic)</span>
                <span>100 ppm</span>
              </div>
            </div>

            {/* Heart Rate Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Heart className="w-3.5 h-3.5 text-red-400" /> Heart Rate (BPM)
                </span>
                <span className={`font-bold ${heartRate > 120 ? 'text-red-400' : 'text-slate-100'}`}>
                  {heartRate} BPM {heartRate > 120 ? '(TACHYCARDIA)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                value={heartRate}
                onChange={(e) => updateSelectedWorker({ heartRate: Number(e.target.value) })}
                className="w-full accent-red-500 bg-industrial-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>50 BPM</span>
                <span>60-100 (Normal)</span>
                <span>120+ (Cardiac Stress)</span>
                <span>160 BPM</span>
              </div>
            </div>

            {/* SpO2 Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> SpO₂ Blood Oxygen (%)
                </span>
                <span className={`font-bold ${spO2 < 90 ? 'text-red-400' : 'text-slate-100'}`}>
                  {spO2}% {spO2 < 85 ? '(HYPOXIC SUFFOCATION)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={spO2}
                onChange={(e) => updateSelectedWorker({ spO2: Number(e.target.value) })}
                className="w-full accent-cyan-400 bg-industrial-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>70% (Severe)</span>
                <span>90% (Threshold)</span>
                <span>95-100% (Optimal)</span>
              </div>
            </div>

            {/* Body Temperature Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Thermometer className="w-3.5 h-3.5 text-orange-400" /> Body Temperature (°C)
                </span>
                <span className="font-bold text-slate-100">
                  {bodyTemp.toFixed(1)}°C
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="45"
                step="0.1"
                value={bodyTemp}
                onChange={(e) => updateSelectedWorker({ bodyTemp: Number(e.target.value) })}
                className="w-full accent-orange-400 bg-industrial-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>30°C</span>
                <span>36.5°C-37.5°C (Normal)</span>
                <span>38.5°C+ (Hyperthermia)</span>
                <span>45°C</span>
              </div>
            </div>

          </div>

          {/* Motion, Fall Detection & SOS Switch Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {/* Movement Dropdown */}
            <div className="bg-industrial-950 p-3 rounded-lg border border-industrial-800">
              <label className="text-slate-400 block mb-1 text-[11px] font-semibold flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-cyan-400" /> MOVEMENT
              </label>
              <select
                value={movement}
                onChange={(e) => updateSelectedWorker({ movement: e.target.value })}
                className="w-full bg-industrial-900 border border-industrial-700 rounded p-1.5 text-slate-200 text-xs font-mono"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="ERRATIC">ERRATIC</option>
                <option value="STATIONARY">STATIONARY</option>
                <option value="FALL">FALL</option>
              </select>
            </div>

            {/* Fall Detection Toggle */}
            <div className="bg-industrial-950 p-3 rounded-lg border border-industrial-800 flex flex-col justify-between">
              <label className="text-slate-400 block text-[11px] font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> FALL DETECTION
              </label>
              <button
                onClick={() => updateSelectedWorker({ 
                  fallDetected: !fallDetected,
                  movement: !fallDetected ? 'FALL' : 'NORMAL'
                })}
                className={`w-full py-1.5 rounded font-mono font-bold text-xs border transition-colors ${
                  fallDetected
                    ? 'bg-red-600 text-white border-red-500 animate-pulse'
                    : 'bg-industrial-800 text-slate-400 border-industrial-700 hover:text-white'
                }`}
              >
                {fallDetected ? 'FALL: ON (DETECTED)' : 'FALL: OFF'}
              </button>
            </div>

            {/* SOS Panic Toggle */}
            <div className="bg-industrial-950 p-3 rounded-lg border border-industrial-800 flex flex-col justify-between">
              <label className="text-slate-400 block text-[11px] font-semibold flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-red-400" /> SOS BEACON
              </label>
              <button
                onClick={() => updateSelectedWorker({ sos: !sos })}
                className={`w-full py-1.5 rounded font-mono font-bold text-xs border transition-colors ${
                  sos
                    ? 'bg-red-600 text-white border-red-500 animate-pulse'
                    : 'bg-industrial-800 text-slate-400 border-industrial-700 hover:text-white'
                }`}
              >
                {sos ? 'SOS: ACTIVE (CRITICAL)' : 'SOS: INACTIVE'}
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-industrial-900 px-6 py-4 border-t border-industrial-800 flex items-center justify-between gap-3">
          <button
            onClick={resetSimulation}
            className="px-4 py-2 rounded-lg bg-industrial-800 hover:bg-industrial-750 text-slate-300 border border-industrial-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerCollapseDemo();
                onClose();
              }}
              disabled={collapseState.active || collapseState.demoRunning}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all"
            >
              <Mountain className="w-3.5 h-3.5" />
              TUNNEL COLLAPSE
            </button>

            <button
              onClick={() => {
                triggerDemoEmergency();
                onClose();
              }}
              disabled={isDemoRunning}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-900/30 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              12s DEMO EMERGENCY
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
