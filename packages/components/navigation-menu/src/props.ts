import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'id',
  'dir',
  'getRootNode',
  'value',
  'value.controlled',
  'defaultValue',
  'onValueChange',
  'openDelay',
  'closeDelay',
  'orientation',
  'ids',
  'disableClickTrigger',
  'disableHoverTrigger',
  'disablePointerLeaveClose',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
