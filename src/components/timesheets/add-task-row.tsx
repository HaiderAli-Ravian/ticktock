"use client"

import { PlusIcon } from "lucide-react"

interface AddTaskRowProps {
  onAdd: () => void
}

export function AddTaskRow({ onAdd }: AddTaskRowProps) {
  return (
    <button
      onClick={onAdd}
      className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-sm text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500 sm:px-4"
    >
      <PlusIcon className="size-4" />
      Add new task
    </button>
  )
}
