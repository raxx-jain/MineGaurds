import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { generateAllWorkers, INITIAL_ALERTS, INITIAL_GATEWAYS } from '../utils/mockData';
import { calculateWorkerRisk } from '../utils/riskEngine';
import { INITIAL_TUNNEL_SENSORS, getSensorsForTunnel, getZoneGasReadings, getSensorNodeStatus } from '../utils/tunnelSensors';
import { playCriticalSiren, playWarningBeep, setAudioMuted, getAudioMuted, startExtremeAlarm, stopExtremeAlarm } from '../utils/audioAlerts';

const MineContext = createContext(null);

export function MineProvider({ children }) {
  const [workers, setWorkers] = useState(() => generateAllWorkers());
  const [selectedWorkerId, setSelectedWorkerId] = useState('MG-024');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [gateways, setGateways] = useState(INITIAL_GATEWAYS);
  const [tunnelSensors, setTunnelSensors] = useState(INITIAL_TUNNEL_SENSORS);
  const [isNetworkDegraded, setIsNetworkDegraded] = useState(false);
  const [isMuted, setIsMutedState] = useState(true);
  
  // Modals & Panels
  const [rescueModalOpen, setRescueModalOpen] = useState(false);
  const [workerProfileModalOpen, setWorkerProfileModalOpen] = useState(false);
  const [rescueState, setRescueState] = useState({
    active: false,
    dispatched: false,
    dispatchedAt: null,
    team: 'Rescue Team Alpha (Station 1)',
    droneDeployed: true,
    estimatedEta: '3m 45s',
  });

  // Demo Emergency Sequence state
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const demoTimersRef = useRef([]);

  // ======================== TUNNEL COLLAPSE STATE ========================
  const [collapseState, setCollapseState] = useState({
    active: false,
    zone: null,         // e.g. 'Tunnel C'
    subZone: null,      // e.g. 'C-04'
    affectedWorkerIds: [],
    evacuatedWorkerIds: [],
    rescueDispatched: false,
    rescueTeam: null,
    zoneLocked: false,
    timestamp: null,
    demoRunning: false,
    demoStep: 0,
  });
  const [collapseModalOpen, setCollapseModalOpen] = useState(false);
  const collapseTimersRef = useRef([]);
  // ======================================================================

  // Telemetry Time-Series Buffer
  const [telemetryHistory, setTelemetryHistory] = useState(() => {
    const points = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      points.push({
        time: new Date(now - i * 2000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        heartRate: 110 + Math.round(Math.sin(i) * 12),
        spO2: 84 + Math.round(Math.cos(i) * 2),
        gas: 60 + Math.round(Math.sin(i * 0.8) * 8),
        riskScore: 88 + Math.round(Math.sin(i) * 3),
      });
    }
    return points;
  });

  // Audio mute toggle
  const toggleAudioMute = useCallback(() => {
    const next = !isMuted;
    setIsMutedState(next);
    setAudioMuted(next);
  }, [isMuted]);

  // Selected Worker object
  const selectedWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  // Helper to update telemetry of a specific worker
  const updateWorkerTelemetry = useCallback((workerId, updates) => {
    setWorkers(prevWorkers =>
      prevWorkers.map(w => {
        if (w.id !== workerId) return w;
        const updatedWorker = { ...w, ...updates };
        const risk = calculateWorkerRisk(updatedWorker);
        return {
          ...updatedWorker,
          riskScore: risk.score,
          riskLevel: risk.level,
          riskColor: risk.color,
          badgeClass: risk.badgeClass,
          riskContributors: risk.contributors,
          primaryReason: risk.primaryReason,
          lastSeen: 'Just now',
        };
      })
    );
  }, []);

  // Update selected worker easily
  const updateSelectedWorker = useCallback((updates) => {
    if (!selectedWorkerId) return;
    updateWorkerTelemetry(selectedWorkerId, updates);
  }, [selectedWorkerId, updateWorkerTelemetry]);

  // Append to telemetry history when selected worker updates
  useEffect(() => {
    if (!selectedWorker) return;
    const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTelemetryHistory(prev => {
      const next = [
        ...prev.slice(-35),
        {
          time: nowStr,
          heartRate: selectedWorker.heartRate,
          spO2: selectedWorker.spO2,
          gas: Math.max(selectedWorker.methane, selectedWorker.co),
          riskScore: selectedWorker.riskScore,
        }
      ];
      return next;
    });
  }, [selectedWorker?.heartRate, selectedWorker?.spO2, selectedWorker?.methane, selectedWorker?.co, selectedWorker?.riskScore, selectedWorkerId]);

  // Subtle living underground heartbeat jitter (ambient realism)
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkers(prevWorkers =>
        prevWorkers.map(w => {
          if (w.id === 'MG-024' || w.id === 'MG-019' || w.id === 'MG-031' || w.id === 'MG-008' || w.id === 'MG-042') {
            return w;
          }
          // Don't jitter workers affected by collapse
          if (w.evacuationRequired) return w;
          if (Math.random() > 0.4) return w;

          const hrJitter = (Math.random() - 0.5) * 2;
          const newHr = Math.round(Math.max(62, Math.min(88, w.heartRate + hrJitter)));
          const updated = { ...w, heartRate: newHr, lastSeen: '1s ago' };
          const risk = calculateWorkerRisk(updated);
          return {
            ...updated,
            riskScore: risk.score,
            riskLevel: risk.level,
            riskColor: risk.color,
            badgeClass: risk.badgeClass,
            riskContributors: risk.contributors,
            primaryReason: risk.primaryReason,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Play audio when critical alerts occur
  useEffect(() => {
    const hasCritical = workers.some(w => w.riskLevel === 'CRITICAL');
    if (hasCritical && !isMuted && !collapseState.active) {
      playCriticalSiren();
    }
  }, [workers, isMuted, collapseState.active]);

  // Reset demo timers helper
  const clearDemoTimers = () => {
    demoTimersRef.current.forEach(timer => clearTimeout(timer));
    demoTimersRef.current = [];
  };

  const clearCollapseTimers = () => {
    collapseTimersRef.current.forEach(timer => clearTimeout(timer));
    collapseTimersRef.current = [];
  };

  // ======================== TUNNEL COLLAPSE LOGIC ========================

  const addAlert = useCallback((msg, severity, workerId = null, workerName = null, zone = null) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    setAlerts(prev => [
      {
        id: `ALT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        time: timeStr,
        workerId: workerId || 'SYSTEM',
        workerName: workerName || 'STRUCTURAL',
        zone: zone || '',
        message: msg,
        severity,
        acknowledged: false,
      },
      ...prev,
    ]);
  }, []);

  /**
   * TRIGGER TUNNEL COLLAPSE
   * Identifies all workers in the target zone and marks them for evacuation.
   */
  const triggerTunnelCollapse = useCallback((targetZone = 'Tunnel C', targetSubZone = 'C-04') => {
    // 1. Find workers in the affected zone
    const affected = workers.filter(w => w.zone === targetZone);
    const affectedIds = affected.map(w => w.id);

    // 2. Set collapse state
    setCollapseState({
      active: true,
      zone: targetZone,
      subZone: targetSubZone,
      affectedWorkerIds: affectedIds,
      evacuatedWorkerIds: [],
      rescueDispatched: false,
      rescueTeam: null,
      zoneLocked: true,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      demoRunning: false,
      demoStep: 0,
    });

    // 3. Mark affected workers as EVACUATION REQUIRED
    setWorkers(prev => prev.map(w => {
      if (w.zone !== targetZone) return w;
      return {
        ...w,
        evacuationRequired: true,
        riskLevel: 'CRITICAL',
        riskScore: 95,
        riskColor: '#ef4444',
        badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
        primaryReason: 'TUNNEL COLLAPSE — EVACUATION REQUIRED',
      };
    }));

    // 4. Fire alert
    addAlert(
      `🚨 TUNNEL COLLAPSE DETECTED — ${targetZone} / ${targetSubZone} — ${affectedIds.length} workers at risk — EVACUATE IMMEDIATELY`,
      'CRITICAL',
      'SYSTEM',
      'STRUCTURAL',
      `${targetZone} (${targetSubZone})`
    );

    // 5. Start extreme alarm
    startExtremeAlarm();

    // 6. Open collapse modal
    setCollapseModalOpen(true);
  }, [workers, addAlert]);

  /**
   * SIMULATE TUNNEL COLLAPSE — Full 15-second demo sequence
   */
  const triggerCollapseDemo = useCallback(() => {
    clearCollapseTimers();

    // Reset affected zone workers to safe first
    setWorkers(prev => prev.map(w => {
      if (w.zone !== 'Tunnel C') return w;
      const updated = { ...w, evacuationRequired: false, heartRate: 78, spO2: 97, methane: 10, co: 6, movement: 'NORMAL', fallDetected: false, bodyTemp: 36.8 };
      const risk = calculateWorkerRisk(updated);
      return { ...updated, riskScore: risk.score, riskLevel: risk.level, riskColor: risk.color, badgeClass: risk.badgeClass, riskContributors: risk.contributors, primaryReason: risk.primaryReason };
    }));

    setCollapseState(prev => ({ ...prev, demoRunning: true, demoStep: 1, active: false, zoneLocked: false, affectedWorkerIds: [], evacuatedWorkerIds: [] }));

    // Step 1 (T=0s): Normal zone
    addAlert('Seismic micro-vibration sensor activity detected in Tunnel C stope region', 'WARNING', 'SYSTEM', 'STRUCTURAL', 'Tunnel C');

    // Step 2 (T=3s): Structural failure detected
    collapseTimersRef.current.push(setTimeout(() => {
      setCollapseState(prev => ({ ...prev, demoStep: 2 }));
      addAlert('⚠️ STRUCTURAL INTEGRITY WARNING — Anomalous rock pressure in Tunnel C crosscut C-03 / C-04', 'HIGH RISK', 'SYSTEM', 'STRUCTURAL', 'Tunnel C (C-04)');
      playWarningBeep();
    }, 3000));

    // Step 3 (T=5.5s): Extreme danger — trigger the actual collapse
    collapseTimersRef.current.push(setTimeout(() => {
      setCollapseState(prev => ({ ...prev, demoStep: 3 }));
      triggerTunnelCollapse('Tunnel C', 'C-04');
    }, 5500));

    // Step 4 (T=8s): Rescue team notified
    collapseTimersRef.current.push(setTimeout(() => {
      setCollapseState(prev => ({ ...prev, demoStep: 4, rescueDispatched: true, rescueTeam: 'Emergency Extraction Unit Bravo' }));
      addAlert('Rescue Extraction Unit Bravo mobilized — Full SCBA and structural shoring gear deployed', 'CRITICAL', 'SYSTEM', 'RESCUE OPS', 'Tunnel C');
    }, 8000));

    // Step 5 (T=11s): Workers start evacuating
    collapseTimersRef.current.push(setTimeout(() => {
      setCollapseState(prev => {
        const evacuated = prev.affectedWorkerIds.slice(0, Math.ceil(prev.affectedWorkerIds.length / 2));
        return { ...prev, demoStep: 5, evacuatedWorkerIds: evacuated };
      });
      addAlert('Evacuation in progress — Workers moving toward Main Haulage Drift via emergency conduit', 'CRITICAL', 'SYSTEM', 'EVACUATION', 'Tunnel C → Main Drift');
    }, 11000));

    // Step 6 (T=14s): All evacuated, zone locked
    collapseTimersRef.current.push(setTimeout(() => {
      setCollapseState(prev => ({
        ...prev,
        demoStep: 6,
        evacuatedWorkerIds: [...prev.affectedWorkerIds],
        demoRunning: false,
      }));
      addAlert('✅ All workers successfully evacuated from Tunnel C danger zone — Zone remains LOCKED', 'CRITICAL', 'SYSTEM', 'EVACUATION', 'Tunnel C');
      stopExtremeAlarm();
    }, 14000));

  }, [addAlert, triggerTunnelCollapse]);

  /**
   * Mark collapse zone as SAFE (operator override)
   */
  const markCollapseSafe = useCallback(() => {
    stopExtremeAlarm();
    setCollapseState({
      active: false,
      zone: null,
      subZone: null,
      affectedWorkerIds: [],
      evacuatedWorkerIds: [],
      rescueDispatched: false,
      rescueTeam: null,
      zoneLocked: false,
      timestamp: null,
      demoRunning: false,
      demoStep: 0,
    });
    // Reset workers
    setWorkers(prev => prev.map(w => {
      if (!w.evacuationRequired) return w;
      const updated = { ...w, evacuationRequired: false };
      const risk = calculateWorkerRisk(updated);
      return { ...updated, riskScore: risk.score, riskLevel: risk.level, riskColor: risk.color, badgeClass: risk.badgeClass, riskContributors: risk.contributors, primaryReason: risk.primaryReason };
    }));
    addAlert('Tunnel C collapse zone cleared and marked SAFE by control-room operator', 'WARNING', 'SYSTEM', 'OPERATOR', 'Tunnel C');
    setCollapseModalOpen(false);
  }, [addAlert]);

  /**
   * Dispatch collapse rescue team
   */
  const dispatchCollapseRescue = useCallback((team = 'Emergency Extraction Unit Bravo') => {
    setCollapseState(prev => ({
      ...prev,
      rescueDispatched: true,
      rescueTeam: team,
    }));
    addAlert(`${team} dispatched to collapse zone with structural shoring & extraction equipment`, 'CRITICAL', 'SYSTEM', 'RESCUE OPS', `${collapseState.zone}`);
  }, [addAlert, collapseState.zone]);

  /**
   * Evacuate a specific worker from collapse zone
   */
  const evacuateWorker = useCallback((workerId) => {
    setCollapseState(prev => ({
      ...prev,
      evacuatedWorkerIds: [...new Set([...prev.evacuatedWorkerIds, workerId])],
    }));
    // Move worker out of danger zone conceptually
    setWorkers(prev => prev.map(w => {
      if (w.id !== workerId) return w;
      const updated = { ...w, zone: 'Main Drift', subZone: 'MD-01', evacuationRequired: false };
      const risk = calculateWorkerRisk(updated);
      return { ...updated, riskScore: risk.score, riskLevel: risk.level, riskColor: risk.color, badgeClass: risk.badgeClass, riskContributors: risk.contributors, primaryReason: risk.primaryReason, x: 320, y: 250 };
    }));
  }, []);

  // ======================================================================

  // Reset Simulation
  const resetSimulation = useCallback(() => {
    clearDemoTimers();
    clearCollapseTimers();
    stopExtremeAlarm();
    setIsDemoRunning(false);
    setDemoStep(0);
    setWorkers(generateAllWorkers());
    setSelectedWorkerId('MG-024');
    setAlerts(INITIAL_ALERTS);
    setIsNetworkDegraded(false);
    setRescueState({
      active: false,
      dispatched: false,
      dispatchedAt: null,
      team: 'Rescue Team Alpha (Station 1)',
      droneDeployed: true,
      estimatedEta: '3m 45s',
    });
    setCollapseState({
      active: false,
      zone: null,
      subZone: null,
      affectedWorkerIds: [],
      evacuatedWorkerIds: [],
      rescueDispatched: false,
      rescueTeam: null,
      zoneLocked: false,
      timestamp: null,
      demoRunning: false,
      demoStep: 0,
    });
    setCollapseModalOpen(false);
    setRescueModalOpen(false);
  }, []);

  // Automated 12-Second SIH Hackathon Demo Sequence
  const triggerDemoEmergency = useCallback(() => {
    clearDemoTimers();
    setIsDemoRunning(true);
    setDemoStep(1);

    updateWorkerTelemetry('MG-024', {
      heartRate: 78, spO2: 98, bodyTemp: 36.8, methane: 12, co: 8, movement: 'NORMAL', fallDetected: false, sos: false,
    });
    setSelectedWorkerId('MG-024');

    const addDemoAlert = (msg, severity) => {
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      setAlerts(prev => [
        { id: `ALT-${Date.now()}`, time: timeStr, workerId: 'MG-024', workerName: 'Arjun Das', zone: 'Tunnel C (C-04)', message: msg, severity, acknowledged: false },
        ...prev,
      ]);
    };

    demoTimersRef.current.push(setTimeout(() => {
      setDemoStep(2);
      updateWorkerTelemetry('MG-024', { methane: 45, co: 38 });
      addDemoAlert('Methane gas influx detected in Deep Stope Zone C-04', 'WARNING');
      playWarningBeep();
    }, 2000));

    demoTimersRef.current.push(setTimeout(() => {
      setDemoStep(3);
      updateWorkerTelemetry('MG-024', { heartRate: 112, methane: 62, co: 52, bodyTemp: 37.6 });
      addDemoAlert('Tachycardia warning: Worker MG-024 HR elevated to 112 BPM', 'HIGH RISK');
      playWarningBeep();
    }, 4500));

    demoTimersRef.current.push(setTimeout(() => {
      setDemoStep(4);
      updateWorkerTelemetry('MG-024', { heartRate: 122, spO2: 86, movement: 'ERRATIC', bodyTemp: 37.9 });
      addDemoAlert('Hypoxia Alert: Worker SpO₂ dropped to 86%', 'HIGH RISK');
      playWarningBeep();
    }, 7000));

    demoTimersRef.current.push(setTimeout(() => {
      setDemoStep(5);
      updateWorkerTelemetry('MG-024', { heartRate: 125, spO2: 82, movement: 'FALL', fallDetected: true, bodyTemp: 38.1, methane: 68, co: 62 });
      addDemoAlert('EMERGENCY: Impact Fall Detected! Worker unresponsive at Stope C-04', 'CRITICAL');
      playCriticalSiren();
    }, 9500));

    demoTimersRef.current.push(setTimeout(() => {
      setDemoStep(6);
      setIsDemoRunning(false);
    }, 11500));
  }, [updateWorkerTelemetry]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => { clearDemoTimers(); clearCollapseTimers(); stopExtremeAlarm(); };
  }, []);

  // Alert acknowledgement
  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  // Dispatch rescue
  const dispatchRescue = (team = 'Rescue Team Alpha (Station 1)') => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    setRescueState({ active: true, dispatched: true, dispatchedAt: timeStr, team, droneDeployed: true, estimatedEta: '3m 15s' });
    setAlerts(prev => [
      { id: `ALT-RSC-${Date.now()}`, time: timeStr, workerId: selectedWorker?.id || 'MG-024', workerName: selectedWorker?.name || 'Worker', zone: `${selectedWorker?.zone} (${selectedWorker?.subZone})`, message: `Rapid Rescue Team Alpha dispatched with Oxygen Draeger units`, severity: 'CRITICAL', acknowledged: true },
      ...prev,
    ]);
  };

  const markWorkerFound = () => {
    setRescueState(prev => ({ ...prev, active: false, dispatched: false, found: true }));
    setRescueModalOpen(false);
  };

  // Summary counts
  const totalWorkers = workers.length;
  const safeCount = workers.filter(w => w.riskLevel === 'SAFE').length;
  const warningCount = workers.filter(w => w.riskLevel === 'WARNING').length;
  const criticalCount = workers.filter(w => w.riskLevel === 'CRITICAL' || w.riskLevel === 'HIGH RISK').length;
  const activeAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <MineContext.Provider
      value={{
        workers, selectedWorkerId, setSelectedWorkerId, selectedWorker,
        filterStatus, setFilterStatus, searchQuery, setSearchQuery,
        alerts, acknowledgeAlert,
        gateways, setGateways,
        isNetworkDegraded, setIsNetworkDegraded,
        isMuted, toggleAudioMute,
        rescueModalOpen, setRescueModalOpen,
        workerProfileModalOpen, setWorkerProfileModalOpen,
        rescueState, dispatchRescue, markWorkerFound,
        telemetryHistory,
        updateWorkerTelemetry, updateSelectedWorker,
        isDemoRunning, demoStep, triggerDemoEmergency,
        resetSimulation,
        totalWorkers, safeCount, warningCount, criticalCount, activeAlertsCount,
        // Fixed Tunnel Sensor Network
        tunnelSensors, setTunnelSensors,
        // Tunnel Collapse
        collapseState, setCollapseState,
        collapseModalOpen, setCollapseModalOpen,
        triggerTunnelCollapse, triggerCollapseDemo,
        markCollapseSafe, dispatchCollapseRescue, evacuateWorker,
      }}
    >
      {children}
    </MineContext.Provider>
  );
}

export function useMine() {
  const context = useContext(MineContext);
  if (!context) {
    throw new Error('useMine must be used within a MineProvider');
  }
  return context;
}
