import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getWeek } from "@/lib/mock-db"

export async function GET(
  _request: Request,
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

  return NextResponse.json(week)
}
