import type { ScrollbarProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'dir',
  'getRootNode',
  'id',
  'ids',
  'onScroll',
  'scrollHideDelay',
  'type',
  'virtual',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const scrollbarProps = createProps<ScrollbarProps>()([
  'orientation',
])

export const splitScrollbarProps = createSplitProps<Partial<ScrollbarProps>>(scrollbarProps)
