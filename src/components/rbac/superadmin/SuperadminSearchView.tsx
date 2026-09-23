import React, { useState, useEffect, useMemo } from 'react';
import { useRBAC } from '../../../context/RBACContext';
import { useApp } from '../../../context/AppContext';
import {
  Search,
  Lock,
  Crown,
  ShieldCheck,
  UserCheck,
  KeyRound,
  FileText,
  Sliders,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  Server
} from 'lucide-react';

export function SuperadminSearchView() {
  const {
    currentPath,
    navigate: rbacNavigate,
    admins,
    auditLogs,
    systemSettings,
    toggleAdminStatus
  } = useRBAC();
  const { products, orders, users, addToast } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admins' | 'logs' | 'permissions' | 'settings'>('all');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Initialize query from URL search params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setQuery(q);
    }
  }, []);

  // Sync query to URL
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (val.trim()) {
        url.searchParams.set('q', val);
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  const copySearchUrl = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      addToast('success', 'Superadmin Search URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // 1. Filter Admins
  const filteredAdmins = useMemo(() => {
    if (!query.trim()) return admins;
    const q = query.toLowerCase();
    return admins.filter(
      a =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.department && a.department.toLowerCase().includes(q)) ||
        a.permissions.some(p => p.toLowerCase().includes(q))
    );
  }, [admins, query]);

  // 2. Filter Audit Logs
  const filteredAuditLogs = useMemo(() => {
    if (!query.trim()) return auditLogs.slice(0, 15);
    const q = query.toLowerCase();
    return auditLogs.filter(
      log =>
        log.action.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.actorEmail.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
    );
  }, [auditLogs, query]);

  // 3. Filter Permissions
  const allPermissions = [
    { key: 'products.create', label: 'Create Products', desc: 'Allows adding new hardware items to inventory' },
    { key: 'products.edit', label: 'Edit Products', desc: 'Modify pricing, descriptions, specifications, and stock' },
    { key: 'products.delete', label: 'Delete Products', desc: 'Archive or permanently delete products' },
    { key: 'orders.view', label: 'View Orders Queue', desc: 'Inspect customer orders and tracking numbers' },
    { key: 'orders.update_status', label: 'Update Order Status', desc: 'Transition orders between Pending, Shipped, Delivered' },
    { key: 'customers.view', label: 'View Customers', desc: 'Access customer profiles, emails, and address records' },
    { key: 'customers.manage', label: 'Manage Customers', desc: 'Suspend or unban customer accounts' },
    { key: 'reports.view', label: 'View Reports', desc: 'Access sales ledgers, revenue charts, and profit analysis' },
    { key: 'reports.export', label: 'Export Reports', desc: 'Download CSV and Excel files for accounting' },
  ];

  const filteredPermissions = useMemo(() => {
    if (!query.trim()) return allPermissions;
    const q = query.toLowerCase();
    return allPermissions.filter(
      p =>
        p.key.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
    );
  }, [query]);

  // 4. Filter System Settings
  const settingsEntries = useMemo(() => {
    const list = [
      { key: 'sessionTimeoutMinutes', label: 'Session Timeout', value: `${systemSettings.sessionTimeoutMinutes} minutes` },
      { key: 'maxLoginAttempts', label: 'Max Login Attempts', value: `${systemSettings.maxLoginAttempts} attempts` },
      { key: 'require2FAForAdmins', label: 'Require 2FA For Admins', value: systemSettings.require2FAForAdmins ? 'Enabled' : 'Disabled' },
      { key: 'maintenanceMode', label: 'Maintenance Mode', value: systemSettings.maintenanceMode ? 'Active (Offline)' : 'Inactive (Online)' },
      { key: 'allowCustomerRegistration', label: 'Customer Registration', value: systemSettings.allowCustomerRegistration ? 'Enabled' : 'Disabled' },
      { key: 'auditLogRetentionDays', label: 'Audit Log Retention', value: `${systemSettings.auditLogRetentionDays} days` },
    ];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(s => s.key.toLowerCase().includes(q) || s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q));
  }, [systemSettings, query]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / URL Breadcrumb */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                Dedicated Superadmin Search URL
              </span>
              <span className="text-xs font-mono text-slate-400 hidden md:inline">
                {typeof window !== 'undefined' ? window.location.origin : ''}/superadmin/search
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-amber-400" />
              Superadmin Master Search & Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Global system surveillance: search across staff administrators, RBAC security roles, audit trails, and configuration switches.
            </p>
          </div>

          {/* Quick Domain Navigation & Copy */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copySearchUrl}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy current /superadmin/search URL"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedUrl ? 'Copied URL!' : 'Copy Search URL'}
            </button>

            <button
              onClick={() => rbacNavigate('/search' + (query ? `?q=${encodeURIComponent(query)}` : ''))}
              className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Switch to User Search URL on same domain"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              User Search (/search)
            </button>

            <button
              onClick={() => rbacNavigate('/adminpanel/search' + (query ? `?q=${encodeURIComponent(query)}` : ''))}
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Switch to Admin Search URL on same domain"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Admin Search (/adminpanel/search)
            </button>
          </div>
        </div>

        {/* Master Search Input */}
        <div className="mt-5 relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder="Search Administrators, Staff Email, Permission Keys, Audit Logs, Settings, Database Tables..."
            className="w-full bg-slate-950 text-white placeholder-slate-500 pl-11 pr-24 py-3 rounded-xl border border-amber-500/40 text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Section:
          </span>

          {[
            { id: 'all', label: `All System Entities (${filteredAdmins.length + filteredAuditLogs.length + filteredPermissions.length})` },
            { id: 'admins', label: `Staff Admins (${filteredAdmins.length})`, icon: UserCheck },
            { id: 'logs', label: `Security Logs (${filteredAuditLogs.length})`, icon: FileText },
            { id: 'permissions', label: `RBAC Permissions (${filteredPermissions.length})`, icon: KeyRound },
            { id: 'settings', label: `System Settings (${settingsEntries.length})`, icon: Sliders },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* 1. Staff Admins Results */}
        {(filterType === 'all' || filterType === 'admins') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Staff Administrators ({filteredAdmins.length})
              </h2>
              <button
                onClick={() => rbacNavigate('/superadmin/admins')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                Manage All Admins <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {filteredAdmins.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No matching staff administrators found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAdmins.map(admin => (
                  <div
                    key={admin.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded">
                          {admin.department || 'Hardware Operations'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            admin.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {admin.status === 'active' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                          {admin.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {admin.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{admin.email}</p>
                      <div className="mt-2 text-[11px] text-slate-500">
                        Permissions: <strong className="text-slate-300">{admin.permissions.length} granted</strong>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => toggleAdminStatus(admin.id)}
                        className="text-slate-400 hover:text-white cursor-pointer text-[11px]"
                      >
                        {admin.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => rbacNavigate('/superadmin/admins')}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Edit Permissions <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Security Audit Logs Results */}
        {(filterType === 'all' || filterType === 'logs') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                Security Audit Trails ({filteredAuditLogs.length})
              </h2>
              <button
                onClick={() => rbacNavigate('/superadmin/settings')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                View System Audit Log <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {filteredAuditLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No matching audit trail events found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor / Email</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAuditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{log.actorName}</div>
                          <div className="text-slate-500 text-[10px] font-mono">{log.actorEmail}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-300 text-[11px]">{log.target}</td>
                        <td className="p-3 text-slate-400 text-xs max-w-xs truncate">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. RBAC Permissions Results */}
        {(filterType === 'all' || filterType === 'permissions') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                RBAC Security Permissions Matrix ({filteredPermissions.length})
              </h2>
              <button
                onClick={() => rbacNavigate('/superadmin/permissions')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                Access Permissions Matrix <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPermissions.map(p => (
                <div key={p.key} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-mono text-xs text-emerald-400 font-bold">{p.key}</div>
                  <div className="text-sm font-semibold text-white mt-1">{p.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. System Settings Results */}
        {(filterType === 'all' || filterType === 'settings') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Platform Settings & Security Parameters ({settingsEntries.length})
              </h2>
              <button
                onClick={() => rbacNavigate('/superadmin/settings')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                Configure Settings <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {settingsEntries.map(s => (
                <div key={s.key} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">{s.label}</div>
                    <div className="text-[10px] font-mono text-slate-500">{s.key}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
