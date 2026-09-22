import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NanoTechLogo } from '../../components/brand/NanoTechLogo';
import { UserRole } from '../../types';
import { SUPER_ADMIN_EMAIL, signUpWithSupabase } from '../../lib/supabase';
import { sendEmailVerificationCode } from '../../lib/supabaseOtp';
import {
  User,
  Mail,
  Lock,
  Phone,
  Store,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

interface UserRegisterPageProps {
  onNavigate?: (view: string, params?: Record<string, string>) => void;
}

export function UserRegisterPage({ onNavigate }: UserRegisterPageProps) {
  const { setCurrentView, addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [storeName, setStoreName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = (viewName: string) => {
    if (onNavigate) {
      onNavigate(viewName, { email });
    } else {
      setCurrentView(viewName);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please check and try again.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Attempt Supabase Auth signup
      try {
        await signUpWithSupabase(email.trim(), password, {
          fullName: name.trim(),
          role,
          phone: phone.trim(),
          storeName: storeName.trim(),
        });
      } catch (sbErr: any) {
        console.warn('Supabase auth notice:', sbErr?.message);
      }

      // 2. Generate and dispatch 6-digit verification code with 10-minute expiry
      const otpRes = await sendEmailVerificationCode(
        email.trim(),
        role,
        'signup',
        { name: name.trim(), phone: phone.trim() }
      );

      // Save pending registration metadata to localStorage for completion after OTP
      localStorage.setItem(
        'nanotech_pending_registration',
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          password,
          storeName: storeName.trim(),
        })
      );

      // Save latest registered email for the verify screen
      localStorage.setItem('nanotech_verify_email', email.trim());

      addToast('success', `Verification code (${otpRes.code}) sent to ${email.trim()}!`);
      
      // Navigate to /user/verify-email
      navigate('user_verify_email');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-lg">
        {/* Step Progress Breadcrumb */}
        <div className="mb-6 flex items-center justify-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20">
            <span className="w-4 h-4 rounded-full bg-slate-950 text-cyan-400 text-[10px] flex items-center justify-center font-black">1</span>
            Register
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400">
            2. Verify Code
          </span>
          <span className="text-slate-600">→</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400">
            3. Shop & Dashboard
          </span>
        </div>

        {/* Main Card */}
        <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 text-slate-200 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <NanoTechLogo size="lg" variant="emblem" glow={true} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Create Your Account</h1>
            <p className="text-xs text-slate-400 mt-1">
              Join NanoTech Computer Shop. We'll send a 6-digit verification code to confirm your email.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-[#080d18] p-1.5 rounded-2xl border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'customer'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Customer / Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'seller'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Hardware Seller
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-400 font-medium transition-all"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

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

            {role === 'seller' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Hardware Store Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Custom Rig Studio"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-400 font-medium transition-all"
                  />
                  <Store className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+977 9801234567 or +1 (555) 019-2834"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-400 font-medium transition-all"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
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
                    className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-400 font-mono transition-all"
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
                    className="w-full bg-[#080d18] border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-400 font-mono transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
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
                  <span>Sending 6-Digit Code...</span>
                </>
              ) : (
                <>
                  <span>Send 6-Digit Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links & Switch to Login */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate('user_login')}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
            >
              Sign In to Account →
            </button>
          </div>

          {/* Admin invitation link */}
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => navigate('admin_register')}
              className="text-[11px] text-purple-300 hover:text-purple-200 flex items-center justify-center gap-1 mx-auto hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Are you a shop administrator? Go to Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
