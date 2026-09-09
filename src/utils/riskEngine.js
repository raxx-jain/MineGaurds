/**
 * MINEGUARDS AI Worker Risk Analysis Engine
 * 
 * Transparent, deterministic multi-sensor fusion model:
 * Combines Environmental, Health, Movement, and Location parameters.
 * 
 * Base weights:
 * - Gas danger (Methane + CO): up to +30 pts
 * - Low SpO2 (Hypoxia): up to +25 pts
 * - Abnormal Heart Rate: up to +15 pts
 * - Fall Detected / Inactivity: up to +20 pts
 * - Extreme Temperature (Heat stroke / hypothermia): up to +10 pts
 * - SOS Panic Trigger: immediate override to CRITICAL (95-100 pts)
 * 
 * Risk Tiers:
 * 0 - 30   : SAFE (Green)
 * 31 - 60  : WARNING (Yellow)
 * 61 - 80  : HIGH RISK (Orange)
 * 81 - 100 : CRITICAL (Red)
 */

export function calculateWorkerRisk(telemetry) {
  const {
    methane = 12,        // ppm (Safe < 25, Warning 25-50, Danger > 50)
    co = 8,              // ppm (Safe < 25, Warning 25-50, Danger > 50)
    spO2 = 98,           // % (Safe >= 95, Warning 90-94, Danger < 90, Severe < 85)
    heartRate = 75,      // bpm (Safe 60-100, Warning 101-120 or 50-59, Danger > 120 or < 50)
    bodyTemp = 36.8,     // °C (Normal 36.5-37.5, Warning 37.6-38.2, Danger > 38.2)
    movement = 'NORMAL', // 'NORMAL', 'ERRATIC', 'STATIONARY', 'FALL'
    fallDetected = false,
    sos = false,
  } = telemetry;

  const contributors = [];
  let score = 0;

  // 1. SOS Panic Button Override
  if (sos) {
    contributors.push({
      category: 'SOS Panic Signal',
      label: 'Manual Emergency Beacon Pressed',
      points: 95,
      severity: 'CRITICAL',
    });
    return {
      score: 98,
      level: 'CRITICAL',
      color: '#ef4444',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
      contributors,
      primaryReason: 'Manual SOS Panic Beacon Activated',
    };
  }

  // 2. Gas Danger (Methane + CO) -> up to 30 pts
  // Combined toxic / explosive gas exposure
  let gasScore = 0;
  let gasDetails = [];
  if (methane > 50) {
    gasScore += 18;
    gasDetails.push(`CH₄ Danger (${methane} ppm)`);
  } else if (methane > 25) {
    gasScore += 9;
    gasDetails.push(`CH₄ Elevated (${methane} ppm)`);
  }

  if (co > 50) {
    gasScore += 18;
    gasDetails.push(`CO Danger (${co} ppm)`);
  } else if (co > 25) {
    gasScore += 10;
    gasDetails.push(`CO Warning (${co} ppm)`);
  }

  // Cap gas score at 30
  const finalGasScore = Math.min(30, gasScore);
  if (finalGasScore > 0) {
    score += finalGasScore;
    contributors.push({
      category: 'Environmental Hazard',
      label: gasDetails.join(' + ') || 'High Gas Exposure',
      points: finalGasScore,
      severity: finalGasScore >= 20 ? 'CRITICAL' : 'WARNING',
    });
  }

  // 3. SpO2 (Hypoxia / Suffocation) -> up to 25 pts
  let spO2Score = 0;
  if (spO2 < 85) {
    spO2Score = 25;
    score += spO2Score;
    contributors.push({
      category: 'Severe Hypoxia',
      label: `Critical Low SpO₂ (${spO2}%)`,
      points: 25,
      severity: 'CRITICAL',
    });
  } else if (spO2 < 90) {
    spO2Score = 20;
    score += spO2Score;
    contributors.push({
      category: 'Low Oxygen Saturation',
      label: `SpO₂ Below Safe Limit (${spO2}%)`,
      points: 20,
      severity: 'HIGH RISK',
    });
  } else if (spO2 < 94) {
    spO2Score = 10;
    score += spO2Score;
    contributors.push({
      category: 'Sub-optimal Oxygen',
      label: `SpO₂ Sub-safe (${spO2}%)`,
      points: 10,
      severity: 'WARNING',
    });
  }

  // 4. Fall Detection & Movement -> up to 20 pts
  if (fallDetected || movement === 'FALL') {
    score += 20;
    contributors.push({
      category: 'Motion Anomaly',
      label: 'Impact / Worker Fall Detected',
      points: 20,
      severity: 'CRITICAL',
    });
  } else if (movement === 'STATIONARY') {
    score += 8;
    contributors.push({
      category: 'Motion Anomaly',
      label: 'Prolonged Worker Inactivity',
      points: 8,
      severity: 'WARNING',
    });
  } else if (movement === 'ERRATIC') {
    score += 6;
    contributors.push({
      category: 'Motion Anomaly',
      label: 'Erratic Motion Pattern',
      points: 6,
      severity: 'WARNING',
    });
  }

  // 5. Abnormal Heart Rate -> up to 15 pts
  if (heartRate > 120 || heartRate < 45) {
    score += 15;
    contributors.push({
      category: 'Cardiovascular Distress',
      label: `Tachycardia / Extreme HR (${heartRate} BPM)`,
      points: 15,
      severity: 'CRITICAL',
    });
  } else if (heartRate > 100 || heartRate < 55) {
    score += 8;
    contributors.push({
      category: 'Elevated Heart Rate',
      label: `Cardiac Elevation (${heartRate} BPM)`,
      points: 8,
      severity: 'WARNING',
    });
  }

  // 6. Body Temperature -> up to 10 pts
  if (bodyTemp > 38.5 || bodyTemp < 35.0) {
    score += 10;
    contributors.push({
      category: 'Thermal Stress',
      label: `Hyperthermia Warning (${bodyTemp.toFixed(1)}°C)`,
      points: 10,
      severity: 'HIGH RISK',
    });
  } else if (bodyTemp > 37.8) {
    score += 4;
    contributors.push({
      category: 'Thermal Stress',
      label: `Mild Heat Stress (${bodyTemp.toFixed(1)}°C)`,
      points: 4,
      severity: 'WARNING',
    });
  }

  // Clamp total score 0 to 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  let level = 'SAFE';
  let color = '#10b981';
  let badgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

  if (finalScore >= 81) {
    level = 'CRITICAL';
    color = '#ef4444';
    badgeClass = 'bg-red-500/20 text-red-400 border-red-500/40';
  } else if (finalScore >= 61) {
    level = 'HIGH RISK';
    color = '#f97316';
    badgeClass = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
  } else if (finalScore >= 31) {
    level = 'WARNING';
    color = '#f59e0b';
    badgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
  }

  // Primary summary reason
  let primaryReason = 'All parameters within normal underground baseline';
  if (contributors.length > 0) {
    primaryReason = contributors[0].label;
    if (contributors.length > 1) {
      primaryReason += ` & ${contributors[1].label}`;
    }
  }

  return {
    score: finalScore,
    level,
    color,
    badgeClass,
    contributors,
    primaryReason,
  };
}
