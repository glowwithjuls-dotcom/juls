# Titi's Cosmetics Ecommerce (MVP)

Production-oriented ecommerce MVP for a Ghanaian cosmetics business, built with Next.js App Router, TypeScript, Prisma, PostgreSQL, Tailwind CSS, Cloudinary, and Paystack.

## What is included

- Customer storefront:
  - Home
  - Shop (search + category filter)
  - Product details
  - Cart
  - Checkout (Paystack + optional pay on delivery)
  - Contact
  - Order tracking
- Admin:
  - Admin login
  - Dashboard
  - Product CRUD + stock management + image upload
  - Order management + status updates + CSV export
  - Delivery zone + checkout settings management
- Core commerce flow:
  - Delivery fee by Ghana delivery zones
  - Order status flow: `PENDING`, `CONFIRMED`, `DISPATCHED`, `DELIVERED`, `CANCELLED`
  - Payment status flow: `PENDING`, `SUCCESS`, `FAILED`
  - Paystack verify + webhook handlers
  - WhatsApp floating contact button site-wide

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (credentials auth for admin)
- Cloudinary (admin image uploads)
- Paystack (Mobile Money + card)
- Zustand (cart), React Hook Form + Zod (validation)

## Project structure

```text
app/                    # App routes (storefront, admin, APIs)
components/             # UI + domain components
lib/                    # Helpers, data access, integrations
prisma/schema.prisma    # Data model
prisma/seed.ts          # Seed script (CSV + zones + admin + settings)
data/SEED_PRODUCTS.csv  # Seed catalog
docs/specs/             # Build/content requirements
```

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Paystack test/live keys
- Cloudinary account

## Environment setup

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Fill required values in `.env.local`:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_WEBHOOK_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `WHATSAPP_NUMBER`

Optional:

- `ALLOW_PAY_ON_DELIVERY`
- `DELIVERY_ZONE_CONFIG`
- `CLOUDINARY_UPLOAD_FOLDER`

## Local development

Install dependencies:

```bash
npm install
```

Generate Prisma client and sync schema:

```bash
npx prisma generate
npx prisma db push
```

Seed products, delivery zones, settings, and admin user:

```bash
npm run db:seed
```

Start dev server:

```bash
npm run dev
```

## Admin credentials setup approach

- Admin credentials are configured via env:
  - `ADMIN_SEED_EMAIL`
  - `ADMIN_SEED_PASSWORD`
- `prisma/seed.ts` hashes and upserts the admin user.
- Login URL: `/admin/login`

## Paystack checkout test mode

1. Use Paystack test keys in env:
   - `PAYSTACK_SECRET_KEY=sk_test_...`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...`
2. Place order from `/checkout`.
3. `/api/checkout` initializes transaction and returns Paystack authorization URL.
4. After redirect back, `/checkout/success` calls `/api/paystack/verify`.
5. Webhook endpoint for event updates:
   - `/api/paystack/webhook`

## Validation and build status

- Typecheck:

```bash
npx tsc --noEmit --incremental false
```

- Production build:

```bash
npm run build
```

Current known tooling issue:

- `npm run lint` currently fails with an ESLint circular config error from `eslint-config-next` + flat config compatibility in this setup.

## Vercel deployment

1. Push repo to Git provider and import into Vercel.
2. Add all required environment variables in Vercel project settings.
3. Ensure managed Postgres is reachable from Vercel runtime.
4. Build command: `npm run build`
5. Start command: `npm run start` (if needed outside Vercel serverless default)
6. Configure Paystack webhook URL to:
   - `https://<your-domain>/api/paystack/webhook`
7. Redeploy after env updates.

## Blocked items without external credentials/assets

- Live Paystack transactions cannot be completed without real Paystack live keys.
- Cloudinary uploads fail without valid Cloudinary credentials.
- Database-backed runtime features fail without a valid PostgreSQL connection.
- Real WhatsApp business automation is not configured (only link-based contact is included).
- Transactional email/SMS notifications are not implemented in this MVP.

## Notes

- `middleware.ts` works, but Next.js 16 warns that middleware convention is deprecated in favor of proxy convention.
- Business/spec references are in `docs/specs/`.
