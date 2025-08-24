export const matchContext = [
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the combobox is open'
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the combobox open state is controlled by the user'
  },
  {
    name: 'ids',
    type: 'Partial<{ root: string; label: string; control: string; input: string; content: string; trigger: string; clearTrigger: string; item(id: string, index?: number): string; positioner: string; itemGroup(id: string | number): string; itemGroupLabel(id: string | number): string; }>',
    desc: 'The ids of the elements in the combobox. Useful for composition.'
  },
  {
    name: 'inputValue',
    type: 'string',
    desc: 'The current value of the combobox\'s input'
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The `name` attribute of the combobox\'s input. Useful for form submission'
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The associate form of the combobox.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the combobox is disabled'
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the combobox is readonly. This puts the combobox in a "non-editable" mode but the user can still interact with it'
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the combobox is invalid'
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the combobox is required'
  },
  {
    name: 'placeholder',
    type: 'string',
    desc: 'The placeholder text of the combobox\'s input'
  },
  {
    name: 'highlightedValue',
    type: 'string',
    desc: 'The active item\'s id. Used to set the `aria-activedescendant` attribute'
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The keys of the selected items'
  },
  {
    name: 'inputBehavior',
    type: '"autohighlight" | "autocomplete" | "none"',
    desc: 'Defines the auto-completion behavior of the combobox. - `autohighlight`: The first focused item is highlighted as the user types - `autocomplete`: Navigating the listbox with the arrow keys selects the item and the input is updated'
  },
  {
    name: 'selectionBehavior',
    type: '"clear" | "replace" | "preserve"',
    desc: 'The behavior of the combobox input when an item is selected - `replace`: The selected item string is set as the input value - `clear`: The input value is cleared - `preserve`: The input value is preserved'
  },
  {
    name: 'autoFocus',
    type: 'boolean',
    desc: 'Whether to autofocus the input on mount'
  },
  {
    name: 'openOnClick',
    type: 'boolean',
    desc: 'Whether to open the combobox popup on initial click on the input'
  },
  {
    name: 'openOnChange',
    type: 'boolean | ((details: InputValueChangeDetails) => boolean)',
    desc: 'Whether to show the combobox when the input value changes'
  },
  {
    name: 'allowCustomValue',
    type: 'boolean',
    desc: 'Whether to allow typing custom values in the input'
  },
  {
    name: 'loopFocus',
    type: 'boolean',
    desc: 'Whether to loop the keyboard navigation through the items'
  },
  {
    name: 'positioning',
    type: 'PositioningOptions',
    desc: 'The positioning options to dynamically position the menu'
  },
  {
    name: 'onInputValueChange',
    type: '(details: InputValueChangeDetails) => void',
    desc: 'Function called when the input\'s value changes'
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails<T>) => void',
    desc: 'Function called when a new item is selected'
  },
  {
    name: 'onHighlightChange',
    type: '(details: HighlightChangeDetails<T>) => void',
    desc: 'Function called when an item is highlighted using the pointer or keyboard navigation.'
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Function called when the popup is opened'
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'Specifies the localized strings that identifies the accessibility elements and their states'
  },
  {
    name: 'collection',
    type: 'ListCollection<any>',
    desc: 'The collection of items'
  },
  {
    name: 'multiple',
    type: 'boolean',
    desc: 'Whether to allow multiple selection. **Good to know:** When `multiple` is `true`, the `selectionBehavior` is automatically set to `clear`. It is recommended to render the selected items in a separate container.'
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    desc: 'Whether to close the combobox when an item is selected.'
  },
  {
    name: 'openOnKeyPress',
    type: 'boolean',
    desc: 'Whether to open the combobox on arrow key press'
  },
  {
    name: 'scrollToIndexFn',
    type: '(details: ScrollToIndexDetails) => void',
    desc: 'Function to scroll to a specific index'
  },
  {
    name: 'composite',
    type: 'boolean',
    desc: 'Whether the combobox is a composed with other composite widgets like tabs'
  },
  {
    name: 'disableLayer',
    type: 'boolean',
    desc: 'Whether to disable registering this a dismissable layer'
  },
  {
    name: 'navigate',
    type: '(details: NavigateDetails) => void',
    desc: 'Function to navigate to the selected item'
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.'
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.'
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.'
  },
  {
    name: 'onPointerDownOutside',
    type: '(event: PointerDownOutsideEvent) => void',
    desc: 'Function called when the pointer is pressed down outside the component'
  },
  {
    name: 'onFocusOutside',
    type: '(event: FocusOutsideEvent) => void',
    desc: 'Function called when the focus is moved outside the component'
  },
  {
    name: 'onInteractOutside',
    type: '(event: InteractOutsideEvent) => void',
    desc: 'Function called when an interaction happens outside the component'
  },
]

export const matchApi = [
  {
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the combobox is focused'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the combobox is open'
  },
  {
    name: 'inputValue',
    type: 'string',
    desc: 'The value of the combobox input'
  },
  {
    name: 'highlightedValue',
    type: 'string',
    desc: 'The value of the highlighted item'
  },
  {
    name: 'highlightedItem',
    type: 'V',
    desc: 'The highlighted item'
  },
  {
    name: 'setHighlightValue',
    type: '(value: string) => void',
    desc: 'The value of the combobox input'
  },
  {
    name: 'syncSelectedItems',
    type: '() => void',
    desc: 'Function to sync the selected items with the value. Useful when `value` is updated from async sources.'
  },
  {
    name: 'selectedItems',
    type: 'V[]',
    desc: 'The selected items'
  },
  {
    name: 'hasSelectedItems',
    type: 'boolean',
    desc: 'Whether there\'s a selected item'
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The selected item keys'
  },
  {
    name: 'valueAsString',
    type: 'string',
    desc: 'The string representation of the selected items'
  },
  {
    name: 'selectValue',
    type: '(value: string) => void',
    desc: 'Function to select a value'
  },
  {
    name: 'setValue',
    type: '(value: string[]) => void',
    desc: 'Function to set the value of the combobox'
  },
  {
    name: 'clearValue',
    type: '(value?: string) => void',
    desc: 'Function to clear the value of the combobox'
  },
  {
    name: 'focus',
    type: '() => void',
    desc: 'Function to focus on the combobox input'
  },
  {
    name: 'setInputValue',
    type: '(value: string) => void',
    desc: 'Function to set the input value of the combobox'
  },
  {
    name: 'getItemState',
    type: '(props: ItemProps) => ItemState',
    desc: 'Returns the state of a combobox item'
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open or close the combobox'
  },
  {
    name: 'collection',
    type: 'ListCollection<V>',
    desc: 'Function to toggle the combobox'
  },
  {
    name: 'setCollection',
    type: '(collection: ListCollection<V>) => void',
    desc: 'Function to set the collection of items'
  },
  {
    name: 'reposition',
    type: '(options?: Partial<PositioningOptions>) => void',
    desc: 'Function to set the positioning options'
  },
  {
    name: 'multiple',
    type: 'boolean',
    desc: 'Whether the combobox allows multiple selections'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the combobox is disabled'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    }
  ],
  label: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'label'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    }
  ],
  control: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'control'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    }
  ],
  input: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'input'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    }
  ],
  trigger: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'trigger'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    }
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'content'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-placement',
      desc: 'The placement of the content'
    }
  ],
  clearTrigger: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'clear-trigger'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    }
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'item'
    },
    {
      name: 'data-highlighted',
      desc: 'Present when highlighted'
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-value',
      desc: 'The value of the item'
    }
  ],
  itemText: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'item-text'
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-highlighted',
      desc: 'Present when highlighted'
    }
  ],
  itemIndicator: [
    {
      name: 'data-scope',
      desc: 'combobox'
    },
    {
      name: 'data-part',
      desc: 'item-indicator'
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"'
    }
  ]
}

export const keyboardApi = [
  {
    name: 'ArrowDown',
    desc: 'When the combobox is closed, opens the listbox and highlights to the first option. When the combobox is open, moves focus to the next option.'
  },
  {
    name: 'ArrowUp',
    desc: 'When the combobox is closed, opens the listbox and highlights to the last option. When the combobox is open, moves focus to the previous option.'
  },
  {
    name: 'Home',
    desc: 'When the combobox is open, moves focus to the first option.'
  },
  {
    name: 'End',
    desc: 'When the combobox is open, moves focus to the last option.'
  },
  {
    name: 'Escape',
    desc: 'Closes the listbox.'
  },
  {
    name: 'Enter',
    desc: 'Selects the highlighted option and closes the combobox.'
  },
  {
    name: 'Esc',
    desc: 'Closes the combobox'
  }
]
