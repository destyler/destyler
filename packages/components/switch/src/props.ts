import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'checked',
  'dir',
  'disabled',
  'form',
  'getRootNode',
  'id',
  'ids',
  'invalid',
  'label',
  'name',
  'onCheckedChange',
  'readOnly',
  'required',
  'value',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
