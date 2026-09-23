# HomeBase

A mobile-friendly web app for homeowners: look up anything about your house —
paint colors, furnace filter sizes, the light bulbs in a certain room,
appliance model numbers — and share projects, tips, and help with other
homeowners.

## Features

- **My home** tab: your house's details, grouped by room
  - Search everything at once ("furnace filter", "kitchen", "SW 7029")
  - Filter by category: Paint, Filters, Light bulbs, Appliances, Plumbing,
    Electrical, Flooring, Other
  - Each category asks for the details that matter (paint → color code and
    sheen; filter → size and MERV rating; bulb → base, wattage, color temp)
  - Optional replacement reminders (e.g. furnace filter every 3 months) with a
    "Due" badge and a one-tap "Replaced it today" button
  - Your home details are private to your account
- **Projects** tab: share what you've built or fixed
- **Tips & tricks** tab: quick wins from other homeowners
- **Help** tab: ask questions and answer others; unanswered questions float to
  the top, and the asker can mark a question solved
- Replies on every post; authors can delete their own posts and replies
- Installable on your phone's home screen (PWA manifest + icons)

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

4. Optional: seed sample data to see the app populated:

   ```bash
   npx prisma db seed
   ```

   This creates a demo account (`demo@homebase.local` / `demo1234`) with a
   filled-in house, plus a few community posts.

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

## Project layout

- `src/lib/categories.ts` — item categories, their field labels, and
  replacement-due logic. Add a category here (and to the `ItemCategory` enum in
  `prisma/schema.prisma`) to extend the app.
- `src/lib/posts.ts` — the three community tabs and their copy
- `src/app/page.tsx` — My home (search + list)
- `src/app/items/` — add/view/edit home items
- `src/app/{projects,tips,help}/` and `src/app/posts/` — community tabs

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) with SQLite for storage
- [Auth.js (NextAuth)](https://authjs.dev) for credential-based accounts
