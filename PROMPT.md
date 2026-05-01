# ticktock — Timesheet Management App

You are building a frontend technical assessment for Tentwenty. The project is already scaffolded: Next.js 15 with App Router, TypeScript, Tailwind, shadcn/ui, src directory. The shadcn components and dependencies listed at the bottom are already installed.

Read this entire document before writing any code. Build in the order given. Do not skip ahead. Do not add features that aren't specified.

## Product summary

ticktock is a timesheet management app. A user logs in, sees a list of their weekly timesheets with status pills, opens a week to see daily entries, and adds or edits time entries against projects through a modal. Three screens total: login, dashboard table, weekly detail. One modal for add/edit entry.

## Tech constraints (non-negotiable)

- Next.js App Router with src directory
- TypeScript strict
- TailwindCSS for all styling
- shadcn/ui for primitives
- next-auth v5 (beta) with Credentials provider for dummy auth
- Internal API routes under src/app/api for all data. Client components must fetch from these routes, never import mock data directly.
- TanStack Query for client-side data fetching and cache
- react-hook-form plus zod for the entry form
- Inter font from next/font/google
- date-fns for date math

## Design tokens

- Primary blue: use Tailwind's blue-600 for buttons and accents, blue-700 for hover. The login right panel is also blue-600.
- Status pill colors:
  - COMPLETED: green-100 background, green-800 text
  - INCOMPLETE: yellow-100 background, yellow-800 text
  - MISSING: pink-100 background, pink-800 text (use rose if pink doesn't match)
- Body background: white. Page wrapper background: gray-50.
- Borders: gray-200. Muted text: gray-500. Body text: gray-900.
- Font: Inter, applied at the root layout.

## Folder structure
src/
app/
(auth)/
login/page.tsx
(dashboard)/
layout.tsx                 # header + footer wrapper
timesheets/
page.tsx                 # table view
[weekId]/page.tsx        # list view (weekly detail)
api/
auth/[...nextauth]/route.ts
timesheets/route.ts        # GET list
timesheets/[weekId]/route.ts        # GET single week with entries
timesheets/[weekId]/entries/route.ts  # POST new entry
timesheets/[weekId]/entries/[entryId]/route.ts  # PATCH, DELETE
layout.tsx
page.tsx                     # redirect to /timesheets if authed, /login if not
components/
ui/                          # shadcn (already there)
layout/
site-header.tsx
site-footer.tsx
timesheets/
timesheets-table.tsx
status-badge.tsx
filters-bar.tsx
pagination-bar.tsx
week-progress.tsx
day-group.tsx
entry-row.tsx
entry-form-modal.tsx
add-task-row.tsx
lib/
auth.ts                      # next-auth config
api-client.ts                # fetch wrapper
mock-db.ts                   # in-memory data store
types.ts                     # shared types
utils.ts                     # cn() and helpers (date formatting, status calc)
validators.ts                # zod schemas
hooks/
use-timesheets.ts
use-week.ts
use-entry-mutations.ts
providers/
query-provider.tsx
session-provider.tsx
middleware.ts                  # protect dashboard routes

## Types

Define these in src/lib/types.ts.

```ts
type EntryStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";
type WorkType = "Bug fixes" | "Development" | "Design" | "Meeting" | "Research";

interface User { id: string; email: string; password: string; name: string; }
interface Project { id: string; name: string; }
interface TimesheetEntry {
  id: string;
  weekId: string;
  date: string;          // ISO yyyy-mm-dd
  projectId: string;
  projectName: string;
  workType: WorkType;
  description: string;
  hours: number;
}
interface WeeklyTimesheet {
  id: string;
  weekNumber: number;
  startDate: string;     // ISO
  endDate: string;       // ISO
  entries: TimesheetEntry[];
}
```

Status is derived, not stored. Sum hours in entries: 0 means MISSING, less than 40 means INCOMPLETE, 40 or more means COMPLETED.

## Mock data

In src/lib/mock-db.ts, export an in-memory module-scoped store. One user: email `john@tentwenty.com`, password `password123`, name `John Doe`. Five projects with realistic names. At least 8 weekly timesheets across January and February 2024 covering all three statuses, with a mix of entries per day. The store must be mutable (add, update, delete entries) so POST/PATCH/DELETE routes work for the session lifetime. No persistence is required, in-memory is fine.

## Auth

next-auth v5 Credentials provider. On signIn, look up the user in mock-db. JWT strategy. Session callback exposes user id, email, name. Middleware protects everything under (dashboard) and redirects unauthenticated users to /login. /login redirects authenticated users to /timesheets.

## API routes

All routes return JSON. Validate inputs with zod. Return 401 if no session. Return 400 with field errors for invalid bodies. Return 404 for missing weekId or entryId.

- GET /api/timesheets — supports `?dateRange=...&status=...&page=1&perPage=5`. Returns `{ items: WeeklyTimesheet[], total, page, perPage }`. Computed status filter applied after derivation.
- GET /api/timesheets/[weekId] — returns the full week with entries.
- POST /api/timesheets/[weekId]/entries — body `{ date, projectId, workType, description, hours }`. Returns the created entry.
- PATCH /api/timesheets/[weekId]/entries/[entryId] — partial update.
- DELETE /api/timesheets/[weekId]/entries/[entryId] — returns `{ ok: true }`.
- GET /api/projects — returns the project list for the modal dropdown.

## Screens

### 1. Login (/login)

Two-column layout, full viewport height. On screens under md, stack vertically with the blue panel below the form (or hidden, your call — keep it simple).

Left column (white, centered content, max-width around 400px):
- "Welcome back" heading, bold, around text-2xl
- Email field (type=email, placeholder `name@example.com`)
- Password field (type=password, dots placeholder)
- "Remember me" checkbox with label
- Full-width blue Sign in button
- Show inline form errors. Show a toast on auth failure.

Right column (blue-600 background, white text, padding around 48px):
- "ticktock" wordmark, large and bold
- Paragraph: "Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device."

### 2. Dashboard table view (/timesheets)

Header (sticky top, white, border-b):
- Left: "ticktock" wordmark + "Timesheets" link
- Right: "John Doe" with chevron, dropdown menu with "Sign out"

Main content (max-width container, padding):
- Card with border, rounded, white background
- Card header: "Your Timesheets" h2, then a row of two Select dropdowns: Date Range (This month, Last month, Last 3 months, All) and Status (All, Completed, Incomplete, Missing). Filters update query params and refetch.
- Table with columns Week #, Date, Status, Actions
- Date cell: format like `1 - 5 January, 2024` using date-fns
- Status cell: StatusBadge component
- Actions cell: blue text link. Label is "View" if COMPLETED, "Update" if INCOMPLETE, "Create" if MISSING. All link to /timesheets/[weekId].
- Below table: per-page select (5 per page) on left, pagination on right with Previous, page numbers, ellipsis, Next.

Footer: "© 2024 tentwenty. All rights reserved." centered, gray-500.

### 3. Weekly detail (/timesheets/[weekId])

Same header and footer.

- Top row: "This week's timesheet" h2 on left. On right, hours summary like `20/40 hrs` with `100%` underneath, and a thin progress bar (orange fill, gray track). Use the Progress component but override to orange.
- Below: date range subtitle like `21 - 26 January, 2024` in gray-500.
- For each day in the week (always show all 7 days, Monday through Sunday or whatever the week's start is): a row with the day label like `Jan 21` on the left (sticky-ish, narrow column), and a stack of EntryRows on the right. Last item in each stack is a dashed-border AddTaskRow that opens the modal pre-filled with that date.
- EntryRow shows: task description (or workType if you want), hours pill on the right like `4 hrs`, then a Project Name pill, then a three-dot menu (Edit, Delete). Edit opens the modal with the entry's values. Delete confirms and removes.

### 4. Add/Edit modal

Dialog from shadcn. Title "Add New Entry" or "Edit Entry". Fields:
- Select Project (required, dropdown from /api/projects)
- Type of Work (required, dropdown of WorkType values)
- Task description (required, textarea, helper text "A note for extra info")
- Hours (required, number stepper with − and + buttons and a numeric input, min 1, max 24)

Footer: blue "Add entry" / "Save changes" submit button on left, white "Cancel" button on right. Form uses react-hook-form + zod. Show field errors below each field. On submit, call mutation, close modal on success, toast on success and error. Optimistic update is nice but not required — invalidate the week query is fine.

## Validation

Zod schema for entry create/update:
- projectId: non-empty string
- workType: enum of WorkType
- description: string, min 3, max 500
- hours: number, integer, min 1, max 24
- date: ISO date string

## Behavior details that matter

- Loading states: skeletons in table rows and list rows. Spinner on submit buttons.
- Empty states: if a week has no entries, every day shows just the AddTaskRow.
- Error states: if a fetch fails, show a small inline error with a Retry button.
- Auth-failed login: show toast `Invalid email or password`.
- Successful create: toast `Entry added`.
- After login, push to /timesheets.
- Sign out clears session and pushes to /login.

## Testing (optional but do at least these)

Add Vitest + React Testing Library. Three tests minimum:
1. StatusBadge renders correct variant for each status
2. Entry form shows validation errors when submitted empty
3. Status derivation function: 0 → MISSING, 20 → INCOMPLETE, 40 → COMPLETED

## README

After everything works, write a README.md with:
- Project name and one-line description
- Stack list
- Setup: `npm install`, copy .env.example to .env, `npm run dev`
- Demo credentials: john@tentwenty.com / password123
- Folder structure brief
- Assumptions and notes (mock data is in-memory, status is derived, etc.)
- Time spent (leave a placeholder I'll fill in)

## Build order

1. Types, mock-db, utils (status derivation, date formatting)
2. next-auth config, login API, middleware
3. Login page
4. Query provider, session provider, root layout with Inter font
5. Dashboard layout (header, footer)
6. /api/timesheets GET with filters and pagination
7. Timesheets table page with filters and pagination
8. /api/timesheets/[weekId] GET, /api/projects GET
9. Weekly detail page layout (header, progress, day groups)
10. Entry form modal with react-hook-form + zod
11. POST/PATCH/DELETE entry routes and mutations
12. Wire Edit and Delete on EntryRow
13. Polish: loading skeletons, empty states, error states, toasts
14. Tests
15. README

## What not to do

- Do not import mock-db from client components. Always go through /api routes.
- Do not add features that aren't in this spec.
- Do not use a UI library other than shadcn and Tailwind.
- Do not commit any secrets. .env.example only.
- Do not write CSS files beyond globals.css.
- Do not over-abstract. Keep components focused and readable.

When you finish a step, briefly say what you did and move on. If something is genuinely ambiguous, ask one focused question rather than guessing. Otherwise, keep building.