import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

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
