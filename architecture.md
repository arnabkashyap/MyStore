# Technical Architecture

## Baishya Furniture and Telectronics

**Status:** Proposed architecture for implementation\
**Stack:** React + Vite, Supabase, Vercel

## 1. Architecture goals

-   Deliver a responsive public product catalogue and enquiry flow.
-   Keep the private admin application and financial data secure.
-   Use managed services appropriate for a small showroom.
-   Support manual availability now and quantity-based inventory later.
-   Preserve historical sale values even when product catalogue data
    changes.
-   Keep implementation understandable and maintainable in Antigravity.

## 2. High-level system

``` text
Customer/Admin Browser
        |
        | HTTPS
        v
Vercel-hosted React + Vite application
        |
        | Supabase client using public anon/publishable key
        v
Supabase Auth ---- Phone OTP provider
        |
        +---- Postgres database with RLS
        |
        +---- Supabase Storage for product images
        |
        +---- Database functions / RPCs for atomic operations
```

The browser is an untrusted environment. It may contain the public
Supabase URL and anon/publishable key, but must never contain a
service-role key or other server secret. Database RLS and trusted
database functions enforce permissions.

## 3. Application structure

Suggested structure; adjust to the actual app only when needed:

``` text
baishya-showroom/
├── public/
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── routes.jsx
│   │   └── routeGuards.jsx
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── products/
│   │   ├── enquiry/
│   │   ├── forms/
│   │   └── ui/
│   ├── pages/
│   │   ├── public/
│   │   ├── auth/
│   │   ├── customer/
│   │   └── admin/
│   ├── layouts/
│   ├── features/
│   │   ├── catalogue/
│   │   ├── authentication/
│   │   ├── enquiries/
│   │   ├── admin-catalogue/
│   │   └── sales/
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── validation.js
│   │   └── formatters.js
│   ├── data/
│   │   └── development-seed.js
│   ├── styles/
│   └── main.jsx
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

This is a target structure, not a mandate to create every folder
immediately. Create folders as features are implemented.

## 4. Frontend routes

Suggested public routes: - `/` --- homepage - `/products` ---
catalogue - `/categories/:slug` --- category listing - `/products/:slug`
--- product details - `/enquiry` --- enquiry cart and submission -
`/enquiry/confirmation/:reference` --- submission confirmation -
`/login` --- phone OTP login - `/account` --- customer account, if
enquiry history is implemented

Suggested admin routes: - `/admin` --- private dashboard -
`/admin/products` --- product management - `/admin/products/new` and
`/admin/products/:id/edit` - `/admin/categories` --- category
management - `/admin/enquiries` and `/admin/enquiries/:id` -
`/admin/sales` and `/admin/sales/new` - `/admin/sales/:id` -
`/admin/reports` - `/admin/settings` - `/admin/audit` --- restricted
audit history

Route guards are useful for navigation and UX, but they are not security
boundaries. Every read/write must also be authorized in Supabase.

## 5. Supabase data model

Use UUID primary keys unless a table needs a separate public reference.
Add `created_at` and `updated_at` where appropriate. Use foreign keys,
check constraints, and indexes.

### 5.1 `profiles`

-   `id` UUID, primary key referencing `auth.users.id`
-   `display_name` nullable
-   `phone_e164` nullable, normalized phone format where possible
-   `created_at`, `updated_at`

Keep role assignment separate from user-editable profile fields. A
customer must not be able to update their own role.

### 5.2 `admin_users` or trusted role table

-   `user_id` UUID primary key referencing `auth.users.id`
-   `role` constrained to approved roles, e.g. `owner`, `admin`
-   `created_at`, `created_by`

Only trusted setup/migration/admin procedures may add or modify these
records. Never allow public self-promotion. RLS policies should use a
secure helper such as `is_admin()` that cannot be spoofed by a
user-editable profile field.

### 5.3 `categories`

-   `id`, `name`, `slug`, `description`
-   `sort_order`, `is_active`
-   `created_at`, `updated_at`

Unique slug. Public read limited to active categories; admin writes
restricted.

### 5.4 `products`

-   `id`, `category_id`
-   `name`, `slug`, `sku` nullable
-   `short_description`, `description`
-   `brand`, `model`, `attributes` JSONB only for flexible non-sensitive
    product attributes
-   `price_mode` constrained to `exact`, `range`, `enquiry`, `hidden`
-   `price_amount` nullable numeric
-   `price_min`, `price_max` nullable numeric
-   `availability_status` constrained to approved status values
-   `is_published`, `is_featured`, `is_archived`
-   `sort_order`, `created_by`, `updated_by`
-   `created_at`, `updated_at`

Add constraints so the selected price mode has the correct values.
Public read policy must only expose published and non-archived records.
Do not store private cost price in this public-facing table. Current
public selling price is not the historical price for sales reports.

### 5.5 `product_images`

-   `id`, `product_id`
-   `storage_path`, `alt_text`
-   `sort_order`, `is_cover`
-   `created_at`, `created_by`

Enforce at most one cover image per product where practical. Product
image uploads and deletes require admin authorization. Use a storage
policy aligned with product publication; never use the product bucket
for private financial files.

### 5.6 `enquiries`

-   `id`, unique public `reference_code`
-   `customer_user_id` nullable for guest-originated enquiries
-   `verified_phone_e164`
-   `customer_name` nullable
-   `customer_message` nullable
-   `status` constrained to approved enquiry statuses
-   `assigned_admin_id` nullable
-   `created_at`, `updated_at`
-   private internal fields such as follow-up notes should be separated
    into a private table or protected by stricter policies if customer
    access to the main enquiry row is allowed.

A guest who has not authenticated can still submit only after phone
verification. Prefer a trusted server/database submission path that
validates the verified identity and inserts the enquiry atomically. Do
not trust a client-supplied `verified=true` flag.

### 5.7 `enquiry_items`

-   `id`, `enquiry_id`, `product_id` nullable if product later
    archived/deleted
-   `product_name_snapshot`, `sku_snapshot` nullable
-   `variant_notes` nullable
-   `quantity` positive integer
-   `display_price_mode_snapshot`, `display_price_label_snapshot`
    nullable
-   `created_at`

Snapshots preserve what the customer enquired about. Do not treat the
displayed price snapshot as a confirmed sale price.

### 5.8 `enquiry_status_history`

-   `id`, `enquiry_id`, `old_status`, `new_status`
-   `changed_by`, `note` private
-   `created_at`

Admin-only access. Consider a database trigger or trusted RPC to prevent
missing history entries.

### 5.9 `sales`

-   `id`, unique `sale_reference`
-   `enquiry_id` nullable
-   `sold_at`
-   `status` constrained to `completed`, `cancelled`, `returned`, or a
    clearly defined partial-return model
-   `currency_code`, provisionally `INR`
-   `discount_total`
-   `additional_expenses_total` only if the design chooses a
    denormalized cache; the source of truth should be expense rows
-   `notes` private
-   `recorded_by`, `created_at`, `updated_at`

Do not store only a total profit field as the source of truth. Calculate
financial metrics from sale items, payments, returns/refunds, and
expenses, or maintain a carefully tested derived summary.

### 5.10 `sale_items`

-   `id`, `sale_id`
-   `product_id` nullable to preserve history after product
    archive/deletion
-   `product_name_snapshot`, `sku_snapshot`
-   `quantity`
-   `returned_quantity` or explicit return records, but choose one
    canonical model
-   `unit_cost_snapshot`
-   `unit_selling_price_snapshot`
-   `discount_amount`
-   `created_at`

Use nonnegative numeric constraints and positive quantities. Decide
whether discount is per unit or per line; document it and use it
consistently. Historical snapshots are immutable except through an
audited correction process.

### 5.11 `sale_expenses`

-   `id`, `sale_id`
-   `expense_type` such as delivery, installation, other
-   `amount`, `description`, `incurred_at`
-   `recorded_by`, `created_at`

General overheads that are not tied to one sale should use a separate
`business_expenses` table if needed, rather than being incorrectly
attributed to product gross profit.

### 5.12 `payments`

-   `id`, `sale_id`
-   `amount`, `payment_method`
-   `paid_at`, `reference_note` nullable
-   `recorded_by`, `created_at`

Support partial payments by multiple payment rows. Do not store card
numbers, CVVs, OTPs, or payment credentials. Outstanding balance
calculation must follow the defined cancellation/refund policy.

### 5.13 `sale_returns` / `refunds` (recommended)

Use explicit return/refund records for auditable adjustments: -
return/refund ID, sale ID and optional sale item ID - quantity returned
where applicable - refund amount - reason and date - recorded admin and
timestamps

Pick a consistent model before implementing reports. Avoid representing
the same return both by editing original quantities and by adding a
separate adjustment that double-counts it.

### 5.14 `audit_logs`

-   `id`, `actor_user_id`
-   `action`, `entity_type`, `entity_id`
-   timestamp and minimal safe metadata

Admin-only read. Insert events through trusted functions/triggers for
important financial/admin actions. Avoid logging OTPs, tokens, or
unnecessary personal data.

### 5.15 Future inventory tables

When quantity inventory is approved, add: - `inventory_movements`:
product, movement type, quantity delta, reason/reference, actor,
timestamp. - Optional stock balance as a derived/cached value. Do not
simulate exact stock with the current manual status field.

## 6. Security and Row Level Security

Enable RLS on all tables reachable through the Supabase client API.

Policy intent: - `categories`: public SELECT for active categories;
admin-only writes. - `products`: public SELECT only for published,
non-archived products; admin-only writes. - `product_images`: public
SELECT only when associated product is published/non-archived;
admin-only mutations. - `profiles`: user can read/update a narrow set of
their own fields; admin access only where needed. Prevent role
changes. - `admin_users`: only a trusted admin bootstrap path can modify
roles; never allow a user to grant themselves admin. - `enquiries`:
customers can read only their own enquiries if customer history is
enabled; admins can read/manage all. Guest submission should go through
a trusted secure function that verifies the authenticated phone
identity. - `enquiry_items`: access follows parent enquiry
authorization. - `enquiry_status_history`: admin-only. - `sales`,
`sale_items`, `sale_expenses`, `payments`, `returns/refunds`,
`business_expenses`, `audit_logs`: admin-only. - Storage: public read
only for approved public product images; uploads/deletes restricted to
admins.

Do not use an email or phone number supplied in the request as proof of
admin identity. Use `auth.uid()` and a protected role mapping. Test
policies using anonymous, customer A, customer B, and admin sessions.

## 7. Atomic operations and trusted functions

Use a secure database function/RPC or a trusted server endpoint for
operations that require multiple coordinated writes: - Create enquiry
and all enquiry items in one transaction. - Generate unique reference
numbers safely. - Create a sale and its sale items/expenses/payments
coherently. - Record returns/refunds and related inventory/payment
adjustments. - Record audit history consistently.

Functions should validate quantities, amounts, status transitions, and
authorization. If a `SECURITY DEFINER` function is used, set a safe
`search_path`, grant execute only to intended roles, and review every
access path carefully.

## 8. Financial calculations

Use a single tested calculation convention across UI, reports, and CSV
exports. For a basic completed sale before returns: - line gross =
quantity × unit selling price - line net = line gross − allocated
discount - line COGS = quantity × unit cost snapshot - gross profit =
net revenue − COGS - estimated net profit = gross profit − sale-specific
expenses

For returns, adjust net revenue, COGS, payment/refund balance, and
quantity according to the selected policy. If returned stock is not
resellable, its cost treatment may differ; the first release should
document a simple operational policy and clearly label reports as
estimates.

Never divide by zero for margin. Use decimal/numeric database types
rather than floating-point types for money. Round for display, not
repeatedly during intermediate calculations.

## 9. Authentication and OTP

-   Configure Supabase phone authentication and an appropriate SMS
    provider.
-   Verify provider support, destination country, rate limits, costs,
    and deliverability before production.
-   Use OTP only as a verification/authentication mechanism; never store
    OTP values in application tables.
-   Apply cooldowns and sensible error messages.
-   If OTP provider setup is unavailable in development, use a clearly
    labelled local-only mock that cannot be enabled in production. Do
    not pretend an unverified phone is verified.
-   Define session expiry and logout behavior.

## 10. Environment and deployment

Expected client environment variables: - `VITE_SUPABASE_URL` -
`VITE_SUPABASE_ANON_KEY` or the current Supabase publishable key
appropriate to the project

The exact public-key variable name should match the selected Supabase
project setup. Public client keys are protected by RLS; they are not
secret keys.

Rules: - Keep `.env.local` ignored by Git. - Commit `.env.example` with
placeholder values only. - Never expose `SUPABASE_SERVICE_ROLE_KEY` in
frontend variables or client bundles. - If privileged operations need
server credentials, run them only in a trusted server-side environment
with restricted access. - Deploy frontend to Vercel with the required
public environment variables configured per environment. - Apply
migrations to the intended Supabase project deliberately; do not run
destructive migrations on production without review. - Configure SPA
route fallback on Vercel if required by the selected routing setup.

## 11. Testing strategy

### Frontend

-   Responsive layouts, product gallery, search/filter behavior, enquiry
    cart quantity updates, validation, loading/error states.

### Database/security

-   Anonymous cannot read unpublished products or private tables.
-   Customer cannot read another customer's profile/enquiry.
-   Customer cannot read/write sales, costs, payments, expenses, or
    audit logs.
-   Customer cannot self-assign admin.
-   Admin can perform authorized management tasks.

### Business logic

-   Price mode validation.
-   Unique enquiry/sale references.
-   Atomic enquiry submission.
-   Financial calculations for discount, partial payment, cancellation,
    return, refund, and zero revenue.
-   Historical snapshots remain stable after catalogue edits.
-   CSV exports reconcile with dashboard totals.

## 12. Architecture decisions to confirm later

-   Whether customer enquiry history is part of release one.
-   Whether both admins have equal privileges or the owner has a
    stronger role.
-   Exact phone OTP provider and budget.
-   Sale tax/discount conventions.
-   Return/refund and returned-stock handling.
-   Whether to use Supabase Edge Functions for any trusted workflows.
-   Whether to add automated testing framework and CI in the initial
    setup.
