import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

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
