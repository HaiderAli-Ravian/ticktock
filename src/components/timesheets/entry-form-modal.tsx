"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { InfoIcon, Loader2, MinusIcon, PlusIcon } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { CustomSelect } from "@/components/ui/custom-select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { apiFetch } from "@/lib/api-client"
import type { Project, TimesheetEntry } from "@/lib/types"
import { WORK_TYPES } from "@/lib/types"
import { entrySchema, type EntryInput } from "@/lib/validators"

interface EntryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  weekId: string
  defaultDate?: string
  entry?: TimesheetEntry | null
  onSubmit: (data: EntryInput) => Promise<void>
}

export function EntryFormModal({
  open,
  onOpenChange,
  mode,
  defaultDate = "",
  entry,
  onSubmit,
}: EntryFormModalProps) {
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiFetch<{ projects: Project[] }>("/api/projects"),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntryInput>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      projectId: "",
      workType: "Development",
      description: "",
      hours: 8,
      date: defaultDate,
    },
  })

  useEffect(() => {
    if (open) {
      if (mode === "edit" && entry) {
        reset({
          projectId: entry.projectId,
          workType: entry.workType,
          description: entry.description,
          hours: entry.hours,
          date: entry.date,
        })
      } else {
        reset({
          projectId: "",
          workType: "Development",
          description: "",
          hours: 8,
          date: defaultDate,
        })
      }
    }
  }, [open, mode, entry, defaultDate, reset])

  async function handleFormSubmit(data: EntryInput) {
    await onSubmit(data)
  }

  const projectOptions =
    projectsData?.projects.map((project) => ({
      value: project.id,
      label: project.name,
    })) ?? []

  const workTypeOptions = WORK_TYPES.map((workType) => ({
    value: workType,
    label: workType,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[calc(100vh-2rem)] gap-4 overflow-y-auto sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-950">
            {mode === "add" ? "Add New Entry" : "Edit Entry"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Project */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-950">
              Select Project <span className="text-red-500">*</span>
              <Tooltip>
                <TooltipTrigger
                  className="inline-flex rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  aria-label="Project field information"
                >
                  <InfoIcon className="size-4 fill-slate-400 text-white" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  Choose the project this task belongs to.
                </TooltipContent>
              </Tooltip>
            </Label>
            <Controller
              control={control}
              name="projectId"
              render={({ field }) => (
                <CustomSelect
                  value={field.value}
                  placeholder="Project Name"
                  options={projectOptions}
                  onChange={field.onChange}
                  rootClassName="w-full sm:w-auto"
                  triggerClassName="w-full border-[#D1D5DB] sm:w-[364px]"
                  contentClassName="w-full sm:w-[364px]"
                />
              )}
            />
            {errors.projectId && (
              <p className="text-xs text-red-500">{errors.projectId.message}</p>
            )}
          </div>

          {/* Work type */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-950">
              Type of Work <span className="text-red-500">*</span>
              <Tooltip>
                <TooltipTrigger
                  className="inline-flex rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  aria-label="Type of work field information"
                >
                  <InfoIcon className="size-4 fill-slate-400 text-white" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  Select the category that best describes the task.
                </TooltipContent>
              </Tooltip>
            </Label>
            <Controller
              control={control}
              name="workType"
              render={({ field }) => (
                <CustomSelect
                  value={field.value}
                  placeholder="Bug fixes"
                  options={workTypeOptions}
                  onChange={field.onChange}
                  rootClassName="w-full sm:w-auto"
                  triggerClassName="w-full border-[#D1D5DB] sm:w-[364px]"
                  contentClassName="w-full sm:w-[364px]"
                />
              )}
            />
            {errors.workType && (
              <p className="text-xs text-red-500">{errors.workType.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-950">
              Task description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Write text here ..."
              className="h-[163px] w-full resize-none rounded-[8px] border border-[#D1D5DB] bg-white pt-[3px] pr-[4px] pb-[3px] pl-[4px] text-base leading-normal text-slate-700 shadow-none placeholder:text-slate-500 focus-visible:border-slate-400 focus-visible:ring-0 sm:w-[494px]"
              {...register("description")}
            />
            <p className="text-xs text-slate-500">A note for extra info</p>
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Hours stepper */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-950">
              Hours <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="hours"
              render={({ field }) => (
                <div className="inline-flex h-10 overflow-hidden rounded-lg border border-slate-300 bg-white">
                  <button
                    type="button"
                    className="flex w-10 items-center justify-center bg-slate-50 text-slate-950 transition-colors hover:bg-slate-100"
                    onClick={() =>
                      field.onChange(Math.max(1, (field.value ?? 1) - 1))
                    }
                  >
                    <MinusIcon className="size-4 stroke-[3]" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={field.value ?? 1}
                    onChange={(e) =>
                      field.onChange(
                        Math.min(24, Math.max(1, parseInt(e.target.value) || 1))
                      )
                    }
                    className="h-full w-12 border-x border-slate-300 bg-white text-center text-sm text-slate-500 outline-none [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    className="flex w-10 items-center justify-center bg-slate-50 text-slate-950 transition-colors hover:bg-slate-100"
                    onClick={() =>
                      field.onChange(Math.min(24, (field.value ?? 1) + 1))
                    }
                  >
                    <PlusIcon className="size-4 stroke-[3]" />
                  </button>
                </div>
              )}
            />
            {errors.hours && (
              <p className="text-xs text-red-500">{errors.hours.message}</p>
            )}
          </div>

          <DialogFooter className="-mx-4 -mb-4 flex-col gap-3 bg-white sm:flex-row sm:justify-stretch">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="order-2 h-14 min-h-14 w-full flex-1 rounded-lg bg-blue-600 text-base font-medium text-white shadow-none hover:bg-blue-700 sm:order-none sm:h-10 sm:min-h-10 sm:w-auto sm:text-sm"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "add" ? (
                "Add entry"
              ) : (
                "Save changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="order-1 h-14 min-h-14 w-full flex-1 rounded-lg border-slate-300 bg-white text-base font-medium text-slate-950 shadow-none hover:bg-slate-50 sm:order-none sm:h-10 sm:min-h-10 sm:w-auto sm:text-sm"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
