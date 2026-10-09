import type { HighlightChunk, HighlightWordProps } from './types'
import { highlightFirst } from './highlight-first'
import { highlightMultiple } from './highlight-multiple'

export function highlightWord(props: HighlightWordProps): HighlightChunk[] {
  const matchAll = props.matchAll ?? Array.isArray(props.query)

  if (!matchAll && Array.isArray(props.query)) {
    throw new Error('matchAll must be true when using multiple queries')
  }

  return matchAll ? highlightMultiple(props, matchAll) : highlightFirst(props)
}
