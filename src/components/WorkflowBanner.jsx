import React from 'react';
import { Radio, Cpu, Gauge, AlertOctagon, MapPin, LifeBuoy, ArrowRight } from 'lucide-react';

export function WorkflowBanner() {
  const steps = [
    { label: 'DETECT', desc: 'IoT Multi-Sensors', icon: Radio, color: 'text-sky-400', border: 'border-sky-500/30' },
    { label: 'ANALYZE', desc: 'Edge Telemetry', icon: Cpu, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { label: 'ASSESS RISK', desc: 'AI Fusion Engine', icon: Gauge, color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'ALERT', desc: 'Zero-Latency Warning', icon: AlertOctagon, color: 'text-red-400', border: 'border-red-500/30' },
    { label: 'LOCATE', desc: 'Subterranean Triangulation', icon: MapPin, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'RESCUE', desc: 'Rapid Dispatch Protocol', icon: LifeBuoy, color: 'text-cyan-400', border: 'border-cyan-500/30' },
  ];

  return (
    <div className="hud-panel rounded-lg px-4 py-2.5 flex flex-col lg:flex-row items-center justify-between gap-3 border border-industrial-700/60">
      {/* Product Mission Statement */}
      <div className="flex items-center gap-2.5 text-xs text-slate-300">
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
          CORE FUSION
        </span>
        <span className="font-medium">
          Combining <strong className="text-white font-semibold">Worker Health</strong>, <strong className="text-white font-semibold">Environmental Hazards</strong>, <strong className="text-white font-semibold">Movement</strong> &amp; <strong className="text-white font-semibold">Underground Location</strong> for Unified Risk Response.
        </span>
      </div>

      {/* Visual Workflow Steps */}
      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.label}>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded bg-industrial-900/80 border ${step.border}`}>
                <Icon className={`w-3.5 h-3.5 ${step.color}`} />
                <span className={`text-[11px] font-mono font-bold tracking-wider ${step.color}`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-400 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
