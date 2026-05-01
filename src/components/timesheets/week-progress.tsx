import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

interface WeekProgressProps {
  totalHours: number
  targetHours?: number
}

export function WeekProgress({
  totalHours,
  targetHours = 40,
}: WeekProgressProps) {
  const pct = Math.min(100, Math.round((totalHours / targetHours) * 100))

  return (
    <div className="flex w-full flex-col items-start gap-1 sm:w-auto sm:items-end">
      <div className="flex items-baseline gap-2 text-sm font-semibold text-gray-900">
        {totalHours}/{targetHours} hrs
        <span className="text-xs font-normal text-gray-500">{pct}%</span>
      </div>
      <ProgressPrimitive.Root
        value={pct}
        className="flex w-full items-center sm:w-36"
        aria-label="Week progress"
      >
        <ProgressPrimitive.Track className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <ProgressPrimitive.Indicator className="h-full bg-orange-500 transition-all" />
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
    </div>
  )
}
