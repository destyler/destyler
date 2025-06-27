import type { CSSProperties, HTMLAttributes, JSX } from 'react'
import { createNormalizer } from '@destyler/types'

type WithoutRef<T> = Omit<T, 'ref'>

type ElementsWithoutRef = {
  [K in keyof JSX.IntrinsicElements]: WithoutRef<JSX.IntrinsicElements[K]>
}

export type PropTypes = ElementsWithoutRef & {
  element: WithoutRef<HTMLAttributes<HTMLElement>>
  style: CSSProperties
}

export const normalizeProps = createNormalizer<PropTypes>(v => v)
