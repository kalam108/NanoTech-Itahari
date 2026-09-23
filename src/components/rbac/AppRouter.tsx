import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { UnifiedLoginPage } from './UnifiedLoginPage';
import { DualUrlPortalBar } from '../layout/DualUrlPortalBar';

// Customer Components
import { CustomerLayout } from './customer/CustomerLayout';
import { CustomerDashboardView } from './customer/CustomerDashboardView';
import { CustomerProductsView } from './customer/CustomerProductsView';
import { CustomerCartView } from './customer/CustomerCartView';
import { CustomerOrdersView } from './customer/CustomerOrdersView';
import { CustomerProfileView } from './customer/CustomerProfileView';
import { CustomerSignupPage } from './customer/CustomerSignupPage';

// Admin Components
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboardView } from './admin/AdminDashboardView';
import { AdminProductsView } from './admin/AdminProductsView';
import { AdminOrdersView } from './admin/AdminOrdersView';
import { AdminCustomersView } from './admin/AdminCustomersView';
import { AdminReportsView } from './admin/AdminReportsView';
import { AdminSearchView } from './admin/AdminSearchView';

// Superadmin Components
import { SuperadminLayout } from './superadmin/SuperadminLayout';
import { SuperadminDashboardView } from './superadmin/SuperadminDashboardView';
import { SuperadminAdminsView } from './superadmin/SuperadminAdminsView';
import { SuperadminCustomersView } from './superadmin/SuperadminCustomersView';
import { SuperadminProductsView } from './superadmin/SuperadminProductsView';
import { SuperadminOrdersView } from './superadmin/SuperadminOrdersView';
import { SuperadminPermissionsView } from './superadmin/SuperadminPermissionsView';
import { SuperadminSettingsView } from './superadmin/SuperadminSettingsView';
import { SuperadminSearchView } from './superadmin/SuperadminSearchView';

// Dedicated User Search Page
import { UserSearchPage } from '../../pages/UserSearchPage';
// Admin Store Content CMS Section
import { ContentManagementSection as AdminContentView } from '../admin/sections/ContentManagementSection';

export const AppRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPath } = useRBAC();

  // Normalize path: strip query parameters for route matching and remove trailing slashes
  const cleanPath = currentPath.split('?')[0];
  const path = cleanPath.endsWith('/') && cleanPath.length > 1 ? cleanPath.slice(0, -1) : cleanPath;

  const renderRoute = () => {
    // 1. DEDICATED USER SEARCH ROUTE (/search) on the same domain
    if (path === '/search') {
      return <UserSearchPage />;
    }

    // 2. SUPERADMIN ROUTES (/kalam-infos & /superadmin)
    if (path.startsWith('/kalam-infos') || path.startsWith('/superadmin')) {
      if (path === '/kalam-infos/login' || path === '/superadmin/login') {
        return <UnifiedLoginPage initialRole="superadmin" />;
      }

      // Role-protected Superadmin Console
      return (
        <SuperadminLayout>
          {(() => {
            const sub = path.startsWith('/kalam-infos')
              ? path.slice('/kalam-infos'.length)
              : path.slice('/superadmin'.length);

            switch (sub) {
              case '/search':
                return <SuperadminSearchView />;
              case '':
              case '/':
              case '/dashboard':
                return <SuperadminDashboardView />;
              case '/admins':
                return <SuperadminAdminsView />;
              case '/customers':
              case '/users':
                return <SuperadminCustomersView />;
              case '/products':
                return <SuperadminProductsView />;
              case '/orders':
                return <SuperadminOrdersView />;
              case '/permissions':
                return <SuperadminPermissionsView />;
              case '/settings':
              case '/logs':
              case '/security':
                return <SuperadminSettingsView />;
              default:
                return <SuperadminDashboardView />;
            }
          })()}
        </SuperadminLayout>
      );
    }

    // 3. ADMIN ROUTES (/adminpanel & /admin)
    if (path.startsWith('/adminpanel') || path.startsWith('/admin')) {
      if (path === '/adminpanel/login' || path === '/admin/login') {
        return <UnifiedLoginPage initialRole="admin" />;
      }

      // Role-protected Admin Portal
      return (
        <AdminLayout>
          {(() => {
            const sub = path.startsWith('/adminpanel')
              ? path.slice('/adminpanel'.length)
              : path.slice('/admin'.length);

            switch (sub) {
              case '/search':
                return <AdminSearchView />;
              case '':
              case '/':
              case '/dashboard':
                return <AdminDashboardView />;
              case '/products':
                return <AdminProductsView />;
              case '/orders':
                return <AdminOrdersView />;
              case '/content':
              case '/store-content':
                return <AdminContentView />;
              case '/customers':
                return <AdminCustomersView />;
              case '/reports':
                return <AdminReportsView />;
              default:
                return <AdminDashboardView />;
            }
          })()}
        </AdminLayout>
      );
    }

    // 4. CUSTOMER ROUTES
    if (path.startsWith('/customer')) {
      if (path === '/customer/login') {
        return <UnifiedLoginPage initialRole="customer" />;
      }

      if (path === '/customer/signup') {
        return <CustomerSignupPage />;
      }

      // Role-protected Customer Portal
      return (
        <CustomerLayout>
          {(() => {
            switch (path) {
              case '/customer/dashboard':
                return <CustomerDashboardView />;
              case '/customer/products':
                return <CustomerProductsView />;
              case '/customer/cart':
                return <CustomerCartView />;
              case '/customer/orders':
                return <CustomerOrdersView />;
              case '/customer/profile':
                return <CustomerProfileView />;
              default:
                return <CustomerDashboardView />;
            }
          })()}
        </CustomerLayout>
      );
    }

    // 5. PUBLIC STOREFRONT / ROOT
    return <>{children}</>;
  };

  return (
    <>
      <DualUrlPortalBar />
      {renderRoute()}
    </>
  );
};
