"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-5 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-950">
            Sign out?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-slate-500">
          Are you sure you want to sign out of your account?
        </p>
        <DialogFooter className="gap-3 bg-white sm:justify-stretch">
          <Button
            type="button"
            className="h-10 flex-1 rounded-lg bg-blue-600 text-sm font-medium text-white shadow-none hover:bg-blue-700"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign out
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 rounded-lg border-slate-300 bg-white text-sm font-medium text-slate-950 shadow-none hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
