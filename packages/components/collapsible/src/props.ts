import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

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
