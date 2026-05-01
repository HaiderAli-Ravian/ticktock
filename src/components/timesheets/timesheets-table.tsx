"use client"

import { addDays, isBefore, parseISO } from "date-fns"
import { ArrowDownIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { StatusBadge } from "@/components/timesheets/status-badge"
import { FiltersBar } from "@/components/timesheets/filters-bar"
import { PaginationBar } from "@/components/timesheets/pagination-bar"
import { TimesheetsTableSkeleton } from "@/components/timesheets/timesheets-table-skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTimesheets } from "@/hooks/use-timesheets"
import { cn, deriveStatus, formatDateRange } from "@/lib/utils"

const ACTION_LABEL: Record<string, string> = {
  COMPLETED: "View",
  INCOMPLETE: "Update",
  MISSING: "Create",
}

const SORT_FIELDS = ["week", "date", "status"] as const
type SortField = (typeof SORT_FIELDS)[number]
type SortOrder = "asc" | "desc"

export function TimesheetsTable() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const status = searchParams.get("status") ?? "all"
  const sortParam = searchParams.get("sortBy")
  const activeSortBy: SortField | null = SORT_FIELDS.includes(
    sortParam as SortField
  )
    ? (sortParam as SortField)
    : null
  const sortBy: SortField = activeSortBy ?? "week"
  const sortOrder: SortOrder =
    searchParams.get("sortOrder") === "desc" ? "desc" : "asc"
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const perPage = Math.max(1, parseInt(searchParams.get("perPage") ?? "5", 10))

  const { data, isLoading, isError, refetch } = useTimesheets({
    startDate,
    endDate,
    status,
    sortBy,
    sortOrder,
    page,
    perPage,
  })

  function handleSort(nextSortBy: SortField) {
    const params = new URLSearchParams(searchParams.toString())
    const nextSortOrder =
      activeSortBy === nextSortBy && sortOrder === "desc" ? "asc" : "desc"

    params.set("sortBy", nextSortBy)
    params.set("sortOrder", nextSortOrder)
    params.set("page", "1")
    router.replace(`/timesheets?${params.toString()}`)
  }

  return (
    <div className="mx-auto w-[calc(100%-24px)] max-w-[1316px] pt-4 sm:w-[calc(100%-40px)] sm:pt-7">
      <div className="rounded-[10px] border border-slate-200 bg-white px-4 pt-5 pb-5 shadow-[0_1px_3px_rgba(15,23,42,0.12)] sm:px-[26px] sm:pt-[26px] sm:pb-[22px]">
        <div className="flex flex-col items-start gap-4 sm:gap-[22px]">
          <h2 className="text-xl leading-none font-bold tracking-normal text-slate-950 sm:text-2xl">
            Your Timesheets
          </h2>
          <FiltersBar />
        </div>

        <div className="pt-5 sm:pt-6">
          {isError ? (
            <div className="flex flex-col items-center gap-2 py-12 text-sm text-slate-500">
              <p>Failed to load timesheets.</p>
              <button
                onClick={() => refetch()}
                className="text-blue-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-[10px] border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
                <Table className="min-w-[760px]">
                  <TableHeader className="bg-slate-50 [&_tr]:border-slate-200">
                    <TableRow className="h-[52px] hover:bg-slate-50">
                      <TableHead
                        aria-sort={getAriaSort(
                          activeSortBy,
                          sortOrder,
                          "week"
                        )}
                        className="w-[84px] px-2 text-sm font-bold text-slate-500 uppercase sm:w-[144px] sm:px-5"
                      >
                        <SortHeader
                          label="Week #"
                          field="week"
                          activeField={activeSortBy}
                          order={sortOrder}
                          onSort={handleSort}
                          className="gap-2 sm:gap-7"
                        />
                      </TableHead>
                      <TableHead
                        aria-sort={getAriaSort(
                          activeSortBy,
                          sortOrder,
                          "date"
                        )}
                        className="px-3 text-sm font-bold text-slate-500 uppercase sm:px-5"
                      >
                        <SortHeader
                          label="Date"
                          field="date"
                          activeField={activeSortBy}
                          order={sortOrder}
                          onSort={handleSort}
                          className="gap-4"
                        />
                      </TableHead>
                      <TableHead
                        aria-sort={getAriaSort(
                          activeSortBy,
                          sortOrder,
                          "status"
                        )}
                        className="px-3 text-sm font-bold text-slate-500 uppercase sm:px-5"
                      >
                        <SortHeader
                          label="Status"
                          field="status"
                          activeField={activeSortBy}
                          order={sortOrder}
                          onSort={handleSort}
                          className="gap-7"
                        />
                      </TableHead>
                      <TableHead className="px-3 text-right text-sm font-bold text-slate-500 uppercase sm:px-11">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="[&_tr:last-child]:border-0">
                    {isLoading
                      ? <TimesheetsTableSkeleton rows={perPage} />
                      : data?.items.map((week) => {
                          const status = deriveStatus(week.entries)
                          return (
                            <TableRow
                              key={week.id}
                              className="h-[57px] border-slate-200 hover:bg-transparent"
                            >
                              <TableCell className="bg-slate-50 px-2 text-base font-normal text-slate-800 sm:px-5">
                                {week.weekNumber}
                              </TableCell>
                              <TableCell className="px-3 text-base font-normal text-slate-500 sm:px-5">
                                {formatWorkWeekRange(
                                  week.startDate,
                                  week.endDate
                                )}
                              </TableCell>
                              <TableCell className="px-3 sm:px-5">
                                <StatusBadge status={status} />
                              </TableCell>
                              <TableCell className="px-3 text-right sm:px-11">
                                <Link
                                  href={`/timesheets/${week.id}`}
                                  className="text-base font-normal text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                  {ACTION_LABEL[status]}
                                </Link>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                  </TableBody>
                </Table>
              </div>

              {data && (
                <PaginationBar
                  total={data.total}
                  page={data.page}
                  perPage={data.perPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface SortHeaderProps {
  label: string
  field: SortField
  activeField: SortField | null
  order: SortOrder
  onSort: (field: SortField) => void
  className?: string
}

function SortHeader({
  label,
  field,
  activeField,
  order,
  onSort,
  className,
}: SortHeaderProps) {
  const isActive = field === activeField

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={cn(
        "inline-flex items-center text-left font-bold text-slate-500 uppercase transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
    >
      <span>{label}</span>
      <ArrowDownIcon
        className={cn(
          "size-4 stroke-[2.4] transition-transform",
          isActive && order === "asc" && "rotate-180"
        )}
      />
    </button>
  )
}

function getAriaSort(
  activeField: SortField | null,
  order: SortOrder,
  field: SortField
) : "ascending" | "descending" | "none" {
  if (activeField !== field) return "none"
  return order === "asc" ? "ascending" : "descending"
}

function formatWorkWeekRange(start: string, end: string): string {
  const startDate = parseISO(start)
  const endDate = parseISO(end)
  const friday = addDays(startDate, 4)
  const displayEnd = isBefore(friday, endDate) ? friday : endDate

  return formatDateRange(start, displayEnd.toISOString())
}
