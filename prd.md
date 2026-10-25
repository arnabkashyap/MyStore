# Product Requirements Document (PRD)

## Baishya Furniture and Telectronics

**Document status:** Initial product specification\
**Version:** 1.0\
**Product type:** Responsive showroom catalogue and enquiry website with
a private admin and sales-management system\
**Primary stack:** React + Vite, Supabase, Vercel\
**Business name:** Baishya Furniture and Telectronics

------------------------------------------------------------------------

## 1. Product overview

Baishya Furniture and Telectronics is a physical showroom selling
products across multiple categories, including electronics, mobile
phones, steel furniture, and wooden furniture. The website will let
customers browse the showroom's catalogue, view product photos and
availability, and send enquiries for one or more products. The showroom
owner will review enquiries and confirm details by phone.

The website will also provide a secure, private admin workspace for
managing the catalogue, availability, enquiries, and a manual sales
register with estimated profit reporting. Customer-facing pages must
never expose supplier cost prices, sales records, profit figures, admin
functions, or other customers' private information.

This is initially an **enquiry-first system**, not an e-commerce
checkout. No online payment processing or automatic order confirmation
is in scope for the first release.

## 2. Problem statement

Customers may not know what products the showroom currently offers, what
variants or availability exist, or how to contact the showroom about
several items at once. The showroom also needs a convenient way to
maintain its product catalogue, receive structured enquiries, and
privately record completed sales and expenses.

The product should centralize these workflows in one responsive website
while preserving the showroom's phone-based confirmation process.

## 3. Goals

1.  Present the showroom and its product categories professionally on
    mobile and desktop.
2.  Let customers browse as guests without being forced to create an
    account.
3.  Offer phone-number OTP authentication for customers who choose to
    sign in.
4.  Support product search, category browsing, product details, and
    multiple product images.
5.  Let customers build an enquiry cart, specify quantities and a
    message, verify their phone number, and submit an enquiry.
6.  Give authorized admins tools to manage products, images,
    availability, categories, banners, and enquiries.
7.  Maintain a private manual sales register with cost/selling-price
    snapshots, expenses, payments, returns/cancellations, and reports.
8.  Protect private and financial data at the database level, not only
    by hiding interface elements.
9.  Keep the first release maintainable and extensible for future
    inventory quantities, more staff roles, or online ordering.

## 4. Non-goals for the first release

-   Online checkout, payment gateway, or customer self-service order
    confirmation.
-   Automatic order placement based only on an enquiry.
-   Automatic supplier purchasing or supplier integrations.
-   Automated accounting, GST filing, tax advice, or statutory financial
    statements.
-   Live synchronization with a physical POS system.
-   Exact stock decrementing or warehouse-level inventory in the initial
    release.
-   Automatic WhatsApp messaging unless a supported integration is
    separately approved and configured.
-   Public customer reviews or ratings.
-   Multi-branch inventory management.
-   AI product recommendations or chatbot features.

## 5. Users and roles

### 5.1 Guest customer

-   Browse public categories and products.
-   Search and filter the catalogue.
-   View product images, descriptions, displayed price information, and
    availability.
-   Add products to an enquiry cart.
-   Start an enquiry, then provide and verify a phone number before
    submission.
-   Contact the showroom using only verified business contact details
    configured by an admin.

### 5.2 Authenticated customer

-   Do everything a guest can do.
-   Sign in using phone-number OTP.
-   Access only their own profile and, if implemented, their own enquiry
    history.
-   Never access admin pages, other customers' enquiries, sales, costs,
    or profits.

### 5.3 Admin: owner and showroom operator

The initial admin group consists of the owner and the user operating the
website. Both require individually authenticated accounts and explicit
admin authorization. Admin permissions are granted by a trusted setup
process; public sign-up must never grant admin access.

Admins can: - Create, edit, publish, unpublish, and archive products. -
Manage categories, product images, display order, and cover images. -
Set the display-price mode and manual availability status. - Manage
homepage banners and featured products. - View, update, and follow up on
enquiries. - Record completed sales, returns, cancellations, payments,
and expenses. - View private sales/profit reports and export permitted
report data. - Review audit history for important administrative
changes.

## 6. Product scope and requirements

Priority labels: **P0** = required for first usable release; **P1** =
valuable soon after; **P2** = future enhancement.

### 6.1 Public storefront

-   **P0:** Responsive homepage with showroom name, navigation, category
    links, featured products, and footer.
-   **P0:** Product listing pages and category pages.
-   **P0:** Product detail page with description, availability,
    price-display mode, and photo gallery.
-   **P0:** Search by product name and relevant catalogue terms.
-   **P1:** Filters for category, availability, and price only where
    comparable numeric prices exist.
-   **P1:** Sort by newest, name, or admin-defined order.
-   **P0:** Enquiry-oriented call-to-action; do not imply that an
    enquiry is a confirmed sale.
-   **P0:** Empty, loading, error, and no-results states.
-   **P0:** Show only published, non-archived products on public pages.

### 6.2 Categories

Initial suggested categories: - Electronics - Mobile Phones - Steel
Furniture - Wooden Furniture - Other Products

Admins can rename, reorder, add, deactivate, or reorganize categories.
Do not hard-code the application so that only the initial categories can
exist.

### 6.3 Product catalogue

A product should support: - Product name and stable identifier/slug. -
Category. - Short summary and detailed description. - One or more
images, with image order and cover-image selection. - Optional brand,
model, SKU, size, colour, material, and variant notes. - Display-price
mode: - Exact price - Price range - Price on enquiry - Hide price -
Optional price/range values validated according to the selected mode. -
Manual availability status: - Available - Out of stock - Available on
order - Coming soon - Discontinued - Published/unpublished and archived
state. - Featured flag and display order. - Created/updated timestamps
and the admin who made the change.

Catalogue selling price is for public display only. Historical sale
records must store their own price snapshots so catalogue edits do not
alter old sales.

### 6.4 Image gallery and storage

-   Admin can upload multiple product images.
-   Admin can reorder images and select a cover image.
-   Customer can swipe/tap through images on mobile and navigate the
    gallery accessibly.
-   Validate file type and reasonable file size; use safe image formats
    where possible.
-   Store files in Supabase Storage using non-public write permissions.
-   Public reads should be limited to images intentionally used for
    published products; private documents or financial attachments must
    not share the public product-image bucket.
-   Deleting a product should not accidentally delete sales history.
    Archive products or preserve historical product-name snapshots.

### 6.5 Customer authentication

-   Guest browsing is allowed.
-   Phone OTP sign-in is optional for browsing.
-   Phone verification is required before an enquiry is submitted.
-   If the customer has already verified their phone in the current
    valid session, do not ask them to verify again unnecessarily.
-   Never treat a phone number typed into a form as verified until the
    authentication provider confirms the OTP.
-   Apply rate limits and abuse controls to OTP requests and enquiry
    submissions.
-   Show clear messages for expired codes, invalid codes, resend
    cooldowns, and provider failures.
-   Provider availability, SMS cost, country support, and Supabase
    configuration must be confirmed before production launch.

### 6.6 Enquiry cart and submission

-   Customer can add multiple products and quantities to an enquiry
    cart.
-   Customer can remove items or change quantities before submission.
-   Customer can include an optional message, such as preferred variant
    or delivery question.
-   Require a verified phone number at submission.
-   Capture product IDs plus immutable display snapshots such as product
    name, selected variant/notes, quantity, and displayed price label at
    submission time.
-   Generate a human-readable reference number that is unique and does
    not reveal internal database IDs.
-   Store submitted enquiry and its items in the database.
-   Show a confirmation screen with the reference number and explain
    that the owner will call to confirm availability, final price, and
    next steps.
-   Submission must be atomic: an enquiry should not be saved without
    its required items.
-   Prevent accidental duplicate submissions through idempotency or a
    comparable server-side safeguard.
-   Do not label an enquiry as a confirmed order.

### 6.7 Enquiry management

Each enquiry includes: - Reference number. - Customer ID if
authenticated, verified phone number, and optional customer name. -
Items and quantities. - Customer message. - Created/updated
timestamps. - Status and follow-up notes. - Admin who last updated it.

Statuses: 1. New 2. Contacted 3. Quotation Sent 4. Confirmed 5. Closed
6. Cancelled

Admin capabilities: - Search and filter by reference, phone number,
date, status, or product. - Open enquiry details and call the customer
using a `tel:` link where supported. - Update status and add private
follow-up notes. - View status history where available. - Convert an
enquiry into a sales record only when a real sale has been
completed/recorded. An enquiry marked "Confirmed" is not automatically
revenue. - Keep private notes hidden from customers.

### 6.8 Private sales register and profit tracker

This is a core private admin feature. Only authorized admins may read or
change it.

Admins manually record each actual sale. A sale may contain one or more
products and should support: - Sale reference and date/time. - Optional
linked enquiry. - Product and quantity. - Cost price per unit at the
time of sale. - Selling price per unit at the time of sale. - Discount
allocated to line or sale. - Additional expenses, such as delivery or
installation. - Payment method: cash, UPI, card, credit, bank transfer,
other, or split/partial payment. - Amount paid, outstanding balance, and
payment history. - Sale status: completed, returned, cancelled, or
partially returned where supported. - Private notes and recording admin.

For each sale item, store snapshots of product name/SKU, quantity, unit
cost, unit selling price, and discount. Changes to the product catalogue
must not change historical sale values.

Definitions: - **Gross sales:** sum of valid sale-line selling amounts
before refunds/returns, using a documented discount convention. - **Net
revenue:** sales after discounts and valid returns/refunds, excluding
amounts not recognized as sales. - **Cost of goods sold (COGS):** cost
snapshot multiplied by net sold quantity, adjusted for returned items
according to the selected return policy. - **Gross profit:** net revenue
minus COGS. - **Additional expenses:** recorded sale-related costs such
as delivery/installation. - **Estimated net profit:** gross profit minus
recorded sale-related expenses. This is an operational estimate, not a
complete accounting statement. - **Gross margin %:** gross profit
divided by net revenue, multiplied by 100; show "---" when net revenue
is zero.

The app must document whether discounts are applied before tax (if tax
is later supported), how returns affect revenue/COGS, and whether
expenses are sale-specific or general. Do not silently double-count
refunds or expenses.

### 6.9 Sales dashboard and reports

-   **P0:** Summary for selected period: sales count, gross sales,
    discounts, net revenue, COGS, gross profit, recorded expenses,
    estimated net profit, amount collected, and outstanding amount.
-   **P0:** Daily, weekly, monthly, and custom-date reporting.
-   **P1:** Yearly reporting and comparison with a prior period.
-   **P1:** Best-selling products and categories by quantity and
    revenue.
-   **P1:** Product/category profitability based on sale snapshots.
-   **P1:** Export selected report data to CSV; ensure exported fields
    are permission-checked.
-   **P1:** Audit events for creating/editing sales, changing payments,
    and recording returns.
-   **P0:** Financial dashboard and export data must never be exposed to
    customer sessions or public APIs.

### 6.10 Manual availability and future inventory

The first release uses admin-managed status labels rather than exact
stock counts. No automatic decrement is required in this phase. Data
design should allow quantity-based inventory later without requiring a
full rewrite.

If quantity tracking is added later, use inventory movement records
rather than directly overwriting stock without history.

### 6.11 Business information

The public website may show business address, phone number, opening
hours, map link, and social links only after the owner supplies and
approves the exact details. Do not invent these values.

## 7. Non-functional requirements

### Security and privacy

-   Supabase Row Level Security (RLS) enabled on every table exposed
    through the client API.
-   Public users can read only published catalogue data and approved
    public assets.
-   Customers can access only their own profile and own enquiries, if
    customer history is enabled.
-   Only explicit admin identities can manage the catalogue, enquiries,
    sales, expenses, payments, reports, and audit logs.
-   Admin authorization must be enforced in database policies or trusted
    server-side functions, not only in frontend route guards.
-   Never expose Supabase service-role keys or other secrets in frontend
    code, committed files, browser bundles, or public logs.
-   Validate inputs and authorization on trusted server/database
    boundaries.
-   Minimize customer data and restrict access to verified phone
    numbers.
-   Keep sensitive financial information out of analytics, error
    messages, and public page metadata.

### Performance and reliability

-   Responsive on current mobile, tablet, and desktop browsers.
-   Optimize and lazy-load product images where appropriate.
-   Use pagination or bounded queries for large catalogues and enquiry
    lists.
-   Provide meaningful loading, error, retry, and empty states.
-   Avoid duplicate enquiry or sale creation during retries.
-   Use database transactions or secure RPCs for multi-step financial
    writes.

### Accessibility and usability

-   Semantic headings, labels, keyboard access, visible focus,
    sufficient contrast, and accessible gallery controls.
-   Forms must explain validation errors near the relevant fields.
-   Do not communicate availability or status using colour alone.

### Maintainability

-   Reusable components and clear separation of public/admin features.
-   Database schema and setup documented in version control.
-   Use migrations for schema changes.
-   Separate development and production configuration.
-   Add automated checks for critical access-control and calculation
    logic.

## 8. Success criteria / acceptance tests

1.  A guest can browse published products without signing in.
2.  A product with multiple photos displays a navigable gallery on
    desktop and mobile.
3.  All four price modes render correctly and validate required values.
4.  All five availability statuses render correctly.
5.  A customer cannot submit an enquiry until their phone is verified.
6.  A successful enquiry has a unique reference and all requested items
    are saved.
7.  A customer cannot read another customer's enquiry or any
    sales/profit data.
8.  An unauthenticated user cannot open admin data APIs even if they
    call them directly.
9.  An authorized admin can create/edit/archive a product and
    upload/reorder photos.
10. An admin can update enquiry status and record private follow-up
    notes.
11. An admin can record a sale with cost/selling-price snapshots and
    expenses.
12. Changing a product's current catalogue price does not change
    historical sale calculations.
13. A returned/cancelled sale is excluded or adjusted according to
    documented rules and is not double-counted.
14. Dashboard totals reconcile with the underlying sale records for the
    selected period.
15. Customer-facing pages contain no admin links, cost prices, profit
    metrics, or private notes.
16. The app builds successfully and deploys using documented environment
    variables.

## 9. Release plan

### Phase 1 --- Foundation

-   React/Vite project, responsive shell, routes, design tokens,
    reusable UI, placeholder catalogue data.

### Phase 2 --- Supabase foundation

-   Create project, configure environment variables, schema migrations,
    RLS, storage policies, and admin identity setup.

### Phase 3 --- Public catalogue

-   Categories, product listings/details, search, images, display-price
    modes, availability statuses.

### Phase 4 --- Authentication and enquiries

-   Phone OTP, enquiry cart, verified submission, reference number,
    customer confirmation.

### Phase 5 --- Admin catalogue and enquiry management

-   Protected admin routes, product/category CRUD, image management,
    enquiry inbox, status/history.

### Phase 6 --- Sales and profit tracker

-   Sale entry, cost snapshots, payments, expenses, return/cancellation
    rules, dashboards, CSV export, audit logs.

### Phase 7 --- Hardening and launch

-   Authorization tests, calculation tests, mobile testing,
    backups/monitoring plan, production deployment, owner handover.

## 10. Decisions that require owner confirmation

Before production launch, confirm: - Exact spelling/branding of "Baishya
Furniture and Telectronics". - Business address, phone number, opening
hours, and approved social links. - Whether customer enquiry history is
required in the first release. - OTP provider and budget/limits. -
Currency (assume INR unless owner confirms otherwise). - Whether sale
amounts include tax and how returns/refunds are recorded. - Whether
discounts are stored per item, per sale, or both. - Whether
delivery/installation expenses are always sale-specific or sometimes
general. - Whether both initial admins have identical permissions. -
Product image upload size/format limits.
