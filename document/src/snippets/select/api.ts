export const matchContext = [
  {
    name: 'collection',
    type: 'ListCollection<any>',
    desc: 'The item collection',
  },
  {
    name: 'ids',
    type: 'Partial<{ root: string; content: string; control: string; trigger: string; clearTrigger: string; label: string; hiddenSelect: string; positioner: string; item(id: string | number): string; itemGroup(id: string | number): string; itemGroupLabel(id: string | number): string; }>',
    desc: 'The ids of the elements in the select. Useful for composition.',
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The `name` attribute of the underlying select.',
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The associate form of the underlying select.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the select is disabled',
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the select is invalid',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the select is read-only',
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the select is required',
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    desc: 'Whether the select should close after an item is selected',
  },
  {
    name: 'onHighlightChange',
    type: '(details: HighlightChangeDetails<T>) => void',
    desc: 'The callback fired when the highlighted item changes.',
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails<T>) => void',
    desc: 'The callback fired when the selected item changes.',
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Function called when the popup is opened',
  },
  {
    name: 'positioning',
    type: 'PositioningOptions',
    desc: 'The positioning options of the menu.',
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The keys of the selected items',
  },
  {
    name: 'highlightedValue',
    type: 'string',
    desc: 'The key of the highlighted item',
  },
  {
    name: 'loopFocus',
    type: 'boolean',
    desc: 'Whether to loop the keyboard navigation through the options',
  },
  {
    name: 'multiple',
    type: 'boolean',
    desc: 'Whether to allow multiple selection',
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the select menu is open',
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the select\'s open state is controlled by the user',
  },
  {
    name: 'scrollToIndexFn',
    type: '(details: ScrollToIndexDetails) => void',
    desc: 'Function to scroll to a specific index',
  },
  {
    name: 'composite',
    type: 'boolean',
    desc: 'Whether the select is a composed with other composite widgets like tabs or combobox',
  },
  {
    name: 'deselectable',
    type: 'boolean',
    desc: 'Whether the value can be cleared by clicking the selected item. **Note:** this is only applicable for single selection',
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.',
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.',
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.',
  },
  {
    name: 'onPointerDownOutside',
    type: '(event: PointerDownOutsideEvent) => void',
    desc: 'Function called when the pointer is pressed down outside the component',
  },
  {
    name: 'onFocusOutside',
    type: '(event: FocusOutsideEvent) => void',
    desc: 'Function called when the focus is moved outside the component',
  },
  {
    name: 'onInteractOutside',
    type: '(event: InteractOutsideEvent) => void',
    desc: 'Function called when an interaction happens outside the component',
  },
]

export const matchApi = [
  {
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the select is focused',
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the select is open',
  },
  {
    name: 'empty',
    type: 'boolean',
    desc: 'Whether the select value is empty',
  },
  {
    name: 'highlightedValue',
    type: 'string',
    desc: 'The value of the highlighted item',
  },
  {
    name: 'highlightedItem',
    type: 'V',
    desc: 'The highlighted item',
  },
  {
    name: 'highlightValue',
    type: '(value: string) => void',
    desc: 'Function to highlight a value',
  },
  {
    name: 'selectedItems',
    type: 'V[]',
    desc: 'The selected items',
  },
  {
    name: 'hasSelectedItems',
    type: 'boolean',
    desc: 'Whether there\'s a selected option',
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The selected item keys',
  },
  {
    name: 'valueAsString',
    type: 'string',
    desc: 'The string representation of the selected items',
  },
  {
    name: 'selectValue',
    type: '(value: string) => void',
    desc: 'Function to select a value',
  },
  {
    name: 'selectAll',
    type: '() => void',
    desc: 'Function to select all values',
  },
  {
    name: 'setValue',
    type: '(value: string[]) => void',
    desc: 'Function to set the value of the select',
  },
  {
    name: 'clearValue',
    type: '(value?: string) => void',
    desc: 'Function to clear the value of the select. If a value is provided, it will only clear that value, otherwise, it will clear all values.',
  },
  {
    name: 'focus',
    type: '() => void',
    desc: 'Function to focus on the select input',
  },
  {
    name: 'getItemState',
    type: '(props: ItemProps<any>) => ItemState',
    desc: 'Returns the state of a select item',
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open or close the select',
  },
  {
    name: 'collection',
    type: 'ListCollection<V>',
    desc: 'Function to toggle the select',
  },
  {
    name: 'setCollection',
    type: '(collection: ListCollection<V>) => void',
    desc: 'Function to set the collection of items',
  },
  {
    name: 'reposition',
    type: '(options?: Partial<PositioningOptions>) => void',
    desc: 'Function to set the positioning options of the select',
  },
  {
    name: 'multiple',
    type: 'boolean',
    desc: 'Whether the select allows multiple selections',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the select is disabled',
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'root',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
  ],
  label: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'label',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
  ],
  control: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'control',
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
  ],
  valueText: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'value-text',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
  ],
  trigger: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'trigger',
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
    {
      name: 'data-placement',
      desc: 'The placement of the trigger',
    },
    {
      name: 'data-placeholder-shown',
      desc: 'Present when placeholder is shown',
    },
  ],
  indicator: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'indicator',
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'item',
    },
    {
      name: 'data-value',
      desc: 'The value of the item',
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"',
    },
    {
      name: 'data-highlighted',
      desc: 'Present when highlighted',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
  ],
  itemText: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'item-text',
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-highlighted',
      desc: 'Present when highlighted',
    },
  ],
  itemIndicator: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'item-indicator',
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"',
    },
  ],
  itemGroup: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'item-group',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
  ],
  clearTrigger: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'clear-trigger',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'select',
    },
    {
      name: 'data-part',
      desc: 'content',
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"',
    },
    {
      name: 'data-placement',
      desc: 'The placement of the content',
    },
  ],
}

export const keyboardApi = [
  {
    name: 'Space',
    desc: 'When focus is on trigger, opens the select and focuses the first selected item. When focus is on the content, selects the highlighted item.',
  },
  {
    name: 'Enter',
    desc: 'When focus is on trigger, opens the select and focuses the first selected item. When focus is on content, selects the focused item.',
  },
  {
    name: 'ArrowDown',
    desc: 'When focus is on trigger, opens the select. When focus is on content, moves focus to the next item.',
  },
  {
    name: 'ArrowUp',
    desc: 'When focus is on trigger, opens the select. When focus is on content, moves focus to the previous item.',
  },
  {
    name: 'Esc',
    desc: 'Closes the select and moves focus to trigger.',
  },
  {
    name: 'A-Z a-z',
    desc: 'When focus is on trigger, selects the item whose label starts with the typed character. When focus is on the listbox, moves focus to the next item with a label that starts with the typed character.',
  }
]
