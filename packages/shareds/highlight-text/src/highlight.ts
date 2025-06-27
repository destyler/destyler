import type { HighlightChunk, HighlightWordProps } from "./types"
import { highlightFirst } from "./highlight-first"
import { highlightMultiple } from "./highlight-multiple"

export function highlightWord (props: HighlightWordProps): HighlightChunk[] {
  if (props.matchAll == null) {
    props.matchAll = Array.isArray(props.query)
  }

  if (!props.matchAll && Array.isArray(props.query)) {
    throw new Error("matchAll must be true when using multiple queries")
  }

  return props.matchAll ? highlightMultiple(props) : highlightFirst(props)
}
