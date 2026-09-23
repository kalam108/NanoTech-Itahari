import React from 'react';
import { useAdmin, AdminSubView } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { useRBAC } from '../../context/RBACContext';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Package,
  FolderTree,
  Boxes,
  Bookmark,
  ShoppingBag,
  Users,
  Store,
  Star,
  DollarSign,
  Receipt,
  ArrowLeftRight,
  PiggyBank,
  FileSpreadsheet,
  BookOpen,
  Scale,
  Menu as MenuIcon,
  PanelLeft,
  Image,
  Tag,
  FileCode,
  Shield,
  Settings,
  History,
  Database,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wrench,
  TrendingDown,
  MapPin,
  Building2,
} from 'lucide-react';

interface NavItem {
  id: AdminSubView;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminSidebar() {
  const {
    adminSubView,
    setAdminSubView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    currentAdmin,
    logoutAdmin,
  } = useAdmin();

  const { products, orders, sellers, reviews } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const pendingSellersCount = sellers.filter((s) => s.status === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  // Exact Sidebar Structure with PC Builder, Price Tracker, Brands & Stores Included
  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports', icon: FileText },
      ],
    },
    {
      title: 'HARDWARE & CATALOG',
      items: [
        { id: 'products', label: 'Products', icon: Package, badge: products.length },
        { id: 'categories', label: 'Categories', icon: FolderTree },
        {
          id: 'inventory',
          label: 'Inventory',
          icon: Boxes,
          badge: lowStockCount > 0 ? lowStockCount : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-900 border border-rose-400/40 font-bold',
        },
        { id: 'brands', label: 'Brands', icon: Bookmark, badge: 'Official' },
        { id: 'pc_builder', label: 'PC Builder', icon: Wrench, badge: 'AM5/LGA' },
        { id: 'price_tracker', label: 'Price Tracker', icon: TrendingDown, badge: 'NPR Live' },
        { id: 'stores', label: 'Stores', icon: MapPin, badge: 'Hubs' },
      ],
    },
    {
      title: 'ORDERS & USERS',
      items: [
        {
          id: 'orders',
          label: 'Orders',
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeColor: 'bg-amber-500/25 text-amber-950 border border-amber-500/40 font-bold',
        },
        { id: 'customers', label: 'Customers', icon: Users },
        {
          id: 'sellers',
          label: 'Sellers',
          icon: Store,
          badge: pendingSellersCount > 0 ? `${pendingSellersCount}` : undefined,
          badgeColor: 'bg-indigo-500/20 text-indigo-950 border border-indigo-400/40 font-bold',
        },
        { id: 'reviews', label: 'Reviews', icon: Star },
      ],
    },
    {
      title: 'ACCOUNTING & SHEETS',
      items: [
        {
          id: 'excel_sheets',
          label: 'Online Excel',
          icon: FileSpreadsheet,
          badge: 'Live',
          badgeColor: 'bg-emerald-500/20 text-emerald-950 border border-emerald-400/40 font-bold text-[10px]',
        },
        {
          id: 'tally_accounting',
          label: 'Tally Accounting',
          icon: BookOpen,
          badge: 'GAAP',
          badgeColor: 'bg-amber-500/25 text-amber-950 border border-amber-400/40 font-bold text-[10px]',
        },
        { id: 'revenue', label: 'Revenue', icon: DollarSign },
        { id: 'expenses', label: 'Expenses', icon: Receipt },
        { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
        { id: 'budget', label: 'Budget', icon: PiggyBank },
        { id: 'excel', label: 'Excel Import/Export', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        { id: 'header_menu', label: 'Header Menu', icon: MenuIcon },
        { id: 'left_menu', label: 'Left Menu', icon: PanelLeft },
        { id: 'banners', label: 'Banners', icon: Image },
        { id: 'offers', label: 'Offers', icon: Tag },
        { id: 'pages', label: 'Pages', icon: FileCode },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'users_roles', label: 'Users & Roles', icon: Shield },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'activity_logs', label: 'Activity Logs', icon: History },
        { id: 'backup', label: 'Backup', icon: Database },
      ],
    },
  ];

  const { navigate: rbacNavigate } = useRBAC();

  const handleNavClick = (view: AdminSubView) => {
    setAdminSubView(view);
    setIsMobileDrawerOpen(false);
    rbacNavigate(view === 'dashboard' ? '/adminpanel/dashboard' : `/adminpanel/${view}`);
  };

  const sidebarContent = (
    <div className="relative flex flex-col h-full text-slate-900 select-none overflow-hidden bg-transparent">
      {/* Optical Specular Refraction Glows for Transparent Yellow Glass */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-amber-300/25 blur-2xl" />
        <div className="absolute top-1/3 -right-8 w-36 h-36 rounded-full bg-yellow-200/30 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl" />
      </div>

      {/* Top Status & Hub Indicator (when expanded) */}
      {!isSidebarCollapsed && (
        <div className="relative z-10 px-3.5 pt-3 pb-2.5 border-b border-amber-400/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </span>
            <span className="text-[11px] font-bold text-amber-950/80 tracking-tight">Itahari Control Hub</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-950 border border-amber-400/40 backdrop-blur-xs">
            Live
          </span>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-amber-400/35 hover:scrollbar-thumb-amber-500/55 scrollbar-track-transparent">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isSidebarCollapsed ? (
              <div className="flex items-center justify-between px-3 mb-1 mt-1">
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-amber-950/60">
                  {section.title}
                </h3>
              </div>
            ) : (
              <div className="h-px bg-amber-400/30 my-2 mx-2" />
            )}

            <div className="p-1 rounded-2xl bg-white/45 border border-amber-400/25 backdrop-blur-md shadow-xs space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  adminSubView === item.id ||
                  (item.id === 'excel_sheets' && (adminSubView === 'online_excel' || adminSubView === 'excel_sheets')) ||
                  (item.id === 'revenue' && adminSubView === 'accounting') ||
                  (item.id === 'expenses' && adminSubView === 'accounting') ||
                  (item.id === 'transactions' && adminSubView === 'accounting') ||
                  (item.id === 'users_roles' && adminSubView === 'admin_users') ||
                  (item.id === 'reports' && adminSubView === 'reports_gen');

                return (
                  <button
                    key={item.id}
                    id={`admin-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 relative cursor-pointer ${
                      isActive
                        ? 'admin-yellow-glass-pill-active font-bold'
                        : 'text-amber-950/75 hover:text-amber-950 admin-yellow-glass-pill-hover border border-transparent font-medium'
                    } ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                  >
                    {/* Active Accent Indicator */}
                    {isActive && (
                      <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-amber-600 stroke-[2.3]'
                            : 'text-amber-900/60 group-hover:text-amber-950 group-hover:scale-105'
                        }`}
                      />
                      {!isSidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!isSidebarCollapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-2xs backdrop-blur-xs ${
                          item.badgeColor || (isActive ? 'bg-amber-400/30 text-amber-950 border border-amber-400/50' : 'bg-amber-400/20 text-amber-900 border border-amber-400/30')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer with Logout & Collapse Toggle */}
      <div className="relative z-10 shrink-0 p-3 border-t border-amber-400/25 bg-amber-400/10 backdrop-blur-xs flex items-center gap-2">
        <button
          id="admin-sidebar-logout-btn"
          onClick={() => {
            logoutAdmin();
            rbacNavigate('/adminpanel/login');
          }}
          className={`flex-1 py-2 px-3 rounded-xl border border-amber-400/35 bg-white/60 hover:bg-white/90 text-amber-950 text-xs font-bold flex items-center gap-2.5 transition-all shadow-xs hover:shadow-sm cursor-pointer ${
            isSidebarCollapsed ? 'justify-center px-0' : 'justify-start'
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-amber-900/70 shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Logout</span>}
        </button>

        <button
          id="admin-sidebar-collapse-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex p-2 rounded-xl border border-amber-400/35 bg-white/60 hover:bg-white/90 text-amber-900 hover:text-amber-950 transition-all cursor-pointer items-center justify-center shrink-0 shadow-xs"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle sidebar width"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 z-20 h-full max-h-full admin-glass-sidebar select-none overflow-hidden ${
          isSidebarCollapsed ? 'w-16' : 'w-56 lg:w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] admin-glass-sidebar h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
