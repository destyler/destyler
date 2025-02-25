import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'aria-label',
  'closeOnEscape',
  'closeOnInteractOutside',
  'dir',
  'finalFocusEl',
  'getRootNode',
  'getRootNode',
  'id',
  'id',
  'ids',
  'initialFocusEl',
  'modal',
  'onEscapeKeyDown',
  'onFocusOutside',
  'onInteractOutside',
  'onOpenChange',
  'onPointerDownOutside',
  'open.controlled',
  'open',
  'persistentElements',
  'preventScroll',
  'restoreFocus',
  'role',
  'trapFocus',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
