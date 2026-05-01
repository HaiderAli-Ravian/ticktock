import { isAfter, isBefore, parseISO } from "date-fns"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getTimesheets } from "@/lib/mock-db"
import { deriveStatus } from "@/lib/utils"

export async function GET(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const statusFilter = searchParams.get("status") ?? "all"
  const sortBy = searchParams.get("sortBy") ?? "week"
  const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc"
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const perPage = Math.max(1, parseInt(searchParams.get("perPage") ?? "5", 10))

  let timesheets = getTimesheets()

  if (startDate || endDate) {
    const rangeStart = parseISO(startDate ?? endDate!)
    const rangeEnd = parseISO(endDate ?? startDate!)

    timesheets = timesheets.filter((week) => {
      const weekStart = parseISO(week.startDate)
      const weekEnd = parseISO(week.endDate)

      return !isAfter(weekStart, rangeEnd) && !isBefore(weekEnd, rangeStart)
    })
  }

  // Status filter
  const withStatus = timesheets.map((w) => ({
    ...w,
    _status: deriveStatus(w.entries),
  }))

  const filtered =
    statusFilter === "all"
      ? withStatus
      : withStatus.filter((w) => w._status === statusFilter.toUpperCase())

  const sorted = [...filtered].sort((a, b) => {
    const direction = sortOrder === "asc" ? 1 : -1

    switch (sortBy) {
      case "date":
        return (
          (parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime()) *
          direction
        )
      case "status":
        return a._status.localeCompare(b._status) * direction
      case "week":
      default:
        return (a.weekNumber - b.weekNumber) * direction
    }
  })

  const total = sorted.length
  const items = sorted
    .slice((page - 1) * perPage, page * perPage)
    .map((w) => ({
      id: w.id,
      weekNumber: w.weekNumber,
      startDate: w.startDate,
      endDate: w.endDate,
      entries: w.entries,
    }))

  return NextResponse.json({ items, total, page, perPage })
}
