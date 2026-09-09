/**
 * MINEGUARDS — Fixed Underground Tunnel Sensor Network
 * 
 * Environmental sensors permanently installed at fixed locations
 * throughout the mine. These are NOT on the worker wearable.
 * 
 * Each sensor node monitors:
 *   - CH₄ (Methane)        ppm
 *   - CO  (Carbon Monoxide) ppm
 *   - H₂S (Hydrogen Sulfide) ppm
 *   - O₂  (Oxygen)         %
 *   - Temperature           °C
 *   - Humidity              %
 * 
 * Hierarchy:  ZONE → TUNNEL → SENSOR NODE
 */

// ──────────────────────────────────────────────
//  Zone Definitions
// ──────────────────────────────────────────────

export const ZONE_DEFINITIONS = [
  {
    id: 'zone-a',
    name: 'Tunnel A',
    label: 'ZONE A — NORTH EXTRACTION',
    tunnels: ['A-02', 'A-03', 'A-04', 'A-05', 'A-06', 'A-07', 'A-08'],
    depth: '-150m to -220m',
    color: '#38bdf8',
  },
  {
    id: 'zone-b',
    name: 'Tunnel B',
    label: 'ZONE B — SUB-LEVEL DRILLING',
    tunnels: ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'],
    depth: '-220m to -320m',
    color: '#a78bfa',
  },
  {
    id: 'zone-c',
    name: 'Tunnel C',
    label: 'ZONE C — DEEP STOPE EXTRACTION',
    tunnels: ['C-01', 'C-02', 'C-03', 'C-04', 'C-05'],
    depth: '-350m to -450m',
    color: '#ef4444',
  },
  {
    id: 'zone-md',
    name: 'Main Drift',
    label: 'MAIN HAULAGE DRIFT',
    tunnels: ['MD-01', 'MD-02', 'MD-03', 'MD-04'],
    depth: '-120m to -200m',
    color: '#10b981',
  },
];

// Map zone name → zone definition for quick lookups
export const ZONE_MAP = {};
ZONE_DEFINITIONS.forEach(z => { ZONE_MAP[z.name] = z; });

// ──────────────────────────────────────────────
//  Fixed Sensor Nodes
// ──────────────────────────────────────────────

function makeSensor(id, zone, tunnel, ch4, co, h2s, o2, temp, humidity, x, y) {
  return { id, zone, tunnel, ch4, co, h2s, o2, temp, humidity, x, y, status: 'ONLINE', lastUpdated: 'Just now' };
}

export const INITIAL_TUNNEL_SENSORS = [
  // ───── Zone A Sensors ─────
  makeSensor('A02-S01', 'Tunnel A', 'A-02', 6,  4,  0.2, 20.8, 24.2, 56, 555, 198),
  makeSensor('A02-S02', 'Tunnel A', 'A-02', 7,  3,  0.1, 20.9, 24.0, 54, 600, 202),
  makeSensor('A05-S01', 'Tunnel A', 'A-05', 14, 10, 0.8, 20.2, 27.5, 62, 730, 215),
  makeSensor('A05-S02', 'Tunnel A', 'A-05', 12, 8,  0.5, 20.4, 26.8, 60, 770, 222),
  makeSensor('A07-S01', 'Tunnel A', 'A-07', 8,  5,  0.3, 20.7, 25.0, 58, 840, 210),

  // ───── Zone B Sensors ─────
  makeSensor('B01-S01', 'Tunnel B', 'B-01', 10, 7,  0.4, 20.5, 26.0, 60, 400, 340),
  makeSensor('B03-S01', 'Tunnel B', 'B-03', 9,  6,  0.3, 20.6, 25.5, 58, 480, 355),
  makeSensor('B05-S01', 'Tunnel B', 'B-05', 11, 9,  0.5, 20.3, 27.0, 64, 620, 375),
  makeSensor('B05-S02', 'Tunnel B', 'B-05', 13, 8,  0.6, 20.2, 27.2, 63, 660, 380),

  // ───── Zone C Sensors (Deep Stope — higher baseline gas) ─────
  makeSensor('C01-S01', 'Tunnel C', 'C-01', 18, 14, 1.2, 19.6, 30.0, 70, 530, 478),
  makeSensor('C02-S01', 'Tunnel C', 'C-02', 22, 18, 1.5, 19.2, 31.0, 72, 585, 490),
  makeSensor('C02-S02', 'Tunnel C', 'C-02', 20, 16, 1.3, 19.4, 30.5, 71, 610, 488),
  makeSensor('C04-S01', 'Tunnel C', 'C-04', 28, 22, 2.0, 18.8, 32.0, 76, 720, 508),
  makeSensor('C04-S02', 'Tunnel C', 'C-04', 32, 26, 2.2, 18.5, 32.4, 78, 750, 515),
  makeSensor('C04-S03', 'Tunnel C', 'C-04', 25, 20, 1.8, 19.0, 31.8, 75, 780, 520),
  makeSensor('C05-S01', 'Tunnel C', 'C-05', 16, 12, 1.0, 19.8, 29.5, 68, 850, 530),

  // ───── Main Drift Sensors ─────
  makeSensor('MD01-S01', 'Main Drift', 'MD-01', 5,  3,  0.1, 20.9, 23.0, 52, 260, 245),
  makeSensor('MD02-S01', 'Main Drift', 'MD-02', 4,  2,  0.1, 21.0, 22.8, 50, 340, 255),
  makeSensor('MD03-S01', 'Main Drift', 'MD-03', 6,  4,  0.2, 20.8, 23.5, 54, 420, 260),
];

// ──────────────────────────────────────────────
//  Zone Status Computation
// ──────────────────────────────────────────────

/**
 * Gas thresholds for zone status classification
 */
const GAS_THRESHOLDS = {
  ch4:  { warning: 20, danger: 40, extreme: 60 },   // ppm
  co:   { warning: 20, danger: 40, extreme: 55 },   // ppm
  h2s:  { warning: 2,  danger: 5,  extreme: 10 },   // ppm
  o2:   { low_warning: 19.5, low_danger: 18.0, low_extreme: 17.0 }, // % (inverse — lower is worse)
};

/**
 * Compute the status for a single sensor node
 */
export function getSensorNodeStatus(sensor) {
  const { ch4, co, h2s, o2 } = sensor;
  let level = 'SAFE';

  // Check each gas
  if (ch4 >= GAS_THRESHOLDS.ch4.extreme || co >= GAS_THRESHOLDS.co.extreme || h2s >= GAS_THRESHOLDS.h2s.extreme || o2 <= GAS_THRESHOLDS.o2.low_extreme) {
    level = 'EXTREME DANGER';
  } else if (ch4 >= GAS_THRESHOLDS.ch4.danger || co >= GAS_THRESHOLDS.co.danger || h2s >= GAS_THRESHOLDS.h2s.danger || o2 <= GAS_THRESHOLDS.o2.low_danger) {
    level = 'DANGER';
  } else if (ch4 >= GAS_THRESHOLDS.ch4.warning || co >= GAS_THRESHOLDS.co.warning || h2s >= GAS_THRESHOLDS.h2s.warning || o2 <= GAS_THRESHOLDS.o2.low_warning) {
    level = 'WARNING';
  }

  return level;
}

/**
 * Compute the overall status for a zone based on all its sensors.
 * Takes the worst-case reading from any sensor node in the zone.
 */
export function getZoneStatus(sensors) {
  const statusRank = { 'SAFE': 0, 'WARNING': 1, 'DANGER': 2, 'EXTREME DANGER': 3 };
  let worstLevel = 'SAFE';

  for (const sensor of sensors) {
    const nodeStatus = getSensorNodeStatus(sensor);
    if (statusRank[nodeStatus] > statusRank[worstLevel]) {
      worstLevel = nodeStatus;
    }
  }

  const colors = {
    'SAFE':           { color: '#10b981', bgClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    'WARNING':        { color: '#f59e0b', bgClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    'DANGER':         { color: '#ef4444', bgClass: 'bg-red-500/20 text-red-400 border-red-500/40' },
    'EXTREME DANGER': { color: '#dc2626', bgClass: 'bg-red-600/30 text-red-300 border-red-500/60' },
  };

  return {
    level: worstLevel,
    ...colors[worstLevel],
  };
}

/**
 * Get aggregated (worst-case) gas readings for a specific zone.
 * Used by AI Risk Engine to evaluate environmental exposure for workers in a zone.
 */
export function getZoneGasReadings(sensors) {
  if (!sensors || sensors.length === 0) {
    return { ch4: 0, co: 0, h2s: 0, o2: 21.0, temp: 22, humidity: 50, worstSensorId: null };
  }

  let worstCh4 = 0, worstCo = 0, worstH2s = 0, worstO2 = 21.0, worstTemp = 0, avgHumidity = 0;
  let worstSensorId = sensors[0].id;
  let worstScore = 0;

  for (const s of sensors) {
    const score = s.ch4 + s.co + (s.h2s * 10) + ((21 - s.o2) * 5);
    if (score > worstScore) {
      worstScore = score;
      worstSensorId = s.id;
    }
    if (s.ch4 > worstCh4) worstCh4 = s.ch4;
    if (s.co > worstCo) worstCo = s.co;
    if (s.h2s > worstH2s) worstH2s = s.h2s;
    if (s.o2 < worstO2) worstO2 = s.o2;
    if (s.temp > worstTemp) worstTemp = s.temp;
    avgHumidity += s.humidity;
  }

  return {
    ch4: worstCh4,
    co: worstCo,
    h2s: worstH2s,
    o2: parseFloat(worstO2.toFixed(1)),
    temp: worstTemp,
    humidity: Math.round(avgHumidity / sensors.length),
    worstSensorId,
  };
}

/**
 * Get sensors belonging to a specific zone name
 */
export function getSensorsForZone(allSensors, zoneName) {
  return allSensors.filter(s => s.zone === zoneName);
}

/**
 * Get sensors belonging to a specific tunnel (sub-zone)
 */
export function getSensorsForTunnel(allSensors, tunnelId) {
  return allSensors.filter(s => s.tunnel === tunnelId);
}

/**
 * Compute all zone statuses at once
 */
export function computeAllZoneStatuses(allSensors) {
  const statuses = {};
  for (const zoneDef of ZONE_DEFINITIONS) {
    const zoneSensors = getSensorsForZone(allSensors, zoneDef.name);
    const gasReadings = getZoneGasReadings(zoneSensors);
    const status = getZoneStatus(zoneSensors);
    statuses[zoneDef.name] = {
      ...status,
      ...gasReadings,
      sensorCount: zoneSensors.length,
      zoneDef,
    };
  }
  return statuses;
}
