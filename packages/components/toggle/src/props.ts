import type { ItemProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'dir',
  'disabled',
  'getRootNode',
  'id',
  'ids',
  'loopFocus',
  'multiple',
  'onValueChange',
  'orientation',
  'rovingFocus',
  'value',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemProps = createProps<ItemProps>()(['value', 'disabled'])

export const splitItemProps = createSplitProps<ItemProps>(itemProps)
