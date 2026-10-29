-- ====================================================================
-- KOSFEEKU SUPABASE DATABASE SCHEMA MIGRATION
-- Full-Stack Boarding House, Café & Co-working Platform
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('owner', 'staff', 'tenant');

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'tenant' NOT NULL,
  avatar_url TEXT,
  emergency_contact TEXT,
  id_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.staff_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  permission TEXT NOT NULL,
  granted_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, permission)
);

-- 3. KOST / ROOMS
CREATE TYPE bathroom_type AS ENUM ('private', 'shared');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance', 'reserved');

CREATE TABLE IF NOT EXISTS public.room_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  area_sqm NUMERIC NOT NULL,
  base_price_per_month NUMERIC NOT NULL CHECK (base_price_per_month >= 1000000),
  bathroom_type bathroom_type NOT NULL,
  max_occupancy INT DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_number TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.room_categories(id) ON DELETE RESTRICT NOT NULL,
  area_sqm NUMERIC NOT NULL,
  monthly_price NUMERIC NOT NULL CHECK (monthly_price >= 1000000),
  facilities TEXT[] DEFAULT '{}',
  bathroom_type bathroom_type NOT NULL,
  max_occupancy INT DEFAULT 1 NOT NULL,
  status room_status DEFAULT 'available' NOT NULL,
  floor INT DEFAULT 1 NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.room_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_code TEXT UNIQUE NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE RESTRICT NOT NULL,
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  duration_months INT NOT NULL CHECK (duration_months >= 1),
  monthly_price NUMERIC NOT NULL,
  deposit_amount NUMERIC NOT NULL,
  total_first_payment NUMERIC NOT NULL,
  status booking_status DEFAULT 'pending' NOT NULL,
  notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.rental_contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contract_number TEXT UNIQUE NOT NULL,
  booking_id UUID REFERENCES public.room_bookings(id) ON DELETE RESTRICT NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE RESTRICT NOT NULL,
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent NUMERIC NOT NULL,
  deposit_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  terms TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TYPE invoice_status AS ENUM ('unpaid', 'pending_verification', 'paid', 'overdue', 'cancelled');

CREATE TABLE IF NOT EXISTS public.rent_invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  contract_id UUID REFERENCES public.rental_contracts(id) ON DELETE RESTRICT NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE RESTRICT NOT NULL,
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
  period_month TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  deposit_amount NUMERIC DEFAULT 0,
  due_date DATE NOT NULL,
  status invoice_status DEFAULT 'unpaid' NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. CAFE MODULE
CREATE TYPE food_category AS ENUM ('noodles', 'rice', 'snacks', 'desserts', 'coffee', 'tea', 'non_coffee');

CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category food_category NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  description TEXT,
  image TEXT,
  available BOOLEAN DEFAULT TRUE NOT NULL,
  stock INT DEFAULT 100 NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TYPE cafe_order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE cafe_delivery_type AS ENUM ('dine_in', 'takeaway', 'room_delivery');

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_code TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  delivery_type cafe_delivery_type NOT NULL,
  table_number TEXT,
  room_number TEXT,
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC DEFAULT 0 NOT NULL,
  coupon_code TEXT,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' NOT NULL,
  order_status cafe_order_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE RESTRICT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_name TEXT NOT NULL,
  current_quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  min_alert_threshold NUMERIC DEFAULT 10,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. CO-WORKING MODULE
CREATE TABLE IF NOT EXISTS public.coworking_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INT NOT NULL,
  hourly_rate NUMERIC NOT NULL,
  daily_rate NUMERIC NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  description TEXT,
  is_available BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.coworking_reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_code TEXT UNIQUE NOT NULL,
  resource_id UUID REFERENCES public.coworking_resources(id) ON DELETE RESTRICT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_hours INT NOT NULL CHECK (duration_hours > 0),
  total_price NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' NOT NULL,
  status TEXT DEFAULT 'confirmed' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. PAYMENTS & PROMOTIONS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_ref TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'rent', 'cafe', 'coworking'
  reference_id TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  payer_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  min_purchase NUMERIC DEFAULT 0,
  applicable_category TEXT DEFAULT 'all',
  expires_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  points INT DEFAULT 0 NOT NULL,
  tier TEXT DEFAULT 'Silver' NOT NULL,
  total_earned INT DEFAULT 0 NOT NULL
);

-- 7. MAINTENANCE & COMPLAINTS
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  tenant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  room_number TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' NOT NULL,
  status TEXT DEFAULT 'submitted' NOT NULL,
  assigned_staff TEXT,
  resolution_notes TEXT,
  cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ
);

-- 8. COMMUNICATIONS & SETTINGS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link TEXT,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT,
  ip TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coworking_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, Owners can read all
CREATE POLICY "Profiles read policy" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner');

CREATE POLICY "Profiles update policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Rooms: Public can read available/occupied rooms. Owners can do all.
CREATE POLICY "Public read rooms" ON public.rooms
  FOR SELECT USING (true);

-- Bookings: Tenants read own, owners read all
CREATE POLICY "Tenant read bookings" ON public.room_bookings
  FOR SELECT USING (auth.uid() = tenant_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('owner', 'staff'));

CREATE POLICY "Tenant insert bookings" ON public.room_bookings
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);

-- Invoices: Tenants read own invoices, owners manage all
CREATE POLICY "Tenant read invoices" ON public.rent_invoices
  FOR SELECT USING (auth.uid() = tenant_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('owner', 'staff'));
