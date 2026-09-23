import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../context/RBACContext';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Crown } from 'lucide-react';

export function DualUrlPortalBar() {
  const { currentPath, navigate: rbacNavigate } = useRBAC();
  const { filters, addToast } = useApp();
  const [copiedUrl, setCopiedUrl] = useState<'superadmin' | null>(null);
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  // Extract query if exists from current URL
  const queryParam = filters?.searchQuery ? `?q=${encodeURIComponent(filters.searchQuery)}` : '';

  const superadminSearchUrl = origin ? `${origin}/superadmin/search${queryParam}` : `/superadmin/search${queryParam}`;

  const cleanPath = currentPath.split('?')[0];
  const isSuperadminSearchActive = cleanPath === '/superadmin/search';

  const copyToClipboard = (url: string, label: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl('superadmin');
      addToast('success', `${label} full URL copied!`);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white text-xs px-3 sm:px-6 lg:px-8 py-2 sticky top-0 z-40 shadow-md">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Domain Indicator Badge */}
        <div className="flex items-center flex-wrap gap-2 shrink-0 text-slate-300 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Same Domain Portal
          </span>
          <span className="hidden sm:inline text-slate-400 font-medium">
            Active Host: <strong className="text-white font-mono">{origin ? new URL(origin).host : 'nanotech-itahari.vercel.app'}</strong>
          </span>
        </div>

        {/* Right: Superadmin Search & Navigation */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 w-full lg:w-auto justify-center lg:justify-end">

          {/* 3. SUPERADMIN SEARCH URL */}
          <div
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] border transition-all ${
              isSuperadminSearchActive
                ? 'bg-amber-500/25 text-amber-200 border-amber-400/60 shadow-xs shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-400 font-medium">Superadmin:</span>
            <button
              onClick={() => rbacNavigate('/superadmin/search' + queryParam)}
              className="font-mono text-amber-300 hover:text-amber-100 hover:underline cursor-pointer font-bold"
              title="Navigate to /superadmin/search"
            >
              /superadmin/search
            </button>
            <button
              onClick={() => copyToClipboard('superadmin', superadminSearchUrl, 'Superadmin Search')}
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Copy /superadmin/search URL"
            >
              {copiedUrl === 'superadmin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Quick Base Navigation */}
          <div className="hidden sm:flex items-center gap-1 border-l border-slate-800 pl-2 text-[11px]">
            <button
              onClick={() => rbacNavigate('/')}
              className={`px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ${
                cleanPath === '/' ? 'text-white font-bold bg-slate-800' : ''
              }`}
            >
              Store
            </button>
            <button
              onClick={() => rbacNavigate('/admin/dashboard')}
              className={`px-2 py-0.5 rounded hover:bg-slate-800 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer ${
                cleanPath.startsWith('/admin') ? 'bg-purple-900/40 font-bold' : ''
              }`}
            >
              Admin Portal
            </button>
            <button
              onClick={() => rbacNavigate('/superadmin/dashboard')}
              className={`px-2 py-0.5 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer ${
                cleanPath.startsWith('/superadmin') && !isSuperadminSearchActive ? 'bg-amber-900/40 font-bold' : ''
              }`}
            >
              Superadmin Console
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
export default DualUrlPortalBar;
