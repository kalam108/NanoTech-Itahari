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

    // 2. SUPERADMIN ROUTES
    if (path.startsWith('/superadmin')) {
      if (path === '/superadmin/login') {
        return <UnifiedLoginPage initialRole="superadmin" />;
      }

      // Role-protected Superadmin Console
      return (
        <SuperadminLayout>
          {(() => {
            switch (path) {
              case '/superadmin/search':
                return <SuperadminSearchView />;
              case '/superadmin/dashboard':
                return <SuperadminDashboardView />;
              case '/superadmin/admins':
                return <SuperadminAdminsView />;
              case '/superadmin/customers':
                return <SuperadminCustomersView />;
              case '/superadmin/products':
                return <SuperadminProductsView />;
              case '/superadmin/orders':
                return <SuperadminOrdersView />;
              case '/superadmin/permissions':
                return <SuperadminPermissionsView />;
              case '/superadmin/settings':
                return <SuperadminSettingsView />;
              default:
                return <SuperadminDashboardView />;
            }
          })()}
        </SuperadminLayout>
      );
    }

    // 3. ADMIN ROUTES
    if (path.startsWith('/admin')) {
      if (path === '/admin/login') {
        return <UnifiedLoginPage initialRole="admin" />;
      }

      // Role-protected Admin Portal
      return (
        <AdminLayout>
          {(() => {
            switch (path) {
              case '/admin/search':
                return <AdminSearchView />;
              case '/admin/dashboard':
                return <AdminDashboardView />;
              case '/admin/products':
                return <AdminProductsView />;
              case '/admin/orders':
                return <AdminOrdersView />;
              case '/admin/customers':
                return <AdminCustomersView />;
              case '/admin/reports':
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
