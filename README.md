# BandhanHub

BandhanHub is a React + Vite matchmaking and messaging app powered by Supabase. It includes email/password and Google sign-in, profile onboarding, profile discovery, likes/match flow, real-time chat, voice messages, browser-based audio/video calling, and PWA support.

## Stack

- React 19
- Vite 6
- React Router 7
- Tailwind CSS 4
- Supabase Auth, Database, Realtime, and Storage
- WebRTC for calling
- `vite-plugin-pwa` for installable/offline-ready behavior

## Core features

- User authentication with email/password and Google OAuth
- Profile setup wizard before entering the dashboard
- Dashboard with profile suggestions and like interactions
- Inbox with conversation list, live updates, and online presence
- Chat view with text messages, voice messages, and call signaling
- Browser audio/video calls using WebRTC with Supabase-backed signaling
- PWA install prompt and service worker registration

## Routes

- `/` - login
- `/signup` - sign up
- `/forgot-password` - password reset request
- `/reset-password` - reset password
- `/auth/callback` - OAuth/email callback handling
- `/profile-setup` - profile onboarding
- `/dashboard` - main app shell
- `/dashboard/matches` - matches view
- `/dashboard/profile` - current user profile
- `/dashboard/profile/:id` - another user's profile
- `/dashboard/inbox` - conversation list
- `/dashboard/messages/:id` - chat and calling screen
- `/dashboard/settings` - settings

## Environment variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional for TURN relay support in calls:

- `VITE_TURN_URL`
- `VITE_TURN_USERNAME`
- `VITE_TURN_CREDENTIAL`

Without TURN credentials, the app falls back to the public Google STUN server.

## Supabase expectations

The frontend expects these Supabase pieces to exist:

- `profiles`
- `messages`
- `likes`
- `notifications`
- `call_ice_candidates`

The app also expects Supabase Auth to be configured for:

- email/password login
- Google OAuth
- redirect URLs that point back to `/auth/callback`

For production use, make sure your Row Level Security policies allow the authenticated users to read and write only the records they should access.

## Getting started

```bash
npm install
npm run dev
```

Default scripts:

- `npm run dev` - start the Vite dev server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint
- `npm run heartbeat` - run the Supabase heartbeat script locally

## Calling notes

BandhanHub uses WebRTC in the browser and Supabase tables/realtime channels for signaling. For more reliable calls across different networks, configure TURN credentials with the `VITE_TURN_*` variables.

Browser permissions required:

- microphone
- camera

## PWA

The app is configured as a Progressive Web App through `vite-plugin-pwa` and registers a service worker for install/offline-ready behavior during development and production builds.

PWA assets are defined in:

- `vite.config.js`
- `public/iconnii.png`
- `public/iconne.png`

## Supabase heartbeat

This repo includes a small heartbeat script intended to help keep a low-traffic Supabase project active.

File:

- `scripts/supabase-heartbeat.js`

Typical GitHub repository secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_HEARTBEAT_TABLE`
- `SUPABASE_HEARTBEAT_COLUMN`

Fallback secret:

- `SUPABASE_ANON_KEY`

Recommended values:

- `SUPABASE_HEARTBEAT_TABLE=profiles`
- `SUPABASE_HEARTBEAT_COLUMN=id`

Run locally:

```bash
npm run heartbeat
```
