import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { For } from "../src/components/for"

describe("For", () => {
  it("renders each item in order for a non-empty array", () => {
    render(
      <For each={["a", "b", "c"]}>
        {(item, index) => (
          <span key={item} data-testid="item" data-index={index}>
            {item}
          </span>
        )}
      </For>,
    )

    const items = screen.getAllByTestId("item")
    expect(items.map((el) => el.textContent)).toEqual(["a", "b", "c"])
    expect(items.map((el) => el.getAttribute("data-index"))).toEqual([
      "0",
      "1",
      "2",
    ])
  })

  it("renders the fallback when the array is empty", () => {
    render(
      <For each={[]} fallback={<span data-testid="fallback">empty</span>}>
        {(item) => <span key={String(item)}>{String(item)}</span>}
      </For>,
    )

    expect(screen.getByTestId("fallback")).toBeInTheDocument()
  })

  it("renders the fallback when `each` is undefined", () => {
    render(
      <For
        each={undefined}
        fallback={<span data-testid="fallback">no data</span>}
      >
        {(item) => <span key={String(item)}>{String(item)}</span>}
      </For>,
    )

    expect(screen.getByTestId("fallback")).toBeInTheDocument()
  })

  it("renders nothing when `each` is undefined and no fallback is provided", () => {
    const { container } = render(
      <For each={undefined}>
        {(item) => <span key={String(item)}>{String(item)}</span>}
      </For>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("renders nothing when the array is empty and no fallback is provided", () => {
    const { container } = render(
      <For each={[]}>
        {(item) => <span key={String(item)}>{String(item)}</span>}
      </For>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("does not render the fallback when the array has items", () => {
    render(
      <For each={["a"]} fallback={<span data-testid="fallback">empty</span>}>
        {(item) => (
          <span key={item} data-testid="item">
            {item}
          </span>
        )}
      </For>,
    )

    expect(screen.queryByTestId("fallback")).not.toBeInTheDocument()
    expect(screen.getByTestId("item")).toHaveTextContent("a")
  })

  it("renders falsy-but-valid values such as 0", () => {
    render(
      <For each={[0, 1, 2]}>
        {(item) => (
          <span key={item} data-testid="num">
            {item}
          </span>
        )}
      </For>,
    )

    expect(screen.getAllByTestId("num").map((el) => el.textContent)).toEqual([
      "0",
      "1",
      "2",
    ])
  })

  it("supports readonly arrays", () => {
    const items = ["x", "y"] as const

    render(
      <For each={items}>
        {(item) => (
          <span key={item} data-testid="ro-item">
            {item}
          </span>
        )}
      </For>,
    )

    expect(
      screen.getAllByTestId("ro-item").map((el) => el.textContent),
    ).toEqual(["x", "y"])
  })
})
