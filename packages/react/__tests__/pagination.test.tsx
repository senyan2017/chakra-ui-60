import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  PaginationItems,
  PaginationRoot,
} from "../src/components/pagination"
import { render } from "./core"

describe("PaginationItems", () => {
  it("renders a default page button for every page when render is omitted", () => {
    render(
      <PaginationRoot count={30} pageSize={10} defaultPage={1}>
        <PaginationItems />
      </PaginationRoot>,
    )

    // 30 items / 10 per page => pages 1, 2, 3
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("renders custom page content and exposes the current page", () => {
    render(
      <PaginationRoot count={30} pageSize={10} defaultPage={2}>
        <PaginationItems
          render={(page) => (
            <button
              data-testid={`page-${page.value}`}
              data-current={page.current}
              data-index={page.index}
            >
              {page.value}
            </button>
          )}
        />
      </PaginationRoot>,
    )

    expect(screen.getByTestId("page-1")).toBeInTheDocument()
    expect(screen.getByTestId("page-2")).toBeInTheDocument()
    expect(screen.getByTestId("page-3")).toBeInTheDocument()

    // defaultPage is 2, so only that item should be marked as current
    expect(screen.getByTestId("page-1")).toHaveAttribute("data-current", "false")
    expect(screen.getByTestId("page-2")).toHaveAttribute("data-current", "true")
    expect(screen.getByTestId("page-3")).toHaveAttribute("data-current", "false")

    // index reflects the position within the rendered list
    expect(screen.getByTestId("page-1")).toHaveAttribute("data-index", "0")
  })

  it("renders the empty fallback when there are no pages", () => {
    render(
      <PaginationRoot count={0} pageSize={10}>
        <PaginationItems
          empty={<div data-testid="empty">No pages</div>}
          render={(page) => (
            <button data-testid={`page-${page.value}`}>{page.value}</button>
          )}
        />
      </PaginationRoot>,
    )

    expect(screen.getByTestId("empty")).toBeInTheDocument()
    expect(screen.queryByTestId("page-1")).not.toBeInTheDocument()
  })

  it("renders nothing for the empty state when no fallback is provided", () => {
    const { container } = render(
      <PaginationRoot count={0} pageSize={10}>
        <PaginationItems
          render={(page) => (
            <button data-testid={`page-${page.value}`}>{page.value}</button>
          )}
        />
      </PaginationRoot>,
    )

    expect(screen.queryByTestId("page-1")).not.toBeInTheDocument()
    expect(container.querySelectorAll("button")).toHaveLength(0)
  })

  it("supports a render function for the ellipsis", () => {
    render(
      <PaginationRoot count={200} pageSize={10} defaultPage={1}>
        <PaginationItems
          ellipsis={({ type, index }) => (
            <span data-testid="ellipsis" data-type={type} data-index={index}>
              …
            </span>
          )}
          render={(page) => (
            <button data-testid={`page-${page.value}`}>{page.value}</button>
          )}
        />
      </PaginationRoot>,
    )

    const ellipses = screen.getAllByTestId("ellipsis")
    expect(ellipses.length).toBeGreaterThan(0)
    expect(ellipses[0]).toHaveAttribute("data-type", "ellipsis")
  })
})
