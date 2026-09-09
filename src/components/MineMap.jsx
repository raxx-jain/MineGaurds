import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Radio, 
  Wind, 
  Compass, 
  Layers, 
  Maximize2, 
  Navigation, 
  ShieldAlert, 
  Heart, 
  Activity, 
  Flame, 
  Thermometer, 
  LifeBuoy, 
  User,
  Crosshair
} from 'lucide-react';
import { useMine } from '../context/MineContext';

export function MineMap({ mapRef }) {
  const { 
    workers, 
    selectedWorkerId, 
    setSelectedWorkerId, 
    selectedWorker, 
    gateways, 
    tunnelSensors,
    filterStatus,
    setRescueModalOpen,
    collapseState,
    setCollapseModalOpen,
  } = useMine();

  const [showGateways, setShowGateways] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showRescueRoute, setShowRescueRoute] = useState(true);
  const [activePopupWorker, setActivePopupWorker] = useState(null);
  const [selectedTunnelFilter, setSelectedTunnelFilter] = useState('ALL');

  // Filter workers shown on map
  const visibleWorkers = workers.filter(w => {
    if (filterStatus === 'SAFE' && w.riskLevel !== 'SAFE') return false;
    if (filterStatus === 'WARNING' && w.riskLevel !== 'WARNING') return false;
    if (filterStatus === 'CRITICAL' && (w.riskLevel !== 'CRITICAL' && w.riskLevel !== 'HIGH RISK')) return false;
    if (selectedTunnelFilter !== 'ALL' && !w.zone.includes(selectedTunnelFilter)) return false;
    return true;
  });

  const handleWorkerClick = (w, e) => {
    e.stopPropagation();
    setSelectedWorkerId(w.id);
    setActivePopupWorker(w);
  };

  const handleMapBackgroundClick = () => {
    setActivePopupWorker(null);
  };

  // Focus on critical worker MG-024
  const handleFocusEmergency = () => {
    const crit = workers.find(w => w.id === 'MG-024') || workers.find(w => w.riskLevel === 'CRITICAL');
    if (crit) {
      setSelectedWorkerId(crit.id);
      setActivePopupWorker(crit);
    }
  };

  return (
    <div 
      ref={mapRef} 
      className="hud-panel rounded-xl overflow-hidden flex flex-col border border-industrial-700/80 shadow-2xl relative"
    >
      {/* Map Header Bar */}
      <div className="bg-industrial-900/90 px-4 py-3 border-b border-industrial-700/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono uppercase flex items-center gap-2">
              <span>UNDERGROUND MINE VECTOR MAP</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-industrial-800 text-slate-400 border border-industrial-700 font-sans font-normal">
                REAL-TIME TELEMETRY GRID
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Shaft 01 Deep Incline • Levels -150m to -450m • Spatial Gateway Triangulation
            </p>
          </div>
        </div>

        {/* Map View Controls & Filters */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          {/* Tunnel Quick Filters */}
          <div className="flex items-center rounded-md bg-industrial-950 p-0.5 border border-industrial-700">
            {['ALL', 'Tunnel A', 'Tunnel B', 'Tunnel C'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTunnelFilter(t === 'ALL' ? 'ALL' : t.replace('Tunnel ', ''))}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  (t === 'ALL' && selectedTunnelFilter === 'ALL') || selectedTunnelFilter === t.replace('Tunnel ', '')
                    ? 'bg-industrial-700 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Layer Toggles */}
          <button
            onClick={() => setShowRescueRoute(!showRescueRoute)}
            className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 transition-colors ${
              showRescueRoute
                ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                : 'bg-industrial-800 text-slate-400 border-industrial-700'
            }`}
            title="Toggle Evacuation / Rescue Route"
          >
            <Navigation className="w-3 h-3" />
            <span>Rescue Route</span>
          </button>

          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 transition-colors ${
              showSensors
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                : 'bg-industrial-800 text-slate-400 border-industrial-700'
            }`}
            title="Toggle Fixed Underground Tunnel Environmental Sensor Nodes"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Tunnel Sensors</span>
          </button>

          <button
            onClick={() => setShowGateways(!showGateways)}
            className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 transition-colors ${
              showGateways
                ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40'
                : 'bg-industrial-800 text-slate-400 border-industrial-700'
            }`}
            title="Toggle Underground Gateway Beacons"
          >
            <Radio className="w-3 h-3" />
            <span>Gateways</span>
          </button>

          {/* Quick Focus Emergency Worker */}
          <button
            onClick={handleFocusEmergency}
            className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/40 text-[11px] flex items-center gap-1 font-semibold transition-colors"
            title="Jump to critical emergency position"
          >
            <Crosshair className="w-3 h-3 text-red-400" />
            <span>Target MG-024</span>
          </button>
        </div>
      </div>

      {/* SVG Map Canvas Container */}
      <div 
        onClick={handleMapBackgroundClick}
        className="relative w-full bg-[#070b12] cursor-crosshair overflow-hidden flex-1 min-h-[420px] md:min-h-[480px] select-none"
      >
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1e293b 1px, transparent 1px),
              linear-gradient(to bottom, #1e293b 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Realistic SVG Mine Layout */}
        <svg 
          viewBox="0 0 1000 620" 
          className="w-full h-full block"
          style={{ minHeight: '440px' }}
        >
          <defs>
            {/* Tunnel Stone/Rock Gradient */}
            <linearGradient id="tunnelGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0f172a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0b111e" stopOpacity="0.95" />
            </linearGradient>

            {/* Toxic Gas Pocket Gradient (Tunnel C) */}
            <radialGradient id="gasZoneGradient" cx="72%" cy="82%" r="22%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </radialGradient>

            {/* Gateway coverage radial */}
            <radialGradient id="gwCoverage" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="80%" stopColor="#06b6d4" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </radialGradient>

            {/* Rescue Route Glow Filter */}
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Collapse danger zone pattern */}
            <pattern id="hazardStripes" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
              <rect width="6" height="12" fill="#ef4444" opacity="0.15" />
              <rect x="6" width="6" height="12" fill="#000" opacity="0.1" />
            </pattern>

            <radialGradient id="collapseDangerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* ================= BACKGROUND BEDROCK MASS ================= */}
          <rect x="0" y="0" width="1000" height="620" fill="#070b12" />

          {/* Depth Contour Markings */}
          <path d="M 50 140 Q 500 130 950 150" stroke="#131e30" strokeWidth="1" strokeDasharray="4 8" fill="none" />
          <text x="60" y="135" fill="#334466" fontSize="10" fontFamily="monospace">DEPTH -150m (LEVEL 1)</text>

          <path d="M 50 290 Q 500 270 950 300" stroke="#131e30" strokeWidth="1" strokeDasharray="4 8" fill="none" />
          <text x="60" y="285" fill="#334466" fontSize="10" fontFamily="monospace">DEPTH -280m (LEVEL 2)</text>

          <path d="M 50 450 Q 500 440 950 460" stroke="#131e30" strokeWidth="1" strokeDasharray="4 8" fill="none" />
          <text x="60" y="445" fill="#334466" fontSize="10" fontFamily="monospace">DEPTH -420m (DEEP EXTRACTION STOPE)</text>

          {/* Toxic Gas Pocket Visualization in Tunnel C */}
          <circle cx="730" cy="510" r="140" fill="url(#gasZoneGradient)" />
          <text x="730" y="440" textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            ⚠ CH₄ / CO DANGER CLOUD
          </text>

          {/* ================= PRIMARY UNDERGROUND TUNNELS ================= */}
          {/* Main Haulage Drift & Incline Tunnel */}
          <g id="tunnels" strokeLinecap="round" strokeLinejoin="round">
            
            {/* Outer tunnel rock borders */}
            {/* Surface Adit & Portal */}
            <path 
              d="M 110 50 L 190 120 L 260 210 L 320 250" 
              stroke="#24344d" 
              strokeWidth="48" 
              fill="none" 
            />
            {/* Main Spine to Central Crosscut */}
            <path 
              d="M 320 250 L 490 265 L 560 300 L 610 380 L 650 470 L 820 520" 
              stroke="#24344d" 
              strokeWidth="42" 
              fill="none" 
            />

            {/* Tunnel A: North Extraction Level */}
            <path 
              d="M 490 265 L 530 200 L 830 210 L 870 230" 
              stroke="#24344d" 
              strokeWidth="38" 
              fill="none" 
            />

            {/* Tunnel B: Sub-level Drilling */}
            <path 
              d="M 320 250 L 370 345 L 700 365" 
              stroke="#24344d" 
              strokeWidth="36" 
              fill="none" 
            />

            {/* Tunnel C: Deep Stope Lower Crosscuts */}
            <path 
              d="M 520 480 L 650 470 L 840 515 L 890 535" 
              stroke="#24344d" 
              strokeWidth="40" 
              fill="none" 
            />
            <path 
              d="M 720 515 L 760 575" 
              stroke="#24344d" 
              strokeWidth="32" 
              fill="none" 
            />

            {/* Ventilation Vertical Shafts */}
            <line x1="830" y1="90" x2="830" y2="210" stroke="#1d2d42" strokeWidth="24" />
            <line x1="880" y1="230" x2="880" y2="520" stroke="#1d2d42" strokeWidth="20" />

            {/* Inner Tunnel Floor Bedding (Dark cavity) */}
            <path d="M 110 50 L 190 120 L 260 210 L 320 250" stroke="#0e1726" strokeWidth="36" fill="none" />
            <path d="M 320 250 L 490 265 L 560 300 L 610 380 L 650 470 L 820 520" stroke="#0e1726" strokeWidth="32" fill="none" />
            <path d="M 490 265 L 530 200 L 830 210 L 870 230" stroke="#0e1726" strokeWidth="28" fill="none" />
            <path d="M 320 250 L 370 345 L 700 365" stroke="#0e1726" strokeWidth="26" fill="none" />
            <path d="M 520 480 L 650 470 L 840 515 L 890 535" stroke="#0e1726" strokeWidth="30" fill="none" />
            <path d="M 720 515 L 760 575" stroke="#0e1726" strokeWidth="22" fill="none" />
            <line x1="830" y1="90" x2="830" y2="210" stroke="#0e1726" strokeWidth="16" />
            <line x1="880" y1="230" x2="880" y2="520" stroke="#0e1726" strokeWidth="14" />

            {/* Tramway / Haulage Rail Guide Lines */}
            <path 
              d="M 110 50 L 190 120 L 260 210 L 320 250 L 490 265 L 560 300 L 610 380 L 650 470 L 820 520" 
              stroke="#3b82f6" 
              strokeWidth="2" 
              strokeDasharray="6 8" 
              opacity="0.45"
              fill="none" 
            />
            <path 
              d="M 490 265 L 530 200 L 830 210" 
              stroke="#3b82f6" 
              strokeWidth="1.5" 
              strokeDasharray="6 8" 
              opacity="0.35"
              fill="none" 
            />
          </g>

          {/* ================= TUNNEL COLLAPSE RED DANGER ZONE ================= */}
          {collapseState.active && (
            <g id="collapseDangerZone">
              {/* Large pulsing red glow under Tunnel C */}
              <ellipse cx="720" cy="500" rx="200" ry="100" fill="url(#collapseDangerGlow)" className="animate-pulse" />
              
              {/* Hazard stripe overlay on tunnel path */}
              <path 
                d="M 520 480 L 650 470 L 840 515 L 890 535" 
                stroke="#ef4444" 
                strokeWidth="52" 
                fill="none" 
                opacity="0.25" 
                className="animate-pulse"
              />
              <path 
                d="M 720 515 L 760 575" 
                stroke="#ef4444" 
                strokeWidth="40" 
                fill="none" 
                opacity="0.25" 
                className="animate-pulse"
              />

              {/* Danger boundary ring */}
              <ellipse 
                cx="720" cy="500" rx="180" ry="90" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2.5" 
                strokeDasharray="8 6" 
                opacity="0.8"
                className="animate-pulse"
              />

              {/* DANGER ZONE label */}
              <rect x="640" y="408" width="160" height="28" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" className="animate-pulse" />
              <text x="720" y="426" textAnchor="middle" fill="#fca5a5" fontSize="12" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
                ⛔ EXTREME DANGER
              </text>

              {/* EVACUATE label */}
              <rect x="650" y="548" width="140" height="22" rx="3" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
              <text x="720" y="563" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                EVACUATE IMMEDIATELY
              </text>

              {/* Zone lock icon indicator */}
              <circle cx="890" cy="535" r="14" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
              <text x="890" y="540" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">🔒</text>
            </g>
          )}

          {/* ================= RESCUE EVACUATION ROUTE OVERLAY ================= */}
          {showRescueRoute && (
            <g id="rescueRoute" filter="url(#glowCyan)">
              {/* Highlighted emergency conduit from Entrance -> Shaft -> Tunnel C */}
              <path 
                d="M 120 60 L 195 125 L 265 215 L 325 255 L 495 270 L 565 305 L 615 385 L 655 475 L 740 510" 
                stroke="#06b6d4" 
                strokeWidth="4" 
                strokeDasharray="10 10" 
                strokeLinecap="round"
                fill="none" 
                className="animate-pulse"
              />
              {/* Rescue Direction Chevrons */}
              <circle cx="200" cy="130" r="3" fill="#06b6d4" />
              <circle cx="330" cy="255" r="3" fill="#06b6d4" />
              <circle cx="500" cy="270" r="3" fill="#06b6d4" />
              <circle cx="615" cy="385" r="3" fill="#06b6d4" />
              <circle cx="655" cy="475" r="3" fill="#06b6d4" />
              <circle cx="740" cy="510" r="4" fill="#ef4444" />
            </g>
          )}

          {/* ================= VENTILATION & EXHAUST SHAFTS ================= */}
          <g id="ventilation">
            {/* North Exhaust Fan */}
            <circle cx="830" cy="85" r="18" fill="#132035" stroke="#38bdf8" strokeWidth="2" />
            <text x="830" y="89" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">FAN</text>
            <text x="830" y="62" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontFamily="monospace">NORTH EXHAUST</text>

            {/* Fresh air flow arrows */}
            <path d="M 140 80 L 160 100" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 350 255 L 380 260" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 520 210 L 550 210" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          </g>

          {/* ================= COMMUNICATION GATEWAYS ================= */}
          {showGateways && gateways.map(gw => (
            <g key={gw.id} id={gw.id}>
              {/* Coverage radius */}
              <circle 
                cx={gw.x} 
                cy={gw.y} 
                r="110" 
                fill="url(#gwCoverage)" 
                stroke="#06b6d4" 
                strokeWidth="1" 
                strokeDasharray="4 6" 
                opacity="0.6" 
              />
              {/* Gateway Beacon Icon */}
              <circle cx={gw.x} cy={gw.y} r="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
              <circle cx={gw.x} cy={gw.y} r="4" fill="#38bdf8" className="animate-ping" />
              <circle cx={gw.x} cy={gw.y} r="3" fill="#ffffff" />
              {/* Label */}
              <rect x={gw.x - 38} y={gw.y - 26} width="76" height="15" rx="3" fill="#0b1320" stroke="#0369a1" strokeWidth="1" />
              <text x={gw.x} y={gw.y - 15} textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace" fontWeight="bold">
                {gw.name}
              </text>
            </g>
          ))}

          {/* ================= FIXED TUNNEL ENVIRONMENTAL SENSORS ================= */}
          {showSensors && tunnelSensors.map(s => {
            const isHazard = s.ch4 > 30 || s.co > 30 || s.o2 < 19.0;
            const isWarning = s.ch4 > 18 || s.co > 18 || s.o2 < 19.5;
            const strokeColor = isHazard ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';
            const fillColor = isHazard ? '#450a0a' : isWarning ? '#451a03' : '#062c22';

            return (
              <g key={s.id} id={s.id}>
                {/* Fixed Sensor Diamond Node */}
                <polygon 
                  points={`${s.x},${s.y - 7} ${s.x + 7},${s.y} ${s.x},${s.y + 7} ${s.x - 7},${s.y}`} 
                  fill={fillColor} 
                  stroke={strokeColor} 
                  strokeWidth="1.5"
                  className={isHazard ? 'animate-pulse' : ''}
                />
                <circle cx={s.x} cy={s.y} r="2" fill={strokeColor} />
                
                {/* Sensor ID badge */}
                <rect 
                  x={s.x - 22} 
                  y={s.y + 9} 
                  width="44" 
                  height="12" 
                  rx="2" 
                  fill="#0b1320" 
                  stroke={strokeColor} 
                  strokeWidth="0.8" 
                  opacity="0.9"
                />
                <text 
                  x={s.x} 
                  y={s.y + 18} 
                  textAnchor="middle" 
                  fill={isHazard ? '#fca5a5' : '#e2e8f0'} 
                  fontSize="8" 
                  fontFamily="monospace" 
                  fontWeight="bold"
                >
                  {s.id}
                </text>
              </g>
            );
          })}

          {/* ================= TUNNEL ANNOTATIONS & LABELS ================= */}
          <g id="labels" fontFamily="monospace" fontWeight="bold">
            {/* Portal Entrance */}
            <rect x="50" y="32" width="125" height="24" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="112" y="48" textAnchor="middle" fill="#fbbf24" fontSize="11">
              SURFACE ADIT PORTAL
            </text>

            {/* Main Tunnel Spine */}
            <text x="320" y="228" fill="#94a3b8" fontSize="10" letterSpacing="1">
              MAIN HAULAGE DRIFT
            </text>

            {/* Tunnel A */}
            <rect x="560" y="165" width="130" height="20" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="625" y="179" textAnchor="middle" fill="#cbd5e1" fontSize="10">
              TUNNEL A • NORTH FACE
            </text>

            {/* Tunnel B */}
            <rect x="420" y="325" width="130" height="20" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="485" y="339" textAnchor="middle" fill="#cbd5e1" fontSize="10">
              TUNNEL B • SUB-DRILLING
            </text>

            {/* Tunnel C */}
            <rect x="550" y="445" width="150" height="20" rx="3" fill="#1e1014" stroke="#ef4444" strokeWidth="1.5" />
            <text x="625" y="459" textAnchor="middle" fill="#fca5a5" fontSize="10">
              TUNNEL C • STOPE C-04 [HAZARD]
            </text>

            {/* Refuge Chamber Safety Bay */}
            <rect x="710" y="345" width="85" height="34" rx="4" fill="#062e24" stroke="#10b981" strokeWidth="1.5" />
            <text x="752" y="360" textAnchor="middle" fill="#34d399" fontSize="9">REFUGE BAY</text>
            <text x="752" y="372" textAnchor="middle" fill="#6ee7b7" fontSize="8">CAPACITY: 20</text>
          </g>

          {/* ================= WORKER POSITION MARKERS ================= */}
          <g id="workerMarkers">
            {visibleWorkers.map((w) => {
              const isSelected = w.id === selectedWorkerId;
              const isCritical = w.riskLevel === 'CRITICAL' || w.riskScore >= 80;
              const isWarning = w.riskLevel === 'WARNING' || (w.riskScore >= 31 && w.riskScore < 80);
              
              // Marker colors matching requirements:
              // SAFE = green, WARNING = yellow, HIGH = orange, CRITICAL = red
              let markerColor = '#10b981'; // Green
              let strokeColor = '#34d399';
              if (isCritical) {
                markerColor = '#ef4444'; // Red
                strokeColor = '#f87171';
              } else if (w.riskLevel === 'HIGH RISK') {
                markerColor = '#f97316'; // Orange
                strokeColor = '#fb923c';
              } else if (isWarning) {
                markerColor = '#f59e0b'; // Yellow
                strokeColor = '#fbbf24';
              }

              return (
                <g
                  key={w.id}
                  transform={`translate(${w.x}, ${w.y})`}
                  onClick={(e) => handleWorkerClick(w, e)}
                  className="cursor-pointer group"
                  tabIndex={0}
                  role="button"
                >
                  {/* Critical pulsing outer alert ring */}
                  {isCritical && (
                    <>
                      <circle
                        r="20"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        className="animate-ping"
                        opacity="0.8"
                      />
                      <circle
                        r="14"
                        fill="#ef4444"
                        opacity="0.25"
                      />
                    </>
                  )}

                  {/* Selected Worker Selection Ring */}
                  {isSelected && (
                    <circle
                      r="16"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                    />
                  )}

                  {/* Primary Beacon Dot */}
                  <circle
                    r={isSelected || isCritical ? 9 : 6.5}
                    fill={markerColor}
                    stroke="#0b111e"
                    strokeWidth="2"
                    filter={isCritical ? 'url(#glowRed)' : undefined}
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Small Inner Core */}
                  <circle
                    r="2.5"
                    fill="#ffffff"
                    opacity="0.9"
                  />

                  {/* Worker Label (ID Badge) */}
                  <rect
                    x="-24"
                    y="-22"
                    width="48"
                    height="14"
                    rx="3"
                    fill={isSelected ? '#0369a1' : isCritical ? '#7f1d1d' : '#0f172a'}
                    stroke={isSelected ? '#38bdf8' : isCritical ? '#ef4444' : '#334155'}
                    strokeWidth="1"
                    className="transition-all"
                  />
                  <text
                    x="0"
                    y="-12"
                    textAnchor="middle"
                    fill={isCritical ? '#fca5a5' : '#f1f5f9'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {w.id}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* ================= INTERACTIVE WORKER POPUP CARD ================= */}
        {activePopupWorker && (
          <div 
            className="absolute z-20 top-4 right-4 w-80 hud-panel-danger p-4 rounded-xl shadow-2xl border-2 border-red-500/80 animate-in fade-in zoom-in duration-150 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-red-500/40 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  activePopupWorker.riskLevel === 'CRITICAL' ? 'bg-red-500 animate-ping' :
                  activePopupWorker.riskLevel === 'HIGH RISK' ? 'bg-orange-500' :
                  activePopupWorker.riskLevel === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div>
                  <h3 className="text-sm font-mono font-black text-white">
                    {activePopupWorker.id} • {activePopupWorker.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    {activePopupWorker.role} | {activePopupWorker.zone} ({activePopupWorker.subZone})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePopupWorker(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-industrial-800"
              >
                ✕
              </button>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-industrial-900/90 p-2 rounded border border-industrial-800">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" /> HEART RATE
                </div>
                <div className={`text-base font-bold telemetry-num ${activePopupWorker.heartRate > 115 ? 'text-red-400' : 'text-slate-100'}`}>
                  {activePopupWorker.heartRate} BPM
                </div>
              </div>

              <div className="bg-industrial-900/90 p-2 rounded border border-industrial-800">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" /> SpO₂ OXYGEN
                </div>
                <div className={`text-base font-bold telemetry-num ${activePopupWorker.spO2 < 90 ? 'text-red-400' : 'text-slate-100'}`}>
                  {activePopupWorker.spO2}%
                </div>
              </div>

              <div className="bg-industrial-900/90 p-2 rounded border border-industrial-800">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" /> GAS LEVEL
                </div>
                <div className={`text-sm font-bold ${activePopupWorker.methane > 40 ? 'text-red-400' : 'text-slate-100'}`}>
                  CH₄ {activePopupWorker.methane} / CO {activePopupWorker.co} ppm
                </div>
              </div>

              <div className="bg-industrial-900/90 p-2 rounded border border-industrial-800">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-orange-400" /> BODY TEMP
                </div>
                <div className="text-base font-bold text-slate-100 telemetry-num">
                  {activePopupWorker.bodyTemp}°C
                </div>
              </div>
            </div>

            {/* Risk & Movement */}
            <div className="mt-2.5 pt-2 border-t border-industrial-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px]">RISK SCORE:</span>
                <span className={`ml-1 font-black ${
                  activePopupWorker.riskScore > 80 ? 'text-red-400' :
                  activePopupWorker.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {activePopupWorker.riskScore}/100 ({activePopupWorker.riskLevel})
                </span>
              </div>
              <div className="text-[10px] px-1.5 py-0.5 rounded bg-industrial-800 text-slate-300">
                Motion: {activePopupWorker.movement}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setSelectedWorkerId(activePopupWorker.id);
                  setRescueModalOpen(true);
                }}
                className="flex-1 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <LifeBuoy className="w-3.5 h-3.5" /> RESCUE PROTOCOL
              </button>
            </div>
          </div>
        )}

        {/* Map Legend Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-industrial-950/85 backdrop-blur-md p-2.5 rounded-lg border border-industrial-700/80 text-[10px] font-mono text-slate-300 pointer-events-none hidden sm:block">
          <div className="text-slate-400 font-bold mb-1.5 uppercase tracking-wider">MAP LEGEND</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe Worker
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning Worker
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" /> Critical Hazard
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-cyan-400" /> Evacuation Route
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-sky-400 bg-sky-900/50" /> Comms Gateway
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-500/30 rounded" /> Gas Pocket (CH₄)
            </span>
            {collapseState.active && (
              <span className="flex items-center gap-1.5 text-red-300 font-bold">
                <span className="w-2.5 h-2.5 bg-red-600 rounded animate-pulse" /> COLLAPSE ZONE
              </span>
            )}
          </div>
        </div>

        {/* Current Map Target Tracker (Bottom Right) */}
        <div className="absolute bottom-3 right-3 bg-industrial-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-industrial-700/80 text-right text-xs font-mono text-slate-300">
          <div className="text-[10px] text-slate-400">ACTIVE TARGET</div>
          <div className="text-amber-400 font-bold">
            {selectedWorker?.id} • {selectedWorker?.name}
          </div>
          <div className="text-[10px] text-slate-400">
            {selectedWorker?.zone} ({selectedWorker?.subZone}) | Risk {selectedWorker?.riskScore}
          </div>
        </div>

      </div>
    </div>
  );
}
