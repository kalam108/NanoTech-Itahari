import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useRBAC } from '../../context/RBACContext';
import { useTranslation } from '../../i18n/useTranslation';
import { LanguageToggle } from './LanguageToggle';
import { NanoTechLogo } from '../brand/NanoTechLogo';
import { HardwareAIRobotIcon } from './HardwareAIRobotIcon';
import {
  Search,
  ShoppingCart,
  Heart,
  Scale,
  User as UserIcon,
  UserPlus,
  Cpu,
  Sparkles,
  Bot,
  Flame,
  Recycle,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Truck,
  MapPin,
  Home,
  Monitor,
  Laptop,
  Layers,
  Settings,
  Headphones,
  Tag,
  Shield,
  Clock,
} from 'lucide-react';

interface HeaderProps {
  onOpenAiAdvisor?: () => void;
}

export function Header({ onOpenAiAdvisor }: HeaderProps) {
  const {
    currentUser,
    setCurrentUserRole,
    currentView,
    setCurrentView,
    cart,
    wishlist,
    compareList,
    filters,
    setFilters,
    categories,
    currency,
    formatPricePrimary,
    setIsAuthModalOpen,
    openAuthModal,
    addToast,
  } = useApp();

  const { t, isNepali } = useTranslation();
  const { navigate: rbacNavigate, role: rbacRole } = useRBAC();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('All Categories');
  const [searchCategoryDropdownOpen, setSearchCategoryDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [componentsDropdownOpen, setComponentsDropdownOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchCategoryRef = useRef<HTMLDivElement>(null);
  const productsMenuRef = useRef<HTMLDivElement>(null);
  const componentsMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  const wishlistCount = (wishlist || []).length;
  const compareCount = (compareList || []).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (searchCategoryRef.current && !searchCategoryRef.current.contains(event.target as Node)) {
        setSearchCategoryDropdownOpen(false);
      }
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
      if (componentsMenuRef.current && !componentsMenuRef.current.contains(event.target as Node)) {
        setComponentsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSearchCategory !== 'All Categories') {
      setFilters(prev => ({ ...prev, category: selectedSearchCategory }));
    }
    // Route directly to dedicated /search URL on the same domain
    const query = filters.searchQuery ? `?q=${encodeURIComponent(filters.searchQuery)}` : '';
    rbacNavigate(`/search${query}`);
  };

  const handleSelectNavCategory = (catName: string, condition: 'all' | 'Refurbished' | 'Used' = 'all') => {
    setFilters(prev => ({ ...prev, category: catName, condition }));
    setProductsDropdownOpen(false);
    setComponentsDropdownOpen(false);
    setCurrentView('products');
  };

  const handleLogout = () => {
    setAccountDropdownOpen(false);
    setCurrentUserRole('customer');
    addToast('info', 'Logged out of account session');
    setCurrentView('home');
  };

  // Real-time store status in Nepal
  const [storeStatus, setStoreStatus] = useState<{ isOpen: boolean; text: string }>({ isOpen: true, text: 'Open now · 8AM–7PM' });

  useEffect(() => {
    const checkStatus = () => {
      try {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kathmandu',
          hour12: false,
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
        }).formatToParts(now);

        const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '12', 10);
        const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
        const weekday = parts.find(p => p.type === 'weekday')?.value || 'Sun';
        const mins = hour * 60 + minute;

        if (weekday === 'Sat') {
          setStoreStatus({ isOpen: false, text: 'Closed (Saturday)' });
        } else if (weekday === 'Thu') {
          if (mins >= 540 && mins < 1140) {
            setStoreStatus({ isOpen: true, text: 'Open · 9AM–7PM' });
          } else {
            setStoreStatus({ isOpen: false, text: 'Closed now' });
          }
        } else {
          if (mins >= 480 && mins < 1140) {
            setStoreStatus({ isOpen: true, text: 'Open · 8AM–7PM' });
          } else {
            setStoreStatus({ isOpen: false, text: 'Closed now' });
          }
        }
      } catch {
        setStoreStatus({ isOpen: true, text: 'Open · 8AM–7PM' });
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_25px_-5px_rgba(79,70,229,0.06)] transition-all font-sans select-none">
      {/* 1. TOP UTILITY BAR (Vibrant Purple to Blue Gradient with Glossy Inset) */}
      <div className="relative bg-gradient-to-r from-[#4f46e5] via-[#2563eb] to-[#0284c7] px-3 sm:px-6 lg:px-8 xl:px-10 py-1.5 sm:py-2 text-xs text-white shadow-2xs overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none">
        <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex items-center justify-between gap-2 sm:gap-4 relative z-10 overflow-x-auto no-scrollbar scroll-smooth">
          {/* Left: Store Location & Live Status Pill (Visible on Mobile & Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs shrink-0 py-0.5">
            <button
              onClick={() => setCurrentView('contact')}
              className="inline-flex items-center gap-1 sm:gap-1.5 text-white/95 hover:text-amber-200 font-semibold whitespace-nowrap cursor-pointer transition"
              title="Click to view Itahari store details"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300 stroke-[2.2] shrink-0" />
              <span className="truncate max-w-[130px] xs:max-w-none">{t('locationItahari')}</span>
            </button>

            {/* Live Store Hours Pill - Visible on mobile and desktop */}
            <button
              type="button"
              onClick={() => setCurrentView('contact')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-full font-bold text-[9px] sm:text-[10px] transition cursor-pointer border shrink-0 ${
                storeStatus.isOpen
                  ? 'bg-emerald-500/25 text-emerald-100 border-emerald-400/40 hover:bg-emerald-500/40'
                  : 'bg-rose-500/25 text-rose-100 border-rose-400/40 hover:bg-rose-500/40'
              }`}
              title="View full weekly store hours and location in Itahari"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span>{storeStatus.isOpen ? t('storeOpen') : t('storeClosed')}</span>
            </button>
          </div>

          {/* Right: Language Switcher, Need Help, Sign In/Up (Visible on Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-3.5 text-[11px] sm:text-xs shrink-0 whitespace-nowrap">
            {/* Direct Language Switcher (EN / नेपाली) */}
            <div className="flex items-center gap-1">
              <LanguageToggle variant="header" />
            </div>

            <span className="text-white/30 font-light">|</span>

            {/* Need Help? - Visible on mobile too */}
            <button
              onClick={() => setCurrentView('help')}
              className="text-white hover:text-white/85 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
              title="Need Help?"
            >
              <Headphones className="w-3.5 h-3.5 text-white stroke-[2.2] shrink-0" />
              <span className="hidden xs:inline">{t('needHelp')}</span>
            </button>

            <span className="text-white/30 font-light">|</span>

            <button
              onClick={() => openAuthModal('login')}
              className="text-white hover:text-white/85 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
              title="Sign In to your account"
            >
              <UserIcon className="w-3.5 h-3.5 text-white stroke-[2.2] shrink-0" />
              <span>{t('signIn')}</span>
            </button>

            <span className="text-white/30 font-light">|</span>

            <button
              onClick={() => openAuthModal('signup')}
              className="text-white hover:text-white/85 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
              title="Create a new account"
            >
              <UserPlus className="w-3.5 h-3.5 text-white stroke-[2.2] shrink-0" />
              <span>{t('signUp')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER (Glossy Crystal Backdrop) */}
      <div className="max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all', condition: 'all', searchQuery: '' }));
              setCurrentView('home');
            }}
            className="flex items-center group focus:outline-none shrink-0 text-left cursor-pointer"
          >
            <NanoTechLogo size="md" variant="horizontal" />
          </button>

          {/* Integrated Glossy Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-2xl relative items-center"
          >
            <div className="w-full flex items-center bg-slate-50/90 hover:bg-white focus-within:bg-white border border-slate-200/90 rounded-full p-1 pl-4 shadow-inner hover:border-indigo-400/80 focus-within:border-[#4f46e5] focus-within:ring-3 focus-within:ring-indigo-500/15 transition-all">
              {/* Search input */}
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.searchQuery}
                onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs sm:text-sm py-1.5 focus:outline-none"
              />

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer ml-2"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2.5 sm:gap-6">
            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="flex flex-col items-center group relative text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Wishlist"
            >
              <div className="relative p-1">
                <Heart className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                <span className="absolute -top-1.5 -right-2 bg-[#4f46e5] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount > 0 ? wishlistCount : 1}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-indigo-600 mt-0.5 hidden sm:block">
                {t('wishlist')}
              </span>
            </button>

            {/* Compare */}
            <button
              onClick={() => setCurrentView('compare')}
              className="flex flex-col items-center group relative text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Compare Products"
            >
              <div className="relative p-1">
                <Scale className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                <span className="absolute -top-1.5 -right-2 bg-[#4f46e5] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {compareCount > 0 ? compareCount : 1}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-indigo-600 mt-0.5 hidden sm:block">
                {t('compare')}
              </span>
            </button>

            {/* Cart */}
            <button
              onClick={() => setCurrentView('cart')}
              className="flex flex-col items-center group relative text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <div className="relative p-1">
                <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                <span className="absolute -top-1.5 -right-2 bg-[#4f46e5] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount > 0 ? cartCount : 3}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-indigo-600 mt-0.5 hidden sm:block">
                {t('cart')}
              </span>
            </button>

            {/* My Account & Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-2.5 p-1 text-slate-700 hover:text-indigo-600 transition-all group cursor-pointer"
                title="Account"
              >
                <div className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center group-hover:border-indigo-500">
                  <UserIcon className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Hello, {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}
                  </span>
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <span>{t('myAccount')}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </button>

              {accountDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] md:hidden"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                  <div className="fixed md:absolute right-3 md:right-0 top-[110px] md:top-full mt-2 w-56 max-w-[calc(100vw-24px)] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 text-slate-700 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                        {t('myAccount')}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {currentUser.name || 'User'}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block">
                        {currentUser.email}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        setCurrentView('user_dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>{t('myProfile')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        setCurrentView('orders');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-slate-500" />
                      <span>{t('myOrders')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        setCurrentView('wishlist');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-slate-500" />
                      <span>{t('wishlist')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        setCurrentView('compare');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <Scale className="w-4 h-4 text-slate-500" />
                      <span>{t('compare')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        setCurrentView('user_dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{t('addresses')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        setCurrentView('user_dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>{t('accountSettings')}</span>
                    </button>

                    <div className="my-1.5 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        rbacNavigate('/admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 text-amber-700 flex items-center gap-2.5 font-semibold transition-colors cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Admin Portal (/admin)</span>
                    </button>

                    <div className="my-1.5 border-t border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Direct Search Bar - Visible directly on mobile header just like desktop */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex md:hidden w-full relative items-center mt-2.5"
        >
          <div className="w-full flex items-center bg-slate-50/95 hover:bg-white focus-within:bg-white border border-slate-200/90 rounded-full p-1 pl-3.5 shadow-inner hover:border-indigo-400 focus-within:border-[#4f46e5] focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={filters.searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-xs py-1.5 focus:outline-none"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/30 transition-all active:scale-95 cursor-pointer ml-1.5"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* 3. SUB-NAVIGATION CATEGORY BAR (Visible on both Desktop and Mobile with Smooth Horizontal Scroll) */}
        <div className="flex items-center justify-between border-t border-slate-200/80 mt-2.5 pt-2 text-xs font-semibold overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
          <div className="flex items-center gap-4 sm:gap-7 shrink-0">
            {/* Home with active bottom line */}
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'all', condition: 'all', searchQuery: '' }));
                setCurrentView('home');
              }}
              className={`relative flex items-center gap-1.5 pb-1.5 transition-colors cursor-pointer shrink-0 ${
                currentView === 'home'
                  ? 'text-[#4f46e5] font-bold'
                  : 'text-slate-600 hover:text-[#4f46e5]'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#4f46e5]" />
              <span>{t('home')}</span>
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f46e5] rounded-full" />
              )}
            </button>

            {/* Products Dropdown */}
            <div className="relative shrink-0" ref={productsMenuRef}>
              <button
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                className={`flex items-center gap-1 transition-colors cursor-pointer ${
                  currentView === 'products' ? 'text-[#4f46e5]' : 'text-slate-600 hover:text-[#4f46e5]'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('products')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {productsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] md:hidden"
                    onClick={() => setProductsDropdownOpen(false)}
                  />
                  <div className="fixed md:absolute left-3 md:left-0 top-[148px] md:top-full mt-2 w-[calc(100vw-24px)] md:w-52 max-w-xs bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 text-slate-700 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        handleSelectNavCategory('all');
                        setProductsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-slate-900 font-bold cursor-pointer"
                    >
                      {t('allProducts')}
                    </button>
                    {categories.slice(0, 8).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          handleSelectNavCategory(cat.name);
                          setProductsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-slate-700 hover:text-indigo-600 cursor-pointer"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Desktops */}
            <button
              onClick={() => handleSelectNavCategory('Desktop PCs')}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[#4f46e5] transition-colors cursor-pointer shrink-0"
            >
              <Monitor className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('desktops')}</span>
            </button>

            {/* Laptops */}
            <button
              onClick={() => handleSelectNavCategory('Laptops')}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[#4f46e5] transition-colors cursor-pointer shrink-0"
            >
              <Laptop className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('laptops')}</span>
            </button>

            {/* Components Dropdown */}
            <div className="relative shrink-0" ref={componentsMenuRef}>
              <button
                onClick={() => setComponentsDropdownOpen(!componentsDropdownOpen)}
                className="flex items-center gap-1 text-slate-600 hover:text-[#4f46e5] transition-colors cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('components')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {componentsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] md:hidden"
                    onClick={() => setComponentsDropdownOpen(false)}
                  />
                  <div className="fixed md:absolute left-3 md:left-0 top-[148px] md:top-full mt-2 w-[calc(100vw-24px)] md:w-56 max-w-xs bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1.5 text-slate-700 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        handleSelectNavCategory('Components');
                        setComponentsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 text-slate-900 font-bold border-b border-slate-100 cursor-pointer"
                    >
                      {t('allComponents')}
                    </button>
                    {[
                      { key: 'gpu', label: 'Graphics Cards (GPU)' },
                      { key: 'cpu', label: 'Processors (CPU)' },
                      { key: 'motherboard', label: 'Motherboards' },
                      { key: 'ram', label: 'RAM / Memory' },
                      { key: 'storage', label: 'Storage / SSD' },
                      { key: 'psu', label: 'Power Supplies (PSU)' },
                      { key: 'cooler', label: 'CPU Coolers & AIO' },
                      { key: 'case', label: 'PC Cases / Cabinets' },
                    ].map(comp => (
                      <button
                        key={comp.key}
                        onClick={() => {
                          handleSelectNavCategory(comp.label);
                          setComponentsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50/60 hover:text-indigo-600 text-slate-700 transition-colors cursor-pointer"
                      >
                        {t(comp.key as any, comp.label)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Accessories */}
            <button
              onClick={() => handleSelectNavCategory('Accessories')}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[#4f46e5] transition-colors cursor-pointer shrink-0"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('accessories')}</span>
            </button>

            {/* Deals */}
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'all', condition: 'all' }));
                setCurrentView('products');
              }}
              className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold transition-colors cursor-pointer shrink-0"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('deals')}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0 pl-4 sm:pl-6 border-l border-slate-200/60 md:border-l-0">
            <button
              onClick={() => setCurrentView('orders')}
              className="text-slate-600 hover:text-[#4f46e5] transition-colors cursor-pointer shrink-0"
            >
              {t('myOrders')}
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className="text-slate-600 hover:text-[#4f46e5] transition-colors cursor-pointer shrink-0"
            >
              {t('about')}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Language Selector */}
          <LanguageToggle variant="mobile" />

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={t('searchHardware')}
              value={filters.searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full h-10 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs pl-4 pr-10 rounded-full focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-10 w-10 text-indigo-600 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">
                  {currentUser?.name ? currentUser.name : 'Account Portal'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {currentUser?.email ? currentUser.email : 'Sign in to access orders'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {t('signIn')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('signup');
                }}
                className="text-xs font-semibold bg-[#f85606] hover:bg-[#e04e05] text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {t('signUp')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 flex items-center gap-2"
            >
              <Home className="w-4 h-4" /> {t('home')}
            </button>
            <button
              onClick={() => {
                setCurrentView('compare');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-slate-600" /> {t('compare')} ({compareCount})
            </button>
            <button
              onClick={() => {
                setCurrentView('products');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-2"
            >
              <Tag className="w-4 h-4" /> {t('allProducts')}
            </button>
            <button
              onClick={() => {
                setCurrentView('about');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-700 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-slate-600" /> {t('about')}
            </button>
            <button
              onClick={() => {
                if (onOpenAiAdvisor) onOpenAiAdvisor();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-slate-900 text-white flex items-center gap-2.5 font-bold shadow-md cursor-pointer hover:bg-slate-800 transition"
            >
              <div className="relative w-6 h-6 rounded-lg p-[1.5px] conic-gradient-360 shrink-0">
                <div className="w-full h-full bg-[#070b18] rounded-[6px] flex items-center justify-center">
                  <HardwareAIRobotIcon className="w-3.5 h-3.5 text-indigo-300" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                {isNepali ? 'हार्डवेयर एआई' : 'Hardware AI Advisor'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
