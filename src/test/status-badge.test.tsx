import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StatusBadge } from "@/components/timesheets/status-badge"

describe("StatusBadge", () => {
  it("renders Completed for COMPLETED status with green styles", () => {
    const { container } = render(<StatusBadge status="COMPLETED" />)
    expect(screen.getByText("Completed")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("bg-green-100", "text-green-800")
  })

  it("renders Incomplete for INCOMPLETE status with yellow styles", () => {
    const { container } = render(<StatusBadge status="INCOMPLETE" />)
    expect(screen.getByText("Incomplete")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("bg-yellow-100", "text-yellow-800")
  })

  it("renders Missing for MISSING status with rose styles", () => {
    const { container } = render(<StatusBadge status="MISSING" />)
    expect(screen.getByText("Missing")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("bg-rose-100", "text-rose-800")
  })
})
