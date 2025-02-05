import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'allowMouseWheel',
  'allowOverflow',
  'clampValueOnBlur',
  'dir',
  'disabled',
  'focusInputOnChange',
  'form',
  'formatOptions',
  'getRootNode',
  'id',
  'ids',
  'inputMode',
  'invalid',
  'locale',
  'max',
  'min',
  'name',
  'onFocusChange',
  'onValueChange',
  'onValueInvalid',
  'pattern',
  'required',
  'readOnly',
  'spinOnPress',
  'step',
  'translations',
  'value',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
