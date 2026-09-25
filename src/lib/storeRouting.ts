/**
 * NanoTech Enterprise Store Routing & Deep Linking Engine
 * Centralizes mapping between browser URL paths and application views.
 */

export interface ParsedRoute {
  view: string;
  productId?: string;
  orderId?: string;
}

/**
 * Parses any incoming URL pathname into the corresponding Store view and parameters.
 */
export function getViewFromPath(pathname: string): ParsedRoute {
  const clean = pathname.split('?')[0].replace(/\/+$/, '') || '/';

  // If path is root or /store, return storefront home
  if (clean === '' || clean === '/' || clean === '/store') {
    return { view: 'home' };
  }

  // Remove leading /store if present (e.g. /store/products -> /products)
  const normalized = clean.startsWith('/store/')
    ? clean.slice('/store'.length)
    : clean;

  // Dedicated Product Detail Route: /store/product/:id or /product/:id
  if (normalized.startsWith('/product/')) {
    const id = normalized.slice('/product/'.length);
    return { view: 'product_detail', productId: id };
  }

  // Dedicated Order Detail Route: /store/order/:id or /order/:id
  if (normalized.startsWith('/order/')) {
    const id = normalized.slice('/order/'.length);
    return { view: 'orders', orderId: id };
  }

  switch (normalized) {
    case '/products':
      return { view: 'products' };
    case '/cart':
      return { view: 'cart' };
    case '/orders':
      return { view: 'orders' };
    case '/pc-builder':
    case '/pc_builder':
      return { view: 'pc_builder' };
    case '/price-tracker':
    case '/price_tracker':
      return { view: 'price_tracker' };
    case '/categories':
      return { view: 'categories' };
    case '/brands':
      return { view: 'brands' };
    case '/stores':
      return { view: 'stores' };
    case '/wishlist':
      return { view: 'wishlist' };
    case '/compare':
      return { view: 'compare' };
    case '/sell':
      return { view: 'sell' };
    case '/seller':
    case '/seller-dashboard':
    case '/seller_dashboard':
      return { view: 'seller_dashboard' };
    case '/search':
      return { view: 'search' };
    case '/chat':
    case '/messages':
      return { view: 'chat' };
    case '/about':
      return { view: 'about' };
    case '/contact':
      return { view: 'contact' };
    case '/help':
      return { view: 'help' };
    case '/login':
    case '/user/login':
    case '/user_login':
      return { view: 'user_login' };
    case '/register':
    case '/user/register':
    case '/user_register':
      return { view: 'user_register' };
    case '/verify':
    case '/user/verify':
    case '/user_verify_email':
      return { view: 'user_verify_email' };
    case '/dashboard':
    case '/user/dashboard':
    case '/user_dashboard':
      return { view: 'user_dashboard' };
    default:
      return { view: 'home' };
  }
}

/**
 * Converts a Store view name (and optional product/order ID) into a clean URL path.
 */
export function getPathFromView(
  view: string,
  productId?: string | null,
  orderId?: string | null
): string {
  switch (view) {
    case 'home':
      return '/store';
    case 'products':
      return '/store/products';
    case 'product_detail':
      return productId ? `/store/product/${productId}` : '/store/products';
    case 'cart':
      return '/store/cart';
    case 'orders':
      return orderId ? `/store/order/${orderId}` : '/store/orders';
    case 'pc_builder':
    case 'pc-builder':
      return '/store/pc-builder';
    case 'price_tracker':
    case 'price-tracker':
      return '/store/price-tracker';
    case 'categories':
      return '/store/categories';
    case 'brands':
      return '/store/brands';
    case 'stores':
      return '/store/stores';
    case 'wishlist':
      return '/store/wishlist';
    case 'compare':
      return '/store/compare';
    case 'sell':
      return '/store/sell';
    case 'seller_dashboard':
      return '/store/seller';
    case 'search':
      return '/search';
    case 'chat':
    case 'messages':
      return '/store/chat';
    case 'about':
      return '/store/about';
    case 'contact':
      return '/store/contact';
    case 'help':
      return '/store/help';
    case 'user_login':
      return '/store/login';
    case 'user_register':
      return '/store/register';
    case 'user_verify_email':
      return '/store/verify';
    case 'user_dashboard':
      return '/store/dashboard';
    case 'admin_dashboard':
      return '/admin/dashboard';
    case 'admin_login':
      return '/admin/login';
    case 'admin_register':
      return '/admin/register';
    case 'admin_verify_email':
      return '/admin/verify';
    default:
      return '/store';
  }
}
