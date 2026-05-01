import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { addEntry, getWeek } from "@/lib/mock-db"
import { entrySchema } from "@/lib/validators"

export async function POST(
  request: Request,
  props: { params: Promise<{ weekId: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekId } = await props.params

  const week = getWeek(weekId)
  if (!week) {
    return NextResponse.json({ error: "Week not found" }, { status: 404 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = entrySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const entry = addEntry(weekId, parsed.data)
  return NextResponse.json(entry, { status: 201 })
}
