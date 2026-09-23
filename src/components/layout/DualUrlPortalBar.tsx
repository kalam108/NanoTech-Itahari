import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Store, Shield, Crown } from 'lucide-react';

export function DualUrlPortalBar() {
  const { currentPath, navigate: rbacNavigate } = useRBAC();
  const { setCurrentView, addToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<'store' | 'admin' | 'superadmin' | null>(null);
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const cleanPath = currentPath.split('?')[0];

  const isStoreActive = cleanPath === '/' || cleanPath === '' || cleanPath.startsWith('/products') || cleanPath.startsWith('/search');
  const isAdminActive = cleanPath.startsWith('/adminpanel') || cleanPath.startsWith('/admin');
  const isSuperadminActive = cleanPath.startsWith('/kalam-infos') || cleanPath.startsWith('/superadmin');

  const copyToClipboard = (key: 'store' | 'admin' | 'superadmin', path: string, label: string) => {
    const fullUrl = origin ? `${origin}${path}` : path;
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedKey(key);
      addToast('success', `${label} URL (${fullUrl}) copied!`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleNavigateToStore = () => {
    setCurrentView('home');
    rbacNavigate('/');
  };

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white text-xs px-3 sm:px-6 lg:px-8 py-2 sticky top-0 z-40 shadow-md">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Domain Indicator Badge */}
        <div className="flex items-center flex-wrap gap-2 shrink-0 text-slate-300 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            3-Tier Architecture
          </span>
          <span className="hidden sm:inline text-slate-400 font-medium">
            Active Host: <strong className="text-white font-mono">{origin ? new URL(origin).host : 'nanotech-itahari.vercel.app'}</strong>
          </span>
        </div>

        {/* Right: The 3 Designated URLs (STORE, ADMIN, SUPERADMIN) */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 w-full md:w-auto justify-center md:justify-end">

          {/* 1. STORE / USER URL (/) */}
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] border transition-all ${
              isStoreActive && !isAdminActive && !isSuperadminActive
                ? 'bg-sky-500/25 text-sky-200 border-sky-400/60 shadow-xs shadow-sky-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Store:</span>
            <button
              onClick={handleNavigateToStore}
              className="font-mono text-sky-300 hover:text-white hover:underline cursor-pointer font-bold"
              title="Navigate to Storefront (/)"
            >
              /
            </button>
            <button
              onClick={() => copyToClipboard('store', '/', 'Storefront')}
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy Store URL"
            >
              {copiedKey === 'store' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* 2. ADMIN PANEL URL (/adminpanel) */}
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] border transition-all ${
              isAdminActive
                ? 'bg-purple-500/25 text-purple-200 border-purple-400/60 shadow-xs shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Admin:</span>
            <button
              onClick={() => rbacNavigate('/adminpanel')}
              className="font-mono text-purple-300 hover:text-white hover:underline cursor-pointer font-bold"
              title="Navigate to /adminpanel (Dashboard, Hardware, Orders, CMS)"
            >
              /adminpanel
            </button>
            <button
              onClick={() => copyToClipboard('admin', '/adminpanel', 'Admin Panel')}
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy Admin Panel URL"
            >
              {copiedKey === 'admin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* 3. SUPERADMIN URL (/kalam-infos) */}
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] border transition-all ${
              isSuperadminActive
                ? 'bg-amber-500/25 text-amber-200 border-amber-400/60 shadow-xs shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Superadmin:</span>
            <button
              onClick={() => rbacNavigate('/kalam-infos')}
              className="font-mono text-amber-300 hover:text-white hover:underline cursor-pointer font-bold"
              title="Navigate to /kalam-infos (Full Root Authority, Admin Creation, Permissions, Audit)"
            >
              /kalam-infos
            </button>
            <button
              onClick={() => copyToClipboard('superadmin', '/kalam-infos', 'Superadmin Kalam Console')}
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy Superadmin URL"
            >
              {copiedKey === 'superadmin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
export default DualUrlPortalBar;
