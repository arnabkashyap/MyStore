# Feature Catalogue and Implementation Backlog

## Baishya Furniture and Telectronics

This document breaks the product requirements into implementable
features and acceptance criteria. Use it to plan Antigravity tasks and
track progress.

Priority: - **P0:** required for first usable launch - **P1:**
recommended follow-up - **P2:** future scope

Status values for project tracking: `Not started`, `In progress`,
`Blocked`, `Review`, `Done`. Initial status for all items is
`Not started`.

------------------------------------------------------------------------

## Epic 1 --- Project foundation

### F-001: React/Vite application setup

**Priority:** P0\
**Scope:** Create a React + Vite JavaScript app, reusable folder
structure, npm scripts, and baseline styles.\
**Acceptance criteria:** - App runs locally with the documented
command. - Production build succeeds. - No secret keys are committed. -
Responsive baseline works on phone and desktop.

### F-002: Design system and shared layout

**Priority:** P0\
**Scope:** Establish typography, spacing, buttons, inputs, colour
tokens, header, navigation, footer, and page container.\
**Acceptance criteria:** Consistent styles, keyboard-visible focus,
mobile navigation, and accessible labels.

### F-003: Routing and page shells

**Priority:** P0\
**Scope:** Public routes and isolated admin route group.\
**Acceptance criteria:** Direct navigation works; unknown routes show a
not-found page; admin shell does not expose private data without
authorization.

------------------------------------------------------------------------

## Epic 2 --- Public storefront

### F-010: Homepage

**Priority:** P0\
**Scope:** Showroom branding, category links, featured products, enquiry
CTA, and footer.\
**Acceptance criteria:** No invented business contact information;
unknown details use placeholders or are omitted.

### F-011: Category browsing

**Priority:** P0\
**Scope:** Display active categories and products within each category.\
**Acceptance criteria:** Categories are data-driven; inactive categories
are not shown publicly.

### F-012: Product listing cards

**Priority:** P0\
**Scope:** Product image, name, category, availability, price label, and
product-detail link.\
**Acceptance criteria:** Correct price mode and availability label;
missing image has a fallback; archived/unpublished products are hidden.

### F-013: Product details and gallery

**Priority:** P0\
**Scope:** Product description, attributes, multiple images, cover
image, and swipe/click gallery.\
**Acceptance criteria:** Gallery is keyboard-accessible,
mobile-friendly, and preserves admin-defined order.

### F-014: Search and filters

**Priority:** P0 search; P1 advanced filters\
**Scope:** Search by name, category, brand/model and description where
practical. Filter by category/availability; price filter only for
comparable numeric prices.\
**Acceptance criteria:** Search is case-insensitive where supported,
no-results state appears, and filters can be cleared.

### F-015: Price display modes

**Priority:** P0\
**Scope:** Exact price, price range, price on enquiry, and hidden
price.\
**Acceptance criteria:** Validation prevents incomplete range/exact
prices; hidden mode does not leak price values in public UI.

### F-016: Availability badges

**Priority:** P0\
**Scope:** Available, Out of stock, Available on order, Coming soon,
Discontinued.\
**Acceptance criteria:** Text label is shown and not colour alone;
status is admin-controlled.

### F-017: Business information and contact links

**Priority:** P1\
**Scope:** Approved phone, address, hours, map and social links.\
**Acceptance criteria:** Only owner-confirmed values appear; phone links
use `tel:` and messaging links use the correct approved destination.

------------------------------------------------------------------------

## Epic 3 --- Authentication

### F-020: Guest browsing

**Priority:** P0\
**Scope:** Browse the public catalogue without login.\
**Acceptance criteria:** Public catalogue works in an anonymous session.

### F-021: Phone OTP sign-in

**Priority:** P0 for production enquiry flow\
**Scope:** Phone input, OTP request, verification, session handling,
resend cooldown, error states, and logout.\
**Acceptance criteria:** Only provider-confirmed verification permits
verified actions; OTP values are never stored in application tables or
logs.

### F-022: Customer profile

**Priority:** P1\
**Scope:** Minimal profile fields and optional name.\
**Acceptance criteria:** Customer can only access their own profile;
editable fields cannot include admin role.

### F-023: OTP abuse controls

**Priority:** P0\
**Scope:** Apply provider limits, UI cooldowns, and server-side
safeguards where supported.\
**Acceptance criteria:** Repeated requests are constrained and errors do
not reveal sensitive account information.

------------------------------------------------------------------------

## Epic 4 --- Enquiry cart and submission

### F-030: Enquiry cart

**Priority:** P0\
**Scope:** Add/remove products, update quantity, and preserve the cart
during browsing.\
**Acceptance criteria:** Quantities are positive integers; archived or
unavailable products receive clear handling; cart is not treated as an
order.

### F-031: Enquiry message and customer details

**Priority:** P0\
**Scope:** Optional message, selected variant notes, and verified
phone.\
**Acceptance criteria:** Input is validated; only necessary personal
data is collected.

### F-032: Verified enquiry submission

**Priority:** P0\
**Scope:** Create enquiry and item rows atomically after phone
verification.\
**Acceptance criteria:** Unverified submission is rejected by the
trusted boundary; retry does not create duplicate enquiries; all
requested items are saved.

### F-033: Enquiry reference and confirmation

**Priority:** P0\
**Scope:** Unique reference and confirmation page.\
**Acceptance criteria:** Reference is human-readable and unique; page
states the showroom will call and does not claim an order is confirmed.

### F-034: Customer enquiry history

**Priority:** P1 / decision pending\
**Scope:** List a customer's own submitted enquiries and statuses.\
**Acceptance criteria:** Database policies prevent access to any other
customer's records. Implement only after owner confirms scope.

------------------------------------------------------------------------

## Epic 5 --- Admin access and catalogue management

### F-040: Admin role bootstrap

**Priority:** P0\
**Scope:** Securely provision the owner and website operator as separate
admin identities.\
**Acceptance criteria:** Public registration cannot create admins;
database policy validates admin role; no hard-coded client-only admin
gate.

### F-041: Protected admin navigation

**Priority:** P0\
**Scope:** Admin route guards and unauthorized page handling.\
**Acceptance criteria:** UX redirects unauthorized sessions, while
database policies independently deny private queries.

### F-042: Category CRUD

**Priority:** P0\
**Scope:** Create, rename, reorder, deactivate categories.\
**Acceptance criteria:** Unique slugs, validation, and admin-only
writes.

### F-043: Product CRUD

**Priority:** P0\
**Scope:** Create/edit/publish/unpublish/archive products, category,
descriptions, optional attributes, price mode, availability, and
featured order.\
**Acceptance criteria:** Validation follows selected price mode; only
authorized admins can change catalogue data.

### F-044: Product image upload and ordering

**Priority:** P0\
**Scope:** Upload multiple images, choose cover, reorder, update alt
text, and remove images.\
**Acceptance criteria:** Only admins can upload/delete; public reads
follow product visibility; upload type/size limits are enforced.

### F-045: Homepage banners and featured items

**Priority:** P1\
**Scope:** Admin-managed promotional content and featured products.\
**Acceptance criteria:** Only approved published content is public; no
unsupported claims or unconfirmed offers.

### F-046: Admin audit history

**Priority:** P1\
**Scope:** Record important product/category and permission changes.\
**Acceptance criteria:** Audit entries are append-only for normal admins
where feasible and cannot be read by customers.

------------------------------------------------------------------------

## Epic 6 --- Enquiry administration

### F-050: Enquiry inbox

**Priority:** P0\
**Scope:** List enquiries with reference, date, verified phone, item
count, and status.\
**Acceptance criteria:** Admin-only, paginated, searchable, and
filterable.

### F-051: Enquiry detail view

**Priority:** P0\
**Scope:** Show customer message, item snapshots, quantities, and
submission details.\
**Acceptance criteria:** Data matches submitted enquiry even if current
product listing changes.

### F-052: Status and follow-up notes

**Priority:** P0\
**Scope:** Update status and add private notes.\
**Acceptance criteria:** Valid status transitions; private notes never
appear to customers; history records who changed status.

### F-053: Call customer

**Priority:** P0\
**Scope:** Click-to-call link for verified phone.\
**Acceptance criteria:** Uses the stored verified phone, safely
formatted; no phone number is exposed on public pages.

### F-054: Enquiry-to-sale workflow

**Priority:** P1\
**Scope:** Start a sales record from an enquiry while retaining
snapshots and linking the records.\
**Acceptance criteria:** Enquiry confirmation alone does not count as
revenue; sale is only recognized after an admin records an actual
transaction.

------------------------------------------------------------------------

## Epic 7 --- Private sales register

### F-060: Manual sale entry

**Priority:** P0\
**Scope:** Record sale date/time, items, quantities, cost snapshot,
selling price snapshot, discounts, and notes.\
**Acceptance criteria:** Only admins can create/edit; numeric
validation; snapshot fields persist after catalogue edits.

### F-061: Sale status and correction policy

**Priority:** P0\
**Scope:** Completed, cancelled, returned/partially returned according
to selected data model.\
**Acceptance criteria:** Status changes are audited; cancelled sales do
not count as ordinary completed revenue; return logic is documented and
tested.

### F-062: Sale-related expenses

**Priority:** P0\
**Scope:** Record delivery, installation, and other sale-specific
expenses.\
**Acceptance criteria:** Expenses are not double-counted; dashboard
labels estimated profit clearly.

### F-063: Payment recording

**Priority:** P0\
**Scope:** Cash, UPI, card, bank transfer, credit, other, and
multiple/partial payments.\
**Acceptance criteria:** Multiple payment rows supported; no card
credentials stored; outstanding balance is calculated consistently.

### F-064: Sales summary dashboard

**Priority:** P0\
**Scope:** Period totals for sale count, gross sales, discounts, net
revenue, COGS, gross profit, expenses, estimated net profit, collected,
and outstanding.\
**Acceptance criteria:** Totals reconcile to sale records and obey
cancellation/return policy.

### F-065: Period reports

**Priority:** P0 daily/monthly; P1 weekly/yearly/custom comparisons\
**Scope:** Filter by date range and show consistent metrics.\
**Acceptance criteria:** Timezone and date-boundary behavior is
documented; all report queries are admin-only.

### F-066: Product/category performance

**Priority:** P1\
**Scope:** Best sellers by quantity/revenue and profitability by
product/category.\
**Acceptance criteria:** Uses sale snapshots and return-adjusted values,
not current catalogue prices.

### F-067: CSV export

**Priority:** P1\
**Scope:** Export permitted report rows and summary values.\
**Acceptance criteria:** Requires admin authorization; export values
reconcile to UI; no private data can be exported by customers.

### F-068: General business expenses

**Priority:** P2\
**Scope:** Record overheads not tied to a specific sale.\
**Acceptance criteria:** Clearly separate from sale-specific expense and
gross-profit calculations.

------------------------------------------------------------------------

## Epic 8 --- Data protection and reliability

### F-070: RLS policy coverage

**Priority:** P0\
**Scope:** Policies for every table and storage bucket.\
**Acceptance criteria:** Anonymous, customer A, customer B, and admin
test cases are documented and pass.

### F-071: Input validation and safe errors

**Priority:** P0\
**Scope:** Validate user input on client and trusted database/server
boundary.\
**Acceptance criteria:** Invalid quantities, amounts, references, and
unauthorized operations are rejected.

### F-072: Atomic enquiry and sale writes

**Priority:** P0\
**Scope:** Use transactions or trusted RPCs for multi-row operations.\
**Acceptance criteria:** Failed writes do not leave partial
enquiry/sale/payment records.

### F-073: Loading, error, empty, and retry states

**Priority:** P0\
**Scope:** Consistent UI states across public and admin flows.\
**Acceptance criteria:** No blank or misleading screen on failure;
retries do not duplicate writes.

### F-074: Backups and operational recovery

**Priority:** P1\
**Scope:** Document Supabase backup/restore options and who can perform
recovery.\
**Acceptance criteria:** Owner understands recovery limitations and
verifies backups before relying on the system.

### F-075: Privacy and retention

**Priority:** P1\
**Scope:** Publish an appropriate privacy notice and define
retention/deletion handling for customer phone numbers and enquiries.\
**Acceptance criteria:** Collect only necessary data and confirm final
policy with the business owner.

------------------------------------------------------------------------

## Epic 9 --- Deployment and launch

### F-080: Environment configuration

**Priority:** P0\
**Scope:** `.env.example`, ignored local secrets, Vercel environment
variables.\
**Acceptance criteria:** No service-role key in browser bundle or
repository; dev and production environments are distinguished.

### F-081: Production build and deployment

**Priority:** P0\
**Scope:** Deploy frontend to Vercel and connect to the intended
Supabase project.\
**Acceptance criteria:** Production build passes; direct route
navigation works; only production-approved configuration is used.

### F-082: Launch checklist and handover

**Priority:** P0\
**Scope:** Test key customer/admin journeys and document common
operations.\
**Acceptance criteria:** Owner can add a product, process an enquiry,
record a sale, and review a report without developer help.

------------------------------------------------------------------------

## Recommended implementation order

1.  F-001 to F-003: project foundation
2.  F-010 to F-016: public catalogue with clearly labelled development
    seed data
3.  Supabase project, schema migrations, and F-070 RLS design before
    exposing real data
4.  F-020 to F-023: guest browsing and OTP
5.  F-030 to F-033: enquiry flow
6.  F-040 to F-044: admin access and catalogue management
7.  F-050 to F-053: enquiry inbox and follow-up
8.  F-060 to F-065: sales register, expenses, payments, and reports
9.  Remaining P1 features, security tests, deployment, and handover

Do not deploy with permissive placeholder RLS policies or real
customer/financial data before authorization tests pass.
