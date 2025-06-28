import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'activationMode',
  'autoResize',
  'dir',
  'disabled',
  'finalFocusEl',
  'form',
  'getRootNode',
  'id',
  'ids',
  'invalid',
  'maxLength',
  'name',
  'onEditChange',
  'onFocusOutside',
  'onInteractOutside',
  'onPointerDownOutside',
  'onValueChange',
  'onValueCommit',
  'onValueRevert',
  'placeholder',
  'readOnly',
  'required',
  'selectOnFocus',
  'edit',
  'edit.controlled',
  'submitMode',
  'translations',
  'value',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
