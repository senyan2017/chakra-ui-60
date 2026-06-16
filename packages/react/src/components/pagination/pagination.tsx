"use client"

import type { Assign } from "@ark-ui/react"
import {
  Pagination as ArkPagination,
  usePaginationContext,
} from "@ark-ui/react/pagination"
import { forwardRef, useMemo } from "react"
import {
  type HTMLChakraProps,
  type SlotRecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "../../styled-system"
import { Box, type BoxProps } from "../box"
import { IconButton } from "../button"
import { For } from "../for"
import { EllipsisIcon } from "../icons"

////////////////////////////////////////////////////////////////////////////////////

const {
  withProvider,
  withContext,
  useStyles: usePaginationStyles,
  PropsProvider,
} = createSlotRecipeContext({ key: "pagination" })

export { usePaginationStyles }

////////////////////////////////////////////////////////////////////////////////////

export interface PaginationRootProviderBaseProps
  extends
    Assign<ArkPagination.RootProviderBaseProps, SlotRecipeProps<"pagination">>,
    UnstyledProp {}

export interface PaginationRootProviderProps extends HTMLChakraProps<
  "div",
  PaginationRootProviderBaseProps
> {}

export const PaginationRootProvider = withProvider<
  HTMLDivElement,
  PaginationRootProviderProps
>(ArkPagination.RootProvider, "root", {
  forwardAsChild: true,
  forwardProps: ["page"],
})

////////////////////////////////////////////////////////////////////////////////////

export interface PaginationRootBaseProps
  extends
    Assign<ArkPagination.RootBaseProps, SlotRecipeProps<"pagination">>,
    UnstyledProp {}

export interface PaginationRootProps extends HTMLChakraProps<
  "div",
  PaginationRootBaseProps
> {}

export const PaginationRoot = withProvider<HTMLDivElement, PaginationRootProps>(
  ArkPagination.Root,
  "root",
  { forwardAsChild: true, forwardProps: ["page"] },
)

////////////////////////////////////////////////////////////////////////////////////

export const PaginationPropsProvider =
  PropsProvider as React.Provider<PaginationRootBaseProps>

////////////////////////////////////////////////////////////////////////////////////

export interface PaginationEllipsisProps
  extends
    HTMLChakraProps<"div", ArkPagination.EllipsisBaseProps>,
    UnstyledProp {}

export const PaginationEllipsis = withContext<
  HTMLDivElement,
  PaginationEllipsisProps
>(ArkPagination.Ellipsis, "ellipsis", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export interface PaginationItemProps
  extends
    HTMLChakraProps<"button", ArkPagination.ItemBaseProps>,
    UnstyledProp {}

export const PaginationItem = withContext<
  HTMLButtonElement,
  PaginationItemProps
>(ArkPagination.Item, "item", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export interface PaginationNextTriggerProps
  extends
    HTMLChakraProps<"button", ArkPagination.NextTriggerBaseProps>,
    UnstyledProp {}

export const PaginationNextTrigger = withContext<
  HTMLButtonElement,
  PaginationNextTriggerProps
>(ArkPagination.NextTrigger, "nextTrigger", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export interface PaginationPrevTriggerProps
  extends
    HTMLChakraProps<"button", ArkPagination.PrevTriggerBaseProps>,
    UnstyledProp {}

export const PaginationPrevTrigger = withContext<
  HTMLButtonElement,
  PaginationPrevTriggerProps
>(ArkPagination.PrevTrigger, "prevTrigger", { forwardAsChild: true })

////////////////////////////////////////////////////////////////////////////////////

export const PaginationContext = ArkPagination.Context

export interface PaginationPageChangeDetails
  extends ArkPagination.PageChangeDetails {}

export interface PaginationPageSizeChangeDetails
  extends ArkPagination.PageSizeChangeDetails {}

////////////////////////////////////////////////////////////////////////////////////

export interface PaginationPageTextFormatDetails {
  page: number
  totalPages: number
  pageRange: { start: number; end: number }
  count: number
}

export type PaginationPageTextFormatFn = (
  details: PaginationPageTextFormatDetails,
) => string

export type PaginationPageTextFormat =
  | "short"
  | "compact"
  | "long"
  | PaginationPageTextFormatFn

export interface PaginationPageTextProps extends BoxProps {
  format?: PaginationPageTextFormat | undefined
}

export const PaginationPageText = forwardRef<
  HTMLParagraphElement,
  PaginationPageTextProps
>(function PaginationPageText(props, ref) {
  const { format = "compact", ...rest } = props
  const { page, totalPages, pageRange, count } = usePaginationContext()
  const content = useMemo(() => {
    if (typeof format === "function") {
      return format({ page, totalPages, pageRange, count })
    }
    if (format === "short") return `${page} / ${totalPages}`
    if (format === "compact") return `${page} of ${totalPages}`
    return `${pageRange.start + 1} - ${Math.min(pageRange.end, count)} of ${count}`
  }, [format, page, totalPages, pageRange, count])

  return (
    <Box fontWeight="medium" ref={ref} {...rest}>
      {content}
    </Box>
  )
})

////////////////////////////////////////////////////////////////////////////////////

interface PaginationPageValue {
  type: "page"
  value: number
}

export interface PaginationItemsProps extends React.HTMLAttributes<HTMLElement> {
  render: (page: PaginationPageValue) => React.ReactNode
  ellipsis?: React.ReactElement | undefined
}

// Props shared by every rendered pagination item and forwarded to the
// underlying Ark element (e.g. `className`, `data-*`, event handlers).
type PaginationItemSharedProps = React.HTMLAttributes<HTMLElement>

interface PaginationPageItemProps extends PaginationItemSharedProps {
  page: PaginationPageValue
  render: PaginationItemsProps["render"]
}

const PaginationPageItem = (props: PaginationPageItemProps) => {
  const { page, render, ...rest } = props
  return (
    <PaginationItem asChild type="page" value={page.value} {...rest}>
      {render(page)}
    </PaginationItem>
  )
}

interface PaginationEllipsisItemProps extends PaginationItemSharedProps {
  index: number
  ellipsis: PaginationItemsProps["ellipsis"]
}

const PaginationEllipsisItem = (props: PaginationEllipsisItemProps) => {
  const { index, ellipsis, ...rest } = props
  return (
    <PaginationEllipsis asChild index={index} {...rest}>
      {ellipsis || (
        <IconButton as="span">
          <EllipsisIcon />
        </IconButton>
      )}
    </PaginationEllipsis>
  )
}

export const PaginationItems = (props: PaginationItemsProps) => {
  const { pages } = usePaginationContext()
  const { render, ellipsis, ...rest } = props
  return (
    <For each={pages}>
      {(page, index) =>
        page.type === "ellipsis" ? (
          <PaginationEllipsisItem
            key={index}
            index={index}
            ellipsis={ellipsis}
            {...rest}
          />
        ) : (
          <PaginationPageItem key={index} page={page} render={render} {...rest} />
        )
      }
    </For>
  )
}
