# Line Trise's Kunstsmykker

<img width="2285" height="1308" alt="image" src="https://github.com/user-attachments/assets/d63bfb02-7842-4f24-bdde-9c328bf4a698" />


A modern TypeScript + React e‑commerce storefront for custom jewelry with an admin panel, serverless Netlify functions (Stripe, Supabase), and a responsive UI.

**Live demo / deployment**

[Live site](https://www.ltkunstsmykker.no/)

**Table of contents**

- Overview
- Features
- Tech stack
- Quick start
- Local development
- Serverless functions
- Testing
- Folder structure
- Deployment
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


## Helpful commands

- Install: `npm install`
- Dev server: `npm run build`
- Netlify CLI: `npm run netlify`
- Build: `npm run build`
- Preview build: `npm run preview`
- Tests: `npm run test`

## Contact

If you need help or want to report an issue, contact the repo owner.

