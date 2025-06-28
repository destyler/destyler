import type { ItemProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'dir',
  'disabled',
  'form',
  'getRootNode',
  'id',
  'ids',
  'name',
  'onValueChange',
  'orientation',
  'readOnly',
  'value',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemProps = createProps<ItemProps>()(['value', 'disabled', 'invalid'])
export const splitItemProps = createSplitProps<ItemProps>(itemProps)
