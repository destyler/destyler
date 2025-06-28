import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'autoFocus',
  'closeOnEscape',
  'closeOnInteractOutside',
  'dir',
  'getRootNode',
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
  'portalled',
  'positioning',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
