# Job Tracker

A mobile-friendly web app for tracking electrical service jobs. Each job
(work order) has a **Labor** folder for logging hours and a **Material**
folder for logging materials used, with support for multiple user accounts.
It also keeps a **Customers** file of each site's panels, lighting, and device
colors so you can look them up when you're not on site.

## Features

- Email/password accounts (register as a regular user or an office/admin user)
- **Open assignments** home screen, plus a menu (top right) for **Projects in
  progress**, **Timekeeping**, and **New work order**
- Each job/work order tracks: Job number, Location, Scope of work, Customer
  name, Customer contact, and Job status (Open, In progress, Complete, On
  hold) — click into a job to edit any of these fields
- Per-job Labor tab: log date, hours, and a description; running total of hours
- Per-job Material tab: log description, quantity, and optional unit cost;
  running total material cost
- Timekeeping screen: every hour you've logged, across all jobs, in one list
- Admins can delete jobs; any user can delete their own labor/material entries
- **Customers** (menu → Customers): searchable by name, address, or phone.
  Each customer has:
  - **Panels** – name, location, brand, amps, spaces, type (main breaker,
    main lug, sub-panel...), voltage/phase, breaker type, and notes. Add as
    many as the site has.
  - **Lighting** – by area: fixture type, quantity, lamp, and ballast/driver
    size, so you can bring the right replacement ballast.
  - **Devices & service** – outlet color, switch color, cover plate color and
    type, device style (Decora/toggle), device brand, plus service drop,
    utility company, and meter number.
  - **Notes** – access info (gate codes, dogs, lockbox) shown at the top of
    every tab, plus free-form notes.
  - Common brands, colors, and lamp types are suggested as you type, but any
    value can be entered.

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

4. Optional: seed a few pretend jobs to see the app populated:

   ```bash
   npx prisma db seed
   ```

   This also adds two sample customers with panels and lighting on file, and
   creates a demo account (`demo@jobtracker.local` / `demo1234`) that
   owns the sample jobs — any account you register can see them too, since
   the job list isn't scoped per-user.

5. Run the dev server:

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
