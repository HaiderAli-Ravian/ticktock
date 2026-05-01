import { Skeleton } from "@/components/ui/skeleton"

export function WeekDetailSkeleton() {
  return (
    <div className="mx-auto w-[calc(100%-24px)] max-w-[1316px] py-4 sm:w-[calc(100%-40px)] sm:py-7">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-48 bg-slate-200" />
            <Skeleton className="h-4 w-40 bg-slate-200" />
          </div>
          <div className="w-full space-y-2 sm:w-[220px]">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 bg-slate-200" />
              <Skeleton className="h-4 w-12 bg-slate-200" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-slate-200" />
          </div>
        </div>

        <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-5 w-16 bg-slate-200 sm:mt-3" />
              <div className="flex-1 space-y-3">
                <div className="rounded-lg border border-gray-100 bg-white px-3 py-3 sm:px-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-56 max-w-full bg-slate-200" />
                      <Skeleton className="h-3 w-36 bg-slate-200" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
                      <Skeleton className="h-8 w-8 rounded-lg bg-slate-200" />
                      <Skeleton className="h-8 w-8 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                </div>
                {i % 2 === 1 && (
                  <Skeleton className="h-10 w-full rounded-lg bg-slate-200" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
