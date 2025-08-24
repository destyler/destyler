export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; hiddenInput: string; control: string; label: string; }>',
    desc: 'The ids of the elements in the checkbox. Useful for composition.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the checkbox is disabled'
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the checkbox is invalid'
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the checkbox is required'
  },
  {
    name: 'checked',
    type: 'CheckedState',
    desc: 'The checked state of the checkbox'
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the checkbox is read-only'
  },
  {
    name: 'onCheckedChange',
    type: '(details: CheckedChangeDetails) => void',
    desc: 'The callback invoked when the checked state changes.'
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name of the input field in a checkbox. Useful for form submission.'
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The id of the form that the checkbox belongs to.'
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The value of checkbox input. Useful for form submission.'
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
    desc: 'A root node to correctly resolve document in custom environments.'
  },
]

export const matchApi = [
  {
    name: 'checked',
    type: 'boolean',
    desc: 'Whether the checkbox is checked'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the checkbox is disabled'
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    desc: 'Whether the checkbox is indeterminate'
  },
  {
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the checkbox is focused'
  },
  {
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the checkbox is focused'
  },
  {
    name: 'checkedState',
    type: 'CheckedState',
    desc: 'The checked state of the checkbox'
  },
  {
    name: 'setChecked',
    type: '(checked: CheckedState) => void',
    desc: 'Function to set the checked state of the checkbox'
  },
  {
    name: 'toggleChecked',
    type: '() => void',
    desc: 'Function to toggle the checked state of the checkbox'
  },
]

export const keyboardApi = [
  {
    name: 'Space',
    desc: 'Toggle the checkbox'
  }
]

export const styleApi = {
  root:[
    {
      name: 'data-active',
      desc: 'Present when active or pressed'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-focus-visible',
      desc: 'Present when focused with keyboard'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    },
    {
      name: 'data-hover',
      desc: 'Present when hovered'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-state',
      desc: '"indeterminate" | "checked" | "unchecked"'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
  ],
  label: [
    {
      name: 'data-active',
      desc: 'Present when active or pressed'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-focus-visible',
      desc: 'Present when focused with keyboard'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    },
    {
      name: 'data-hover',
      desc: 'Present when hovered'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-state',
      desc: '"indeterminate" | "checked" | "unchecked"'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
  ],
  control:[
    {
      name: 'data-active',
      desc: 'Present when active or pressed'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-focus-visible',
      desc: 'Present when focused with keyboard'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    },
    {
      name: 'data-hover',
      desc: 'Present when hovered'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-state',
      desc: '"indeterminate" | "checked" | "unchecked"'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
  ],
  indicator:[
    {
      name: 'data-active',
      desc: 'Present when active or pressed'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-focus-visible',
      desc: 'Present when focused with keyboard'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    },
    {
      name: 'data-hover',
      desc: 'Present when hovered'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-state',
      desc: '"indeterminate" | "checked" | "unchecked"'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
  ]
}
