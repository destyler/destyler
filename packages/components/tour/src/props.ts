import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

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
