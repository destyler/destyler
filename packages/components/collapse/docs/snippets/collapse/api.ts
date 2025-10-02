export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; item(value: string): string; itemContent(value: string): string; itemTrigger(value: string): string; }>',
    desc: 'The ids of the elements in the collapse. Useful for composition.'
  },
  {
    name: 'multiple',
    type: 'boolean',
    desc: 'Whether multiple collapse items can be expanded at the same time.'
  },
  {
    name: 'collapsible',
    type: 'boolean',
    desc: 'Whether an collapse item can be closed after it has been expanded.'
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The `value` of the collapse items that are currently being expanded.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the collapse items are disabled'
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'The callback fired when the state of expanded/collapsed collapse items changes.'
  },
  {
    name: 'onFocusChange',
    type: '(details: FocusChangeDetails) => void',
    desc: 'The callback fired when the focused collapse item changes.'
  },
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    desc: 'The orientation of the collapse items.'
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
]

export const matchApi = [
  {
    name: 'focusedValue',
    type: 'string',
    desc: 'The value of the focused collapse item.'
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The value of the collapse'
  },
  {
    name: 'setValue',
    type: '(value: string[]) => void',
    desc: 'Sets the value of the collapse.'
  },
  {
    name: 'getItemState',
    type: '(props: ItemProps) => ItemState',
    desc: 'Gets the state of an collapse item.'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'collapse'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the collapse'
    }
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'collapse'
    },
    {
      name: 'data-part',
      desc: 'item'
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
      name: 'data-orientation',
      desc: 'The orientation of the item'
    }
  ],
  itemContent: [
    {
      name: 'data-scope',
      desc: 'collapse'
    },
    {
      name: 'data-part',
      desc: 'item-content'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the item'
    }
  ],
  itemIndicator: [
    {
      name: 'data-scope',
      desc: 'collapse'
    },
    {
      name: 'data-part',
      desc: 'item-indicator'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the item'
    }
  ],
  itemTrigger: [
    {
      name: 'data-scope',
      desc: 'collapse'
    },
    {
      name: 'data-part',
      desc: 'item-trigger'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the item'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    }
  ]
}

export const keyboardApi = [
  {
    name: 'Space',
    desc: 'When focus is on an trigger of a collapsed item, the item is expanded'
  },
  {
    name: 'Enter',
    desc: 'When focus is on an trigger of a collapsed section, expands the section.'
  },
  {
    name: 'Tab',
    desc: 'Moves focus to the next focusable element'
  },
  {
    name: 'Shift + Tab',
    desc: 'Moves focus to the previous focusable element'
  },
  {
    name: 'ArrowDown',
    desc: 'Moves focus to the next trigger'
  },
  {
    name: 'ArrowUp',
    desc: 'Moves focus to the previous trigger.'
  },
  {
    name: 'Home',
    desc: 'When focus is on an trigger, moves focus to the first trigger.'
  },
  {
    name: 'End',
    desc: 'When focus is on an trigger, moves focus to the last trigger.'
  }
]
