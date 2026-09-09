import { calculateWorkerRisk } from './riskEngine';

// Predefined workers matching exact prompt specifications
export const INITIAL_WORKERS = [
  {
    id: 'MG-001',
    name: 'Ramesh Verma',
    role: 'Drill Operator',
    zone: 'Tunnel A',
    subZone: 'A-02',
    x: 580,
    y: 200,
    heartRate: 78,
    spO2: 98,
    bodyTemp: 36.7,
    ambientTemp: 24.2,
    methane: 8,
    co: 5,
    humidity: 58,
    movement: 'NORMAL',
    fallDetected: false,
    sos: false,
    battery: 94,
    gateway: 'Gateway 02',
    signalDbm: -62,
    lastSeen: '1s ago',
    shift: 'Morning (06:00 - 14:00)',
    ppeEquipped: true,
  },
  {
    id: 'MG-014',
    name: 'Vikram Singh',
    role: 'Loader Driver',
    zone: 'Tunnel B',
    subZone: 'B-03',
    x: 460,
    y: 350,
    heartRate: 91,
    spO2: 96,
    bodyTemp: 37.1,
    ambientTemp: 26.5,
    methane: 14,
    co: 12,
    humidity: 64,
    movement: 'NORMAL',
    fallDetected: false,
    sos: false,
    battery: 88,
    gateway: 'Gateway 01',
    signalDbm: -71,
    lastSeen: '2s ago',
    shift: 'Morning (06:00 - 14:00)',
    ppeEquipped: true,
  },
  {
    id: 'MG-024',
    name: 'Arjun Das',
    role: 'Deep Blaster',
    zone: 'Tunnel C',
    subZone: 'C-04',
    x: 740,
    y: 510,
    heartRate: 125,
    spO2: 82,
    bodyTemp: 38.1,
    ambientTemp: 32.4,
    methane: 68,
    co: 62,
    humidity: 78,
    movement: 'FALL',
    fallDetected: true,
    sos: false,
    battery: 76,
    gateway: 'Gateway 03',
    signalDbm: -84,
    lastSeen: 'Just now',
    shift: 'Morning (06:00 - 14:00)',
    ppeEquipped: true,
  },
  {
    id: 'MG-031',
    name: 'Mohan Kumar',
    role: 'Face Inspector',
    zone: 'Tunnel A',
    subZone: 'A-05',
    x: 760,
    y: 220,
    heartRate: 108,
    spO2: 91,
    bodyTemp: 37.8,
    ambientTemp: 29.8,
    methane: 42,
    co: 38,
    humidity: 71,
    movement: 'NORMAL',
    fallDetected: false,
    sos: false,
    battery: 82,
    gateway: 'Gateway 02',
    signalDbm: -74,
    lastSeen: '2s ago',
    shift: 'Morning (06:00 - 14:00)',
    ppeEquipped: true,
  },
  {
    id: 'MG-019',
    name: 'Suresh Nayak',
    role: 'Shaft Timberman',
    zone: 'Tunnel C',
    subZone: 'C-02',
    x: 580,
    y: 490,
    heartRate: 122,
    spO2: 84,
    bodyTemp: 38.3,
    ambientTemp: 31.0,
    methane: 58,
    co: 54,
    humidity: 75,
    movement: 'ERRATIC',
    fallDetected: false,
    sos: false,
    battery: 69,
    gateway: 'Gateway 03',
    signalDbm: -81,
    lastSeen: '3s ago',
    shift: 'Morning (06:00 - 14:00)',
    ppeEquipped: true,
  },
  {
    id: 'MG-008',
    name: 'Dinesh Prasad',
    role: 'Conveyor Tech',
    zone: 'Tunnel B',
    subZone: 'B-05',
    x: 630,
    y: 380,
    heartRate: 104,
    spO2: 92,
    bodyTemp: 37.6,
    ambientTemp: 28.0,
    methane: 32,
    co: 28,
    humidity: 68,
    movement: 'NORMAL',
    fallDetected: false,
    sos: false,
    battery: 91,
    gateway: 'Gateway 01',
    signalDbm: -68,
    lastSeen: '1s ago',
    shift: 'Morning (06:00 - 14:00)',
    ppeEquipped: true,
  },
  {
    id: 'MG-042',
    name: 'Kalyan Sen',
    role: 'Pump Station Tech',
    zone: 'Tunnel C',
    subZone: 'C-01',
    x: 510,
    y: 475,
    heartRate: 98,
    spO2: 93,
    bodyTemp: 37.5,
    ambientTemp: 27.5,
    methane: 29,
    co: 26,
    humidity: 70,
    movement: 'NORMAL',
    fallDetected: false,
    sos: false,
    battery: 85,
    gateway: 'Gateway 03',
    signalDbm: -72,
    lastSeen: '1s ago',
    shift: 'Morning (06:00 - 14:00)',
    ppeEquipped: true,
  },
];

// Generate the remaining workers (up to 42 total) with safe baseline parameters
const FIRST_NAMES = ['Anil', 'Sunil', 'Rajesh', 'Pankaj', 'Deepak', 'Manoj', 'Santosh', 'Gopal', 'Mukesh', 'Hemant', 'Ajay', 'Vijay', 'Bipin', 'Sanjay', 'Suraj', 'Alok', 'Naveen', 'Ravi', 'Praveen', 'Ashok', 'Kishore', 'Bhuvan', 'Harish', 'Manish', 'Devendra', 'Kamal', 'Chandan', 'Nitin', 'Somesh', 'Tapan', 'Govind', 'Jagdish', 'Pritam', 'Girish', 'Bhaskar'];
const LAST_NAMES = ['Sharma', 'Yadav', 'Patel', 'Reddy', 'Meena', 'Mishra', 'Gupta', 'Rathore', 'Chauhan', 'Pandey', 'Kashyap', 'Tiwari', 'Bose', 'Mukherjee', 'Roy', 'Barman', 'Kole', 'Sahoo', 'Jha', 'Murmu', 'Oraon', 'Soren', 'Munda', 'Hembrom'];
const ROLES = ['Support Timberman', 'Driller', 'Blasting Mate', 'Conveyor Attendant', 'Ventilation Monitor', 'Locomotive Driver', 'Survey Assistant', 'Electrician'];

export function generateAllWorkers() {
  const workers = [...INITIAL_WORKERS];
  const totalNeeded = 42;

  // Track counts to ensure exact summary card metrics:
  // Safe: 37, Warning: 3 (MG-031, MG-008, MG-042), Critical: 2 (MG-024, MG-019) -> 37 + 3 + 2 = 42
  const zones = [
    { name: 'Tunnel A', sub: ['A-01', 'A-03', 'A-04', 'A-06', 'A-07', 'A-08'], xRange: [500, 820], yRange: [180, 240], gw: 'Gateway 02' },
    { name: 'Tunnel B', sub: ['B-01', 'B-02', 'B-04', 'B-06'], xRange: [380, 680], yRange: [320, 390], gw: 'Gateway 01' },
    { name: 'Main Drift', sub: ['MD-01', 'MD-02', 'MD-03', 'MD-04'], xRange: [220, 420], yRange: [220, 280], gw: 'Gateway 01' },
    { name: 'Tunnel C', sub: ['C-03', 'C-05'], xRange: [600, 800], yRange: [480, 540], gw: 'Gateway 03' },
  ];

  let currentId = 2;
  const existingIds = new Set(workers.map(w => parseInt(w.id.replace('MG-', ''), 10)));

  while (workers.length < totalNeeded) {
    while (existingIds.has(currentId)) {
      currentId++;
    }
    existingIds.add(currentId);

    const idStr = `MG-${String(currentId).padStart(3, '0')}`;
    const zInfo = zones[workers.length % zones.length];
    const subZone = zInfo.sub[workers.length % zInfo.sub.length];
    const firstName = FIRST_NAMES[(workers.length * 3) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(workers.length * 5) % LAST_NAMES.length];
    const role = ROLES[workers.length % ROLES.length];

    // Distribute nicely along tunnel coordinates
    const t = (workers.length % 7) / 7;
    const x = Math.round(zInfo.xRange[0] + t * (zInfo.xRange[1] - zInfo.xRange[0]) + (Math.sin(workers.length) * 15));
    const y = Math.round(zInfo.yRange[0] + t * (zInfo.yRange[1] - zInfo.yRange[0]) + (Math.cos(workers.length) * 10));

    // Baseline safe biometrics
    const hr = Math.round(68 + ((workers.length * 7) % 22)); // 68 - 90
    const spo2 = Math.round(96 + ((workers.length * 3) % 4)); // 96 - 99
    const temp = +(36.4 + ((workers.length % 6) * 0.12)).toFixed(1);
    const ch4 = Math.round(6 + (workers.length % 10)); // 6 - 15 ppm
    const coVal = Math.round(4 + (workers.length % 8)); // 4 - 11 ppm

    workers.push({
      id: idStr,
      name: `${firstName} ${lastName}`,
      role,
      zone: zInfo.name,
      subZone,
      x,
      y,
      heartRate: hr,
      spO2: spo2,
      bodyTemp: temp,
      ambientTemp: +(23.0 + (workers.length % 5) * 0.8).toFixed(1),
      methane: ch4,
      co: coVal,
      humidity: 55 + (workers.length % 18),
      movement: 'NORMAL',
      fallDetected: false,
      sos: false,
      battery: 75 + (workers.length % 24),
      gateway: zInfo.gw,
      signalDbm: -55 - (workers.length % 25),
      lastSeen: `${(workers.length % 4) + 1}s ago`,
      shift: 'Morning (06:00 - 14:00)',
      ppeEquipped: true,
    });
  }

  // Calculate initial AI Risk for all workers
  return workers.map(w => {
    const risk = calculateWorkerRisk(w);
    return {
      ...w,
      riskScore: risk.score,
      riskLevel: risk.level,
      riskColor: risk.color,
      badgeClass: risk.badgeClass,
      riskContributors: risk.contributors,
      primaryReason: risk.primaryReason,
    };
  });
}

// Pre-seeded Active Alerts matching prompt specifications
export const INITIAL_ALERTS = [
  {
    id: 'ALT-101',
    time: '14:32:04',
    workerId: 'MG-024',
    workerName: 'Arjun Das',
    zone: 'Tunnel C (C-04)',
    message: 'Worker fall detected with low SpO₂ (82%)',
    severity: 'CRITICAL',
    acknowledged: false,
  },
  {
    id: 'ALT-102',
    time: '14:31:42',
    workerId: 'MG-031',
    workerName: 'Mohan Kumar',
    zone: 'Tunnel A (A-05)',
    message: 'Methane and CO concentration increasing rapidly',
    severity: 'WARNING',
    acknowledged: false,
  },
  {
    id: 'ALT-103',
    time: '14:30:15',
    workerId: 'MG-014',
    workerName: 'Vikram Singh',
    zone: 'Tunnel B (B-03)',
    message: 'Abnormal heart rate elevation detected (91 BPM)',
    severity: 'WARNING',
    acknowledged: true,
  },
  {
    id: 'ALT-104',
    time: '14:28:51',
    workerId: 'MG-024',
    workerName: 'Arjun Das',
    zone: 'Tunnel C (C-04)',
    message: 'SpO₂ dropping below safe threshold (88% -> 82%)',
    severity: 'HIGH RISK',
    acknowledged: true,
  },
  {
    id: 'ALT-105',
    time: '14:26:10',
    workerId: 'MG-019',
    workerName: 'Suresh Nayak',
    zone: 'Tunnel C (C-02)',
    message: 'Elevated ambient methane & high body temperature',
    severity: 'CRITICAL',
    acknowledged: false,
  },
];

// Gateways
export const INITIAL_GATEWAYS = [
  { id: 'GW-01', name: 'Gateway 01', location: 'Main Haulage Drift', status: 'ONLINE', latencyMs: 14, workers: 14, signal: 94, x: 290, y: 250 },
  { id: 'GW-02', name: 'Gateway 02', location: 'Tunnel A Extraction', status: 'ONLINE', latencyMs: 19, workers: 15, signal: 91, x: 540, y: 220 },
  { id: 'GW-03', name: 'Gateway 03', location: 'Tunnel C Deep Stope', status: 'ONLINE', latencyMs: 27, workers: 11, signal: 88, x: 680, y: 500 },
];
