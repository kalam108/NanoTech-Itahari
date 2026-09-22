import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPER_ADMIN_EMAIL } from '../../lib/supabase';
import { sendEmailVerificationCode } from '../../lib/supabaseOtp';
import { AdminRole } from '../../types/admin';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building,
  Sparkles,
} from 'lucide-react';

interface AdminRegisterPageProps {
  onNavigate?: (view: string, params?: Record<string, string>) => void;
}

export function AdminRegisterPage({ onNavigate }: AdminRegisterPageProps) {
  const { setCurrentView, addToast } = useApp();

  const [name, setName] = useState('NanoTech Admin');
  const [email, setEmail] = useState(SUPER_ADMIN_EMAIL);
  const [adminRole, setAdminRole] = useState<AdminRole>('super_admin');
  const [securityPasscode, setSecurityPasscode] = useState('NANO-ADMIN-2026');
  const [password, setPassword] = useState('Admin@12345');
  const [confirmPassword, setConfirmPassword] = useState('Admin@12345');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = (viewName: string) => {
    if (onNavigate) {
      onNavigate(viewName, { email });
    } else {
      setCurrentView(viewName);
    }
  };

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid administrator email.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Admin password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Security passcode validation (Admin Invitation Protection)
    const isSuperAdminEmail = email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    if (!isSuperAdminEmail && securityPasscode.trim().toUpperCase() !== 'NANO-ADMIN-2026') {
      setErrorMessage('Invalid Admin Security Passcode. Administrator invitation code is required.');
      return;
    }

    setIsLoading(true);

    try {
      // Dispatch 6-digit admin verification code
      const otpRes = await sendEmailVerificationCode(
        email.trim(),
        'admin',
        'admin_register',
        { name: name.trim(), adminPasscode: securityPasscode }
      );

      // Save pending admin state
      localStorage.setItem(
        'nanotech_pending_admin_reg',
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          adminRole,
          password,
        })
      );
      localStorage.setItem('nanotech_verify_admin_email', email.trim());

      addToast('success', `Admin authorization code (${otpRes.code}) dispatched to ${email}!`);
      navigate('admin_verify_email');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to dispatch admin verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] admin-glossy-bg flex items-center justify-center p-4 sm:p-6 py-12 relative">
      <div className="w-full max-w-lg">
        {/* Step Progress Breadcrumb */}
        <div className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20">
            <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] flex items-center justify-center font-black">1</span>
            Admin Authorization
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400">
            2. Verify OTP
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400">
            3. Admin Console
          </span>
        </div>

        <div className="glass-panel border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-slate-200 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 mx-auto mb-3 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal Registration</h1>
            <p className="text-xs text-slate-400 mt-1">
              Elevated access for shop management, inventory oversight, and financial records.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Administrator Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Tech Admin"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-amber-400 font-medium transition-all"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-amber-400 font-medium transition-all"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Role Designation</label>
                <select
                  value={adminRole}
                  onChange={e => setAdminRole(e.target.value as AdminRole)}
                  className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl px-3 py-3 focus:outline-none focus:border-amber-400"
                >
                  <option value="super_admin">Super Admin (Full Access)</option>
                  <option value="store_admin">Store Admin</option>
                  <option value="inventory_manager">Inventory Manager</option>
                  <option value="support_admin">Support Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1.5">Security Passcode</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="NANO-ADMIN-2026"
                    value={securityPasscode}
                    onChange={e => setSecurityPasscode(e.target.value)}
                    className="w-full bg-[#080d18] border border-amber-500/40 text-xs text-amber-300 font-mono font-bold rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-amber-400 uppercase"
                  />
                  <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Admin Code...</span>
                </>
              ) : (
                <>
                  <span>Send Admin Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Already an authorized admin?</span>
            <button
              type="button"
              onClick={() => navigate('admin_login')}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline"
            >
              Admin Sign In →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
