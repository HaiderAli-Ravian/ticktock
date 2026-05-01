import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deleteEntry, updateEntry } from "@/lib/mock-db"
import { entryUpdateSchema } from "@/lib/validators"

type RouteProps = { params: Promise<{ weekId: string; entryId: string }> }

export async function PATCH(request: Request, props: RouteProps) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekId, entryId } = await props.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = entryUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const updated = updateEntry(weekId, entryId, parsed.data)
  if (!updated) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 })
  }

  return NextResponse.json(updated)
}

export async function DELETE(_request: Request, props: RouteProps) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { weekId, entryId } = await props.params
  const ok = deleteEntry(weekId, entryId)

  if (!ok) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
