# Fakawang 2.0 (Next.js Version)

This is a modern rewrite of the original Fakawang (Dujiaoka) system, built with Next.js and Prisma, optimized for Vercel deployment.

## Features

- **Storefront**: Browse products, view details.
- **Ordering**: Place orders with quantity checks.
- **Database**: Prisma ORM (SQLite for dev, easily switchable to Postgres/MySQL for Vercel).
- **API**: RESTful API for order creation.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize Database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   node prisma/seed.js
   ```

3. Run Development Server:
   ```bash
   npm run dev
   ```

## Deploying to Vercel

1. Push this code to GitHub/GitLab.
2. Import the project in Vercel.
3. **Database**: Vercel Serverless Functions are ephemeral, so SQLite won't work well for production.
   - Create a Postgres database (e.g., Vercel Postgres, Supabase, Neon).
   - Update `prisma/schema.prisma`:
     ```prisma
     datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
     }
     ```
   - Set `DATABASE_URL` in Vercel Environment Variables.
4. Redeploy.

## Project Structure

- `app/`: Next.js App Router pages and APIs.
- `lib/`: Utility functions (Prisma client).
- `prisma/`: Database schema and seed script.
