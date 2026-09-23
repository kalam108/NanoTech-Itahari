import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRBAC } from '../../context/RBACContext';
import { useTranslation } from '../../i18n/useTranslation';
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  User,
  Menu,
  X,
  Tag,
  Cpu,
  Headphones,
  Flame,
  Scale,
  Heart,
  Package,
  Sparkles,
  PhoneCall,
  HelpCircle,
  Shield,
  Laptop,
} from 'lucide-react';

export function MobileBottomNav() {
  const { currentView, setCurrentView, cart, openAuthModal, currentUser } = useApp();
  const { navigate: rbacNavigate } = useRBAC();
  const { t } = useTranslation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const cartCount = (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleTabClick = (view: string) => {
    setIsMoreMenuOpen(false);
    setCurrentView(view);
    rbacNavigate('/');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isHome = currentView === 'home';
  const isCategories = currentView === 'categories';
  const isCart = currentView === 'cart';
  const isAccount = currentView === 'user_dashboard' || currentView === 'orders';

  return (
    <>
      {/* Mobile "More" Fullscreen / Sheet Modal */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 z-10 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Menu className="w-4 h-4 text-indigo-600" />
                More Features & Portals
              </span>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
              <button
                onClick={() => handleTabClick('pc_builder')}
                className="p-3 rounded-2xl bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 flex items-center gap-2.5 transition text-left cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Custom PC Builder</span>
              </button>
              <button
                onClick={() => handleTabClick('compare')}
                className="p-3 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition text-left cursor-pointer"
              >
                <Scale className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Compare Specs</span>
              </button>
              <button
                onClick={() => handleTabClick('price_tracker')}
                className="p-3 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition text-left cursor-pointer"
              >
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Price Tracker</span>
              </button>
              <button
                onClick={() => handleTabClick('wishlist')}
                className="p-3 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition text-left cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Saved Wishlist</span>
              </button>
              <button
                onClick={() => handleTabClick('orders')}
                className="p-3 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition text-left cursor-pointer"
              >
                <Package className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Track Orders</span>
              </button>
              <button
                onClick={() => handleTabClick('contact')}
                className="p-3 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition text-left cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Itahari Store & Map</span>
              </button>
              <button
                onClick={() => handleTabClick('about')}
                className="p-3 rounded-2xl bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 transition text-left cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-slate-600 shrink-0" />
                <span>About NanoTech</span>
              </button>
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  rbacNavigate('/admin');
                }}
                className="p-3 rounded-2xl bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-2.5 transition text-left cursor-pointer"
              >
                <Shield className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Staff Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar on Mobile */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Home */}
          <button
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all cursor-pointer ${
              isHome ? 'text-[#4f46e5] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.4] text-[#4f46e5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5">{t('home')}</span>
          </button>

          {/* 2. Categories */}
          <button
            onClick={() => handleTabClick('categories')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all cursor-pointer ${
              isCategories ? 'text-[#4f46e5] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <LayoutGrid className={`w-5 h-5 ${isCategories ? 'stroke-[2.4] text-[#4f46e5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5">{t('categories')}</span>
          </button>

          {/* 3. Cart */}
          <button
            onClick={() => handleTabClick('cart')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all relative cursor-pointer ${
              isCart ? 'text-[#4f46e5] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className="relative">
              <ShoppingCart className={`w-5 h-5 ${isCart ? 'stroke-[2.4] text-[#4f46e5]' : 'stroke-[1.8]'}`} />
              <span className="absolute -top-1.5 -right-2 bg-[#4f46e5] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 0 ? cartCount : 3}
              </span>
            </div>
            <span className="text-[10px] mt-0.5">{t('cart')}</span>
          </button>

          {/* 4. Account */}
          <button
            onClick={() => {
              if (currentUser?.email) {
                handleTabClick('user_dashboard');
              } else {
                openAuthModal('login');
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all cursor-pointer ${
              isAccount ? 'text-[#4f46e5] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <User className={`w-5 h-5 ${isAccount ? 'stroke-[2.4] text-[#4f46e5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5">Account</span>
          </button>

          {/* 5. More */}
          <button
            onClick={() => setIsMoreMenuOpen(prev => !prev)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all cursor-pointer ${
              isMoreMenuOpen ? 'text-[#4f46e5] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Menu className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
