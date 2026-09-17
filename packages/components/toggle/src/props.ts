import type { ItemProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'defaultValue',
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
  'value.controlled',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemProps = createProps<ItemProps>()(['value', 'disabled'])

export const splitItemProps = createSplitProps<ItemProps>(itemProps)
