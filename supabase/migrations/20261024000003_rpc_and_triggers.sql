-- Migration: 20261024000003_rpc_and_triggers.sql
-- Description: Trusted RPC functions, timestamps triggers, and atomic submission procedures
-- Specification conformance: Atomic enquiry submission, unique human-readable references, audit triggers

-- ============================================================================
-- 1. TIMESTAMP TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Apply updated_at trigger across all core mutable tables
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_sales_updated_at
BEFORE UPDATE ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 2. AUTOMATIC PROFILE CREATION TRIGGER (ON AUTH SIGNUP)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, phone_e164, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
        NEW.phone,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE
    SET display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
        phone_e164 = COALESCE(EXCLUDED.phone_e164, public.profiles.phone_e164),
        updated_at = now();
    RETURN NEW;
END;
$$;

-- Trigger whenever an auth user is confirmed/created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- ============================================================================
-- 3. ATOMIC ENQUIRY SUBMISSION PROCEDURE (SECURE RPC)
-- ============================================================================

-- Submits an enquiry and its item snapshots atomically in a single transaction.
-- Requires an active authenticated session with a confirmed phone number (SEC-01).
-- Validates item inputs (SEC-03).
-- Generates collision-resistant human-readable reference code: ENQ-YYYYMMDD-XXXXXX with concurrency retry (SEC-05).
CREATE OR REPLACE FUNCTION public.submit_enquiry(
    p_customer_name TEXT DEFAULT NULL,
    p_customer_message TEXT DEFAULT NULL,
    p_items JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_customer_user_id UUID;
    v_verified_phone TEXT;
    v_customer_name TEXT;
    v_enquiry_id UUID;
    v_reference_code TEXT;
    v_date_prefix TEXT;
    v_random_suffix TEXT;
    v_attempts INT := 0;
    v_item JSONB;
    v_item_count INT;
    v_raw_product_id TEXT;
    v_product_uuid UUID;
    v_product_exists_name TEXT;
    v_item_name TEXT;
    v_raw_quantity TEXT;
    v_quantity INT;
    v_violated_constraint TEXT;
BEGIN
    -- 1. Enforce authenticated session
    v_customer_user_id := auth.uid();
    IF v_customer_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required: You must be logged in with a verified phone number to submit an enquiry.';
    END IF;

    -- 2. Derive verified phone number from trusted auth.users record (SEC-01)
    SELECT phone INTO v_verified_phone
    FROM auth.users
    WHERE id = v_customer_user_id
      AND phone_confirmed_at IS NOT NULL;

    IF v_verified_phone IS NULL OR trim(v_verified_phone) = '' THEN
        RAISE EXCEPTION 'Unverified phone: Your account does not have a confirmed phone number.';
    END IF;

    -- Resolve customer display name (fallback to profile display_name if empty)
    v_customer_name := trim(p_customer_name);
    IF v_customer_name IS NULL OR v_customer_name = '' THEN
        SELECT display_name INTO v_customer_name
        FROM public.profiles
        WHERE id = v_customer_user_id;
    END IF;

    -- 3. Validate items array
    IF p_items IS NULL OR jsonb_typeof(p_items) != 'array' THEN
        RAISE EXCEPTION 'Invalid enquiry items payload: An array of items is required.';
    END IF;

    v_item_count := jsonb_array_length(p_items);
    IF v_item_count IS NULL OR v_item_count = 0 THEN
        RAISE EXCEPTION 'At least one product item is required to submit an enquiry.';
    END IF;

    IF v_item_count > 50 THEN
        RAISE EXCEPTION 'Cart item limit exceeded. Maximum 50 unique items per enquiry.';
    END IF;

    -- 4. Generate unique collision-resistant reference code with concurrency retry (SEC-05)
    -- Format: ENQ-YYYYMMDD-XXXXXX (6 hex characters = 16.7M combinations/day)
    v_date_prefix := to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YYYYMMDD');
    LOOP
        v_attempts := v_attempts + 1;
        v_random_suffix := upper(encode(gen_random_bytes(3), 'hex'));
        v_reference_code := 'ENQ-' || v_date_prefix || '-' || v_random_suffix;

        BEGIN
            INSERT INTO public.enquiries (
                reference_code,
                customer_user_id,
                verified_phone_e164,
                customer_name,
                customer_message,
                status,
                created_at,
                updated_at
            ) VALUES (
                v_reference_code,
                v_customer_user_id,
                v_verified_phone,
                v_customer_name,
                trim(p_customer_message),
                'new',
                now(),
                now()
            ) RETURNING id INTO v_enquiry_id;

            -- Successfully inserted parent enquiry row
            EXIT;
        EXCEPTION
            WHEN unique_violation THEN
                -- Explicitly verify that the violation was caused by reference_code uniqueness
                GET STACKED DIAGNOSTICS v_violated_constraint = CONSTRAINT_NAME;
                IF v_violated_constraint IS DISTINCT FROM 'enquiries_reference_code_key' THEN
                    RAISE; -- Re-throw unrelated uniqueness violation immediately
                END IF;

                IF v_attempts >= 5 THEN
                    RAISE EXCEPTION 'Could not generate unique reference code after multiple attempts. Please try again.';
                END IF;
                -- Collision detected under concurrency on reference_code: retry with fresh suffix
        END;
    END LOOP;

    -- 5. Validate and insert all enquiry item snapshots (SEC-03)
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_raw_product_id := trim(v_item->>'product_id');
        v_product_uuid := NULL;
        v_product_exists_name := NULL;

        IF v_raw_product_id IS NOT NULL AND v_raw_product_id <> '' THEN
            -- Validate UUID regex before casting to prevent syntax exceptions
            IF v_raw_product_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
                RAISE EXCEPTION 'Invalid product ID format.';
            END IF;
            v_product_uuid := v_raw_product_id::UUID;

            -- Validate product exists, is published, not archived, and not discontinued
            SELECT name INTO v_product_exists_name
            FROM public.products
            WHERE id = v_product_uuid
              AND is_published = true
              AND is_archived = false
              AND availability_status != 'discontinued';

            IF NOT FOUND THEN
                RAISE EXCEPTION 'One or more items in your enquiry are no longer available in the catalogue.';
            END IF;
        END IF;

        -- Validate item name
        v_item_name := trim(COALESCE(v_item->>'product_name_snapshot', ''));
        IF v_item_name = '' THEN
            IF v_product_exists_name IS NOT NULL THEN
                v_item_name := v_product_exists_name;
            ELSE
                RAISE EXCEPTION 'Item name is required for all enquiry items.';
            END IF;
        END IF;

        -- Validate quantity as positive integer within bounds [1, 500] with length guard against overflow
        v_raw_quantity := trim(v_item->>'quantity');
        IF v_raw_quantity IS NULL OR v_raw_quantity = '' OR v_raw_quantity !~ '^[0-9]+$' THEN
            RAISE EXCEPTION 'Item quantity must be a positive integer.';
        END IF;

        IF length(v_raw_quantity) > 3 THEN
            RAISE EXCEPTION 'Item quantity must be between 1 and 500.';
        END IF;

        v_quantity := v_raw_quantity::INT;
        IF v_quantity < 1 OR v_quantity > 500 THEN
            RAISE EXCEPTION 'Item quantity must be between 1 and 500.';
        END IF;

        -- Insert snapshot
        INSERT INTO public.enquiry_items (
            enquiry_id,
            product_id,
            product_name_snapshot,
            sku_snapshot,
            variant_notes,
            quantity,
            display_price_mode_snapshot,
            display_price_label_snapshot,
            created_at
        ) VALUES (
            v_enquiry_id,
            v_product_uuid,
            v_item_name,
            trim(v_item->>'sku_snapshot'),
            trim(v_item->>'variant_notes'),
            v_quantity,
            trim(v_item->>'display_price_mode_snapshot'),
            trim(v_item->>'display_price_label_snapshot'),
            now()
        );
    END LOOP;

    -- 6. Record initial status history entry
    INSERT INTO public.enquiry_status_history (
        enquiry_id,
        old_status,
        new_status,
        note,
        changed_by,
        created_at
    ) VALUES (
        v_enquiry_id,
        NULL,
        'new',
        'Customer enquiry received via showroom website',
        v_customer_user_id,
        now()
    );

    -- Return confirmation payload
    RETURN jsonb_build_object(
        'success', true,
        'enquiry_id', v_enquiry_id,
        'reference_code', v_reference_code,
        'status', 'new',
        'created_at', now()
    );
END;
$$;

-- Restrict execution to authenticated users only (SEC-01)
REVOKE EXECUTE ON FUNCTION public.submit_enquiry(TEXT, TEXT, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_enquiry(TEXT, TEXT, JSONB) TO authenticated;

-- ============================================================================
-- 4. ADMIN STATUS TRANSITION RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_enquiry_status(
    p_enquiry_id UUID,
    p_new_status TEXT,
    p_internal_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_old_status TEXT;
BEGIN
    -- Only authorized admins can change enquiry statuses
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Administrator authorization is required.';
    END IF;

    -- Validate new status
    IF p_new_status NOT IN ('new', 'contacted', 'quotation_sent', 'confirmed', 'closed', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid enquiry status: %', p_new_status;
    END IF;

    -- Fetch current status
    SELECT status INTO v_old_status
    FROM public.enquiries
    WHERE id = p_enquiry_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enquiry not found.';
    END IF;

    -- Update enquiry
    UPDATE public.enquiries
    SET status = p_new_status,
        assigned_admin_id = COALESCE(assigned_admin_id, auth.uid()),
        updated_at = now()
    WHERE id = p_enquiry_id;

    -- Record status history and private note
    INSERT INTO public.enquiry_status_history (
        enquiry_id,
        old_status,
        new_status,
        note,
        changed_by,
        created_at
    ) VALUES (
        p_enquiry_id,
        v_old_status,
        p_new_status,
        trim(p_internal_note),
        auth.uid(),
        now()
    );

    RETURN jsonb_build_object(
        'success', true,
        'enquiry_id', p_enquiry_id,
        'old_status', v_old_status,
        'new_status', p_new_status
    );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_enquiry_status(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_enquiry_status(UUID, TEXT, TEXT) TO authenticated;
