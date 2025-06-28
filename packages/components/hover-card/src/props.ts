import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'closeDelay',
  'dir',
  'getRootNode',
  'id',
  'ids',
  'onOpenChange',
  'open.controlled',
  'open',
  'openDelay',
  'positioning',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
