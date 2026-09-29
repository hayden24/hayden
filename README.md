# Job Tracker

A mobile-friendly web app for tracking electrical customers and service jobs.
Each customer keeps their contact info plus the electrical details of their
property (service/panel, lighting and ballasts, circuits). Each job (work
order) has a **Labor** folder for logging hours and a **Material** folder for
logging materials used, with support for multiple user accounts.

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
- **Customers** (menu → Customers): searchable list of customers with name,
  phone/contact, email, address, and notes. Each customer has tabs for:
  - **Service** — amperage, voltage, phase, panel brand/model, meter #, notes
    (add more than one for sub-panels or multiple services)
  - **Lighting** — area, fixture type, lamp type, ballast brand/model, qty
  - **Circuits** — what it feeds, which panel it's fed from, circuit #,
    breaker size, wire size
  - **Other info** — free-form label/details pairs for anything else
    (generator, gate code, EV charger...)
  - **Jobs** — every work order for that customer, plus a shortcut to start a
    new one pre-filled with their info
- Work orders can be linked to a saved customer (pick one on the new work order
  form or when editing a job). Existing jobs are linked automatically by
  customer name when you run the migration.
- Timekeeping screen: every hour you've logged, across all jobs, in one list
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

4. Optional: seed a few pretend jobs to see the app populated:

   ```bash
   npx prisma db seed
   ```

   This creates a demo account (`demo@jobtracker.local` / `demo1234`) that
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
