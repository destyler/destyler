import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

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
