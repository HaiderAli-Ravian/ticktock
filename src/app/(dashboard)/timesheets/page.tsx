import { Suspense } from "react"
import { TimesheetsTable } from "@/components/timesheets/timesheets-table"

export default function TimesheetsPage() {
  return (
    <Suspense>
      <TimesheetsTable />
    </Suspense>
  )
}
