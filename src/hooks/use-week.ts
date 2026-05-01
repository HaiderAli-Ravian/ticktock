"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import type { WeeklyTimesheet } from "@/lib/types"

export function useWeek(weekId: string) {
  return useQuery({
    queryKey: ["week", weekId],
    queryFn: () => apiFetch<WeeklyTimesheet>(`/api/timesheets/${weekId}`),
    enabled: !!weekId,
  })
}
