import type { ItemGroupLabelProps, ItemGroupProps, ItemProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'closeOnSelect',
  'collection',
  'dir',
  'disabled',
  'deselectable',
  'form',
  'getRootNode',
  'highlightedValue',
  'id',
  'ids',
  'invalid',
  'loopFocus',
  'multiple',
  'name',
  'onFocusOutside',
  'onHighlightChange',
  'onInteractOutside',
  'onOpenChange',
  'onPointerDownOutside',
  'onValueChange',
  'open.controlled',
  'open',
  'composite',
  'positioning',
  'required',
  'readOnly',
  'scrollToIndexFn',
  'value',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemProps = createProps<ItemProps>()(['item', 'persistFocus'])
export const splitItemProps = createSplitProps<ItemProps>(itemProps)

export const itemGroupProps = createProps<ItemGroupProps>()(['id'])
export const splitItemGroupProps = createSplitProps<ItemGroupProps>(itemGroupProps)

export const itemGroupLabelProps = createProps<ItemGroupLabelProps>()(['htmlFor'])
export const splitItemGroupLabelProps = createSplitProps<ItemGroupLabelProps>(itemGroupLabelProps)
