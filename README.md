# Line Trise's Kunstsmykker

[![Build and Tests](https://github.com/ESPR07/line-trises-smykkebod/actions/workflows/pipeline.yml/badge.svg)](https://github.com/ESPR07/line-trises-smykkebod/actions/workflows/pipeline.yml)

[![Netlify Status](https://api.netlify.com/api/v1/badges/9d47e87e-f36d-4e3b-955b-627b50f8e735/deploy-status)](https://app.netlify.com/projects/linetrisesmykkebod/deploys)

Line Trise’s Kunstsmykker is a small e-commerce web application built with React + TypeScript for selling handcrafted jewelry. The project focuses on a clean storefront experience for customers and a secure, authenticated admin interface for managing products and orders.

The application is built with Vite, uses Supabase as a backend service, and exposes a typed `Database` interface alongside reusable hooks and contexts for core business logic.


## Table of contents

- [Features](#features)  
- [Tech stack](#tech-stack)  
- [Quick start](#quick-start)  

## Features

- Browse, view and add products to cart for customers.
- Auth based admin views for product & order management.
- Context-based cart via [`CartContext`](src/App.tsx) and `cartInteractions` reducer.
- Lazy page loading via React `Suspense` for faster initial load.

Referenced runtime hooks:
- [`useProductList`](src/API/useProducts) — product pagination & searching
- [`useGetOrders`](src/API/useGetOrders) — orders listing (admin)
- [`useAuthStatus`](src/API/useAuthStatus) — session status gating admin/UI


## Tech stack

- <b>Frontend:</b> React + TypeScript (Vite)
- <b>Styling:</b> CSS Modules
- <b>Backend:</b> Supabase (Auth + Database)
- <b>State management:</b> React Context + reducers
- <b>Testing:</b> Vitest
- <b>Linting:</b> ESLint
- <b>Deployment:</b> Netlify

Related configuration files:
- Supplied typed DB interface via [`src/@types/Database`](src/@types/Database)
- Vite dev server: see [`vite.config.ts`](vite.config.ts)
- Unit tests config: see [`vitest.config.ts`](vitest.config.ts)
- ESLint: [`eslint.config.js`](eslint.config.js)


## Quick start

Requirements:
- Node.js (recommended LTS)
- npm or yarn
- env variables
- netlify CLI

Setup:
1. Clone the repo.
2. Copy environment example: `copy .env.example and rename to .env` and fill values from (`.env.example`).
3. Install dependencies:

```bash
npm install
# or
yarn
#also required for Netlify Serverless Functions
npm install -g netlify-cli
```
4. To run the project:

```bash
npm run netlify
```