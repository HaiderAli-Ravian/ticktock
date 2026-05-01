import { describe, expect, it } from "vitest"
import { entrySchema } from "@/lib/validators"

describe("entrySchema validation", () => {
  const validEntry = {
    projectId: "proj-1",
    workType: "Development" as const,
    description: "Valid description text",
    hours: 8,
    date: "2024-01-15",
  }

  it("accepts a valid entry", () => {
    const result = entrySchema.safeParse(validEntry)
    expect(result.success).toBe(true)
  })

  it("fails when projectId is empty", () => {
    const result = entrySchema.safeParse({ ...validEntry, projectId: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      expect(fields.projectId).toBeDefined()
    }
  })

  it("fails when description is too short", () => {
    const result = entrySchema.safeParse({ ...validEntry, description: "ab" })
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      expect(fields.description).toBeDefined()
    }
  })

  it("fails when hours is below minimum", () => {
    const result = entrySchema.safeParse({ ...validEntry, hours: 0 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      expect(fields.hours).toBeDefined()
    }
  })

  it("fails when hours exceeds maximum", () => {
    const result = entrySchema.safeParse({ ...validEntry, hours: 25 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      expect(fields.hours).toBeDefined()
    }
  })

  it("fails when workType is invalid", () => {
    const result = entrySchema.safeParse({ ...validEntry, workType: "Invalid" })
    expect(result.success).toBe(false)
  })
})
