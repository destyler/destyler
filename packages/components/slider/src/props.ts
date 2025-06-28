import type { ThumbProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'aria-label',
  'aria-labelledby',
  'dir',
  'disabled',
  'form',
  'getAriaValueText',
  'getRootNode',
  'id',
  'ids',
  'invalid',
  'max',
  'min',
  'minStepsBetweenThumbs',
  'name',
  'onFocusChange',
  'onValueChange',
  'onValueChangeEnd',
  'orientation',
  'origin',
  'readOnly',
  'step',
  'thumbAlignment',
  'thumbAlignment',
  'thumbSize',
  'value',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const thumbProps = createProps<ThumbProps>()(['index', 'name'])
export const splitThumbProps = createSplitProps<ThumbProps>(thumbProps)
