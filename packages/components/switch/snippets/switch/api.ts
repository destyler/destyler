export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; hiddenInput: string; control: string; label: string; thumb: string; }>',
    desc: 'The ids of the elements in the switch. Useful for composition.',
  },
  {
    name: 'label',
    type: 'string',
    desc: 'Specifies the localized strings that identifies the accessibility elements and their states',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the switch is disabled.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'If `true`, the switch is marked as invalid.',
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'If `true`, the switch input is marked as required,',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the switch is read-only',
  },
  {
    name: 'onCheckedChange',
    type: '(details: CheckedChangeDetails) => void',
    desc: 'Function to call when the switch is clicked.',
  },
  {
    name: 'checked',
    type: 'boolean',
    desc: 'Whether the switch is checked.',
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name of the input field in a switch (Useful for form submission).',
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The id of the form that the switch belongs to',
  },
  {
    name: 'value',
    type: 'string | number',
    desc: 'The value of switch input. Useful for form submission.',
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
    name: 'checked',
    type: 'boolean',
    desc: 'Whether the switch is checked',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the switch is disabled',
  },
  {
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the switch is focused',
  },
  {
    name: 'setChecked',
    type: '(checked: boolean) => void',
    desc: 'Function to set the checked state of the switch',
  },
  {
    name: 'toggleChecked',
    type: '() => void',
    desc: 'Function to toggle the checked state of the switch',
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-active',
      desc: 'Present when active or pressed',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
    {
      name: 'data-focus-visible',
      desc: 'Present when focused with keyboard',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
    {
      name: 'data-hover',
      desc: 'Present when hovered',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
  ],
  label: [
    {
      name: 'data-active',
      desc: 'Present when active or pressed',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
    {
      name: 'data-focus-visible',
      desc: 'Present when focused with keyboard',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
    {
      name: 'data-hover',
      desc: 'Present when hovered',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
  ],
  thumb: [
    {
      name: 'data-active',
      desc: 'Present when active or pressed',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
    {
      name: 'data-focus-visible',
      desc: 'Present when focused with keyboard',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
    {
      name: 'data-hover',
      desc: 'Present when hovered',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
  ],
  control: [
    {
      name: 'data-active',
      desc: 'Present when active or pressed',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
    {
      name: 'data-focus-visible',
      desc: 'Present when focused with keyboard',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
    {
      name: 'data-hover',
      desc: 'Present when hovered',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
  ],
}

export const keyboardApi = [
  {
    name: 'Space Enter',
    desc: 'Toggle the switch',
  }
]
