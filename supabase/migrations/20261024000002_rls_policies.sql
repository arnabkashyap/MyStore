-- Migration: 20261024000002_rls_policies.sql
-- Description: Row Level Security (RLS) policies and security functions
-- Security boundary: Enforces database-level access controls for Baishya showroom

-- ============================================================================
-- 1. SECURITY HELPER FUNCTIONS
-- ============================================================================

-- Fast, security-definer helper to verify if the requesting user has an active admin role.
-- SET search_path prevents search_path hijacking vulnerabilities.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid()
    );
$$;

-- Helper to verify if the requesting user is the showroom owner
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.admin_users
        WHERE user_id = auth.uid() AND role = 'owner'
    );
$$;

-- Revoke public execution and re-grant explicitly
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

REVOKE EXECUTE ON FUNCTION public.is_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated, anon;

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. PROFILES POLICIES
-- ============================================================================

-- Users can read their own profile; admins can read any profile
CREATE POLICY "profiles_select_policy"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_admin());

-- Users can update their own profile; admins can update any profile
CREATE POLICY "profiles_update_policy"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid() OR public.is_admin())
WITH CHECK (id = auth.uid() OR public.is_admin());

-- Automated user profile insertion on signup (trigger will handle this)
CREATE POLICY "profiles_insert_policy"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR public.is_admin());

-- ============================================================================
-- 4. ADMIN USERS POLICIES (Strict role management)
-- ============================================================================

-- Admins can view who the other admins are
CREATE POLICY "admin_users_select_policy"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin());

-- ONLY the owner can grant or revoke admin roles. Public/customers cannot self-promote.
CREATE POLICY "admin_users_insert_policy"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (public.is_owner());

CREATE POLICY "admin_users_update_policy"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (public.is_owner())
WITH CHECK (public.is_owner());

CREATE POLICY "admin_users_delete_policy"
ON public.admin_users
FOR DELETE
TO authenticated
USING (public.is_owner());

-- ============================================================================
-- 5. CATEGORIES POLICIES
-- ============================================================================

-- Public can read active categories; admins can read all
CREATE POLICY "categories_select_policy"
ON public.categories
FOR SELECT
TO public
USING (is_active = true OR public.is_admin());

-- Admin-only category management
CREATE POLICY "categories_insert_policy"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "categories_update_policy"
ON public.categories
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "categories_delete_policy"
ON public.categories
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================================================
-- 6. PRODUCTS POLICIES
-- ============================================================================

-- Public can read ONLY published, non-archived products; admins can read all
CREATE POLICY "products_select_policy"
ON public.products
FOR SELECT
TO public
USING ((is_published = true AND is_archived = false) OR public.is_admin());

-- Admin-only product mutation
CREATE POLICY "products_insert_policy"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "products_update_policy"
ON public.products
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "products_delete_policy"
ON public.products
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================================================
-- 7. PRODUCT IMAGES POLICIES
-- ============================================================================

-- Public can view images belonging to published, non-archived products; admins can view all
CREATE POLICY "product_images_select_policy"
ON public.product_images
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1
        FROM public.products p
        WHERE p.id = product_id
          AND (p.is_published = true AND p.is_archived = false)
    )
    OR public.is_admin()
);

-- Admin-only image management
CREATE POLICY "product_images_insert_policy"
ON public.product_images
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "product_images_update_policy"
ON public.product_images
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "product_images_delete_policy"
ON public.product_images
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================================================
-- 8. BANNERS POLICIES
-- ============================================================================

-- Public can view active banners within valid date windows; admins can view all
CREATE POLICY "banners_select_policy"
ON public.banners
FOR SELECT
TO public
USING (
    (
        is_active = true
        AND (start_date IS NULL OR start_date <= now())
        AND (end_date IS NULL OR end_date >= now())
    )
    OR public.is_admin()
);

CREATE POLICY "banners_insert_policy"
ON public.banners
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "banners_update_policy"
ON public.banners
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "banners_delete_policy"
ON public.banners
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================================================
-- 9. ENQUIRIES & ENQUIRY ITEMS POLICIES
-- ============================================================================

-- Customers can view only their own submitted enquiries; admins can view all
CREATE POLICY "enquiries_select_policy"
ON public.enquiries
FOR SELECT
TO authenticated
USING (
    public.is_admin()
    OR (auth.uid() IS NOT NULL AND customer_user_id = auth.uid())
);

-- Note: Customer enquiry creation is performed through the trusted atomic RPC `submit_enquiry`.
-- Direct inserts on enquiries are restricted to admins.
CREATE POLICY "enquiries_insert_policy"
ON public.enquiries
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Admins can update enquiry status and assignment; customers cannot alter submitted enquiries
CREATE POLICY "enquiries_update_policy"
ON public.enquiries
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admins only can delete enquiries (if required for data purge)
CREATE POLICY "enquiries_delete_policy"
ON public.enquiries
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Enquiry items follow parent enquiry permissions
CREATE POLICY "enquiry_items_select_policy"
ON public.enquiry_items
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.enquiries e
        WHERE e.id = enquiry_id
          AND (public.is_admin() OR (auth.uid() IS NOT NULL AND e.customer_user_id = auth.uid()))
    )
);

CREATE POLICY "enquiry_items_insert_policy"
ON public.enquiry_items
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "enquiry_items_update_policy"
ON public.enquiry_items
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "enquiry_items_delete_policy"
ON public.enquiry_items
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Enquiry status history and private internal notes: STRICTLY ADMIN-ONLY
CREATE POLICY "enquiry_status_history_policy"
ON public.enquiry_status_history
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================================
-- 10. PRIVATE SALES REGISTER & PROFIT TRACKER POLICIES (Zero public/customer access)
-- ============================================================================

-- Sales
CREATE POLICY "sales_admin_policy"
ON public.sales
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Sale Items
CREATE POLICY "sale_items_admin_policy"
ON public.sale_items
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Sale Expenses
CREATE POLICY "sale_expenses_admin_policy"
ON public.sale_expenses
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Payments
CREATE POLICY "payments_admin_policy"
ON public.payments
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Sale Returns / Refunds
CREATE POLICY "sale_returns_admin_policy"
ON public.sale_returns
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================================
-- 11. AUDIT LOGS POLICIES (Strictly admin-only audit access)
-- ============================================================================

CREATE POLICY "audit_logs_select_policy"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "audit_logs_insert_policy"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());
