import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'ids',
  'value',
  'id',
  'encoding',
  'dir',
  'getRootNode',
  'onValueChange',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
