import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

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
