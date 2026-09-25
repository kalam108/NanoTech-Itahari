import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { useApp } from '../../context/AppContext';
import { Search, Shield, Crown, Copy, Check, ExternalLink, X, ChevronRight } from 'lucide-react';

interface SameDomainPortalBarProps {
  className?: string;
  variant?: 'banner' | 'card' | 'compact';
}

export function SameDomainPortalBar({ className = '', variant = 'card' }: SameDomainPortalBarProps) {
  const { currentPath, navigate: rbacNavigate } = useRBAC();
  const { filters, addToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<'user' | 'admin' | 'superadmin' | null>(null);
  const [host, setHost] = useState<string>('nanotech-itahari.vercel.app');
  const [origin, setOrigin] = useState<string>('https://nanotech-itahari.vercel.app');
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.host) setHost(window.location.host);
      if (window.location.origin) setOrigin(window.location.origin);
    }
  }, []);

  if (isDismissed) {
    return (
      <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 ${className}`}>
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Multi-Search URLs & Portal Switcher (Hidden)
        </span>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline flex items-center gap-1"
        >
          Show Bar <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    );
  }

  const queryParam = filters?.searchQuery ? `?q=${encodeURIComponent(filters.searchQuery)}` : '';
  const userSearchUrl = `${origin}/search${queryParam}`;
  const adminSearchUrl = `${origin}/admin/search${queryParam}`;
  const superadminSearchUrl = `${origin}/superadmin/search${queryParam}`;

  const cleanPath = currentPath.split('?')[0];
  const isUserSearchActive = cleanPath === '/search' || cleanPath === '/store/search';
  const isAdminSearchActive = cleanPath === '/admin/search' || cleanPath === '/adminpanel/search';
  const isSuperadminSearchActive = cleanPath === '/superadmin/search' || cleanPath === '/kalam-infos/search';

  const copyToClipboard = (key: 'user' | 'admin' | 'superadmin', url: string, label: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedKey(key);
      addToast('success', `${label} URL copied: ${url}`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  return (
    <div
      className={`bg-slate-950/95 backdrop-blur-md border border-slate-800/90 text-white rounded-2xl p-2.5 sm:px-4 sm:py-2.5 shadow-xl shadow-slate-950/40 relative z-20 ${className}`}
    >
      <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Left: Domain Indicator Badge */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0 text-slate-300 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Same Domain Multi-Search
          </span>
          <span className="text-slate-400 font-medium">
            Active Host: <strong className="text-white font-mono">{host}</strong>
          </span>
        </div>

        {/* Right: The 3 Dedicated Search URLs + Portal Switcher */}
        <div className="flex items-center flex-wrap gap-2 w-full xl:w-auto justify-center xl:justify-end">
          {/* 1. USER SEARCH URL */}
          <div
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] border transition-all ${
              isUserSearchActive
                ? 'bg-sky-500/25 text-sky-200 border-sky-400/60 shadow-xs shadow-sky-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-medium">User:</span>
            <button
              onClick={() => rbacNavigate('/search' + queryParam)}
              className="font-mono text-sky-300 hover:text-sky-100 hover:underline cursor-pointer font-bold"
              title="Navigate to User Search (/search)"
            >
              /search
            </button>
            <button
              onClick={() => copyToClipboard('user', userSearchUrl, 'User Search')}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy /search URL"
            >
              {copiedKey === 'user' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* 2. ADMIN SEARCH URL */}
          <div
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] border transition-all ${
              isAdminSearchActive
                ? 'bg-purple-500/25 text-purple-200 border-purple-400/60 shadow-xs shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="text-slate-400 font-medium">Admin:</span>
            <button
              onClick={() => rbacNavigate('/admin/search' + queryParam)}
              className="font-mono text-purple-300 hover:text-purple-100 hover:underline cursor-pointer font-bold"
              title="Navigate to Admin Search (/admin/search)"
            >
              /admin/search
            </button>
            <button
              onClick={() => copyToClipboard('admin', adminSearchUrl, 'Admin Search')}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy /admin/search URL"
            >
              {copiedKey === 'admin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* 3. SUPERADMIN SEARCH URL */}
          <div
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] border transition-all ${
              isSuperadminSearchActive
                ? 'bg-amber-500/25 text-amber-200 border-amber-400/60 shadow-xs shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 font-medium">Superadmin:</span>
            <button
              onClick={() => rbacNavigate('/superadmin/search' + queryParam)}
              className="font-mono text-amber-300 hover:text-amber-100 hover:underline cursor-pointer font-bold"
              title="Navigate to Superadmin Search (/superadmin/search)"
            >
              /superadmin/search
            </button>
            <button
              onClick={() => copyToClipboard('superadmin', superadminSearchUrl, 'Superadmin Search')}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy /superadmin/search URL"
            >
              {copiedKey === 'superadmin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Cross-Portal Switcher Links */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2 text-[11px]">
            <button
              onClick={() => rbacNavigate('/store')}
              className={`px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ${
                cleanPath === '/' || cleanPath === '/store' ? 'text-white font-bold bg-slate-800' : ''
              }`}
              title="Switch to Public Storefront"
            >
              Store
            </button>
            <button
              onClick={() => rbacNavigate('/admin/dashboard')}
              className={`px-2.5 py-1 rounded-lg hover:bg-slate-800 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer ${
                cleanPath.startsWith('/admin') ? 'bg-purple-950/60 text-purple-200 font-bold border border-purple-800/40' : ''
              }`}
              title="Switch to Admin Portal"
            >
              Admin Portal
            </button>
            <button
              onClick={() => rbacNavigate('/superadmin/dashboard')}
              className={`px-2.5 py-1 rounded-lg hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer ${
                cleanPath.startsWith('/superadmin') || cleanPath.startsWith('/kalam-infos')
                  ? 'bg-amber-950/60 text-amber-200 font-bold border border-amber-800/40'
                  : ''
              }`}
              title="Switch to Superadmin Console"
            >
              Superadmin Console
            </button>
          </div>

          {/* Close/Minimize Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors ml-1 cursor-pointer"
            title="Minimize Bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SameDomainPortalBar;
