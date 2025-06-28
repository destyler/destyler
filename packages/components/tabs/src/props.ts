import type { ContentProps, TriggerProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'activationMode',
  'composite',
  'deselectable',
  'dir',
  'getRootNode',
  'id',
  'ids',
  'loopFocus',
  'navigate',
  'onFocusChange',
  'onValueChange',
  'orientation',
  'translations',
  'value',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const triggerProps = createProps<TriggerProps>()(['disabled', 'value'])
export const splitTriggerProps = createSplitProps<TriggerProps>(triggerProps)

export const contentProps = createProps<ContentProps>()(['value'])
export const splitContentProps = createSplitProps<ContentProps>(contentProps)
