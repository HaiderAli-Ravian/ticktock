# ticktock

A timesheet management web application for tracking weekly work hours across projects.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Base UI)
- **Auth**: next-auth v5 (Credentials provider, JWT)
- **Data fetching**: TanStack Query v5
- **Forms**: react-hook-form + Zod v4
- **Dates**: date-fns v4
- **Toasts**: Sonner
- **Tests**: Vitest + React Testing Library

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set AUTH_SECRET to any long random string
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Live demo

[https://ticktock-indol.vercel.app/](https://ticktock-indol.vercel.app/)

## Demo credentials

| Email | Password |
|---|---|
| john@tentwenty.com | password123 |

## Folder structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # Protected layout + pages
│   │   ├── layout.tsx         # Header + footer wrapper
│   │   └── timesheets/        # Table view + weekly detail
│   └── api/                   # Route handlers
│       ├── auth/[...nextauth]/ # next-auth handler
│       ├── timesheets/        # GET list, week, POST/PATCH/DELETE entries
│       └── projects/          # GET project list
├── components/
│   ├── layout/                # SiteHeader, SiteFooter
│   └── timesheets/            # Table, badges, modal, day groups, etc.
├── hooks/                     # useTimesheets, useWeek, useEntryMutations
├── lib/                       # Types, mock-db, utils, validators, api-client, auth
├── providers/                 # QueryProvider, SessionProvider
└── proxy.ts                   # Route protection (Next.js 16 middleware)
```

## Assumptions & notes

- **No persistence**: All data lives in-memory for the server process lifetime. Restarting the dev server resets to the seed data.
- **Status is derived**: `COMPLETED` ≥ 40 hrs, `INCOMPLETE` 1–39 hrs, `MISSING` 0 hrs. It is never stored.
- **18 seed weeks** spanning January–April 2026 covering all three statuses.
- **Next.js 16 specifics**: `middleware.ts` is replaced by `proxy.ts`; `params` and `searchParams` are fully async (must be awaited in pages/layouts/routes).
- **Zod v4** and **date-fns v4** — APIs differ from v3; the codebase uses v4-compatible syntax throughout.

## Tests

```bash
npm test
```

Runs 3 test suites (12 tests total):
1. `deriveStatus` — 0 → MISSING, 20 → INCOMPLETE, 40 → COMPLETED
2. `StatusBadge` — renders correct label and color classes for each status
3. `entrySchema` — validates required fields, min/max constraints, enum values

## Time spent

Approximately 24 hours.
