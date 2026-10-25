# Supabase Database & Security Setup Guide

## Baishya Furniture and Telectronics — Phase 2 Foundation

This directory contains the version-controlled SQL migrations, Row Level Security (RLS) policies, storage bucket configurations, and seed scripts for the Baishya Furniture and Telectronics showroom backend.

---

### Migration Inventory

| Migration File | Description | Security Scope |
|---|---|---|
| [`migrations/20261024000001_core_schema.sql`](file:///C:/ANTIGRAVITY/MyStore/supabase/migrations/20261024000001_core_schema.sql) | Core tables, foreign keys, check constraints, timestamps, and indexes. | Defines strict data structures for profiles, admin roles, categories, products, images, banners, enquiries, enquiry items, sales, sale items, expenses, payments, returns, and audit logs. |
| [`migrations/20261024000002_rls_policies.sql`](file:///C:/ANTIGRAVITY/MyStore/supabase/migrations/20261024000002_rls_policies.sql) | Row Level Security (RLS) policies and security functions (`is_admin()`, `is_owner()`). | Enforces that public users can only read published catalogue items. Confines sales, costs, profits, payments, expenses, internal notes, and audit logs exclusively to verified admins. Enquiries are readable only by their authenticated owner and admins. |
| [`migrations/20261024000003_rpc_and_triggers.sql`](file:///C:/ANTIGRAVITY/MyStore/supabase/migrations/20261024000003_rpc_and_triggers.sql) | Trusted database functions, updated_at triggers, profile creation trigger, and atomic enquiry submission RPC. | Generates collision-resistant reference numbers (`ENQ-YYYYMMDD-XXXXXX`), enforces confirmed phone verification via `auth.users.phone_confirmed_at`, validates item UUIDs and quantities, and inserts enquiry + items in a single atomic transaction. |
| [`migrations/20261024000004_storage_policies.sql`](file:///C:/ANTIGRAVITY/MyStore/supabase/migrations/20261024000004_storage_policies.sql) | Storage bucket `product-images` provisioning and access rules. | Public read for product images; admin-only upload, update, and delete. Restricts MIME types to safe raster formats (JPEG, PNG, WebP, AVIF) to eliminate Stored XSS risks from executable XML/SVG formats. |
| [`seed.sql`](file:///C:/ANTIGRAVITY/MyStore/supabase/seed.sql) | Initial category seed and admin bootstrap instructions. | Populates baseline showroom categories without inventing real inventory or fake credentials. |

---

### How to Apply Migrations

> [!IMPORTANT]
> These migration scripts are designed as **one-time, sequential baseline migrations** for an unapplied/fresh Supabase project. If you are applying them manually via the SQL Editor, apply them strictly in the numbered order (`01 -> 02 -> 03 -> 04 -> seed`).
>
> If a statement fails during initial manual setup, **do not repeatedly re-run the entire script blindly**. Inspect the specific error, resolve the underlying condition (e.g. drop any partially created object from that specific failed step), and resume cleanly.

#### Option A: Via the Supabase Web Dashboard (Recommended for Initial Setup)

1. **Log in to Supabase**: Navigate to [https://supabase.com/dashboard](https://supabase.com/dashboard) and create or select your project.
2. **Open the SQL Editor**: In the left sidebar, click on **SQL Editor**.
3. **Execute Migrations in Order**:
   - Copy the contents of `migrations/20261024000001_core_schema.sql` and click **Run**.
   - Copy the contents of `migrations/20261024000002_rls_policies.sql` and click **Run**.
   - Copy the contents of `migrations/20261024000003_rpc_and_triggers.sql` and click **Run**.
   - Copy the contents of `migrations/20261024000004_storage_policies.sql` and click **Run**.
   - Copy the contents of `seed.sql` and click **Run** to load initial categories.
4. **Verify Database Structure**:
   - In the left sidebar under **Table Editor**, confirm all 15 tables are present with RLS enabled (indicated by a green shield icon).
   - Under **Storage**, confirm the `product-images` bucket is created with JPEG, PNG, WebP, and AVIF allowed MIME types.

---

#### Option B: Via the Supabase CLI

If you have Docker and the Supabase CLI installed:

```bash
# Initialize local Supabase instance
supabase start

# Link to your remote Supabase project (replace with your project ref)
supabase link --project-ref <your-project-id>

# Push all migrations sequentially (tracked via schema_migrations)
supabase db push

# Optional: Apply baseline category seed
supabase db reset
```

---

### Authentication & Enquiry Submission Protocol

- **RPC Signature:**  
  `public.submit_enquiry(p_customer_name TEXT, p_customer_message TEXT, p_items JSONB)`
- **Phone Verification Requirement:**  
  The RPC does **not** trust client-supplied phone numbers or verification booleans. It strictly requires `auth.uid() IS NOT NULL` and queries `auth.users` directly to confirm that `phone_confirmed_at IS NOT NULL`.
- **Note on Phone OTP Provider:**  
  Checking `phone_confirmed_at` in the database enforces the security gate at the relational level. Actual SMS OTP delivery and frontend authentication flows require enabling a phone provider (e.g. Twilio, MessageBird) in the Supabase Dashboard under **Authentication > Providers > Phone**, which will be integrated with the client in Phase 4.

---

### Administrator Bootstrapping Protocol

To establish the initial admin group (the showroom owner and the website operator) without exposing privilege escalation vulnerabilities:

1. Have the owner or operator sign up in your Supabase Auth instance (via Phone OTP once configured, or through the Supabase Dashboard under **Authentication > Users > Add User**).
2. Note their assigned `UUID` from the `auth.users` table.
3. In the Supabase **SQL Editor**, grant admin authorization using the trusted database-side insert:

```sql
INSERT INTO public.admin_users (user_id, role)
VALUES ('<PASTE-USER-UUID-HERE>', 'owner')
ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
```

> [!SECURITY-NOTE]
> Public users cannot insert or update rows in `public.admin_users`. The `is_admin()` and `is_owner()` functions evaluate `auth.uid()` against this table with `SECURITY DEFINER` and `SET search_path = public`, ensuring zero risk of client-side role tampering.

---

### Environment Variables & Credentials Protocol

When ready to link the client in future phases:

1. Create a local `.env.local` file (this file is already ignored in `.gitignore`):
   ```env
   VITE_SUPABASE_URL=https://<your-actual-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-actual-public-anon-key>
   ```
2. **Never** put `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, `.env.example`, or any client-side file. The service-role key bypasses Row Level Security and must remain private to secure backend/admin environments only.
