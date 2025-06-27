import type { IndicatorProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'getRootNode',
  'id',
  'ids',
  'value',
  'timeout',
  'onStatusChange',
])
export const contextProps = createSplitProps<UserDefinedContext>(props)

export const indicatorProps = createProps<IndicatorProps>()(['copied'])
export const splitIndicatorProps = createSplitProps<IndicatorProps>(indicatorProps)
