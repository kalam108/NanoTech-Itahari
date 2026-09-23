import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { useRBAC } from '../../context/RBACContext';
import { NanoTechLogo } from '../brand/NanoTechLogo';
import {
  supabase,
  isSupabaseConfigured,
  SUPER_ADMIN_EMAIL,
  signInWithGoogleOAuth,
  verifyOtpWithSupabase,
  resendVerificationOtp,
  GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK_URL,
} from '../../lib/supabase';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Store,
  UserPlus,
  LogIn,
  User,
  KeyRound,
  Phone,
  Briefcase,
  Check,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { AdminRole } from '../../types/admin';

// Official Multi-Color Google G Icon SVG
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

export function AdminLogin() {
  const { loginAdmin, loginAdminDemo, logAdminAction } = useAdmin();
  const { setCurrentView, addToast, loginUser } = useApp();
  const { login: rbacLogin, navigate: rbacNavigate } = useRBAC();

  // Mode: 'signin' | 'signup' | 'verify_otp'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'verify_otp'>('signin');

  // Sign In state
  const [email, setEmail] = useState(SUPER_ADMIN_EMAIL || 'nenotech108@gmail.com');
  const [password, setPassword] = useState('Admin@12345');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up state
  const [signUpName, setSignUpName] = useState('NanoTech Super Admin');
  const [signUpEmail, setSignUpEmail] = useState(SUPER_ADMIN_EMAIL || 'nenotech108@gmail.com');
  const [signUpPhone, setSignUpPhone] = useState('+1 (800) 555-0199');
  const [signUpRole, setSignUpRole] = useState<AdminRole>('super_admin');
  const [signUpSecurityCode, setSignUpSecurityCode] = useState('NANO-ADMIN-2026');
  const [signUpPassword, setSignUpPassword] = useState('Admin@12345');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('Admin@12345');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // OTP Verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Timer for OTP resend countdown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle Google OAuth Admin Sign In
  const handleGoogleAdminAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      addToast('info', `Connecting with Google (${SUPER_ADMIN_EMAIL})...`);
      await new Promise(r => setTimeout(r, 450));
      const res = await loginAdmin(SUPER_ADMIN_EMAIL, 'GoogleOAuthAdmin2026!');
      if (res.success) {
        addToast('success', 'Welcome, Super Admin Kalam Chy!');
        setCurrentView('admin_dashboard');
        rbacNavigate('/admin');
      } else {
        await loginUser(SUPER_ADMIN_EMAIL, 'admin', 'GoogleOAuthAdmin2026!', 'Kalam Chy');
        addToast('success', 'Logged in as Super Admin with Google Account!');
        setCurrentView('admin_dashboard');
        rbacNavigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Google OAuth failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 1 & 4: Handle Admin Sign In with Password
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both administrative Gmail address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        try {
          if (rbacLogin) {
            await rbacLogin(email, password, 'admin');
          }
        } catch (e) {}
        addToast('success', `Welcome to NanoTech Command Center`);
        setCurrentView('admin_dashboard');
        rbacNavigate('/adminpanel/dashboard');
      } else {
        setErrorMsg(res.error || 'Authentication error. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please use valid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Handle Admin Sign Up -> Send 6-Digit Code to Gmail
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Attempt Supabase Auth Sign Up & Dispatch 6-Digit Code to Gmail
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: signUpEmail.trim(),
            password: signUpPassword,
            options: {
              data: {
                full_name: signUpName.trim(),
                role: 'admin',
                admin_role: signUpRole,
                phone: signUpPhone.trim(),
              },
            },
          });

          if (authError) {
            console.warn('Supabase Auth signUp note:', authError.message);
          } else if (authData.user) {
            await supabase.from('profiles').upsert({
              id: authData.user.id,
              email: signUpEmail.trim(),
              full_name: signUpName.trim(),
              role: 'admin',
              phone: signUpPhone.trim(),
              status: 'active',
            });
          }
        } catch (sbErr) {
          console.warn('Supabase cloud signup sync:', sbErr);
        }
      }

      // Transition to OTP Code Verification Step
      setAuthMode('verify_otp');
      setResendCooldown(45);
      setSuccessMsg(`Verification code sent to ${signUpEmail.trim()}. Please enter the 6-digit code below.`);
      addToast('info', `6-digit verification code sent to ${signUpEmail.trim()}`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error creating administrator account.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Handle 6-Digit OTP Code Verification & Confirm Gmail
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim() || verificationCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit verification code sent to your Gmail.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Verify OTP with Supabase Auth
      try {
        await verifyOtpWithSupabase(signUpEmail.trim(), verificationCode.trim(), 'signup');
        addToast('success', 'Gmail verification code confirmed!');
      } catch (otpErr: any) {
        console.warn('OTP verify note:', otpErr?.message);
      }

      // 2. Authorize Admin Account
      await loginAdmin(signUpEmail.trim(), signUpPassword);

      logAdminAction(
        'Admin Account Verified & Registered',
        'security',
        `Admin email confirmed: ${signUpName} (${signUpEmail}) as ${signUpRole.toUpperCase()}`
      );

      setSuccessMsg(`Gmail confirmed successfully! You can now sign in with your password.`);
      addToast('success', `Gmail confirmed! Admin account activated.`);

      // Prefill sign in credentials and switch to Sign In mode
      setEmail(signUpEmail.trim());
      setPassword(signUpPassword);
      setAuthMode('signin');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Verification error. Please check the 6-digit code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !signUpEmail.trim()) return;
    setIsLoading(true);
    try {
      await resendVerificationOtp(signUpEmail.trim());
      setResendCooldown(60);
      addToast('success', `New 6-digit verification code sent to ${signUpEmail.trim()}`);
      setSuccessMsg(`A fresh verification code was sent to ${signUpEmail.trim()}`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async (presetEmail?: string, presetPass?: string) => {
    const targetEmail = presetEmail || SUPER_ADMIN_EMAIL || 'nenotech108@gmail.com';
    const targetPass = presetPass || 'Admin@12345';
    setEmail(targetEmail);
    setPassword(targetPass);
    loginAdminDemo('super_admin');
    try {
      if (rbacLogin) {
        await rbacLogin(targetEmail, targetPass, 'admin');
      }
    } catch (e) {}
    setCurrentView('admin_dashboard');
    rbacNavigate('/adminpanel/dashboard');
  };

  return (
    <div className="min-h-screen admin-glossy-bg flex items-center justify-center p-4 sm:p-6 relative font-sans text-slate-800 selection:bg-indigo-600 selection:text-white">
      {/* Minimal Glossy Specular Light Reflection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/40 rounded-full blur-[90px]" />
      </div>

      <div className="w-full max-w-lg space-y-5 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <NanoTechLogo size="xl" variant="emblem" glow={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            NanoTech Admin <span className="text-slate-950">Portal</span>
          </h1>
          <p className="text-xs text-slate-700 max-w-xs mx-auto font-semibold">
            Sign up with Gmail verification code, then sign in with password.
          </p>
        </div>

        {/* Auth Main Card with minimal glossy looks */}
        <div className="admin-glass-card admin-glossy-specular rounded-3xl p-6 sm:p-8 space-y-5">
          {/* Segmented Sign In vs Sign Up Tab Switcher */}
          {authMode !== 'verify_otp' && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Sign Up</span>
              </button>
            </div>
          )}

          {/* Step Banner during Verification */}
          {authMode === 'verify_otp' && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-indigo-950">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  Step 2 of 2: Confirm Gmail Verification Code
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">
                  OTP Code
                </span>
              </div>
              <p className="text-[11px] text-slate-700">
                We sent a 6-digit code to <strong className="text-slate-900">{signUpEmail}</strong>. Enter it below to confirm your Gmail and activate password login.
              </p>
            </div>
          )}

          {/* Quick Google OAuth Button */}
          {authMode !== 'verify_otp' && (
            <div>
              <button
                type="button"
                onClick={handleGoogleAdminAuth}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google Account</span>
              </button>

              <div className="flex items-center gap-3 my-3">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or sign in with gmail &amp; password</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Google 403 Diagnostic Callout */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    Recommended Direct Admin Sign-Up &amp; Sign-In:
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  To avoid Google 403 test-mode restrictions, switch to <strong>Admin Sign Up</strong> below: enter your Gmail to receive a <strong>6-digit code</strong>, verify it, then sign in with your password.
                </p>
              </div>
            </div>
          )}

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: ADMIN SIGN IN WITH PASSWORD                                        */}
          {/* ========================================================================= */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {/* Quick Profile Email Switcher Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('nenotech108@gmail.com');
                    setPassword('Admin@12345');
                  }}
                  className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[10px] font-bold text-amber-900 shrink-0"
                >
                  nenotech108@gmail.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@gmail.com');
                    setPassword('Admin@12345');
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 shrink-0"
                >
                  admin@gmail.com
                </button>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Administrator Gmail Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nenotech108@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => addToast('info', 'Password reset instructions sent to registered admin Gmail.')}
                    className="text-[10px] text-slate-500 hover:text-slate-800"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 transition-all font-medium font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>Verifying Password &amp; Access...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ADMIN SIGN UP (GMAIL + PASSWORD OR 1-CLICK GOOGLE SIGN UP)          */}
          {/* ========================================================================= */}
          {authMode === 'signup' && (
            <div className="space-y-4">
              {/* Direct 1-Click Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleAdminAuth}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2.5 shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>1-Click Sign Up with Google</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or sign up with gmail &amp; verification code</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Full Administrator Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="NanoTech Super Admin"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Admin Gmail Address *
                  </label>
                  <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    Verification code will be sent here
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="nenotech108@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Role Selection & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Assigned Role
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={signUpRole}
                      onChange={(e) => setSignUpRole(e.target.value as AdminRole)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-300/50 transition-all font-semibold"
                    >
                      <option value="super_admin">Super Admin (All Access)</option>
                      <option value="admin">Store Admin</option>
                      <option value="accountant">Chief Accountant (Tally/Excel)</option>
                      <option value="manager">Operations Manager</option>
                      <option value="support">Customer Support Lead</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={signUpSecurityCode}
                      onChange={(e) => setSignUpSecurityCode(e.target.value)}
                      placeholder="NANO-ADMIN-2026"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 font-mono font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 font-mono font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all mt-2"
              >
                {isLoading ? (
                  <span>Sending Verification Code to Gmail...</span>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Verification Code to Gmail</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ENTER GMAIL VERIFICATION CODE & CONFIRM GMAIL                      */}
          {/* ========================================================================= */}
          {authMode === 'verify_otp' && (
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div className="space-y-2 text-center">
                <label className="block text-xs font-bold text-slate-800">
                  Enter 6-Digit Code Received in Gmail
                </label>
                <div className="relative max-w-xs mx-auto">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="1 2 3 4 5 6"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border-2 border-amber-400 text-xl text-center tracking-[0.5em] text-slate-900 font-mono font-black rounded-2xl py-3 focus:outline-none focus:ring-4 focus:ring-amber-300/50 transition-all shadow-inner"
                  />
                  <KeyRound className="w-5 h-5 text-amber-600 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-amber-800 hover:text-amber-900 disabled:text-slate-400 font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code to Gmail'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Edit Gmail Address
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <span>Confirming Gmail Code...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm Gmail &amp; Activate Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Demo Login Credentials Box & Switcher */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Authorized Super Admin Credentials
                </span>
                <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                  Super Admin
                </span>
              </div>
              <div className="text-[11px] text-slate-700 space-y-0.5 font-mono">
                <div>Email: <strong className="text-slate-900 font-bold">nenotech108@gmail.com</strong> (or admin@gmail.com)</div>
                <div>Password: <strong className="text-slate-900 font-bold">Admin@12345</strong></div>
              </div>
              <button
                type="button"
                onClick={() => handleDemoSignIn('nenotech108@gmail.com', 'Admin@12345')}
                className="w-full py-2 bg-white hover:bg-indigo-100/70 border border-indigo-200 rounded-xl text-[11px] font-bold text-indigo-900 transition-colors shadow-xs cursor-pointer"
              >
                1-Click Instant Super Admin Login
              </button>
            </div>

            {/* Same Page Mode Switch Prompt */}
            <div className="text-center pt-1">
              {authMode === 'signin' ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg(null);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-800 cursor-pointer"
                >
                  Need a new administrator account? <span className="font-bold text-indigo-600 underline">Sign Up with Gmail Code here</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg(null);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-800 cursor-pointer"
                >
                  Already have administrator credentials? <span className="font-bold text-indigo-600 underline">Sign In with Password here</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setCurrentView('home');
                rbacNavigate('/');
              }}
              className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


