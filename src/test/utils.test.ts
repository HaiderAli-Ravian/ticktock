import { describe, expect, it } from "vitest"
import { deriveStatus } from "@/lib/utils"
import type { TimesheetEntry } from "@/lib/types"

function makeEntries(hours: number[]): TimesheetEntry[] {
  return hours.map((h, i) => ({
    id: `e${i}`,
    weekId: "week-1",
    date: "2024-01-01",
    projectId: "proj-1",
    projectName: "Test Project",
    workType: "Development" as const,
    description: "Test entry",
    hours: h,
  }))
}

describe("deriveStatus", () => {
  it("returns MISSING when total hours is 0", () => {
    expect(deriveStatus([])).toBe("MISSING")
    expect(deriveStatus(makeEntries([0]))).toBe("MISSING")
  })

  it("returns INCOMPLETE when total hours is less than 40", () => {
    expect(deriveStatus(makeEntries([20]))).toBe("INCOMPLETE")
    expect(deriveStatus(makeEntries([8, 8, 4]))).toBe("INCOMPLETE")
    expect(deriveStatus(makeEntries([39]))).toBe("INCOMPLETE")
  })

  it("returns COMPLETED when total hours is 40 or more", () => {
    expect(deriveStatus(makeEntries([40]))).toBe("COMPLETED")
    expect(deriveStatus(makeEntries([8, 8, 8, 8, 8]))).toBe("COMPLETED")
    expect(deriveStatus(makeEntries([50]))).toBe("COMPLETED")
  })
})
