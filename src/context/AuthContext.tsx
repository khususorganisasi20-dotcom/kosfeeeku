import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DatabaseService } from '../lib/database';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | 'guest';
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole | 'guest') => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const DEMO_USERS: Record<string, UserProfile> = {
  tenant: {
    id: 'tenant-demo',
    email: 'budi@student.ac.id',
    fullName: 'Budi Santoso',
    phone: '0812-9988-7766',
    role: 'tenant',
    emergencyContact: '0811-2233-4455 (Ibu Siti)',
    idNumber: '3201234567890001',
    createdAt: '2026-09-01T10:00:00Z',
  },
  owner: {
    id: 'owner-ratna',
    email: 'ratna@kosfeeku.com',
    fullName: 'Hj. Ratna Wijaya (Owner)',
    phone: '0813-1122-3344',
    role: 'owner',
    createdAt: '2026-01-01T08:00:00Z',
  },
  staff: {
    id: 'staff-dika',
    email: 'dika.barista@kosfeeku.com',
    fullName: 'Andika Pratama (Head Barista & Ops)',
    phone: '0857-3344-5566',
    role: 'staff',
    createdAt: '2026-03-15T08:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kosfeeku_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS.tenant;
      }
    }
    // Default to tenant for easy test-driving
    return DEMO_USERS.tenant;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('kosfeeku_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kosfeeku_current_user');
    }
  }, [user]);

  const login = async (email: string, role: UserRole, name?: string): Promise<{ success: boolean; message?: string }> => {
    // If Supabase is connected, we can sign in via Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        // Mock fallback if user is testing with demo email or real credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'password123',
        });
        if (error && !email.includes('kosfeeku') && !email.includes('student')) {
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.warn('Supabase auth attempt handled:', err);
      }
    }

    const matchedDemo = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    const loggedUser: UserProfile = matchedDemo || {
      id: `usr-${Date.now()}`,
      email,
      fullName: name || (role === 'owner' ? 'Pemilik KosfeeKu' : 'Penghuni KosfeeKu'),
      phone: '0812-3456-7890',
      role,
      createdAt: new Date().toISOString(),
    };

    setUser(loggedUser);
    DatabaseService.logAudit(loggedUser.id, loggedUser.fullName, loggedUser.role, 'USER_LOGIN', 'Auth System', `Logged in via ${role} portal`);
    return { success: true };
  };

  const register = async (name: string, email: string, phone: string, _password: string): Promise<{ success: boolean; message?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signUp({
          email,
          password: _password,
          options: { data: { full_name: name, role: 'tenant' } },
        });
      } catch (err) {
        console.warn('Supabase register notice:', err);
      }
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: name,
      phone,
      role: 'tenant', // Public registration is strictly restricted to tenant
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    DatabaseService.logAudit(newUser.id, newUser.fullName, 'tenant', 'USER_REGISTER', 'Auth System', 'Registered new tenant account');
    return { success: true };
  };

  const logout = () => {
    if (user) {
      DatabaseService.logAudit(user.id, user.fullName, user.role, 'USER_LOGOUT', 'Auth System', 'User logged out');
    }
    setUser(null);
  };

  const switchDemoRole = (targetRole: UserRole | 'guest') => {
    if (targetRole === 'guest') {
      setUser(null);
    } else {
      const demo = DEMO_USERS[targetRole];
      if (demo) {
        setUser(demo);
        DatabaseService.logAudit(demo.id, demo.fullName, demo.role, 'ROLE_SWITCH', 'Demo Switcher', `Switched active session to ${targetRole}`);
      }
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'guest',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
