import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import { UnifiedLoginPage } from './UnifiedLoginPage';



// Search Page
import { UserSearchPage } from '../../pages/UserSearchPage';

// Superadmin Components
import { SuperadminLayout } from './SuperadminLayout';
import { SuperadminDashboardView } from './SuperadminDashboardView';
import { SuperadminAdminsView } from './SuperadminAdminsView';
import { SuperadminCustomersView } from './SuperadminCustomersView';
import { SuperadminProductsView } from './SuperadminProductsView';
import { SuperadminOrdersView } from './SuperadminOrdersView';
import { SuperadminPermissionsView } from './SuperadminPermissionsView';
import { SuperadminSettingsView } from './SuperadminSettingsView';
import { SuperadminSearchView } from './SuperadminSearchView';

// Admin Enterprise Dashboard & Login Components
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminLogin } from '../admin/AdminLogin';

export const AppRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPath } = useRBAC();

  // Normalize path: strip query parameters for route matching and remove trailing slashes
  const cleanPath = currentPath.split('?')[0];
  const path = cleanPath.endsWith('/') && cleanPath.length > 1 ? cleanPath.slice(0, -1) : cleanPath;

  const renderRoute = () => {
    // 1. SUPERADMIN ROUTES (/superadmin & legacy /kalam-infos)
    if (path.startsWith('/superadmin') || path.startsWith('/kalam-infos')) {
      if (path === '/superadmin/login' || path === '/kalam-infos/login') {
        return <UnifiedLoginPage initialRole="superadmin" />;
      }

      // Role-protected Superadmin Console
      return (
        <SuperadminLayout>
          {(() => {
            const sub = path.startsWith('/superadmin')
              ? path.slice('/superadmin'.length)
              : path.slice('/kalam-infos'.length);

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



    // 5. PUBLIC STOREFRONT / ROOT
    return <>{children}</>;
  };

  return renderRoute();
};
