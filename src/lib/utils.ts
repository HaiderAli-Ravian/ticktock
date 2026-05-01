import { clsx, type ClassValue } from "clsx"
import { format, parseISO } from "date-fns"
import { twMerge } from "tailwind-merge"
import type { EntryStatus, TimesheetEntry } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deriveStatus(entries: TimesheetEntry[]): EntryStatus {
  const total = entries.reduce((sum, e) => sum + e.hours, 0)
  if (total === 0) return "MISSING"
  if (total < 40) return "INCOMPLETE"
  return "COMPLETED"
}

export function formatDateRange(start: string, end: string): string {
  const s = parseISO(start)
  const e = parseISO(end)

  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${format(s, "d")} - ${format(e, "d MMMM, yyyy")}`
  }

  return `${format(s, "d MMMM")} - ${format(e, "d MMMM, yyyy")}`
}

export function formatDayLabel(date: string): string {
  return format(parseISO(date), "MMM d")
}

export function totalHours(entries: TimesheetEntry[]): number {
  return entries.reduce((sum, e) => sum + e.hours, 0)
}
