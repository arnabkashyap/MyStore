# Project Context

## Baishya Furniture and Telectronics

This document is the shared working context for developers and AI coding
agents. Read it before making changes. It records the business intent,
confirmed decisions, terminology, constraints, and current assumptions.

## 1. Business context

Baishya Furniture and Telectronics is a newly opened physical showroom.
Its catalogue spans multiple product types: - Electronics - Mobile
phones - Steel furniture - Wooden furniture - Other categories that may
be added later

The website supports showroom discovery and product enquiries. It is not
initially a full e-commerce store. The owner confirms availability,
final price, and the sale by phone.

## 2. Confirmed decisions

-   Project is new and will be built from scratch.
-   Project folder/name: `baishya-showroom`.
-   Business display name supplied:
    `Baishya Furniture and Telectronics`.
-   Frontend: React + Vite using JavaScript and CSS unless later
    explicitly changed.
-   Backend/database/auth/storage: Supabase.
-   Hosting target: Vercel.
-   Customer browsing: guest access is allowed.
-   Customer login: optional phone-number OTP sign-in.
-   Enquiry submission: phone verification required before submission.
-   Order flow: enquiry only; owner confirms by phone. No online
    checkout/payment in the initial release.
-   Initial inventory model: manual availability status, not exact stock
    counts.
-   Initial admin group: the owner and the website operator. Each should
    have an individual account.
-   Admin-managed product gallery: multiple images per product, with
    order and cover image.
-   Price display is flexible per product.
-   A private manual sales register and profit tracker are part of the
    product requirements from the start.
-   Financial and customer-private information must be protected by
    database policies, not only frontend hiding.

## 3. Core product principles

1.  **Enquiry is not an order.** Submitting an enquiry only asks the
    showroom to follow up. It does not reserve stock, confirm a price,
    or create revenue.
2.  **Guest-friendly catalogue.** Do not force a customer to sign in
    merely to browse products.
3.  **Verified phone at submission.** A customer-entered phone number is
    not verified until OTP authentication succeeds.
4.  **Truthful catalogue.** Do not invent real products, prices, stock,
    contact details, address, or hours. Use clearly marked seed/demo
    data only during development.
5.  **Private financial data.** Cost prices, sales, expenses, payment
    history, margins, and profit are admin-only.
6.  **Historical accuracy.** A sale stores the product and price/cost
    snapshots used at that time. Editing today's product listing must
    not rewrite history.
7.  **Secure by default.** Every table exposed through Supabase APIs
    requires intentional RLS policies. Frontend guards improve UX but
    are not authorization.
8.  **Extensible categories.** Categories must be data-driven, not
    hard-coded to only four types.
9.  **Mobile first.** Customers may browse on phones; admin workflows
    should also remain usable on mobile.
10. **Incremental implementation.** Work phase by phase. Do not build
    future features prematurely or change the stack without approval.

## 4. User types

### Guest

Can read the public catalogue and build a local enquiry cart. Must
verify phone before final submission.

### Customer

Authenticated by phone OTP. Can access their own permitted account data
only. If enquiry history is implemented, it must be filtered by the
authenticated identity at the database layer.

### Admin

One of the two explicitly authorized people. Can manage products,
categories, images, enquiries, sales, expenses, and private reports
according to assigned permissions.

Public registration must never grant an admin role. Admin authorization
must be provisioned through a trusted process and verified in database
policies.

## 5. Catalogue rules

### Price display modes

-   `exact`: show a single amount.
-   `range`: show a minimum and maximum amount.
-   `enquiry`: show "Price on enquiry".
-   `hidden`: do not display price.

Validate the relevant amount fields based on mode. Never show a zero or
stale placeholder as a real price.

### Availability statuses

Use stable internal values and separate human-readable labels: -
`available` --- Available - `out_of_stock` --- Out of stock -
`available_on_order` --- Available on order - `coming_soon` --- Coming
soon - `discontinued` --- Discontinued

Availability is manually maintained in the first release. Do not infer
stock counts or automatically decrement quantity.

### Product images

-   A product can have one or more images.
-   Store image order and cover-image selection.
-   Public pages should display only approved images for published
    products.
-   Keep product image storage separate from private financial documents
    if those are ever added.

## 6. Enquiry rules

-   Enquiry can include multiple products and quantities.
-   Customer may include optional notes.
-   Require verified phone before submission.
-   Generate a unique public reference code.
-   Store item snapshots so the enquiry remains understandable if the
    catalogue changes.
-   Confirmation page must say that the showroom will contact the
    customer; do not say the order is confirmed.
-   Admin follow-up notes are private.
-   Enquiry status values: `new`, `contacted`, `quotation_sent`,
    `confirmed`, `closed`, `cancelled`.
-   Only a real sale recorded by an admin is included in sales/profit
    reports.

## 7. Sales and profit terminology

-   **Sale record:** a manual record of a real transaction entered by an
    admin.
-   **Sale item snapshot:** product name/SKU, quantity, unit cost, unit
    selling price, discount, and any agreed line-level details at sale
    time.
-   **Net revenue:** valid sales after discounts and recorded
    returns/refunds, following documented conventions.
-   **COGS:** cost of goods sold for the net quantity sold, using the
    historical cost snapshot.
-   **Gross profit:** net revenue minus COGS.
-   **Additional expense:** sale-related cost such as delivery or
    installation.
-   **Estimated net profit:** gross profit minus recorded expenses. This
    is an operational estimate, not formal accounting.
-   **Outstanding balance:** amount due after recorded payments,
    adjusted for cancellations/refunds/credits under the documented
    policy.
-   **Gross margin:** gross profit / net revenue × 100; do not divide by
    zero.

Do not mix enquiry value with actual revenue. Do not count cancelled
sales as completed revenue. Define and test return/refund behavior
before relying on reports.

## 8. Technical conventions

-   Use React functional components and hooks.
-   Keep routes/pages separate from reusable components and data-access
    helpers.
-   Keep Supabase client setup in a single module,
    e.g. `src/lib/supabase.js`.
-   Use environment variables for Supabase URL and public
    anon/publishable key. These client-side values are not substitutes
    for RLS.
-   Never place service-role keys in `VITE_*` variables or browser code.
-   Use SQL migrations or versioned SQL files for schema and policy
    changes.
-   Prefer explicit schemas, constraints, foreign keys, and indexes.
-   Use server-side/database transactions or secure RPCs for multi-row
    operations involving sales, payments, or enquiry submission.
-   Avoid hard-coded admin emails/phone numbers as the only security
    control.
-   Do not log OTPs, access tokens, cost prices, or sensitive customer
    details.
-   Add tests for access policies and financial calculations.

## 9. Data privacy boundaries

Public users: - Read only published catalogue data and permitted public
images. - Cannot read customer lists, private enquiry notes, admin
profiles, sales, sale items, cost prices, payments, expenses, profit
reports, or audit logs.

Customers: - Can read only their own permitted profile/enquiries. -
Cannot read other customers' information or any financial/admin data.

Admins: - Can access only the private operational data their assigned
role permits. - All financial operations and exports must be protected
by RLS and trusted authorization.

## 10. Development workflow for Antigravity

At the start of a task: 1. Read `prd.md`, `context.md`,
`architecture.md`, and `features.md`. 2. Inspect the existing repository
and current implementation. 3. Identify the exact phase and scope of the
task. 4. Make the smallest coherent change. 5. Do not overwrite working
code or delete files without explaining why. 6. Do not invent business
facts. 7. Run lint/build/tests that are available. 8. Report files
changed, commands run, results, risks, and any manual setup needed. 9.
Stop after the requested phase and wait for review.

## 11. Known unknowns --- do not guess

-   Official logo, brand colours, business address, phone number,
    opening hours.
-   Final list of products, SKUs, descriptions, prices, and images.
-   OTP/SMS provider configuration and budget.
-   Exact admin identities and whether the two admins have equal
    permissions.
-   Customer enquiry-history requirements.
-   Tax-inclusive/exclusive price conventions.
-   Return/refund and discount allocation policy.
-   Whether general overheads should be included in profit reporting.
-   Legal/privacy notice wording and data-retention policy.

Until confirmed, use neutral branding, placeholders clearly labelled as
placeholders, INR as a provisional currency assumption, and no real
customer/business data.
