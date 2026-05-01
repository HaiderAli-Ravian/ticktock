"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api-client"
import type { TimesheetEntry } from "@/lib/types"
import type { EntryInput, EntryUpdateInput } from "@/lib/validators"

export function useCreateEntry(weekId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EntryInput) =>
      apiFetch<TimesheetEntry>(`/api/timesheets/${weekId}/entries`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week", weekId] })
    },
  })
}

export function useUpdateEntry(weekId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      entryId,
      data,
    }: {
      entryId: string
      data: EntryUpdateInput
    }) =>
      apiFetch<TimesheetEntry>(
        `/api/timesheets/${weekId}/entries/${entryId}`,
        { method: "PATCH", body: JSON.stringify(data) }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week", weekId] })
    },
  })
}

export function useDeleteEntry(weekId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entryId: string) =>
      apiFetch(`/api/timesheets/${weekId}/entries/${entryId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["week", weekId] })
    },
  })
}
