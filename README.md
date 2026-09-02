# Job Tracker

A mobile-friendly web app for tracking electrical service jobs. Each job has a
**Labor** folder for logging hours and a **Material** folder for logging
materials used, with support for multiple user accounts.

## Features

- Email/password accounts (register as a regular user or an office/admin user)
- Job list with status (Open, In progress, Complete, On hold)
- Per-job Labor tab: log date, hours, and a description; running total of hours
- Per-job Material tab: log description, quantity, and optional unit cost;
  running total material cost
- Admins can delete jobs; any user can delete their own labor/material entries

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set a real `AUTH_SECRET`:

   ```bash
   cp .env.example .env
   openssl rand -base64 32   # paste the result in as AUTH_SECRET
   ```

3. Create the database (SQLite, stored at `prisma/dev.db`):

   ```bash
   npx prisma migrate deploy
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000), then register an
   account to get started.

## Production

```bash
npm run build
npm run start
```

The app reads `DATABASE_URL` and `AUTH_SECRET` from the environment (see
`.env.example`). When self-hosting behind a reverse proxy, make sure the proxy
forwards the original `Host` header so sign-in works correctly.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) with SQLite for storage
- [Auth.js (NextAuth)](https://authjs.dev) for credential-based accounts
