import { cn } from "@/lib/utils"
import type { EntryStatus } from "@/lib/types"

const STATUS_STYLES: Record<EntryStatus, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  INCOMPLETE: "bg-yellow-100 text-yellow-800",
  MISSING: "bg-rose-100 text-rose-800",
}

const STATUS_LABELS: Record<EntryStatus, string> = {
  COMPLETED: "Completed",
  INCOMPLETE: "Incomplete",
  MISSING: "Missing",
}

interface StatusBadgeProps {
  status: EntryStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[23px] min-w-[78px] items-center justify-center rounded-[6px] px-2.5 text-xs leading-none font-semibold uppercase",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
