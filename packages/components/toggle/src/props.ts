import type { ItemProps, UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

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
