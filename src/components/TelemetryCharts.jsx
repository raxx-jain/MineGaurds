import React from 'react';
import { LineChart, Activity, Heart, Flame, Gauge } from 'lucide-react';
import { useMine } from '../context/MineContext';

function SparklineChart({ 
  title, 
  icon: Icon, 
  data = [], 
  dataKey, 
  unit = '', 
  minVal = 0, 
  maxVal = 100, 
  lineColor = '#10b981', 
  warningThreshold = null,
  isCritical = false 
}) {
  const width = 300;
  const height = 90;
  const padding = { top: 12, right: 10, bottom: 20, left: 34 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Values array
  const values = data.map(d => d[dataKey] ?? 0);
  const latestVal = values[values.length - 1] ?? 0;

  // Scale functions
  const getY = (val) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const ratio = (clamped - minVal) / (maxVal - minVal);
    return padding.top + chartH - ratio * chartH;
  };

  const getX = (idx) => {
    if (values.length <= 1) return padding.left;
    return padding.left + (idx / (values.length - 1)) * chartW;
  };

  // Build SVG path
  let pathD = '';
  let fillD = '';
  if (values.length > 0) {
    const points = values.map((val, idx) => `${getX(idx).toFixed(1)},${getY(val).toFixed(1)}`);
    pathD = `M ${points.join(' L ')}`;
    const lastX = getX(values.length - 1);
    fillD = `M ${padding.left},${padding.top + chartH} L ${points.join(' L ')} L ${lastX},${padding.top + chartH} Z`;
  }

  // Warning threshold Y
  const threshY = warningThreshold !== null ? getY(warningThreshold) : null;

  const gradId = `grad-${dataKey}`;

  return (
    <div className="bg-industrial-900/90 rounded-lg p-3 border border-industrial-800 flex flex-col justify-between">
      {/* Chart Title & Latest Value */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300">
          <Icon className="w-3.5 h-3.5" style={{ color: lineColor }} />
          <span>{title}</span>
        </div>
        <div className="text-right">
          <span 
            className="text-base font-bold font-mono telemetry-num"
            style={{ color: lineColor }}
          >
            {latestVal}
          </span>
          <span className="text-[10px] text-slate-500 font-mono ml-1">{unit}</span>
        </div>
      </div>

      {/* SVG Sparkline */}
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line 
            x1={padding.left} 
            y1={padding.top} 
            x2={width - padding.right} 
            y2={padding.top} 
            stroke="#1e293b" 
            strokeWidth="1" 
          />
          <line 
            x1={padding.left} 
            y1={padding.top + chartH / 2} 
            x2={width - padding.right} 
            y2={padding.top + chartH / 2} 
            stroke="#1e293b" 
            strokeWidth="1" 
            strokeDasharray="2 2" 
          />
          <line 
            x1={padding.left} 
            y1={padding.top + chartH} 
            x2={width - padding.right} 
            y2={padding.top + chartH} 
            stroke="#1e293b" 
            strokeWidth="1" 
          />

          {/* Y-axis labels */}
          <text x={padding.left - 4} y={padding.top + 4} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
            {maxVal}
          </text>
          <text x={padding.left - 4} y={padding.top + chartH + 3} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
            {minVal}
          </text>

          {/* Warning threshold line */}
          {threshY !== null && (
            <line
              x1={padding.left}
              y1={threshY}
              x2={width - padding.right}
              y2={threshY}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.75"
            />
          )}

          {/* Area fill */}
          {fillD && <path d={fillD} fill={`url(#${gradId})`} />}

          {/* Line stroke */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Latest Point Indicator */}
          {values.length > 0 && (
            <circle
              cx={getX(values.length - 1)}
              cy={getY(latestVal)}
              r="3.5"
              fill={lineColor}
              stroke="#070b12"
              strokeWidth="1.5"
              className={isCritical ? 'animate-ping' : ''}
            />
          )}

          {/* X-axis time label */}
          <text x={padding.left} y={height - 2} fill="#475569" fontSize="8" fontFamily="monospace">
            -60s
          </text>
          <text x={width - padding.right} y={height - 2} fill="#475569" fontSize="8" fontFamily="monospace" textAnchor="end">
            NOW
          </text>
        </svg>
      </div>
    </div>
  );
}

export function TelemetryCharts() {
  const { telemetryHistory, selectedWorker } = useMine();

  if (!selectedWorker) return null;

  return (
    <div className="hud-panel rounded-xl p-4 md:p-5 flex flex-col border border-industrial-700/80 shadow-2xl">
      <div className="flex items-center justify-between border-b border-industrial-700/70 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono uppercase">
              REAL-TIME TELEMETRY HISTORY (60s ROLLING WINDOW)
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Continuous trend analysis for Worker <strong className="text-slate-200">{selectedWorker.id}</strong>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-industrial-800 text-cyan-400 border border-industrial-700">
          BUFFER: 30 SAMPLES (2s TICK)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Heart Rate Chart */}
        <SparklineChart
          title="HEART RATE"
          icon={Heart}
          data={telemetryHistory}
          dataKey="heartRate"
          unit="BPM"
          minVal={40}
          maxVal={160}
          lineColor={selectedWorker.heartRate > 115 ? '#ef4444' : '#f59e0b'}
          warningThreshold={120}
          isCritical={selectedWorker.heartRate > 120}
        />

        {/* SpO2 Chart */}
        <SparklineChart
          title="SpO₂ OXYGEN"
          icon={Activity}
          data={telemetryHistory}
          dataKey="spO2"
          unit="%"
          minVal={70}
          maxVal={100}
          lineColor={selectedWorker.spO2 < 88 ? '#ef4444' : '#06b6d4'}
          warningThreshold={90}
          isCritical={selectedWorker.spO2 < 85}
        />

        {/* Gas Concentration Chart */}
        <SparklineChart
          title="GAS CONCENTRATION"
          icon={Flame}
          data={telemetryHistory}
          dataKey="gas"
          unit="ppm"
          minVal={0}
          maxVal={100}
          lineColor={Math.max(selectedWorker.methane, selectedWorker.co) > 40 ? '#ef4444' : '#f97316'}
          warningThreshold={50}
          isCritical={Math.max(selectedWorker.methane, selectedWorker.co) > 50}
        />

        {/* Risk Score Chart */}
        <SparklineChart
          title="AI RISK SCORE"
          icon={Gauge}
          data={telemetryHistory}
          dataKey="riskScore"
          unit="/100"
          minVal={0}
          maxVal={100}
          lineColor={selectedWorker.riskColor}
          warningThreshold={80}
          isCritical={selectedWorker.riskScore >= 81}
        />
      </div>
    </div>
  );
}
