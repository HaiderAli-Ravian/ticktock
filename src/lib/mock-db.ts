import type { Project, TimesheetEntry, User, WeeklyTimesheet } from "./types"

const users: User[] = [
  {
    id: "user-1",
    email: "john@tentwenty.com",
    password: "password123",
    name: "John Doe",
  },
]

const projects: Project[] = [
  { id: "proj-1", name: "TenTwenty Website" },
  { id: "proj-2", name: "Mobile App Redesign" },
  { id: "proj-3", name: "Client Portal" },
  { id: "proj-4", name: "Internal Dashboard" },
  { id: "proj-5", name: "E-Commerce Platform" },
]

let entryCounter = 1000

function eid(): string {
  return `e${entryCounter++}`
}

function makeEntry(
  weekId: string,
  date: string,
  projectId: string,
  workType: TimesheetEntry["workType"],
  description: string,
  hours: number
): TimesheetEntry {
  const project = projects.find((p) => p.id === projectId)!
  return {
    id: eid(),
    weekId,
    date,
    projectId,
    projectName: project.name,
    workType,
    description,
    hours,
  }
}

const entryTemplates: Array<{
  projectId: string
  workType: TimesheetEntry["workType"]
  description: string
}> = [
  {
    projectId: "proj-1",
    workType: "Development",
    description: "Implemented planned product updates and reviewed pull requests",
  },
  {
    projectId: "proj-2",
    workType: "Design",
    description: "Refined responsive screens and prepared stakeholder handoff notes",
  },
  {
    projectId: "proj-3",
    workType: "Bug fixes",
    description: "Resolved client portal defects reported during QA",
  },
  {
    projectId: "proj-4",
    workType: "Meeting",
    description: "Sprint planning, estimation, and cross-team alignment",
  },
  {
    projectId: "proj-5",
    workType: "Research",
    description: "Investigated implementation options and documented tradeoffs",
  },
]

const weeklyHours = [
  [8, 8, 8, 8, 8],
  [7, 8, 6],
  [],
  [8, 8, 8, 8, 8],
  [6, 6, 4],
  [8, 8, 8, 8, 8],
  [],
  [8, 8, 6, 6],
  [8, 8, 8, 8, 8],
  [5, 7, 6],
  [8, 8, 8, 8, 8],
  [],
  [8, 8, 8, 8, 8],
  [6, 8, 8],
  [8, 8, 8, 8, 8],
  [],
  [8, 8, 7],
  [8, 8, 8, 8, 8],
]

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function makeWeek(weekNumber: number, start: Date): WeeklyTimesheet {
  const weekId = `week-2026-${String(weekNumber).padStart(2, "0")}`
  const end = addDays(start, 6)
  const hours = weeklyHours[weekNumber - 1] ?? []

  return {
    id: weekId,
    weekNumber,
    startDate: isoDate(start),
    endDate: isoDate(end),
    entries: hours.map((entryHours, index) => {
      const template = entryTemplates[(weekNumber + index - 1) % entryTemplates.length]
      return makeEntry(
        weekId,
        isoDate(addDays(start, index)),
        template.projectId,
        template.workType,
        template.description,
        entryHours
      )
    }),
  }
}

const timesheets: WeeklyTimesheet[] = Array.from({ length: 18 }, (_, index) =>
  makeWeek(index + 1, addDays(new Date("2026-01-01T00:00:00.000Z"), index * 7))
)

// ── Getters ────────────────────────────────────────────────────────────────

export function getUser(email: string): User | undefined {
  return users.find((u) => u.email === email)
}

export function getProjects(): Project[] {
  return projects
}

export function getTimesheets(): WeeklyTimesheet[] {
  return timesheets
}

export function getWeek(weekId: string): WeeklyTimesheet | undefined {
  return timesheets.find((w) => w.id === weekId)
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function addEntry(
  weekId: string,
  data: Omit<TimesheetEntry, "id" | "weekId" | "projectName">
): TimesheetEntry {
  const week = timesheets.find((w) => w.id === weekId)
  if (!week) throw new Error(`Week ${weekId} not found`)

  const project = projects.find((p) => p.id === data.projectId)
  if (!project) throw new Error(`Project ${data.projectId} not found`)

  const entry: TimesheetEntry = {
    ...data,
    id: eid(),
    weekId,
    projectName: project.name,
  }
  week.entries.push(entry)
  return entry
}

export function updateEntry(
  weekId: string,
  entryId: string,
  data: Partial<Omit<TimesheetEntry, "id" | "weekId" | "projectName">>
): TimesheetEntry | undefined {
  const week = timesheets.find((w) => w.id === weekId)
  if (!week) return undefined

  const idx = week.entries.findIndex((e) => e.id === entryId)
  if (idx === -1) return undefined

  if (data.projectId) {
    const project = projects.find((p) => p.id === data.projectId)
    if (project) {
      week.entries[idx] = {
        ...week.entries[idx],
        ...data,
        projectName: project.name,
      }
    }
  } else {
    week.entries[idx] = { ...week.entries[idx], ...data }
  }

  return week.entries[idx]
}

export function deleteEntry(weekId: string, entryId: string): boolean {
  const week = timesheets.find((w) => w.id === weekId)
  if (!week) return false

  const idx = week.entries.findIndex((e) => e.id === entryId)
  if (idx === -1) return false

  week.entries.splice(idx, 1)
  return true
}
