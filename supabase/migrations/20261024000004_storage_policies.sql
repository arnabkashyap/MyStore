-- Migration: 20261024000004_storage_policies.sql
-- Description: Supabase Storage bucket and access policies for showroom product imagery
-- Security boundaries: Enforces that product image bucket is distinct from private financial attachments

-- ============================================================================
-- 1. PROVISION STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- ============================================================================
-- 2. STORAGE OBJECT POLICIES
-- ============================================================================

-- Public can view/read images stored in product-images bucket
CREATE POLICY "product_images_storage_read_policy"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Only authorized admins can upload new product images
CREATE POLICY "product_images_storage_insert_policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
);

-- Only authorized admins can update existing product images
CREATE POLICY "product_images_storage_update_policy"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND public.is_admin()
)
WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
);

-- Only authorized admins can delete product images
CREATE POLICY "product_images_storage_delete_policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'product-images'
    AND public.is_admin()
);
