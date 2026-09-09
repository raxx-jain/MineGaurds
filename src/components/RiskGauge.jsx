import React from 'react';

export function RiskGauge({ score = 0, level = 'SAFE', color = '#10b981' }) {
  // Circular gauge geometry
  // Semi-circle arc from 135 deg to 405 deg (270 degrees sweep)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (270 / 360) * circumference;
  
  // Progress fraction (0 to 1)
  const normalizedScore = Math.min(100, Math.max(0, score));
  const progressLength = (normalizedScore / 100) * arcLength;
  const strokeDashoffset = arcLength - progressLength;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg 
        width="220" 
        height="180" 
        viewBox="0 0 220 180" 
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={color} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Center Pivot Point */}
        <g transform="translate(110, 110)">
          {/* Background Track Arc (270 degrees) */}
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke="#1a2436"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(135)"
          />

          {/* Calibrated Tick Marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angleDeg = 135 + (tick / 100) * 270;
            const angleRad = (angleDeg * Math.PI) / 180;
            const innerR = radius - 18;
            const outerR = radius - 10;
            const x1 = Math.cos(angleRad) * innerR;
            const y1 = Math.sin(angleRad) * innerR;
            const x2 = Math.cos(angleRad) * outerR;
            const y2 = Math.sin(angleRad) * outerR;

            return (
              <g key={tick}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#475569"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Active Value Arc */}
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(135)"
            filter="url(#gaugeShadow)"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.3s ease',
            }}
          />

          {/* Needle Indicator */}
          {(() => {
            const needleAngle = 135 + (normalizedScore / 100) * 270;
            const rad = (needleAngle * Math.PI) / 180;
            const needleLen = radius - 20;
            const nx = Math.cos(rad) * needleLen;
            const ny = Math.sin(rad) * needleLen;

            return (
              <g style={{ transition: 'transform 0.5s ease-out' }}>
                <line
                  x1="0"
                  y1="0"
                  x2={nx}
                  y2={ny}
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="0" r="7" fill="#0f172a" stroke={color} strokeWidth="2.5" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
              </g>
            );
          })()}
        </g>
      </svg>

      {/* Numerical Center Display */}
      <div className="absolute top-[80px] text-center pointer-events-none">
        <div 
          className="text-4xl font-black font-mono tracking-tight telemetry-num"
          style={{ color }}
        >
          {normalizedScore}
          <span className="text-sm font-semibold text-slate-500 font-sans ml-1">/100</span>
        </div>
        
        <div className="mt-1">
          <span 
            className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border inline-block"
            style={{ 
              borderColor: `${color}60`,
              backgroundColor: `${color}15`,
              color: color
            }}
          >
            {level}
          </span>
        </div>
      </div>

      {/* Scale Range labels */}
      <div className="w-48 flex justify-between text-[10px] font-mono text-slate-500 px-2 mt-[-10px]">
        <span>0 SAFE</span>
        <span>50 WARN</span>
        <span>100 CRIT</span>
      </div>
    </div>
  );
}
