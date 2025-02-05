import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

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
