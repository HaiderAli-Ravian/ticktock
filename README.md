A Next.js timesheet-dashboard assessment demonstrating weekly entries, query-driven UI, form validation, and focused tests.

Authentication uses a fixed demo user, and application data is stored in memory. Data resets when the server process restarts; this is not a production authentication or persistence implementation.

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

Approximately ~13 hours.


## Screenshots

### Timesheet Listing overview

Weekly status badges, date and status filters, and pagination using the fixed demo user and seeded timesheet data.

<img width="3024" height="1722" alt="ticktock-timesheets" src="https://github.com/user-attachments/assets/71ee253d-df12-443c-8286-304043ad741d" />


### Weekly Timesheet overview

Weekly timesheet details with total hours completed each day.

<img width="3024" height="1996" alt="screenshot_2026-10-01_raw (10)" src="https://github.com/user-attachments/assets/7d066fed-e4d7-47ea-b21b-7b85416700bb" />


### Time-entry dialog

Project and work-type selection, task notes, and hour controls over the weekly timesheet. Shown with demonstration data; no entry was submitted for this capture.

<img width="3024" height="1722" alt="ticktock-entry-dialog" src="https://github.com/user-attachments/assets/f6cb9b56-b8d8-4d4d-bab4-e84e6bb2131b" />
