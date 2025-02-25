import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'allowOverflow',
  'closeOnEscape',
  'dir',
  'disabled',
  'draggable',
  'getAnchorPosition',
  'getBoundaryEl',
  'getRootNode',
  'gridSize',
  'id',
  'ids',
  'lockAspectRatio',
  'maxSize',
  'minSize',
  'onOpenChange',
  'onPositionChange',
  'onPositionChangeEnd',
  'onSizeChange',
  'onSizeChangeEnd',
  'onStageChange',
  'open',
  'persistRect',
  'position',
  'resizable',
  'strategy',
  'size',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
