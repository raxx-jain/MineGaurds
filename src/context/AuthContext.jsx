import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  SUPERVISOR: 'SUPERVISOR',
  MINEWORKER: 'MINEWORKER',
  RESCUE_TEAM: 'RESCUE_TEAM',
};

export const DEMO_PROFILES = {
  [ROLES.SUPERVISOR]: {
    name: 'Rajesh V. Sharma',
    email: 'supervisor.control@mineguards.gov.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: ROLES.SUPERVISOR,
    roleTitle: 'Chief Control Room Operations Supervisor',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    workerId: null,
  },
  [ROLES.MINEWORKER]: {
    name: 'Arjun Das',
    email: 'arjun.das.mg024@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: ROLES.MINEWORKER,
    roleTitle: 'Deep Blaster (Stope C-04)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    workerId: 'MG-024',
  },
  [ROLES.RESCUE_TEAM]: {
    name: 'Cmdr. Vikram Malhotra',
    email: 'rescue.alpha@mineguards.gov.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: ROLES.RESCUE_TEAM,
    roleTitle: 'Rapid Underground Extraction Unit Leader',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    workerId: null,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mineguards_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mineguards_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mineguards_user');
    }
  }, [user]);

  const loginWithGoogle = (role = ROLES.SUPERVISOR, customWorkerId = null) => {
    const baseProfile = DEMO_PROFILES[role] || DEMO_PROFILES[ROLES.SUPERVISOR];
    const userProfile = {
      ...baseProfile,
      workerId: customWorkerId || baseProfile.workerId,
      loginTimestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setUser(userProfile);
    return userProfile;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (DEMO_PROFILES[newRole]) {
      setUser({
        ...DEMO_PROFILES[newRole],
        loginTimestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loginWithGoogle,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
