import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

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
