import React, { useState, useEffect, useMemo } from 'react';
import { useRBAC } from '../../../context/RBACContext';
import { useApp } from '../../../context/AppContext';
import { useAdmin } from '../../../context/AdminContext';
import {
  Search,
  SlidersHorizontal,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Crown
} from 'lucide-react';

export function AdminSearchView() {
  const { navigate: rbacNavigate, currentPath } = useRBAC();
  const { products, orders, users, addToast } = useApp();
  const { settings, setAdminSubView, setSelectedAdminProductId, setSelectedAdminOrderId } = useAdmin();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'products' | 'orders' | 'customers' | 'low_stock'>('all');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Initialize query from URL search params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setQuery(q);
    }
  }, []);

  // Sync query to URL on change
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
      addToast('success', 'Admin Search URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products.slice(0, 15);
    const q = query.toLowerCase();
    return products.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [products, query]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (!query.trim()) return orders.slice(0, 10);
    const q = query.toLowerCase();
    return orders.filter(
      o =>
        o.id.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q) ||
        o.buyerEmail.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    );
  }, [orders, query]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    if (!query.trim()) return users.slice(0, 8);
    const q = query.toLowerCase();
    return users.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
    );
  }, [users, query]);

  // Low Stock Items
  const lowStockItems = useMemo(() => {
    return products.filter(p => p.stock <= 5);
  }, [products]);

  const totalResultsCount =
    (filterType === 'all' || filterType === 'products' ? filteredProducts.length : 0) +
    (filterType === 'all' || filterType === 'orders' ? filteredOrders.length : 0) +
    (filterType === 'all' || filterType === 'customers' ? filteredCustomers.length : 0) +
    (filterType === 'low_stock' ? lowStockItems.length : 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / URL Breadcrumb */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-400" />
                Dedicated Admin Search URL
              </span>
              <span className="text-xs font-mono text-slate-400 hidden md:inline">
                {typeof window !== 'undefined' ? window.location.origin : ''}/admin/search
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-purple-400" />
              Admin Global Search & Lookup
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Search across catalog products, customer order records, client accounts, and inventory stock levels.
            </p>
          </div>

          {/* Quick Domain Links & Copy URL */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copySearchUrl}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy current /admin/search URL"
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
              onClick={() => rbacNavigate('/superadmin/search' + (query ? `?q=${encodeURIComponent(query)}` : ''))}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Switch to Superadmin Search URL on same domain"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Superadmin Search (/superadmin/search)
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-5 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => handleQueryChange(e.target.value)}
            placeholder="Search by Product Title, SKU, Brand, Order #, Buyer Name, Email, Customer Phone..."
            className="w-full bg-slate-950 text-white placeholder-slate-500 pl-11 pr-24 py-3 rounded-xl border border-slate-700 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
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
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter View:
          </span>

          {[
            { id: 'all', label: `All Entities (${filteredProducts.length + filteredOrders.length + filteredCustomers.length})` },
            { id: 'products', label: `Products (${filteredProducts.length})`, icon: Package },
            { id: 'orders', label: `Orders (${filteredOrders.length})`, icon: ShoppingBag },
            { id: 'customers', label: `Customers (${filteredCustomers.length})`, icon: Users },
            { id: 'low_stock', label: `Low Stock Alerts (${lowStockItems.length})`, icon: AlertTriangle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
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
        {/* 1. Products Results */}
        {(filterType === 'all' || filterType === 'products') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-400" />
                Catalog Products ({filteredProducts.length})
              </h2>
              <button
                onClick={() => rbacNavigate('/admin/products')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                View Full Products Manager <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No matching products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {p.brand}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.stock > 10
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : p.stock > 0
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of Stock'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        NPR {p.price.toLocaleString()} • Cat: {p.category}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-slate-500">ID: {p.id.slice(-6)}</span>
                      <button
                        onClick={() => rbacNavigate('/admin/products')}
                        className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Edit in Admin <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Orders Results */}
        {(filterType === 'all' || filterType === 'orders') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                Customer Orders ({filteredOrders.length})
              </h2>
              <button
                onClick={() => rbacNavigate('/admin/orders')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                View Orders Queue <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No matching orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Buyer Name & Email</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono text-slate-200 font-bold">#{o.id.slice(-8)}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{o.buyerName}</div>
                          <div className="text-slate-500 text-[11px]">{o.buyerEmail}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-white">NPR {o.total.toLocaleString()}</td>
                        <td className="p-3 uppercase text-[10px] font-mono text-slate-400">{o.paymentMethod}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              o.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : o.status === 'processing'
                                ? 'bg-sky-500/20 text-sky-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => rbacNavigate('/admin/orders')}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. Customers Results */}
        {(filterType === 'all' || filterType === 'customers') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                Customer Accounts ({filteredCustomers.length})
              </h2>
              <button
                onClick={() => rbacNavigate('/admin/customers')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                View All Customers <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {filteredCustomers.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No matching customers found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCustomers.map(u => (
                  <div key={u.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 font-bold text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="font-semibold text-white truncate text-xs">{u.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{u.email}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{u.phone || 'No phone'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Low Stock Alerts */}
        {filterType === 'low_stock' && (
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Low Stock & Restock Alerts ({lowStockItems.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockItems.map(p => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{p.title}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-xs">
                      {p.stock} left
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Brand: {p.brand}</div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => rbacNavigate('/admin/products')}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold"
                    >
                      Update Inventory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
