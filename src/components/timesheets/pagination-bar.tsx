"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaginationBarProps {
  total: number
  page: number
  perPage: number
}

export function PaginationBar({ total, page, perPage }: PaginationBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(p))
    router.push(`?${params.toString()}`)
  }

  function changePerPage(value: string | null) {
    if (!value) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("perPage", value)
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const pages = buildPageNumbers(page, totalPages)

  return (
    <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
      <div className="flex items-center gap-2 text-[#4b5565]">
        <Select value={String(perPage)} onValueChange={changePerPage}>
          <SelectTrigger className="h-[42px] w-[142px] rounded-[13px] border-[#e3e8ef] bg-white px-4 text-sm font-normal text-[#4b5565] shadow-[0_1px_2px_rgba(15,23,42,0.08)] sm:text-base [&_svg]:text-[#4b5565]">
            <SelectValue>{perPage} per page</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex max-w-full flex-wrap items-center justify-start overflow-hidden rounded-[13px] border border-[#e3e8ef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="h-[42px] rounded-none border-0 border-r border-[#e3e8ef] bg-white px-3 text-sm font-medium text-[#4b5565] shadow-none hover:bg-[#f8fafc] disabled:opacity-60 sm:px-4 sm:text-base"
        >
          Previous
        </Button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-[42px] min-w-9 items-center justify-center border-r border-[#e3e8ef] bg-white px-2 text-sm font-medium text-[#4b5565] sm:min-w-[42px] sm:text-base"
            >
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              className={
                p === page
                  ? "h-[42px] min-w-9 rounded-none border-0 border-r border-[#e3e8ef] bg-[#f8fafc] px-2 text-sm font-medium text-[#0b5cff] shadow-none hover:bg-[#f8fafc] sm:min-w-[42px] sm:text-base"
                  : "h-[42px] min-w-9 rounded-none border-0 border-r border-[#e3e8ef] bg-white px-2 text-sm font-medium text-[#4b5565] shadow-none hover:bg-[#f8fafc] sm:min-w-[42px] sm:text-base"
              }
              onClick={() => goToPage(p as number)}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className="h-[42px] rounded-none border-0 bg-white px-3 text-sm font-medium text-[#4b5565] shadow-none hover:bg-[#f8fafc] disabled:opacity-60 sm:px-4 sm:text-base"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = [1]

  if (current > 3) pages.push("...")

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push("...")
  pages.push(total)

  return pages
}
