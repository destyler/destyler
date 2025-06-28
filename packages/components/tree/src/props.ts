import type { NodeProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'ids',
  'collection',
  'dir',
  'expandedValue',
  'expandOnClick',
  'focusedValue',
  'getRootNode',
  'id',
  'onExpandedChange',
  'onFocusChange',
  'onSelectionChange',
  'selectedValue',
  'selectionMode',
  'typeahead',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemProps = createProps<NodeProps>()(['node', 'indexPath'])

export const splitItemProps = createSplitProps<NodeProps>(itemProps)
