import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, RBACUser, AuditLog, SystemSettings, Permission } from '../types/rbac';
import { INITIAL_RBAC_USERS, INITIAL_AUDIT_LOGS, INITIAL_SYSTEM_SETTINGS } from '../data/rbacSeed';

interface RBACContextType {
  currentUser: RBACUser | null;
  role: Role | 'guest';
  isAuthenticated: boolean;
  token: string | null;
  currentPath: string;
  navigate: (path: string) => void;
  login: (email: string, password: string, requiredRole?: Role) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  quickLoginAs: (targetRole: Role) => Promise<void>;
  admins: RBACUser[];
  addAdmin: (adminData: { name: string; email: string; password: string; phone?: string; department?: string; permissions: Permission[] }) => Promise<{ success: boolean; error?: string }>;
  toggleAdminStatus: (adminId: string) => Promise<void>;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, target: string, details: string) => void;
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  hasPermission: (permission: Permission) => boolean;
  securityNotice: string | null;
  clearSecurityNotice: () => void;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Read initial path safely
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );

  const [currentUser, setCurrentUser] = useState<RBACUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [admins, setAdmins] = useState<RBACUser[]>(INITIAL_RBAC_USERS.filter((u) => u.role === 'admin'));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  // Sync with browser history and handle popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Restore stored session if exists
  useEffect(() => {
    const storedToken = localStorage.getItem('nanotech_session_token');
    const storedUser = localStorage.getItem('nanotech_user');

    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setToken(storedToken);
      } catch (err) {
        localStorage.removeItem('nanotech_session_token');
        localStorage.removeItem('nanotech_user');
      }
    }
  }, []);

  // Route Navigation Helper
  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearSecurityNotice = () => setSecurityNotice(null);

  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorName: currentUser ? (currentUser.role === 'superadmin' ? 'Kalam' : currentUser.name) : 'Anonymous Guest',
      actorEmail: currentUser ? currentUser.email : 'guest@client',
      actorRole: currentUser ? currentUser.role : 'customer',
      action,
      target,
      timestamp: new Date().toISOString(),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // ROUTE GUARD ENFORCEMENT
  // Runs whenever currentPath or currentUser changes
  useEffect(() => {
    const path = currentPath;

    // 1. SUPERADMIN ROUTES PROTECTION
    if (path.startsWith('/superadmin')) {
      if (path === '/superadmin/login') {
        // If already logged in as superadmin, go to dashboard
        if (currentUser && currentUser.role === 'superadmin') {
          navigate('/superadmin/dashboard');
        }
        return;
      }

      // If not logged in, redirect to superadmin login
      if (!currentUser) {
        setSecurityNotice('Authentication required. Please log in with Superadmin credentials.');
        navigate('/superadmin/login');
        return;
      }

      // If logged in as customer, STRICTLY FORBIDDEN!
      if (currentUser.role === 'customer') {
        addAuditLog('FORBIDDEN_SUPERADMIN_ACCESS', path, `Customer ${currentUser.email} blocked from accessing ${path}`);
        setSecurityNotice('Access Denied: Customer accounts are strictly prohibited from accessing the Superadmin console.');
        navigate('/customer/dashboard');
        return;
      }

      // If logged in as admin, STRICTLY FORBIDDEN!
      if (currentUser.role === 'admin') {
        addAuditLog('FORBIDDEN_SUPERADMIN_ACCESS', path, `Admin ${currentUser.email} blocked from accessing ${path}`);
        setSecurityNotice('Access Denied: Standard administrators cannot access the Superadmin console (Reserved for Kalam).');
        navigate('/admin/dashboard');
        return;
      }
    }

    // 2. ADMIN ROUTES PROTECTION
    if (path.startsWith('/admin')) {
      if (path === '/admin/login') {
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin')) {
          navigate(currentUser.role === 'superadmin' ? '/superadmin/dashboard' : '/admin/dashboard');
        }
        return;
      }

      // If not logged in, redirect to admin login
      if (!currentUser) {
        setSecurityNotice('Authentication required. Please log into the Admin portal.');
        navigate('/admin/login');
        return;
      }

      // If logged in as customer, STRICTLY FORBIDDEN!
      if (currentUser.role === 'customer') {
        addAuditLog('FORBIDDEN_ADMIN_ACCESS', path, `Customer ${currentUser.email} blocked from accessing ${path}`);
        setSecurityNotice('Access Denied: Customer accounts cannot access administrative routes.');
        navigate('/customer/dashboard');
        return;
      }
    }

    // 3. CUSTOMER PROTECTED ROUTES
    if (path.startsWith('/customer')) {
      const publicCustomerRoutes = ['/customer/login', '/customer/signup', '/customer/products'];
      if (publicCustomerRoutes.includes(path)) {
        if (currentUser && (path === '/customer/login' || path === '/customer/signup')) {
          navigate('/customer/dashboard');
        }
        return;
      }

      // Protected customer views (e.g. /customer/dashboard, /customer/cart, /customer/orders, /customer/profile)
      if (!currentUser) {
        setSecurityNotice('Please log in or sign up to access your customer dashboard.');
        navigate('/customer/login');
        return;
      }
    }
  }, [currentPath, currentUser]);

  const login = async (
    email: string,
    password: string,
    requiredRole?: Role
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // First attempt server-side login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requiredRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem('nanotech_session_token', data.token);
      localStorage.setItem('nanotech_user', JSON.stringify(data.user));

      addAuditLog('LOGIN_SUCCESS', '/api/auth/login', `Logged in as ${data.user.role} (${data.user.name})`);

      // Route to respective dashboard
      if (data.user.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }

      return { success: true };
    } catch (err) {
      // Fallback for offline seed verification
      const seedUser = INITIAL_RBAC_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!seedUser) {
        return { success: false, error: 'User not found' };
      }

      if (requiredRole && seedUser.role !== requiredRole && seedUser.role !== 'superadmin') {
        return { success: false, error: `Unauthorized: Account role is ${seedUser.role}` };
      }

      const simToken = `fallback_${seedUser.id}_${Date.now()}`;
      setCurrentUser(seedUser);
      setToken(simToken);
      localStorage.setItem('nanotech_session_token', simToken);
      localStorage.setItem('nanotech_user', JSON.stringify(seedUser));

      if (seedUser.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (seedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }

      return { success: true };
    }
  };

  const registerCustomer = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setCurrentUser(data.user);
      setToken(data.token);
      localStorage.setItem('nanotech_session_token', data.token);
      localStorage.setItem('nanotech_user', JSON.stringify(data.user));

      navigate('/customer/dashboard');
      return { success: true };
    } catch (err) {
      // Local fallback
      const newUser: RBACUser = {
        id: `user-customer-${Date.now()}`,
        name,
        email,
        role: 'customer',
        status: 'active',
        phone: phone || '',
        permissions: ['products.view'],
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      setToken(`fallback_${newUser.id}`);
      navigate('/customer/dashboard');
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      if (currentUser) {
        addAuditLog('LOGOUT', '/logout', `User ${currentUser.email} logged out`);
      }
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem('nanotech_session_token');
      localStorage.removeItem('nanotech_user');
      navigate('/');
    }
  };

  // Quick Switcher for testing and verifying roles
  const quickLoginAs = async (targetRole: Role) => {
    if (targetRole === 'superadmin') {
      await login('kalam@nanotech.com', 'Kalam@123');
    } else if (targetRole === 'admin') {
      await login('admin@nanotech.com', 'Admin@123');
    } else {
      await login('customer@nanotech.com', 'Customer@123');
    }
  };

  const addAdmin = async (adminData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    department?: string;
    permissions: Permission[];
  }): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'superadmin') {
      return { success: false, error: 'Only Kalam (Superadmin) can create administrators.' };
    }

    try {
      const response = await fetch('/api/superadmin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to create admin' };
      }

      setAdmins((prev) => [data.admin, ...prev]);
      addAuditLog('ADMIN_CREATED', adminData.email, `Superadmin created admin "${adminData.name}"`);
      return { success: true };
    } catch {
      // Local state fallback
      const newAdmin: RBACUser = {
        id: `user-admin-${Date.now()}`,
        name: adminData.name,
        email: adminData.email,
        role: 'admin',
        status: 'active',
        phone: adminData.phone || '',
        permissions: adminData.permissions,
        createdAt: new Date().toISOString(),
      };
      setAdmins((prev) => [newAdmin, ...prev]);
      addAuditLog('ADMIN_CREATED', adminData.email, `Superadmin created admin "${adminData.name}"`);
      return { success: true };
    }
  };

  const toggleAdminStatus = async (adminId: string) => {
    if (!currentUser || currentUser.role !== 'superadmin') return;

    try {
      await fetch(`/api/superadmin/admins/${adminId}/toggle-status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Fallback
    }

    setAdmins((prev) =>
      prev.map((adm) => {
        if (adm.id === adminId) {
          const nextStatus = adm.status === 'active' ? 'disabled' : 'active';
          addAuditLog('ADMIN_STATUS_CHANGED', adm.email, `Admin "${adm.name}" changed to ${nextStatus}`);
          return { ...adm, status: nextStatus };
        }
        return adm;
      })
    );
  };

  const updateSystemSettings = (updates: Partial<SystemSettings>) => {
    if (!currentUser || currentUser.role !== 'superadmin') return;
    setSystemSettings((prev) => ({ ...prev, ...updates }));
    addAuditLog('SYSTEM_SETTINGS_UPDATED', 'Global Configuration', 'Updated store/maintenance configuration');
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'superadmin') return true;
    return currentUser.permissions.includes(permission);
  };

  return (
    <RBACContext.Provider
      value={{
        currentUser,
        role: currentUser ? currentUser.role : 'guest',
        isAuthenticated: !!currentUser,
        token,
        currentPath,
        navigate,
        login,
        registerCustomer,
        logout,
        quickLoginAs,
        admins,
        addAdmin,
        toggleAdminStatus,
        auditLogs,
        addAuditLog,
        systemSettings,
        updateSystemSettings,
        hasPermission,
        securityNotice,
        clearSecurityNotice,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
