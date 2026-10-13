import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Package,
  Heart,
  Store,
  MapPin,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  LogOut,
  ShoppingBag,
  Cpu,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface UserDashboardPageProps {
  onNavigate?: (view: string) => void;
}

export function UserDashboardPage({ onNavigate }: UserDashboardPageProps) {
  const {
    currentUser,
    setCurrentUserRole,
    orders,
    wishlist,
    products,
    setCurrentView,
    sellerProfile,
    formatPricePrimary,
    formatPriceSecondary,
    showDualCurrency,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'security'>('profile');

  const userOrders = orders.filter(
    o => o.buyerId === currentUser.id || o.buyerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleLogout = () => {
    setCurrentUserRole('customer');
    addToast('info', 'Logged out of account session.');
    setCurrentView('home');
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfdfd]">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Profile Banner (Glossy Minimal Card) */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.04),0_1px_3px_rgba(0,0,0,0.02)] p-6 sm:p-8">
          {/* Subtle glossy gradient light reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-slate-50/30 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            {/* User Identity Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Glossy Minimal Avatar */}
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-0.5 shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_1px_rgba(255,255,255,0.35)] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center text-2xl font-black text-white tracking-wider">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentUser.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Email Verified (6-Digit OTP)
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    {currentUser.email}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[11px] uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {currentUser.role === 'seller' ? (
                <button
                  onClick={() => setCurrentView('seller_dashboard')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-[0_4px_14px_rgba(79,70,229,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>Seller Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('sell')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100/70 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border border-indigo-200/80 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Store className="w-4 h-4 text-indigo-600" />
                  <span>Start Selling Rig</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Nav Tabs (Minimal Segmented Pill Bar) */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 inline-flex flex-wrap gap-1.5 backdrop-blur-md">
              {[
                { id: 'profile', label: 'Account Profile', icon: User },
                { id: 'orders', label: `My Orders (${userOrders.length})`, icon: Package },
                { id: 'wishlist', label: `Saved Wishlist (${wishlistProducts.length})`, icon: Heart },
                { id: 'security', label: 'Email & Security', icon: ShieldCheck },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04)] border border-slate-200/70'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Information Card */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Account Information</h3>
                <span className="text-[11px] font-semibold text-slate-400">Personal & Session Details</span>
              </div>

              {/* 4 Soft Textured Info Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-indigo-200/80 transition-colors space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Full Name
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">{currentUser.name}</span>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-indigo-200/80 transition-colors space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Email Address
                  </span>
                  <span className="text-sm font-semibold text-indigo-600 font-mono block select-all">
                    {currentUser.email}
                  </span>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-indigo-200/80 transition-colors space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Account Type
                  </span>
                  <span className="capitalize text-sm font-bold text-slate-900 block">
                    {currentUser.role}
                  </span>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-indigo-200/80 transition-colors space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Status
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active & Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Fast Access Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-6 sm:p-8 space-y-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base pb-1 border-b border-slate-100">
                  Shop Fast Access
                </h3>
                <p className="text-xs text-slate-500 mt-2 mb-4">
                  Quick links to shop rigs, computer components, or complete pending orders.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentView('products')}
                    className="w-full p-3.5 rounded-2xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-300 text-xs text-slate-800 font-bold flex items-center justify-between transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                  >
                    <div className="text-left">
                      <span className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors">
                        Browse GPU & CPU Catalog
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Explore hardware in Nepal
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition-all shadow-2xs shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </button>

                  <button
                    onClick={() => setCurrentView('cart')}
                    className="w-full p-3.5 rounded-2xl bg-slate-50/70 hover:bg-purple-50/40 border border-slate-200/80 hover:border-purple-300 text-xs text-slate-800 font-bold flex items-center justify-between transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                  >
                    <div className="text-left">
                      <span className="font-bold text-slate-900 block group-hover:text-purple-600 transition-colors">
                        View Shopping Cart
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        Checkout with eSewa / Khalti
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white text-purple-600 flex items-center justify-center transition-all shadow-2xs shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
              Your Hardware Orders
            </h3>
            {userOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-slate-500">You have no order history yet.</p>
                <button
                  onClick={() => setCurrentView('products')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  Explore Products →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Order #{order.id}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-900">
                        {formatPricePrimary(order.total)}
                      </span>
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-3 py-1 rounded-full capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-100">
              Saved Wishlist Items
            </h3>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Heart className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-slate-500">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlistProducts.map(p => (
                  <div
                    key={p.id}
                    className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 flex gap-3 items-center shadow-2xs hover:shadow-xs transition-all"
                  >
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800';
                      }}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                      <span className="text-xs font-extrabold text-indigo-600">
                        {formatPricePrimary(p.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Email & Security Tab */}
        {activeTab === 'security' && (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04),0_1px_2px_rgba(0,0,0,0.02)] p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Email Verification & Security Protection
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between shadow-2xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">6-Digit Email OTP Verification</span>
                  <p className="text-slate-500 text-[11px]">
                    All sensitive account actions and logins are verified with expiring 6-digit numeric OTP codes sent to your inbox.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-xs">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

