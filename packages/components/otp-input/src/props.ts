import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'autoFocus',
  'blurOnComplete',
  'dir',
  'disabled',
  'form',
  'getRootNode',
  'id',
  'ids',
  'invalid',
  'mask',
  'name',
  'onValueChange',
  'onValueComplete',
  'onValueInvalid',
  'otp',
  'readOnly',
  'pattern',
  'placeholder',
  'required',
  'selectOnFocus',
  'translations',
  'type',
  'value',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
