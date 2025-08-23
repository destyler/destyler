import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'dir',
  'disabled',
  'drawing',
  'getRootNode',
  'id',
  'ids',
  'name',
  'onDraw',
  'onDrawEnd',
  'readOnly',
  'required',
  'translations',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
