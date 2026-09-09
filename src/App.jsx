import React, { useState, useRef, useEffect } from 'react';
import { MineProvider, useMine } from './context/MineContext';
import { AuthProvider, useAuth, ROLES } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { EmergencyBanner } from './components/EmergencyBanner';
import { MineMap } from './components/MineMap';
import { RiskEnginePanel } from './components/RiskEnginePanel';
import { SensorPanel } from './components/SensorPanel';
import { TelemetryCharts } from './components/TelemetryCharts';
import { WorkerTable } from './components/WorkerTable';
import { AlertFeed } from './components/AlertFeed';
import { CommunicationPanel } from './components/CommunicationPanel';
import { RescueModal } from './components/RescueModal';
import { SimulatorControl } from './components/SimulatorControl';
import { WorkerProfileModal } from './components/WorkerProfileModal';
import { CollapseModal } from './components/CollapseModal';
import { Heart, Activity, Thermometer, ShieldAlert, LifeBuoy, Bell, MapPin } from 'lucide-react';

function DashboardContent() {
  const { isAuthenticated, user, role } = useAuth();
  const { setSelectedWorkerId, selectedWorker, setRescueModalOpen, collapseState } = useMine();
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const mapSectionRef = useRef(null);

  // Auto select mineworker ID if logged in as mineworker
  useEffect(() => {
    if (role === ROLES.MINEWORKER && user?.workerId) {
      setSelectedWorkerId(user.workerId);
    }
  }, [role, user?.workerId, setSelectedWorkerId]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const scrollToMap = (workerId) => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-industrial-950 text-slate-200 flex flex-col font-sans">
      
      {/* Top Navigation Bar with User Profile & Sign Out Button */}
      <Navbar 
        onOpenSimulator={() => setSimulatorOpen(true)}
        onOpenMeshStatus={() => {
          const el = document.getElementById('comms-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Control-Room Workspace Container */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 lg:px-6 py-4 space-y-4">
        
        {/* ROLE NOTICE BANNER */}
        <div className="bg-industrial-900 border border-industrial-700/80 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-400 font-bold">AUTHENTICATED GOOGLE SESSION:</span>
            <span className="text-slate-100 font-bold">{user?.name}</span>
            <span className="text-slate-400">({user?.email})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Active Role Mode:</span>
            <span className={`px-2.5 py-0.5 rounded font-bold border ${user?.badgeColor}`}>
              {role === ROLES.SUPERVISOR ? '📡 SUPERVISOR' : role === ROLES.MINEWORKER ? `👷 MINEWORKER (${user?.workerId})` : '🚑 RESCUE TEAM'}
            </span>
          </div>
        </div>

        {/* ================= SUPERVISOR VIEW ================= */}
        {role === ROLES.SUPERVISOR && (
          <>
            {/* Row 1: KPI Summary Cards */}
            <section aria-label="Key Performance Indicators">
              <SummaryCards />
            </section>

            {/* Row 2: Active Emergency Action Banner */}
            <section aria-label="Active Emergency Alert System">
              <EmergencyBanner onFocusMap={scrollToMap} />
            </section>

            {/* Row 3: Primary Control-Room Dual Grid (Mine Map + AI Risk Engine) */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4" aria-label="Underground Tactical Map and AI Risk Engine">
              <div className="xl:col-span-7">
                <MineMap mapRef={mapSectionRef} />
              </div>
              <div className="xl:col-span-5">
                <RiskEnginePanel />
              </div>
            </section>

            {/* Row 4: Detailed Telemetry Grid & Real-time Trend Charts */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4" aria-label="Sensor Telemetry and Historical Trends">
              <div className="xl:col-span-6">
                <SensorPanel />
              </div>
              <div className="xl:col-span-6">
                <TelemetryCharts />
              </div>
            </section>

            {/* Row 5: Live Worker Monitoring Table & Communication/Alerts */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4" aria-label="Worker Roster and Communication Mesh">
              <div className="xl:col-span-8">
                <WorkerTable onFocusMap={scrollToMap} />
              </div>
              <div className="xl:col-span-4 space-y-4" id="comms-section">
                <CommunicationPanel />
                <AlertFeed onFocusMap={scrollToMap} />
              </div>
            </section>
          </>
        )}

        {/* ================= MINEWORKER VIEW ================= */}
        {role === ROLES.MINEWORKER && (
          <div className="space-y-4">
            {/* Worker Personal Safety Header */}
            <div className="hud-panel p-5 rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={user?.avatar} alt={user?.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-mono font-black text-white">{user?.name}</h2>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                      WORKER {user?.workerId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    {user?.roleTitle} • Wearable Smart-Vest Node #W-{user?.workerId?.replace('MG-', '')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRescueModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-900/40"
                >
                  <Bell className="w-4 h-4" /> TRIGGER SOS EMERGENCY BEACON
                </button>
              </div>
            </div>

            {/* Mineworker Dual Grid: Mine Map Evacuation Route + Personal Telemetry */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-7">
                <MineMap mapRef={mapSectionRef} />
              </div>
              <div className="xl:col-span-5">
                <SensorPanel />
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-6">
                <TelemetryCharts />
              </div>
              <div className="xl:col-span-6 space-y-4">
                <AlertFeed onFocusMap={scrollToMap} />
              </div>
            </section>
          </div>
        )}

        {/* ================= RESCUE TEAM VIEW ================= */}
        {role === ROLES.RESCUE_TEAM && (
          <div className="space-y-4">
            {/* Rescue Ops Header */}
            <div className="hud-panel p-5 rounded-2xl border-2 border-red-500/50 bg-red-950/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={user?.avatar} alt={user?.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-red-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-mono font-black text-white">{user?.name}</h2>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-mono font-bold">
                      RESCUE COMMAND
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    {user?.roleTitle} • Emergency Extraction Station 01
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRescueModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-900/40"
                >
                  <LifeBuoy className="w-4 h-4" /> DISPATCH RESCUE SQUAD ALPHA
                </button>
              </div>
            </div>

            {/* Emergency Action Banner */}
            <EmergencyBanner onFocusMap={scrollToMap} />

            {/* Tactical Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-7">
                <MineMap mapRef={mapSectionRef} />
              </div>
              <div className="xl:col-span-5 space-y-4">
                <RiskEnginePanel />
                <AlertFeed onFocusMap={scrollToMap} />
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-8">
                <WorkerTable onFocusMap={scrollToMap} />
              </div>
              <div className="xl:col-span-4">
                <CommunicationPanel />
              </div>
            </section>
          </div>
        )}

      </main>

      {/* Control-Room Industrial Footer */}
      <footer className="bg-industrial-950 border-t border-industrial-800/80 py-3 px-6 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>MINEGUARDS CONSOLE • CENTRAL UNDERGROUND OPERATIONS</span>
        </div>
        <div>
          Authenticated: <strong className="text-slate-300">{user?.name}</strong> ({user?.role})
        </div>
        <div className="text-slate-400 font-semibold">
          SYSTEM ACTIVE • 24/7 MONITORING
        </div>
      </footer>

      {/* Interactive Modals */}
      <RescueModal />
      <SimulatorControl 
        isOpen={simulatorOpen} 
        onClose={() => setSimulatorOpen(false)} 
      />
      <WorkerProfileModal />
      <CollapseModal />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MineProvider>
        <DashboardContent />
      </MineProvider>
    </AuthProvider>
  );
}
