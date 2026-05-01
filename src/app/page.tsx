import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

// Root page redirects to login if not authenticated, otherwise to timesheets
export default async function RootPage() {
  const session = await auth()
  if (session) {
    redirect("/timesheets")
  } else {
    redirect("/login")
  }
}
