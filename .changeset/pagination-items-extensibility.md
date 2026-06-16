---
"@chakra-ui/react": minor
---

Improve the extensibility of `Pagination.Items`:

- Add an `empty` prop to render fallback content when there are no pages,
  removing the need to guard for the empty state at the call site.
- The `render` prop is now optional (falls back to a default page button) and
  its details now include `current` (whether the page is selected) and `index`,
  making it easier to customize the current vs. non-current page items.
- The `ellipsis` prop now accepts a render function (in addition to a React
  element) that receives the ellipsis details, matching the mental model of the
  `render` prop.

These changes are backward compatible; existing usage continues to work
unchanged.
