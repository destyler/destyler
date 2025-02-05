import type { ContentProps, TriggerProps, UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'activationMode',
  'composite',
  'dir',
  'getRootNode',
  'id',
  'ids',
  'loopFocus',
  'onFocusChange',
  'onValueChange',
  'orientation',
  'translations',
  'deselectable',
  'value',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const triggerProps = createProps<TriggerProps>()(['disabled', 'value'])
export const splitTriggerProps = createSplitProps<TriggerProps>(triggerProps)

export const contentProps = createProps<ContentProps>()(['value'])
export const splitContentProps = createSplitProps<ContentProps>(contentProps)
