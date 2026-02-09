# Line Trise's Kunstsmykker

A modern TypeScript + React e‑commerce storefront for custom jewelry with an admin panel, serverless Netlify functions (Stripe, Supabase), and a responsive UI.

**Live demo / deployment**

[Live site](https://www.ltkunstsmykker.no/)

**Table of contents**

- Overview
- Features
- Tech stack
- Quick start
- Environment variables
- Local development
- Serverless functions
- Testing
- Folder structure
- Deployment
- Contributing
- License & contact

## Overview

This repository powers a small online shop for custom jewelry. It contains a React + Vite frontend, an admin interface, and a collection of Netlify Functions that handle payments, order emails, and webhook handling (Stripe, Supabase interactions, etc.).

## Features

- Browse and purchase products
- Create custom products
- Admin dashboard: products, orders, settings
- Payment processing via Stripe
- Server-side email notifications for orders
- Image uploads and product management
- Responsive UI and mobile-friendly sidebar

## Tech stack

- Frontend: React + TypeScript + Vite
- Styling: CSS modules + global CSS
- Backend: Netlify Functions (serverless) in `netlify/functions`
- Database / Auth: Supabase (client + backend usage)
- Payments: Stripe (payment intents, webhooks)
- Testing: Vitest

## Quick start

1. Install dependencies

```bash
npm install
```

2. Copy or create environment variables (see below)

3. Run development server

```bash
npm run dev
or
npm run netlify for netlify CLI (testing advanced features)
```

3. Build for production

```bash
npm run build
```

Preview production build locally

```bash
npm run preview
```

Run tests

```bash
npm run test
```

## Environment variables

This project uses both client-side Vite environment variables (prefixed with `VITE_`) and server-side environment variables consumed by Netlify Functions. Example variables you should provide:

- Client (Vite):
  - `VITE_SUPABASE_URL` — Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
  - Any other `VITE_` prefixed keys used by the frontend

- Server / Netlify Functions (not prefixed):
  - `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (used only server-side)
  - `STRIPE_SECRET_KEY` — Stripe secret key
  - `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
  - Any other secret keys required by functions (email credentials, API keys)

Place Vite environment variables in a `.env.local` or a local env file supported by Vite. Configure server secrets in Netlify dashboard (Site settings > Build & deploy > Environment) or use a `.env` for local functions testing.

## Local development notes

- The frontend and admin components are built with TypeScript; the source entry is `src/main.tsx`.
- The admin sidebar and components live in `src/components/AdminComponents`.
- If you change environment variables, restart the dev server.

## Serverless functions

Serverless functions are in the `netlify/functions` folder. Key handlers include:

- `createPaymentIntent.ts` — create Stripe payment intents
- `stripeWebhook.ts` — handle Stripe webhooks
- `createOrderConfirmation.tsx` / `ShippingConfirmationEmail.tsx` — server-rendered email templates
- `supabaseClientBackend.ts` — helper for server-side Supabase calls

When running functions locally, make sure the server-side env vars are set so they can access Stripe and Supabase. For deployment, set secrets in Netlify.

## Testing

- Unit / component tests use Vitest. Run them with:

```bash
npm run test
```

Add or update tests under `src/` near the hooks/components they verify.

## Folder structure (high level)

- `src/` — application source
  - `API/` — custom hooks and API utilities
  - `assets/` — fonts, svg components
  - `components/` — UI components (AdminComponents, ProductCard, PaymentForm, etc.)
  - `context/` — React contexts and providers
  - `pages/` — routed pages (CartPage, ProductPage, AdminPage, etc.)
  - `Reducers/` — cart interaction reducers
- `netlify/functions/` — serverless backend functions and email templates
- `public/` — static assets

## Deployment

This project is configured for Netlify. The build command is typically:

```bash
npm run build
```

- The output directory is `dist/` (Vite default). Netlify will pick this up automatically if `netlify.toml` is present.
- Add your server-side env vars in the Netlify site settings.

## Contributing

- Fork the repo, create a feature branch, and open a pull request.
- Keep changes small and focused; add tests for new logic when possible.
- Run `npm run test` and ensure linting/formatting is consistent.

## Helpful commands

- Install: `npm install`
- Dev server: `npm run build`
- Netlify CLI: `npm run netlify`
- Build: `npm run build`
- Preview build: `npm run preview`
- Tests: `npm run test`

## Contact

If you need help or want to report an issue, contact the repo owner.

