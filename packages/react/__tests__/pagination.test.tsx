import "@testing-library/jest-dom/vitest"
import { render as renderUI, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import {
  ChakraProvider,
  PaginationItems,
  type PaginationItemsProps,
  PaginationRoot,
  defaultSystem,
} from "../src"

interface SetupProps {
  count?: number
  pageSize?: number
  page?: number
  render?: PaginationItemsProps["render"]
  ellipsis?: PaginationItemsProps["ellipsis"]
}

function setup(props: SetupProps = {}) {
  const {
    count = 100,
    pageSize = 10,
    page = 5,
    render = (item) => <span data-testid={`page-${item.value}`}>{item.value}</span>,
    ellipsis,
  } = props

  return renderUI(
    <ChakraProvider value={defaultSystem}>
      <PaginationRoot count={count} pageSize={pageSize} defaultPage={page}>
        <PaginationItems render={render} ellipsis={ellipsis} />
      </PaginationRoot>
    </ChakraProvider>,
  )
}

describe("PaginationItems", () => {
  it("renders a page item for every page entry using the render prop", () => {
    const render = vi.fn((item: { type: "page"; value: number }) => (
      <span data-testid={`page-${item.value}`}>{item.value}</span>
    ))

    setup({ render })

    // first/last pages and the current page are always page items
    expect(screen.getByTestId("page-1")).toHaveTextContent("1")
    expect(screen.getByTestId("page-5")).toHaveTextContent("5")
    expect(screen.getByTestId("page-10")).toHaveTextContent("10")

    // render is only ever invoked for page entries, never ellipsis
    expect(render).toHaveBeenCalled()
    for (const [item] of render.mock.calls) {
      expect(item).toMatchObject({ type: "page" })
      expect(typeof item.value).toBe("number")
    }
  })

  it("renders the default ellipsis when the page range overflows", () => {
    // plain-text page items, so the only svg present is the default icon
    const { container } = setup({
      render: (item) => <span>{item.value}</span>,
    })

    expect(container.querySelector("svg")).toBeTruthy()
  })

  it("renders a custom ellipsis element when the ellipsis prop is provided", () => {
    const { container } = setup({
      render: (item) => <span>{item.value}</span>,
      ellipsis: <span data-testid="custom-ellipsis">...</span>,
    })

    expect(screen.getAllByTestId("custom-ellipsis").length).toBeGreaterThan(0)
    // the default icon should not be rendered when a custom ellipsis is supplied
    expect(container.querySelector("svg")).toBeNull()
  })
})
