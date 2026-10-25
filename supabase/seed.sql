-- Seed Data: supabase/seed.sql
-- Description: Baseline showroom categories and admin bootstrap instructions
-- Note: Does NOT include fake credentials, real stock counts, or real financial transactions.

-- ============================================================================
-- 1. SHOWROOM CATEGORIES SEED DATA
-- ============================================================================

INSERT INTO public.categories (name, slug, description, sort_order, is_active)
VALUES
    (
        'Electronics',
        'electronics',
        'Smart 4K televisions, inverter air conditioners, refrigerators, and essential home appliances.',
        1,
        true
    ),
    (
        'Mobile Phones',
        'mobile-phones',
        'Latest 5G smartphones, feature phones, genuine chargers, audio gear, and showroom accessories.',
        2,
        true
    ),
    (
        'Steel Furniture',
        'steel-furniture',
        'Heavy-gauge multi-door steel almirahs, locker wardrobes, office storage units, and metal racks.',
        3,
        true
    ),
    (
        'Wooden Furniture',
        'wooden-furniture',
        'Handcrafted solid teak and engineered wood dining suites, double beds, dressing tables, and sets.',
        4,
        true
    ),
    (
        'Other Products',
        'other-products',
        'Showroom specialties, seasonal home utility items, and custom orders.',
        5,
        true
    )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- ============================================================================
-- 2. ADMIN USER BOOTSTRAP INSTRUCTIONS
-- ============================================================================
-- To bootstrap the showroom owner or website operator as an authorized administrator:
-- 1. Create the user in Supabase Auth via Phone OTP or Email.
-- 2. Note their UUID from the auth.users table (or Supabase Dashboard > Authentication > Users).
-- 3. Execute the following SQL statement in the Supabase SQL Editor:
--
--    INSERT INTO public.admin_users (user_id, role)
--    VALUES ('<PASTE-AUTH-USER-UUID-HERE>', 'owner')
--    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
--
-- IMPORTANT: Public registration must never allow self-promotion to an admin role.
-- Admin authorization is exclusively controlled by the admin_users table and enforced by is_admin().
