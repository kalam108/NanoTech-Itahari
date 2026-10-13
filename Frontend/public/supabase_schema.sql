-- ============================================================
-- COMPLETE NANOTECH SUPABASE SCHEMA SCRIPT (SEQUENTIAL FIX)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sellers
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'suspended', 'rejected')),
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_name TEXT,
  description TEXT,
  product_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(12, 2),
  category TEXT NOT NULL,
  condition TEXT NOT NULL DEFAULT 'brand_new' CHECK (condition IN ('brand_new', 'like_new', 'refurbished', 'used')),
  brand TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  seller_id TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
  seller_name TEXT,
  seller_rating NUMERIC(3, 2) DEFAULT 5.00,
  seller_verified BOOLEAN DEFAULT false,
  stock INTEGER NOT NULL DEFAULT 1 CHECK (stock >= 0),
  is_featured BOOLEAN DEFAULT false,
  specifications JSONB DEFAULT '[]'::jsonb,
  warranty TEXT,
  location TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) DEFAULT 0,
  discount NUMERIC(12, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  shipping_address JSONB NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  estimated_delivery TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  seller_id TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tally Accounts
CREATE TABLE IF NOT EXISTS public.tally_accounts (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  sub_type TEXT NOT NULL,
  opening_balance NUMERIC(14, 2) DEFAULT 0.00,
  current_balance NUMERIC(14, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tally Vouchers
CREATE TABLE IF NOT EXISTS public.tally_vouchers (
  id TEXT PRIMARY KEY,
  voucher_number TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'receipt', 'journal', 'contra', 'sales', 'purchase')),
  debit_account TEXT REFERENCES public.tally_accounts(id) ON DELETE RESTRICT,
  credit_account TEXT REFERENCES public.tally_accounts(id) ON DELETE RESTRICT,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
  reference TEXT,
  payment_method TEXT,
  narration TEXT,
  status TEXT DEFAULT 'posted' CHECK (status IN ('draft', 'posted', 'cancelled')),
  approved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Excel Workbooks & Sheets
CREATE TABLE IF NOT EXISTS public.excel_workbooks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  active_sheet_id TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.excel_sheets (
  id TEXT PRIMARY KEY,
  workbook_id TEXT REFERENCES public.excel_workbooks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  cells JSONB DEFAULT '{}'::jsonb,
  row_count INTEGER DEFAULT 100,
  col_count INTEGER DEFAULT 26,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Banners & Offers
CREATE TABLE IF NOT EXISTS public.website_banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  tag TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT DEFAULT 'hero_slider',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.website_offers (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC(5, 2) NOT NULL,
  description TEXT,
  min_spend NUMERIC(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tally_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tally_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excel_workbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excel_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_offers ENABLE ROW LEVEL SECURITY;

-- 14. Add Access Policies
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "All Access Profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public Read Sellers" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "All Access Sellers" ON public.sellers FOR ALL USING (true);

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "All Access Categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "All Access Products" ON public.products FOR ALL USING (true);

CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "All Access Orders" ON public.orders FOR ALL USING (true);

CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "All Access Reviews" ON public.reviews FOR ALL USING (true);

CREATE POLICY "Public Read Messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "All Access Messages" ON public.messages FOR ALL USING (true);

CREATE POLICY "Public Read Tally Accounts" ON public.tally_accounts FOR SELECT USING (true);
CREATE POLICY "All Access Tally Accounts" ON public.tally_accounts FOR ALL USING (true);

CREATE POLICY "Public Read Tally Vouchers" ON public.tally_vouchers FOR SELECT USING (true);
CREATE POLICY "All Access Tally Vouchers" ON public.tally_vouchers FOR ALL USING (true);

CREATE POLICY "Public Read Excel Workbooks" ON public.excel_workbooks FOR SELECT USING (true);
CREATE POLICY "All Access Excel Workbooks" ON public.excel_workbooks FOR ALL USING (true);

CREATE POLICY "Public Read Excel Sheets" ON public.excel_sheets FOR SELECT USING (true);
CREATE POLICY "All Access Excel Sheets" ON public.excel_sheets FOR ALL USING (true);

CREATE POLICY "Public Read Banners" ON public.website_banners FOR SELECT USING (true);
CREATE POLICY "All Access Banners" ON public.website_banners FOR ALL USING (true);

CREATE POLICY "Public Read Offers" ON public.website_offers FOR SELECT USING (true);
CREATE POLICY "All Access Offers" ON public.website_offers FOR ALL USING (true);

-- 15. Initial Super Admin Profile
INSERT INTO public.profiles (id, email, full_name, role, status)
VALUES ('user-super-admin-01', 'nenotech108@gmail.com', 'NanoTech Super Admin', 'admin', 'active')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = 'admin';
