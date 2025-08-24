export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; item(value: string): string; }>',
    desc: 'The ids of the elements in the toggle. Useful for composition.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the toggle is disabled.',
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The values of the toggles in the group.',
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Function to call when the toggle is clicked.',
  },
  {
    name: 'loopFocus',
    type: 'boolean',
    desc: 'Whether to loop focus inside the toggle group.',
  },
  {
    name: 'rovingFocus',
    type: 'boolean',
    desc: 'Whether to use roving tab index to manage focus.',
  },
  {
    name: 'orientation',
    type: 'Orientation',
    desc: 'The orientation of the toggle group.',
  },
  {
    name: 'multiple',
    type: 'boolean',
    desc: 'Whether to allow multiple toggles to be selected.',
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
]

export const matchApi = [
  {
    name: 'value',
    type: 'string[]',
    desc: 'The value of the toggle group.',
  },
  {
    name: 'setValue',
    type: '(values: string[]) => void',
    desc: 'Function to set the value of the toggle group.',
  },
  {
    name: 'getItemState',
    type: '(props: ItemProps) => ItemState',
    desc: 'Returns the state of the toggle item.',
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'toggle-group',
    },
    {
      name: 'data-part',
      desc: 'root',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the toggle-group',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'toggle-group',
    },
    {
      name: 'data-part',
      desc: 'item',
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
      name: 'data-orientation',
      desc: 'The orientation of the item',
    },
    {
      name: 'data-state',
      desc: '"on" | "off"',
    },
  ],
}

export const keyboardApi = [
  {
    name: 'Tab',
    desc: 'Moves focus to either the pressed item or the first item in the group.',
  },
  {
    name: 'Space',
    desc: 'Activates/deactivates the item.',
  },
  {
    name: 'Enter',
    desc: 'Activates/deactivates the item.',
  },
  {
    name: 'ArrowDown',
    desc: 'Moves focus to the next item in the group.',
  },
  {
    name: 'ArrowRight',
    desc: 'Moves focus to the next item in the group.',
  },
  {
    name: 'ArrowUp',
    desc: 'Moves focus to the previous item in the group.',
  },
  {
    name: 'ArrowLeft',
    desc: 'Moves focus to the previous item in the group.',
  },
  {
    name: 'Home',
    desc: 'Moves focus to the first item.',
  },
  {
    name: 'End',
    desc: 'Moves focus to the last item.',
  }
]
