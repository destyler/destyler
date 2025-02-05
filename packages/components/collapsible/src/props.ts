import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'dir',
  'disabled',
  'getRootNode',
  'id',
  'ids',
  'onExitComplete',
  'onOpenChange',
  'open.controlled',
  'open',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
