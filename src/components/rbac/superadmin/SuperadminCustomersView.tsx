import React, { useState } from 'react';
import { useRBAC } from '../../../context/RBACContext';
import { Users, Search, ShieldCheck, Lock, Key, Ban, CheckCircle2 } from 'lucide-react';

export const SuperadminCustomersView: React.FC = () => {
  const [customers, setCustomers] = useState([
    { id: 'usr-sita-03', name: 'Sita Sharma', email: 'customer@nanotech.com', phone: '+977 9812345678', location: 'Itahari, Ward-6', orders: 4, status: 'active', joined: '2025-04-12' },
    { id: 'usr-bik-04', name: 'Bikram Thapa', email: 'bikram.thapa@gmail.com', phone: '+977 9845012345', location: 'Biratnagar, Morang', orders: 3, status: 'active', joined: '2025-05-20' },
    { id: 'usr-deep-05', name: 'Deepak Pokhrel', email: 'deepak.pokhrel@yahoo.com', phone: '+977 9803322114', location: 'Dharan, Sunsari', orders: 6, status: 'active', joined: '2025-02-14' },
    { id: 'usr-anj-06', name: 'Anjali Rai', email: 'anjali.rai@gmail.com', phone: '+977 9811223344', location: 'Damak, Jhapa', orders: 2, status: 'active', joined: '2025-06-18' },
    { id: 'usr-sus-07', name: 'Sushil Shrestha', email: 'sushil.shrestha@hotmail.com', phone: '+977 9809988776', location: 'Inaruwa, Sunsari', orders: 1, status: 'suspended', joined: '2025-08-01' },
  ]);

  const [search, setSearch] = useState('');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    setActionAlert(`Customer account ${newStatus === 'active' ? 'reactivated' : 'suspended'} by Kalam.`);
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleResetPassword = (name: string) => {
    setActionAlert(`Temporary password reset token issued for ${name}.`);
    setTimeout(() => setActionAlert(null), 3500);
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Accounts Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Root oversight of registered shoppers, profile status, and account safety
          </p>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {actionAlert && (
        <div className="bg-amber-950/70 border border-amber-600 text-amber-300 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email & Phone</th>
                <th className="p-4">Location</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Superadmin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.map((c) => {
                const isActive = c.status === 'active';
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                          {c.name.charAt(0)}
                        </div>
                        {c.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {c.id}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-white">{c.email}</div>
                      <div className="text-[11px] text-slate-400">{c.phone}</div>
                    </td>

                    <td className="p-4 text-slate-300">{c.location}</td>

                    <td className="p-4 font-bold text-white">{c.orders} orders</td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}
                      >
                        {isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleResetPassword(c.name)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] flex items-center gap-1 transition"
                          title="Reset Password"
                        >
                          <Key className="w-3 h-3 text-amber-400" />
                          Reset
                        </button>
                        <button
                          onClick={() => toggleStatus(c.id, c.status)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
                            isActive
                              ? 'bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40'
                              : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40'
                          }`}
                        >
                          <Ban className="w-3 h-3" />
                          {isActive ? 'Suspend' : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
