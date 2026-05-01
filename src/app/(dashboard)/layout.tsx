import { redirect } from "next/navigation"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
