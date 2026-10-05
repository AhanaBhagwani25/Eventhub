# EventHub

A full-stack web app to discover events, register for a seat, and host your own.

**Live demo:** _add your Vercel/Netlify link here_

## Features

- Sign up and log in (email and password), with two account types: **attendee** and **organizer**
- Browse upcoming events with **search**, **category** and **date** filters (kept in the URL, so filtered views can be shared)
- Event page with date, place, price and live seat count
- **Register / cancel** with a seat limit enforced in the database
- **My registrations** page (upcoming and past)
- **Organizer dashboard**: create, edit and delete your events and see registrations per event
- Validated forms, loading skeletons, empty states, toast messages
- Light and dark theme, responsive layout, keyboard-friendly

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router |
| Styling | Tailwind CSS |
| Forms | React Hook Form, Zod |
| Backend | Supabase (Postgres, Auth, Row Level Security) |

## Run it locally

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create a Supabase project** at [supabase.com](https://supabase.com) (free plan is enough).
3. **Create the database.** In Supabase open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
4. **Turn off email confirmation for testing:** Authentication -> Providers -> Email -> switch off "Confirm email".
5. **Add your keys.** Copy `.env.example` to `.env` and fill in the values from Project Settings -> API:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
6. **Start the app**
   ```bash
   npm run dev
   ```
7. **Add sample events to test.** Sign up once using "Host events", then paste `supabase/seed.sql` into the SQL Editor and run it. It adds 16 events (every category, plus 2 past events) and is safe to run twice.

## Deploy

1. Push the project to GitHub (make sure `.env` is **not** committed; it is already in `.gitignore`).
2. Import the repo in [Vercel](https://vercel.com) (or Netlify). The defaults work: build command `npm run build`, output folder `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under the project's Environment Variables, then deploy.
4. In Supabase -> Authentication -> URL Configuration, set the Site URL to your deployed link.
5. Paste the live link at the top of this README and in the repo's About section.

## Project structure

```
src/
  components/   Navbar, EventCard (ticket stub), skeleton, ProtectedRoute, shared UI
  context/      AuthContext (session + profile), ToastContext
  lib/          Supabase client, types, helpers, theme hook
  pages/        Home, Events, EventDetails, Login, Signup,
                MyRegistrations, Dashboard, EventFormPage, NotFound
supabase/
  schema.sql    Tables, triggers, view, security policies
  seed.sql      Optional sample data
docs/
  INTERVIEW_NOTES.md
```

## Database design

- `profiles` (id, full_name, role) one row per user, created automatically by a trigger on sign-up
- `events` (organizer_id, title, description, category, location, starts_at, capacity, price, image_url)
- `registrations` (event_id, user_id) with a unique pair so nobody registers twice
- `events_with_counts` view adds `registered_count` so seat numbers are public while registrations stay private

## Security

- **Row Level Security** is on for every table. Anyone can read events; only organizers can create them; only the owner can edit or delete; people can only see and cancel their own registrations.
- Roles cannot be changed from the browser (no update policy on `profiles`), and the sign-up trigger only accepts `attendee` or `organizer`.
- The seat limit and "event already ended" check live in a database trigger, so they can't be bypassed from the browser.
- Only the public **anon** key is used in the frontend. Secrets stay in `.env`, which is never committed.
