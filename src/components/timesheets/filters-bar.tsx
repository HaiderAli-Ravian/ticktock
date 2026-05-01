"use client"

import { format, parseISO } from "date-fns"
import { CalendarIcon, XIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CustomSelect } from "@/components/ui/custom-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "incomplete", label: "Incomplete" },
  { value: "missing", label: "Missing" },
]

export function FiltersBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const status = searchParams.get("status") ?? "all"

  const selectedRange: DateRange | undefined = startDate
    ? {
        from: parseISO(startDate),
        to: endDate ? parseISO(endDate) : undefined,
      }
    : undefined

  function updateStatus(value: string | null) {
    if (!value) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("status", value)
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  function updateDateRange(range: DateRange | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("dateRange")
    params.delete("startDate")
    params.delete("endDate")

    if (range?.from) params.set("startDate", format(range.from, "yyyy-MM-dd"))
    if (range?.to) params.set("endDate", format(range.to, "yyyy-MM-dd"))
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  function clearDateRange() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("dateRange")
    params.delete("startDate")
    params.delete("endDate")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const dateRangeLabel = formatDateRangeLabel(startDate, endDate)

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex w-full items-center gap-1.5 sm:w-auto">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="h-[42px] flex-1 justify-start gap-2 rounded-[8px] border-slate-300 bg-white px-3 text-left text-sm font-normal text-slate-500 shadow-none hover:bg-white hover:text-slate-700 sm:w-[210px] sm:flex-none"
              />
            }
          >
            <CalendarIcon className="size-4 shrink-0 text-slate-500" />
            <span className="truncate">{dateRangeLabel}</span>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="max-h-[70vh] w-auto max-w-[calc(100vw-2rem)] overflow-auto p-0"
          >
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={selectedRange}
              onSelect={updateDateRange}
            />
          </PopoverContent>
        </Popover>

        {(startDate || endDate) && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-slate-500 hover:text-slate-700"
            aria-label="Clear date range"
            onClick={clearDateRange}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>

      <CustomSelect
        value={status}
        placeholder="Status"
        options={STATUS_OPTIONS}
        onChange={updateStatus}
        rootClassName="w-full sm:w-auto"
        triggerClassName="w-full sm:w-[144px]"
        contentClassName="w-full sm:w-[144px]"
      />
    </div>
  )
}

function formatDateRangeLabel(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "Date Range"

  const start = startDate ? parseISO(startDate) : null
  const end = endDate ? parseISO(endDate) : null

  if (start && end) {
    return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`
  }

  if (start) return `${format(start, "MMM d, yyyy")} - ...`
  if (end) return `... - ${format(end, "MMM d, yyyy")}`

  return "Date Range"
}
