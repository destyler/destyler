import type { ItemProps, UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

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
