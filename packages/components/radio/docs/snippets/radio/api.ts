export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; label: string; indicator: string; item(value: string): string; itemLabel(value: string): string; itemControl(value: string): string; itemHiddenInput(value: string): string; }>',
    desc: 'The ids of the elements in the radio. Useful for composition.',
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The value of the checked radio',
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name of the input fields in the radio (Useful for form submission).',
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The associate form of the underlying input.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'If `true`, the radio will be disabled',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the checkbox is read-only',
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Function called once a radio is checked',
  },
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    desc: 'Orientation of the radio',
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
    type: 'string',
    desc: 'The current value of the radio',
  },
  {
    name: 'setValue',
    type: '(value: string) => void',
    desc: 'Function to set the value of the radio',
  },
  {
    name: 'clearValue',
    type: '() => void',
    desc: 'Function to clear the value of the radio',
  },
  {
    name: 'focus',
    type: '() => void',
    desc: 'Function to focus the radio',
  },
  {
    name: 'getItemState',
    type: '(props: ItemProps) => ItemState',
    desc: 'Returns the state details of a radio input',
  },
]

export const keyboardApi = [
  {
    name: 'Tab',
    desc: 'Moves focus to either the checked radio item or the first radio item in the group.',
  },
  {
    name: 'Space',
    desc: 'When focus is on an unchecked radio item, checks it.',
  },
  {
    name: 'ArrowDown',
    desc: 'Moves focus and checks the next radio item in the group.',
  },
  {
    name: 'ArrowRight',
    desc: 'Moves focus and checks the next radio item in the group.',
  },
  {
    name: 'ArrowUp',
    desc: 'Moves focus to the previous radio item in the group.',
  },
  {
    name: 'ArrowLeft',
    desc: 'Moves focus to the previous radio item in the group.',
  }
]
