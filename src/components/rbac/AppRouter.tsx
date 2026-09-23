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

// Search Page
import { UserSearchPage } from '../../pages/UserSearchPage';

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

// Admin Enterprise Dashboard & Login Components
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminLogin } from '../admin/AdminLogin';

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

    // 3. ADMIN ROUTES (/adminpanel & /admin) -> Renders the full NanoTech Enterprise Admin Dashboard
    if (path.startsWith('/adminpanel') || path.startsWith('/admin')) {
      if (path === '/adminpanel/login' || path === '/admin/login') {
        return <AdminLogin />;
      }

      // Role-protected NanoTech Enterprise Admin Dashboard
      return <AdminDashboard />;
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
