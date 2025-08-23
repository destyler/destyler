import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'closeOnEscape',
  'closeOnInteractOutside',
  'dir',
  'getRootNode',
  'id',
  'ids',
  'keyboardNavigation',
  'onFocusOutside',
  'onInteractOutside',
  'onPointerDownOutside',
  'onStatusChange',
  'onStepChange',
  'preventInteraction',
  'spotlightOffset',
  'spotlightRadius',
  'stepId',
  'steps',
  'translations',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
