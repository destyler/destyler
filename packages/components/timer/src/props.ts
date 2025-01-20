import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'autoStart',
  'countdown',
  'getRootNode',
  'id',
  'ids',
  'interval',
  'onComplete',
  'onTick',
  'startMs',
  'targetMs',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
