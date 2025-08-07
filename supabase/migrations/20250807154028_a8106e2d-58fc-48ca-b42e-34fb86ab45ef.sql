-- Create demo user and staff record for testing
-- First, we need to create a vendor for the demo user
INSERT INTO public.vendors (id, name, api_endpoint)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo Vendor', 'https://api.demo-vendor.com')
ON CONFLICT (id) DO NOTHING;

-- Create a demo staff record
-- Note: The user_id will need to be updated after the auth user is created
INSERT INTO public.staff (
  id,
  user_id, 
  vendor_id, 
  email, 
  role, 
  qr_badge_code
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002', -- Placeholder user_id that matches what we'll create in auth
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@demo.com',
  'owner',
  'DEMO_QR_123'
) ON CONFLICT (id) DO NOTHING;

-- Add some sample menu items for the demo vendor
INSERT INTO public.menu_items (
  id,
  vendor_id,
  name,
  price,
  prep_time_minutes,
  is_special,
  is_bestseller,
  active
) VALUES 
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'Classic Burger', 12.99, 8, false, true, true),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'Fish & Chips', 14.99, 12, false, false, true),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'Caesar Salad', 9.99, 5, false, false, true),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440000', 'Truffle Pasta', 18.99, 15, true, false, true)
ON CONFLICT DO NOTHING;