"use client"

import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CustomSelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  placeholder: string
  options: CustomSelectOption[]
  onChange: (value: string) => void
  rootClassName?: string
  triggerClassName?: string
  contentClassName?: string
  itemClassName?: string
}

export function CustomSelect({
  value,
  placeholder,
  options,
  onChange,
  rootClassName,
  triggerClassName,
  contentClassName,
  itemClassName,
}: CustomSelectProps) {
  const selected = options.find((option) => option.value === value)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn("relative inline-block", rootClassName)}>
      <Button
        type="button"
        variant="outline"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "h-[42px] w-[144px] justify-between gap-2 rounded-[8px] border-slate-300 bg-white px-3 text-left text-sm font-normal text-slate-500 shadow-none hover:bg-white hover:text-slate-700 active:translate-y-0 aria-expanded:bg-white aria-expanded:text-slate-700",
          triggerClassName
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDownIcon className="size-4 shrink-0 text-slate-500" />
      </Button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute top-[calc(100%+6px)] left-0 z-50 w-[144px] rounded-[8px] border border-slate-200 bg-white p-1 shadow-md",
            contentClassName
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              className={cn(
                "flex h-9 w-full items-center justify-between rounded-md px-2 text-left text-sm text-slate-900 hover:bg-slate-50",
                itemClassName
              )}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              <span className="truncate">{option.label}</span>
              {value === option.value && (
                <CheckIcon className="size-4 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
