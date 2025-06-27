import type { ItemProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'collapsible',
  'dir',
  'disabled',
  'getRootNode',
  'id',
  'ids',
  'multiple',
  'onFocusChange',
  'onValueChange',
  'orientation',
  'value',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemProps = createProps<ItemProps>()(['value', 'disabled'])
export const splitItemProps = createSplitProps<ItemProps>(itemProps)
