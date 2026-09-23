import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { Role } from '../../types/rbac';
import { Shield, Lock, User, Key, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const UnifiedLoginPage: React.FC<{ initialRole?: Role }> = ({ initialRole = 'customer' }) => {
  const { login, navigate, quickLoginAs } = useRBAC();
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'superadmin') {
      setEmail('kalam@nanotech.com');
      setPassword('Kalam@123');
    } else if (role === 'admin') {
      setEmail('nenotech108@gmail.com');
      setPassword('Admin@12345');
    } else {
      setEmail('customer@nanotech.com');
      setPassword('Customer@123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await login(email, password, selectedRole);
    setLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="max-w-md w-full space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-inner">
            {selectedRole === 'superadmin' ? (
              <Lock className="w-7 h-7 text-amber-400" />
            ) : selectedRole === 'admin' ? (
              <Shield className="w-7 h-7 text-purple-400" />
            ) : (
              <User className="w-7 h-7 text-blue-400" />
            )}
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {selectedRole === 'superadmin'
              ? 'Superadmin Access Control'
              : selectedRole === 'admin'
              ? 'NanoTech Staff & Admin Portal'
              : 'Customer Account Login'}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {selectedRole === 'superadmin'
              ? 'Master administrator console reserved for Kalam.'
              : selectedRole === 'admin'
              ? 'Sign in to manage catalog, orders, and fulfillment.'
              : 'Sign in to access your dashboard, orders, and cart.'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleSelect('customer')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
              selectedRole === 'customer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
              selectedRole === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('superadmin')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1 ${
              selectedRole === 'superadmin'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Superadmin
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-950/70 border border-red-800 text-red-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                selectedRole === 'superadmin'
                  ? 'kalam@nanotech.com'
                  : selectedRole === 'admin'
                  ? 'admin@nanotech.com'
                  : 'customer@nanotech.com'
              }
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg ${
              selectedRole === 'superadmin'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : selectedRole === 'admin'
                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* One-Click Quick Fill Button */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 mb-2 font-medium flex items-center justify-between">
            <span>Instant Demo Credentials:</span>
            <span className="text-cyan-400 text-[10px]">Click to auto-login</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => quickLoginAs('superadmin')}
              className="text-left text-xs bg-slate-950/80 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500/60 p-2.5 rounded-lg flex items-center justify-between group transition"
            >
              <div>
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Kalam — Superadmin
                </div>
                <div className="text-slate-400 text-[11px]">kalamchy88@gmail.com / kalam@nanotech.com (Kalam@123)</div>
              </div>
              <span className="text-amber-400 text-xs opacity-0 group-hover:opacity-100 transition">Enter →</span>
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('admin')}
              className="text-left text-xs bg-slate-950/80 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-500/60 p-2.5 rounded-lg flex items-center justify-between group transition"
            >
              <div>
                <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-purple-400" />
                  NENOTECH108 (Admin Dashboard)
                </div>
                <div className="text-slate-400 text-[11px]">nenotech108@gmail.com / Admin@12345</div>
              </div>
              <span className="text-purple-400 text-xs opacity-0 group-hover:opacity-100 transition">Enter →</span>
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('customer')}
              className="text-left text-xs bg-slate-950/80 hover:bg-slate-800 border border-blue-500/30 hover:border-blue-500/60 p-2.5 rounded-lg flex items-center justify-between group transition"
            >
              <div>
                <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-blue-400" />
                  Sita Sharma (Customer)
                </div>
                <div className="text-slate-400 text-[11px]">customer@nanotech.com / Customer@123</div>
              </div>
              <span className="text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition">Enter →</span>
            </button>
          </div>
        </div>

        {/* Customer Signup Link */}
        {selectedRole === 'customer' && (
          <div className="text-center text-xs text-slate-400 pt-2">
            Don't have an account yet?{' '}
            <button
              onClick={() => navigate('/customer/signup')}
              className="text-cyan-400 hover:underline font-semibold"
            >
              Create customer account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
