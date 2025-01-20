import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'checked',
  'dir',
  'disabled',
  'form',
  'getRootNode',
  'id',
  'ids',
  'invalid',
  'name',
  'onCheckedChange',
  'readOnly',
  'required',
  'value',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
