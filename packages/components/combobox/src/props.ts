import type { ItemGroupLabelProps, ItemGroupProps, ItemProps, UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'allowCustomValue',
  'autoFocus',
  'closeOnSelect',
  'collection',
  'dir',
  'disabled',
  'disableLayer',
  'form',
  'getRootNode',
  'highlightedValue',
  'id',
  'ids',
  'inputBehavior',
  'inputValue',
  'invalid',
  'loopFocus',
  'multiple',
  'name',
  'onFocusOutside',
  'onHighlightChange',
  'onInputValueChange',
  'onInteractOutside',
  'onOpenChange',
  'onOpenChange',
  'onPointerDownOutside',
  'onValueChange',
  'open.controlled',
  'open',
  'openOnClick',
  'openOnChange',
  'openOnKeyPress',
  'placeholder',
  'positioning',
  'readOnly',
  'required',
  'scrollToIndexFn',
  'selectionBehavior',
  'translations',
  'composite',
  'value',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemGroupLabelProps = createProps<ItemGroupLabelProps>()(['htmlFor'])
export const splitItemGroupLabelProps = createSplitProps<ItemGroupLabelProps>(itemGroupLabelProps)

export const itemGroupProps = createProps<ItemGroupProps>()(['id'])
export const splitItemGroupProps = createSplitProps<ItemGroupProps>(itemGroupProps)

export const itemProps = createProps<ItemProps>()(['item', 'persistFocus'])
export const splitItemProps = createSplitProps<ItemProps>(itemProps)
