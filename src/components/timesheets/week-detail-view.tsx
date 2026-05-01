"use client"

import { addDays, format, parseISO } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"
import { DayGroup } from "@/components/timesheets/day-group"
import { EntryFormModal } from "@/components/timesheets/entry-form-modal"
import { WeekDetailSkeleton } from "@/components/timesheets/week-detail-skeleton"
import { WeekProgress } from "@/components/timesheets/week-progress"
import {
  useCreateEntry,
  useDeleteEntry,
  useUpdateEntry,
} from "@/hooks/use-entry-mutations"
import { useWeek } from "@/hooks/use-week"
import type { TimesheetEntry } from "@/lib/types"
import type { EntryInput } from "@/lib/validators"
import { formatDateRange, totalHours } from "@/lib/utils"

interface ModalState {
  open: boolean
  mode: "add" | "edit"
  date: string
  entry: TimesheetEntry | null
}

const CLOSED: ModalState = { open: false, mode: "add", date: "", entry: null }

export function WeekDetailView({ weekId }: { weekId: string }) {
  const { data: week, isLoading, isError, refetch } = useWeek(weekId)
  const [modal, setModal] = useState<ModalState>(CLOSED)

  const createEntry = useCreateEntry(weekId)
  const updateEntry = useUpdateEntry(weekId)
  const deleteEntry = useDeleteEntry(weekId)

  function openAdd(date: string) {
    setModal({ open: true, mode: "add", date, entry: null })
  }

  function openEdit(entry: TimesheetEntry) {
    setModal({ open: true, mode: "edit", date: entry.date, entry })
  }

  async function handleDelete(entryId: string) {
    try {
      await deleteEntry.mutateAsync(entryId)
      toast.success("Entry deleted")
    } catch {
      toast.error("Failed to delete entry")
    }
  }

  async function handleModalSubmit(data: EntryInput) {
    try {
      if (modal.mode === "add") {
        await createEntry.mutateAsync(data)
        toast.success("Entry added")
      } else if (modal.entry) {
        await updateEntry.mutateAsync({ entryId: modal.entry.id, data })
        toast.success("Entry updated")
      }
      setModal(CLOSED)
    } catch {
      toast.error("Something went wrong")
      throw new Error("submission failed")
    }
  }

  if (isLoading) {
    return <WeekDetailSkeleton />
  }

  if (isError || !week) {
    return (
      <div className="mx-auto w-[calc(100%-24px)] max-w-[1316px] py-4 text-sm text-gray-500 sm:w-[calc(100%-40px)] sm:py-7">
        <p>Failed to load timesheet.</p>
        <button
          onClick={() => refetch()}
          className="text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  const hrs = totalHours(week.entries)
  const entriesByDate = week.entries.reduce<Record<string, TimesheetEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = []
      acc[entry.date].push(entry)
      return acc
    },
    {}
  )

  // Generate all 7 days
  const days = Array.from({ length: 7 }, (_, i) =>
    format(addDays(parseISO(week.startDate), i), "yyyy-MM-dd")
  )

  return (
    <div className="mx-auto w-[calc(100%-24px)] max-w-[1316px] py-4 sm:w-[calc(100%-40px)] sm:py-7">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        {/* Header */}
        <div className="mb-2 flex flex-col gap-3 sm:mb-1 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            This week&apos;s timesheet
          </h2>
          <WeekProgress totalHours={hrs} />
        </div>
        <p className="mb-6 text-sm text-gray-500 sm:mb-8">
          {formatDateRange(week.startDate, week.endDate)}
        </p>

        {/* Day groups */}
        <div className="space-y-5 sm:space-y-6">
          {days.map((date) => (
            <DayGroup
              key={date}
              date={date}
              entries={entriesByDate[date] ?? []}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <EntryFormModal
        open={modal.open}
        onOpenChange={(open) => setModal((s) => ({ ...s, open }))}
        mode={modal.mode}
        weekId={weekId}
        defaultDate={modal.date}
        entry={modal.entry}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}
