import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/providers/query-provider"
import { SessionProvider } from "@/providers/session-provider"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ticktock",
  description: "Timesheet management made simple",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <SessionProvider>
          <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
