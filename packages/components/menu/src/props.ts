import type { ItemGroupLabelProps, ItemGroupProps, ItemProps, OptionItemProps, UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()([
  'anchorPoint',
  'aria-label',
  'closeOnSelect',
  'composite',
  'dir',
  'getRootNode',
  'highlightedValue',
  'id',
  'ids',
  'loopFocus',
  'navigate',
  'onEscapeKeyDown',
  'onFocusOutside',
  'onHighlightChange',
  'onInteractOutside',
  'onOpenChange',
  'onPointerDownOutside',
  'onSelect',
  'open.controlled',
  'open',
  'positioning',
  'typeahead',
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemProps = createProps<ItemProps>()(['closeOnSelect', 'disabled', 'value', 'valueText'])
export const splitItemProps = createSplitProps<ItemProps>(itemProps)

export const itemGroupLabelProps = createProps<ItemGroupLabelProps>()(['htmlFor'])
export const splitItemGroupLabelProps = createSplitProps<ItemGroupLabelProps>(itemGroupLabelProps)

export const itemGroupProps = createProps<ItemGroupProps>()(['id'])
export const splitItemGroupProps = createSplitProps<ItemGroupProps>(itemGroupProps)

export const optionItemProps = createProps<OptionItemProps>()([
  'disabled',
  'valueText',
  'closeOnSelect',
  'type',
  'value',
  'checked',
  'onCheckedChange',
])

export const splitOptionItemProps = createSplitProps<OptionItemProps>(optionItemProps)
