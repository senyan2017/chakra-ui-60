---
"@chakra-ui/react": patch
---

Fix issue where the `For` component ignored the `fallback` prop when `each` was
`undefined`. Previously, only an empty array (`[]`) rendered the fallback while
`undefined` rendered nothing, leading to inconsistent behavior between "empty"
and "no data yet" states. Both cases now render the `fallback`.
