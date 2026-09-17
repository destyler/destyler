import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'count',
  'defaultStep',
  'dir',
  'getRootNode',
  'id',
  'ids',
  'linear',
  'onStepChange',
  'onStepComplete',
  'orientation',
  'step',
  'step.controlled',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
