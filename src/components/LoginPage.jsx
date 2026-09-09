import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Radio, 
  Users, 
  LifeBuoy, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  HardHat,
  Cpu,
  Flame,
  Globe
} from 'lucide-react';
import { useAuth, ROLES, DEMO_PROFILES } from '../context/AuthContext';
import { useMine } from '../context/MineContext';

export function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const { workers } = useMine();

  const [selectedRole, setSelectedRole] = useState(ROLES.SUPERVISOR);
  const [selectedWorkerId, setSelectedWorkerId] = useState('MG-024');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const activeDemoProfile = DEMO_PROFILES[selectedRole];

  const handleOpenGoogleModal = () => {
    setShowGoogleModal(true);
  };

  const handleConfirmGoogleLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      loginWithGoogle(selectedRole, selectedRole === ROLES.MINEWORKER ? selectedWorkerId : null);
      setIsAuthenticating(false);
      setShowGoogleModal(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-industrial-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500/20 selection:text-amber-200 relative overflow-hidden">
      
      {/* Background Radial & Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 60%),
            linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />

      {/* Top Header Bar */}
      <header className="bg-industrial-900/90 border-b border-industrial-800 py-3.5 px-6 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            🛡️
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider font-mono text-white flex items-center gap-2">
              <span>MINEGUARDS</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                SIH 2026 PROTOTYPE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              AI-Powered Underground Mine Worker Safety, Monitoring &amp; Rescue Gateway
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SECURITY PROTOCOL ENFORCED</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="hud-panel rounded-2xl max-w-xl w-full border-2 border-industrial-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Gateway Card Title */}
          <div className="bg-industrial-900/90 p-6 border-b border-industrial-800 text-center relative">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-mono font-black tracking-wide text-white uppercase">
              SUBTERRANEAN SECURITY GATEWAY
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Select your operational role to initiate Google Single Sign-On (SSO) authentication
            </p>
          </div>

          <div className="p-6 space-y-6">

            {/* Role Selection Tabs */}
            <div>
              <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                1. SELECT YOUR OPERATIONAL ROLE:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Supervisor Tab */}
                <button
                  onClick={() => setSelectedRole(ROLES.SUPERVISOR)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all font-mono ${
                    selectedRole === ROLES.SUPERVISOR
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-500'
                      : 'bg-industrial-900/70 border-industrial-800 text-slate-400 hover:border-industrial-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Radio className={`w-4 h-4 ${selectedRole === ROLES.SUPERVISOR ? 'text-amber-400' : 'text-slate-500'}`} />
                    {selectedRole === ROLES.SUPERVISOR && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">SUPERVISOR</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">Central Operations</div>
                  </div>
                </button>

                {/* Mineworker Tab */}
                <button
                  onClick={() => setSelectedRole(ROLES.MINEWORKER)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all font-mono ${
                    selectedRole === ROLES.MINEWORKER
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500'
                      : 'bg-industrial-900/70 border-industrial-800 text-slate-400 hover:border-industrial-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <HardHat className={`w-4 h-4 ${selectedRole === ROLES.MINEWORKER ? 'text-emerald-400' : 'text-slate-500'}`} />
                    {selectedRole === ROLES.MINEWORKER && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">MINEWORKER</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">Personal Safety HUD</div>
                  </div>
                </button>

                {/* Rescue Team Tab */}
                <button
                  onClick={() => setSelectedRole(ROLES.RESCUE_TEAM)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all font-mono ${
                    selectedRole === ROLES.RESCUE_TEAM
                      ? 'bg-red-950/40 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.15)] ring-1 ring-red-500'
                      : 'bg-industrial-900/70 border-industrial-800 text-slate-400 hover:border-industrial-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <LifeBuoy className={`w-4 h-4 ${selectedRole === ROLES.RESCUE_TEAM ? 'text-red-400' : 'text-slate-500'}`} />
                    {selectedRole === ROLES.RESCUE_TEAM && <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">RESCUE TEAM</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">Emergency Command</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Selected Role Profile Preview Card */}
            <div className="bg-industrial-950 p-4 rounded-xl border border-industrial-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-industrial-800 pb-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  AUTH CREDENTIAL PREVIEW
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeDemoProfile.badgeColor}`}>
                  {selectedRole} MODE
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={activeDemoProfile.avatar}
                  alt={activeDemoProfile.name}
                  className="w-11 h-11 rounded-full border-2 border-industrial-700 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{activeDemoProfile.name}</div>
                  <div className="text-xs text-amber-300 truncate">{activeDemoProfile.email}</div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">{activeDemoProfile.roleTitle}</div>
                </div>
              </div>

              {/* If Mineworker, allow selecting worker ID */}
              {selectedRole === ROLES.MINEWORKER && (
                <div className="pt-2 border-t border-industrial-800/80">
                  <label className="text-[10px] text-slate-400 block mb-1">
                    LINKED UNDERGROUND WORKER ACCOUNT:
                  </label>
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    className="w-full bg-industrial-900 border border-industrial-700 rounded-lg p-2 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.id} • {w.name} ({w.role} - {w.zone})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Sign in with Google Button */}
            <div className="space-y-3">
              <button
                onClick={handleOpenGoogleModal}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-sans font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] group"
              >
                {/* Google Multicolor SVG Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform ml-auto" />
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-500 font-mono">
                  Smart India Hackathon 2026 OAuth Simulated Gateway
                </span>
              </div>
            </div>

          </div>

          {/* Footer note */}
          <div className="bg-industrial-900/90 px-6 py-3 border-t border-industrial-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>MINEGUARDS v2.4 • PROTOTYPE ACCESS</span>
            <span className="text-amber-400 font-semibold">256-BIT ENCRYPTED</span>
          </div>

        </div>
      </main>

      {/* Simulated Google OAuth Sign-In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-semibold text-sm text-slate-700">Sign in with Google</span>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Choose an account</h3>
                <p className="text-xs text-slate-500">to continue to MINEGUARDS Safety Console</p>
              </div>

              {/* Google User Profile Option */}
              <button
                onClick={handleConfirmGoogleLogin}
                disabled={isAuthenticating}
                className="w-full p-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left group"
              >
                <img 
                  src={activeDemoProfile.avatar} 
                  alt={activeDemoProfile.name} 
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {activeDemoProfile.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{activeDemoProfile.email}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {isAuthenticating && (
                <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-xs font-mono flex items-center justify-center gap-2 animate-pulse">
                  <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying OAuth 2.0 Credentials...</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t text-[11px] text-slate-500 flex justify-between">
              <span>To continue, Google will share your name and email with MINEGUARDS.</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Bar */}
      <footer className="bg-industrial-900 border-t border-industrial-800 py-3 px-6 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>MINEGUARDS UNDERGROUND SAFETY SYSTEM</span>
        </div>
        <div>
          Smart India Hackathon 2026 Prototype
        </div>
        <div className="text-slate-400 font-semibold">
          SYSTEM ONLINE
        </div>
      </footer>

    </div>
  );
}
