import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'dir',
  'id',
  'ids',
  'items',
  'getRootNode',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
