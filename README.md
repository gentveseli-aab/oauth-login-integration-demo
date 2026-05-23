# OAuth Login Integration Demo

University Cloud Computing project — **Topic ID: 45**.

A minimal demo of third-party **Google OAuth** login using **Next.js (App Router)** and **Auth.js (next-auth v5)**. It illustrates the full sign-in flow, session-based user profile mapping, protected UI pages, protected serverless API routes, callback/error handling, and cloud-ready deployment on Vercel.

## Stack

- Next.js 16 (App Router, TypeScript)
- React 19
- Auth.js (`next-auth@beta`, v5) — Google provider
- Tailwind CSS v4
- Serverless functions via Next.js Route Handlers

## Features

- Google OAuth sign-in / sign-out
- JWT-based session (no database needed)
- Home page with login button (logged out) / dashboard link + logout (logged in)
- Protected `/dashboard` page (server-side session check + redirect)
- Protected serverless API route `/api/profile` that returns the logged-in user's profile
- Simple role concept (`USER` by default) injected into the session via the JWT callback
- Auth.js callback/error handling out of the box at `/api/auth/*`

## Project structure

```
auth.ts                              # NextAuth(v5) config: Google provider + role callback
app/api/auth/[...nextauth]/route.ts  # Re-exports Auth.js GET/POST handlers
app/api/profile/route.ts             # Protected serverless API route
app/page.tsx                         # Home page (login / dashboard link)
app/dashboard/page.tsx               # Protected page (shows name, email, role)
types/next-auth.d.ts                 # Session/JWT type augmentation for `role`
```

## Environment variables

Create a `.env.local` file in the project root (do **not** commit it):

```sh
AUTH_SECRET=...           # run: npx auth secret  (or: openssl rand -base64 32)
AUTH_GOOGLE_ID=...        # OAuth 2.0 Client ID from Google Cloud Console
AUTH_GOOGLE_SECRET=...    # OAuth 2.0 Client Secret from Google Cloud Console
```

Auth.js v5 auto-detects `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` for the Google provider, and uses `AUTH_SECRET` to sign session JWTs. `AUTH_URL` is auto-inferred locally and on Vercel; set it explicitly only for custom deployments.

## Google Cloud Console setup

1. Open <https://console.cloud.google.com/> and create (or pick) a project.
2. **APIs & Services → OAuth consent screen**: configure as **External**, add your Google account as a test user.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**, type **Web application**.
4. Add **Authorized redirect URIs**:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://<your-domain>/api/auth/callback/google`
5. Copy the generated **Client ID** and **Client Secret** into `.env.local`.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Other useful scripts:

```bash
npm run lint     # ESLint
npm run build    # Production build
npm start        # Run the production build
```

## Deployment notes (cloud-ready)

The app is designed to deploy as serverless functions on **Vercel**:

1. Push the repo to GitHub (already done).
2. Import the project on <https://vercel.com/new>.
3. In **Project Settings → Environment Variables** add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
4. After the first deploy, add the production redirect URI (`https://<your-domain>/api/auth/callback/google`) in Google Cloud Console.
5. Redeploy.

The same code also runs on any Node.js host that supports Next.js (e.g. Render, Fly.io, AWS via OpenNext) — the routes under `app/api/**` map to serverless functions on Vercel and to a Node server elsewhere.

## Security notes

- `.env.local` is git-ignored — secrets must never be committed.
- The session is a signed JWT cookie; no DB is required for this demo.
- The `role` is currently hard-coded to `USER` in the JWT callback for demo simplicity; in a real app it would come from a database.

## Demo evidence

Screenshots are available in the `docs/screenshots` folder:

- Home page with Google sign-in
- Google OAuth login flow
- Protected dashboard after login
- Protected `/api/profile` response

## Live demo

Demo URL: https://oauth-login-integration-demo-w8vx.vercel.app