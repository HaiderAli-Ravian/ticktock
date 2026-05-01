"use client"

import { MoreHorizontalIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TimesheetEntry } from "@/lib/types"

interface EntryRowProps {
  entry: TimesheetEntry
  onEdit: (entry: TimesheetEntry) => void
  onDelete: (entryId: string) => void
}

export function EntryRow({ entry, onEdit, onDelete }: EntryRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <p className="min-w-0 flex-1 text-sm font-medium break-words text-gray-900 sm:truncate">
        {entry.description}
      </p>

      <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2">
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
          {entry.hours} hrs
        </span>
        <span className="max-w-full truncate rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {entry.projectName}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded p-1 text-gray-400 outline-none hover:bg-gray-100 hover:text-gray-600">
            <MoreHorizontalIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(entry)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(entry.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
