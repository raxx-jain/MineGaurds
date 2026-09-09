import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Play, 
  RotateCcw, 
  Bell, 
  Sliders, 
  HardHat,
  Cpu,
  Layers,
  Mountain,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { useMine } from '../context/MineContext';
import { useAuth, ROLES, DEMO_PROFILES } from '../context/AuthContext';

export function Navbar({ onOpenSimulator, onOpenMeshStatus }) {
  const { 
    isNetworkDegraded, 
    setIsNetworkDegraded,
    isMuted, 
    toggleAudioMute, 
    triggerDemoEmergency, 
    resetSimulation, 
    isDemoRunning, 
    demoStep,
    activeAlertsCount,
    criticalCount,
    collapseState,
    triggerCollapseDemo,
  } = useMine();

  const { user, logout, switchRole } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setCurrentDate(now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-industrial-900 border-b border-industrial-700/60 sticky top-0 z-30 shadow-2xl backdrop-blur-md">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Brand & Product Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500/20 to-industrial-800 border border-amber-500/50 shadow-inner">
            <HardHat className="w-6 h-6 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-slate-100 uppercase font-sans">
                MINE<span className="text-amber-400">GUARDS</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold tracking-wider">
                CONTROL CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-tight hidden sm:block">
              Underground Safety &amp; Rescue System
            </p>
          </div>
        </div>

        {/* Center: Live System & Clock */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Live System Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-industrial-850 border border-industrial-700/80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400">
              LIVE SYSTEM
            </span>
          </div>

          {/* Time & Date */}
          <div className="text-right hidden md:block">
            <div className="text-sm font-mono font-bold text-slate-200 tracking-wider">
              {currentTime || '14:30:33'}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {currentDate || 'Saturday, Sep 5, 2026'}
            </div>
          </div>

          {/* Network Status Toggle */}
          <button
            onClick={() => setIsNetworkDegraded(!isNetworkDegraded)}
            title="Click to toggle underground network degradation"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono font-semibold border transition-all ${
              isNetworkDegraded
                ? 'bg-amber-950/40 text-amber-400 border-amber-500/50 hover:bg-amber-900/50'
                : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/40'
            }`}
          >
            {isNetworkDegraded ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>MESH DEGRADED</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>ONLINE (92%)</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Actions, Demo Emergency Button & Settings */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Emergency Button */}
          <button
            onClick={triggerDemoEmergency}
            disabled={isDemoRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all shadow-md ${
              isDemoRunning
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50'
            }`}
            title="Run 12-second automated emergency simulation for SIH judges"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isDemoRunning ? `SIMULATING (${demoStep}/6)` : 'DEMO EMERGENCY'}</span>
          </button>

          {/* Tunnel Collapse Demo Button */}
          <button
            onClick={triggerCollapseDemo}
            disabled={collapseState.active || collapseState.demoRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all shadow-md ${
              collapseState.active || collapseState.demoRunning
                ? 'bg-red-800 text-red-200 animate-pulse'
                : 'bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/50'
            }`}
            title="Run 15-second tunnel collapse structural emergency simulation"
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>{collapseState.demoRunning ? `COLLAPSE (${collapseState.demoStep}/6)` : collapseState.active ? 'COLLAPSE ACTIVE' : 'SIMULATE COLLAPSE'}</span>
          </button>

          {/* Reset Simulation */}
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-industrial-800 hover:bg-industrial-750 border border-industrial-700 transition-colors"
            title="Reset simulation parameters to normal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          {/* Audio Alarm Mute / Unmute */}
          <button
            onClick={toggleAudioMute}
            className={`p-1.5 rounded-md border transition-colors ${
              isMuted
                ? 'bg-industrial-800 text-slate-400 border-industrial-700 hover:text-slate-200'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title={isMuted ? 'Sound Muted (Click to enable audio alarms)' : 'Sound Enabled (Click to mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Presenter Simulation Sliders Button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
            title="Open SIH Presenter Sensor Simulator"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">SIMULATOR</span>
          </button>

          {/* Notifications / Alerts Count */}
          <div className="relative">
            <button
              onClick={onOpenMeshStatus}
              className="p-1.5 rounded-md bg-industrial-800 hover:bg-industrial-750 border border-industrial-700 text-slate-300 hover:text-white transition-colors"
              title="Active Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-1">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </div>

          {/* User Google Profile Card & Role Switcher */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-industrial-700/80">
              
              {/* Role Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-lg bg-industrial-950 border border-industrial-700 hover:border-amber-500/50 transition-colors"
                  title="Signed-in Google Account • Click to switch demo role"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-amber-500/50"
                  />
                  <div className="text-left hidden xl:block">
                    <div className="text-[11px] font-bold text-slate-100 leading-none truncate max-w-[110px]">
                      {user.name}
                    </div>
                    <div className="text-[9px] font-mono text-amber-300 leading-tight mt-0.5 font-bold">
                      {user.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Role Switcher Menu */}
                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-industrial-900 border border-industrial-700 rounded-xl shadow-2xl p-2 z-50 space-y-1 font-mono text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold border-b border-industrial-800 pb-1 mb-1">
                      SWITCH DEMO ROLE MODE:
                    </div>
                    <button
                      onClick={() => {
                        switchRole(ROLES.SUPERVISOR);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                        user.role === ROLES.SUPERVISOR ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300 hover:bg-industrial-800'
                      }`}
                    >
                      <span>📡 Supervisor</span>
                      {user.role === ROLES.SUPERVISOR && <span className="text-[10px] bg-amber-500/30 px-1.5 py-0.5 rounded">ACTIVE</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchRole(ROLES.MINEWORKER);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                        user.role === ROLES.MINEWORKER ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-industrial-800'
                      }`}
                    >
                      <span>👷 Mineworker (Personal)</span>
                      {user.role === ROLES.MINEWORKER && <span className="text-[10px] bg-emerald-500/30 px-1.5 py-0.5 rounded">ACTIVE</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchRole(ROLES.RESCUE_TEAM);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                        user.role === ROLES.RESCUE_TEAM ? 'bg-red-500/20 text-red-300 font-bold' : 'text-slate-300 hover:bg-industrial-800'
                      }`}
                    >
                      <span>🚑 Rescue Team</span>
                      {user.role === ROLES.RESCUE_TEAM && <span className="text-[10px] bg-red-500/30 px-1.5 py-0.5 rounded">ACTIVE</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* SIGN OUT BUTTON */}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition-all shadow hover:shadow-red-900/40"
                title="Sign out of MINEGUARDS and return to login screen"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">SIGN OUT</span>
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}
