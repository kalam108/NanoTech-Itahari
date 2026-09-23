import React, { useState } from 'react';
import { ServerProvider } from './context/ServerContext';
import { AppProvider, useApp } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import { RBACProvider } from './context/RBACContext';
import { AppRouter } from './components/rbac/AppRouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';
import { HardwareAIFloatingButton } from './components/layout/HardwareAIFloatingButton';
import { AuthModal } from './components/auth/AuthModal';
import { AIProductAdvisor } from './components/products/AIProductAdvisor';
import { AddToCartPaymentModal } from './components/cart/AddToCartPaymentModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { ServerDiagnosticsModal } from './components/common/ServerConnectivityStatus';

// Pages & Views
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { UserOrdersPage } from './components/orders/UserOrdersPage';
import { ChatView } from './components/chat/ChatView';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SellPage } from './pages/SellPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { WishlistPage } from './pages/WishlistPage';
import { ComparePage } from './pages/ComparePage';
import { PCBuilderPage } from './pages/PCBuilderPage';
import { BrandsPage } from './pages/BrandsPage';
import { StoresPage } from './pages/StoresPage';
import { PriceTrackerPage } from './pages/PriceTrackerPage';
import { AboutPage, ContactPage, HelpPage } from './pages/AboutContactHelpPages';
import { UserRegisterPage } from './pages/auth/UserRegisterPage';
import { UserVerifyEmailPage } from './pages/auth/UserVerifyEmailPage';
import { UserLoginPage } from './pages/auth/UserLoginPage';
import { UserDashboardPage } from './pages/auth/UserDashboardPage';
import { AdminRegisterPage } from './pages/auth/AdminRegisterPage';
import { AdminVerifyEmailPage } from './pages/auth/AdminVerifyEmailPage';
import { AdminLogin } from './components/admin/AdminLogin';

function MainLayout() {
  const {
    currentView,
    isAddToCartModalOpen,
    setIsAddToCartModalOpen,
    lastAddedProduct,
    lastAddedQuantity,
    openCheckoutModalWithPayment,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    checkoutInitialMethod,
    checkoutInitialBank,
  } = useApp();
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // If in isolated Admin Dashboard mode, render full enterprise console
  if (currentView === 'admin_dashboard') {
    return (
      <>
        <ToastContainer />
        <AdminDashboard />
      </>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)} />;
      case 'products':
        return <ProductsPage />;
      case 'product_detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'orders':
        return <UserOrdersPage />;
      case 'chat':
      case 'messages':
        return <ChatView />;
      case 'search':
        return <UserSearchPage />;
      case 'seller_dashboard':
        return <SellerDashboard />;
      case 'sell':
        return <SellPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'compare':
        return <ComparePage />;
      case 'pc_builder':
      case 'pc-builder':
        return <PCBuilderPage />;
      case 'brands':
        return <BrandsPage />;
      case 'stores':
        return <StoresPage />;
      case 'price_tracker':
      case 'price-tracker':
        return <PriceTrackerPage />;
      case 'user_register':
        return <UserRegisterPage />;
      case 'user_verify_email':
        return <UserVerifyEmailPage />;
      case 'user_login':
        return <UserLoginPage />;
      case 'user_dashboard':
        return <UserDashboardPage />;
      case 'admin_register':
        return <AdminRegisterPage />;
      case 'admin_verify_email':
        return <AdminVerifyEmailPage />;
      case 'admin_login':
        return <AdminLogin />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <HomePage onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)} />;
    }
  };

  const isUserDashboardView = currentView === 'user_dashboard' || currentView === 'orders';

  return (
    <div
      className={`min-h-screen ${isUserDashboardView ? 'bg-[#fdfdfd]' : 'bg-white'} text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden w-full max-w-full`}
    >
      <ToastContainer />
      <Header onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)} />

      <main className={`flex-1 relative z-10 ${isUserDashboardView ? 'bg-[#fdfdfd]' : 'bg-white'}`}>
        {renderContent()}
      </main>

      <Footer />

      {/* Floating Hardware AI in Right Down Side with Glossy 360-Color Logo */}
      <HardwareAIFloatingButton
        isOpen={isAiAdvisorOpen}
        onClick={() => setIsAiAdvisorOpen(prev => !prev)}
      />

      {/* Global Modals */}
      <AuthModal />
      <AIProductAdvisor isOpen={isAiAdvisorOpen} onClose={() => setIsAiAdvisorOpen(false)} />
      <AddToCartPaymentModal
        isOpen={isAddToCartModalOpen}
        onClose={() => setIsAddToCartModalOpen(false)}
        product={lastAddedProduct}
        quantity={lastAddedQuantity}
        onProceedToCheckout={(method, bank) => {
          openCheckoutModalWithPayment(method, bank);
        }}
      />
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        initialMethod={checkoutInitialMethod}
        initialBank={checkoutInitialBank}
      />
      <ServerDiagnosticsModal />
    </div>
  );
}

export function App() {
  return (
    <ServerProvider>
      <AppProvider>
        <AdminProvider>
          <RBACProvider>
            <AppRouter>
              <MainLayout />
            </AppRouter>
          </RBACProvider>
        </AdminProvider>
      </AppProvider>
    </ServerProvider>
  );
}

export default App;
