import type { PanelProps, ResizeTriggerProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'dir',
  'getRootNode',
  'id',
  'ids',
  'onSizeChange',
  'onSizeChangeEnd',
  'orientation',
  'size',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const panelProps = createProps<PanelProps>()(['id', 'snapSize'])
export const splitPanelProps = createSplitProps<PanelProps>(panelProps)

export const resizeTriggerProps = createProps<ResizeTriggerProps>()(['disabled', 'id', 'step'])
export const splitResizeTriggerProps = createSplitProps<ResizeTriggerProps>(resizeTriggerProps)
