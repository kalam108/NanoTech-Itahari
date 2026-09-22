import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { useApp } from '../../context/AppContext';
import { Shield, Search, Copy, Check, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';

export function DualUrlPortalBar() {
  const { currentPath, navigate: rbacNavigate } = useRBAC();
  const { currentView, setCurrentView, filters, setFilters, addToast } = useApp();
  const [copiedUrl, setCopiedUrl] = useState<'admin' | 'search' | null>(null);
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const adminUrl = origin ? `${origin}/admin` : '/admin';
  const searchQueryParam = filters.searchQuery ? `?q=${encodeURIComponent(filters.searchQuery)}` : '';
  const searchUrl = origin ? `${origin}/search${searchQueryParam}` : `/search${searchQueryParam}`;

  const isAdminActive = currentPath.startsWith('/admin') || currentPath.startsWith('/superadmin') || currentView === 'admin_dashboard' || currentView === 'admin_login';
  const isSearchActive = currentPath === '/search' || (currentPath === '/' && (currentView === 'products' || !!filters.searchQuery));

  const copyToClipboard = (type: 'admin' | 'search', url: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(type);
      addToast('success', `${type === 'admin' ? 'Admin Portal' : 'User Search'} URL copied to clipboard!`);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  const handleGoToAdmin = () => {
    rbacNavigate('/admin');
  };

  const handleGoToSearch = () => {
    rbacNavigate('/search');
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs px-3 sm:px-6 lg:px-8 xl:px-10 py-1.5 transition-colors">
      <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Domain Indicator Badge */}
        <div className="flex items-center gap-2 shrink-0 text-slate-300 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Same Domain Routing
          </span>
          <span className="hidden sm:inline text-slate-400">
            Dedicated URL endpoints on <strong className="text-white font-mono">{origin ? new URL(origin).host : 'nanotech-itahari'}</strong>:
          </span>
        </div>

        {/* Right: The Two Distinct URLs (Admin URL & User Search URL) */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 w-full md:w-auto justify-end">
          
          {/* 1. USER SEARCH URL */}
          <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] border transition-all ${
            isSearchActive 
              ? 'bg-sky-500/20 text-sky-200 border-sky-400/50 shadow-xs' 
              : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
          }`}>
            <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-slate-400 font-medium">User Search:</span>
            <button
              onClick={handleGoToSearch}
              className="font-mono text-sky-300 hover:text-sky-100 hover:underline cursor-pointer font-medium"
              title="Navigate to /search"
            >
              /search
            </button>
            <button
              onClick={() => copyToClipboard('search', searchUrl)}
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy User Search Full URL"
            >
              {copiedUrl === 'search' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* 2. ADMIN PORTAL URL */}
          <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] border transition-all ${
            isAdminActive 
              ? 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-xs' 
              : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
          }`}>
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 font-medium">Admin:</span>
            <button
              onClick={handleGoToAdmin}
              className="font-mono text-amber-300 hover:text-amber-100 hover:underline cursor-pointer font-medium"
              title="Navigate to /admin"
            >
              /admin
            </button>
            <button
              onClick={() => copyToClipboard('admin', adminUrl)}
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy Admin Full URL"
            >
              {copiedUrl === 'admin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
