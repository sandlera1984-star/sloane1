# Sloane Exclusive

Subscription-based exclusive content platform built with Next.js 14 (App Router), Prisma, Stripe, and Vercel Blob.

## Stack
- Next.js 14 + TypeScript + Tailwind CSS
- Prisma + Postgres (Neon/Supabase)
- Custom email/password auth with bcrypt
- Stripe subscriptions (CAD $5/month)
- Vercel Blob for media storage
- Resend for transactional/notification emails

## Environment Variables
Create a `.env` file with the following:

```
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.com
APP_URL=https://your-domain.com
BLOB_READ_WRITE_TOKEN=
RESEND_API_KEY=
EMAIL_FROM=no-reply@your-domain.com
```

## Local Development
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Stripe Setup
1. Create a Stripe product + recurring price at CAD $5/month.
2. Set the price ID in `STRIPE_PRICE_ID`.
3. Configure webhooks for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Add the webhook secret to `STRIPE_WEBHOOK_SECRET`.
5. Point the webhook URL to `/api/stripe/webhook`.

## Vercel Deployment
1. Add all environment variables in Vercel.
2. Provision a Postgres database (Neon or Supabase).
3. Deploy the project.
4. Set `NEXT_PUBLIC_APP_URL` and `APP_URL` to your deployed domain.

## Admin Access
Set a user role to `admin` directly in the database to access `/admin` and upload content.

## Media Access
Locked media is served via `/api/media/[id]` which validates active subscriptions before redirecting.
