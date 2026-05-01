"use client"

import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import type { WeeklyTimesheet } from "@/lib/types"

interface TimesheetsResponse {
  items: WeeklyTimesheet[]
  total: number
  page: number
  perPage: number
}

interface UseTimesheetsParams {
  startDate: string | null
  endDate: string | null
  status: string
  sortBy: string
  sortOrder: string
  page: number
  perPage: number
}

export function useTimesheets({
  startDate,
  endDate,
  status,
  sortBy,
  sortOrder,
  page,
  perPage,
}: UseTimesheetsParams) {
  return useQuery({
    queryKey: [
      "timesheets",
      startDate,
      endDate,
      status,
      sortBy,
      sortOrder,
      page,
      perPage,
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        status,
        sortBy,
        sortOrder,
        page: String(page),
        perPage: String(perPage),
      })
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)
      return apiFetch<TimesheetsResponse>(`/api/timesheets?${params}`)
    },
  })
}
