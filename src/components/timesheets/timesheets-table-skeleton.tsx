import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

interface TimesheetsTableSkeletonProps {
  rows: number
}

export function TimesheetsTableSkeleton({ rows }: TimesheetsTableSkeletonProps) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow
      key={i}
      className="h-[57px] border-slate-200 hover:bg-transparent"
    >
      <TableCell className="bg-slate-50 px-2 sm:px-5">
        <Skeleton className="h-4 w-8 bg-slate-200" />
      </TableCell>
      <TableCell className="px-3 sm:px-5">
        <Skeleton className="h-4 w-40 bg-slate-200" />
      </TableCell>
      <TableCell className="px-3 sm:px-5">
        <Skeleton className="h-5 w-24 rounded-full bg-slate-200" />
      </TableCell>
      <TableCell className="px-3 sm:px-11">
        <Skeleton className="ml-auto h-4 w-12 bg-slate-200" />
      </TableCell>
    </TableRow>
  ))
}
