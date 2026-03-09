# Build Plan

1. **Scaffold & Tooling**
   - Manual Next.js App Router setup (TypeScript, Tailwind, ESLint, Prettier) with aliases and shared font tokens.
   - Configure env management (.env.example) and Git hygiene.

2. **Data & Backend**
   - Prisma schema for categories, products, customers, orders, delivery zones, site settings, and admin users.
   - Seed script imports data/SEED_PRODUCTS.csv, bootstraps delivery fees, default settings, and sample admin credentials pulled from env.
   - Utility services for Prisma client, delivery fee lookup, Paystack integration, Cloudinary uploads, and order code generation.

3. **Storefront Experience**
   - Route group (site) for public pages (home, shop, product detail, cart, checkout, contact, tracking) with SEO metadata.
   - Shared UI components (hero, product grid, testimonial strip, CTA banners) plus WhatsApp floating action button.
   - Client cart powered by a persisted Zustand store with optimistic loading and skeleton states.

4. **Checkout & Payments**
   - Checkout form validation with Zod + React Hook Form, delivery region-based fees, pay-on-delivery toggle display from settings.
   - API routes + server actions to create customers/orders, initialize Paystack payments, handle callbacks/webhooks, and expose order status.

5. **Admin Experience**
   - NextAuth credential-based login for /admin/login storing hashed Prisma admin user credentials.
   - Admin dashboard with KPIs, product CRUD (including Cloudinary upload helper), order table with status management + CSV export, and configurable delivery fees/pay-on-delivery.

6. **DX & Documentation**
   - README covers setup, env vars, scripts, seed instructions, Paystack test flow, Vercel deployment notes, and outstanding credentials/assets.
   - Basic tests/manual QA checklist plus notes on blocked integrations (live Paystack keys, production Cloudinary folder).

