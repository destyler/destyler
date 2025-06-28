import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'dir',
  'getRootNode',
  'id',
  'ids',
  'max',
  'min',
  'orientation',
  'translations',
  'value',
  'onValueChange',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
