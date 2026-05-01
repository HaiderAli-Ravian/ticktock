"use client"

import { ChevronDownIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { SignOutDialog } from "@/components/layout/sign-out-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const { data: session } = useSession()
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:h-[70px] sm:px-5">
        <div className="flex min-w-0 items-center gap-4 sm:gap-9">
          <Link
            href="/timesheets"
            className="text-xl leading-none font-bold tracking-normal text-slate-950 sm:text-2xl"
          >
            ticktock
          </Link>
          <Link
            href="/timesheets"
            className="truncate text-sm leading-none font-medium text-slate-700 hover:text-slate-950 sm:text-base"
          >
            Timesheets
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-sm leading-none font-medium text-slate-500 outline-none hover:bg-gray-100 sm:text-base">
            {session?.user?.name ?? "Account"}
            <ChevronDownIcon className="size-4 text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <SignOutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
      </div>
    </header>
  )
}
