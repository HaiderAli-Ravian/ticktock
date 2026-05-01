import { z } from "zod"

export const entrySchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  workType: z.enum([
    "Bug fixes",
    "Development",
    "Design",
    "Meeting",
    "Research",
  ]),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description must be at most 500 characters"),
  hours: z
    .number()
    .int("Hours must be a whole number")
    .min(1, "Hours must be at least 1")
    .max(24, "Hours must be at most 24"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
})

export const entryUpdateSchema = entrySchema.partial()

export type EntryInput = z.infer<typeof entrySchema>
export type EntryUpdateInput = z.infer<typeof entryUpdateSchema>
