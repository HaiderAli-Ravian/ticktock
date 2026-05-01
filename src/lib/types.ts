export type EntryStatus = "COMPLETED" | "INCOMPLETE" | "MISSING"
export type WorkType = "Bug fixes" | "Development" | "Design" | "Meeting" | "Research"

export const WORK_TYPES: WorkType[] = [
  "Bug fixes",
  "Development",
  "Design",
  "Meeting",
  "Research",
]

export interface User {
  id: string
  email: string
  password: string
  name: string
}

export interface Project {
  id: string
  name: string
}

export interface TimesheetEntry {
  id: string
  weekId: string
  date: string
  projectId: string
  projectName: string
  workType: WorkType
  description: string
  hours: number
}

export interface WeeklyTimesheet {
  id: string
  weekNumber: number
  startDate: string
  endDate: string
  entries: TimesheetEntry[]
}
