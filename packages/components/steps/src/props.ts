import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'count',
  'dir',
  'getRootNode',
  'id',
  'ids',
  'linear',
  'onStepChange',
  'onStepComplete',
  'orientation',
  'step',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
