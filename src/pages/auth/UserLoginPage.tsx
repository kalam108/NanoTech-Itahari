import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NanoTechLogo } from '../../components/brand/NanoTechLogo';
import { UserRole } from '../../types';
import { SUPER_ADMIN_EMAIL, signInWithGoogleOAuth } from '../../lib/supabase';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Cpu,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
  Store,
} from 'lucide-react';

interface UserLoginPageProps {
  onNavigate?: (view: string, params?: Record<string, string>) => void;
}

// Google SVG
function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function UserLoginPage({ onNavigate }: UserLoginPageProps) {
  const { setCurrentView, loginUser, addToast } = useApp();

  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('Password@123');
  const [role, setRole] = useState<UserRole>('customer');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = (viewName: string) => {
    if (onNavigate) {
      onNavigate(viewName, { email });
    } else {
      setCurrentView(viewName);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const isSuperAdmin = email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      const effectiveRole = isSuperAdmin ? 'admin' : role;
      const success = await loginUser(email.trim(), effectiveRole, password);

      if (success) {
        if (isSuperAdmin) {
          navigate('admin_dashboard');
        } else if (effectiveRole === 'seller') {
          navigate('seller_dashboard');
        } else {
          navigate('user_dashboard');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      addToast('info', 'Connecting to Google OAuth via Supabase...');
      await signInWithGoogleOAuth();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google OAuth failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md">
        <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 text-slate-200 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <NanoTechLogo size="lg" variant="emblem" glow={true} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to your NanoTech Computer Shop customer or seller account.
            </p>
          </div>

          {/* Quick Perspective Role Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-[#080d18] p-1.5 rounded-2xl border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => {
                setRole('customer');
                setEmail('alex.rivera@example.com');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'customer'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('seller');
                setEmail('seller@nanotech.com');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'seller'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Seller
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google One-Click Auth */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 mb-4"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Or email password
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-400 font-medium transition-all"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => addToast('info', `Password reset instructions dispatched to ${email}`)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-400 font-mono transition-all"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm py-3.5 rounded-2xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links: Register & Verify OTP */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>New to NanoTech?</span>
            <button
              type="button"
              onClick={() => navigate('user_register')}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
            >
              Create Account →
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => navigate('user_verify_email')}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline text-[11px]"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Have a 6-digit verification code?</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('admin_login')}
              className="text-purple-300 hover:text-purple-200 text-[11px] hover:underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
