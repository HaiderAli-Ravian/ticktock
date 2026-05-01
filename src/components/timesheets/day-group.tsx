"use client"

import { AddTaskRow } from "@/components/timesheets/add-task-row"
import { EntryRow } from "@/components/timesheets/entry-row"
import type { TimesheetEntry } from "@/lib/types"
import { formatDayLabel } from "@/lib/utils"

interface DayGroupProps {
  date: string
  entries: TimesheetEntry[]
  onAdd: (date: string) => void
  onEdit: (entry: TimesheetEntry) => void
  onDelete: (entryId: string) => void
}

export function DayGroup({
  date,
  entries,
  onAdd,
  onEdit,
  onDelete,
}: DayGroupProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
      <div className="shrink-0 text-sm font-medium text-gray-500 sm:w-16 sm:pt-3">
        {formatDayLabel(date)}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {entries.map((entry) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        <AddTaskRow onAdd={() => onAdd(date)} />
      </div>
    </div>
  )
}
