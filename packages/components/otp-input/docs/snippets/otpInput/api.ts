export const matchContext = [
  {
    name: 'name',
    type: 'string',
    desc: 'The name of the input element. Useful for form submission.',
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The associate form of the underlying input element.',
  },
  {
    name: 'pattern',
    type: 'string',
    desc: 'The regular expression that the user-entered input value is checked against.',
  },
  {
    name: 'ids',
    type: 'Partial<{ root: string; hiddenInput: string; label: string; control: string; input(id: string): string; }>',
    desc: 'The ids of the elements in the otp input. Useful for composition.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the inputs are disabled',
  },
  {
    name: 'placeholder',
    type: 'string',
    desc: 'The placeholder text for the input',
  },
  {
    name: 'autoFocus',
    type: 'boolean',
    desc: 'Whether to auto-focus the first input.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the otp input is in the invalid state',
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the otp input is required',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the otp input is in the valid state',
  },
  {
    name: 'otp',
    type: 'boolean',
    desc: 'If `true`, the otp input component signals to its fields that they should use `autocomplete="one-time-code"`.',
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The value of the the otp input.',
  },
  {
    name: 'type',
    type: '"alphanumeric" | "numeric" | "alphabetic"',
    desc: 'The type of value the otp-input should allow',
  },
  {
    name: 'onValueComplete',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Function called when all inputs have valid values',
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Function called on input change',
  },
  {
    name: 'onValueInvalid',
    type: '(details: ValueInvalidDetails) => void',
    desc: 'Function called when an invalid value is entered',
  },
  {
    name: 'mask',
    type: 'boolean',
    desc: 'If `true`, the input\'s value will be masked just like `type=password`',
  },
  {
    name: 'blurOnComplete',
    type: 'boolean',
    desc: 'Whether to blur the input when the value is complete',
  },
  {
    name: 'selectOnFocus',
    type: 'boolean',
    desc: 'Whether to select input value when input is focused',
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'Specifies the localized strings that identifies the accessibility elements and their states',
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
    desc: 'The value of the input as an array of strings.',
  },
  {
    name: 'valueAsString',
    type: 'string',
    desc: 'The value of the input as a string.',
  },
  {
    name: 'complete',
    type: 'boolean',
    desc: 'Whether all inputs are filled.',
  },
  {
    name: 'setValue',
    type: '(value: string[]) => void',
    desc: 'Function to set the value of the inputs.',
  },
  {
    name: 'clearValue',
    type: '() => void',
    desc: 'Function to clear the value of the inputs.',
  },
  {
    name: 'setValueAtIndex',
    type: '(index: number, value: string) => void',
    desc: 'Function to set the value of the input at a specific index.',
  },
  {
    name: 'focus',
    type: '() => void',
    desc: 'Function to focus the otp-input. This will focus the first input.',
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'otp-input',
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
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-complete',
      desc: 'Present when the otp-input value is complete',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
  ],
  label: [
    {
      name: 'data-scope',
      desc: 'otp-input',
    },
    {
      name: 'data-part',
      desc: 'label',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-complete',
      desc: 'Present when the label value is complete',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
  ],
  input: [
    {
      name: 'data-scope',
      desc: 'otp-input',
    },
    {
      name: 'data-part',
      desc: 'input',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-complete',
      desc: 'Present when the input value is complete',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
  ],
}

export const keyboardApi = [
  {
    name: 'ArrowLeft',
    desc: 'Moves focus to the previous input',
  },
  {
    name: 'ArrowRight',
    desc: 'Moves focus to the next input',
  },
  {
    name: 'Backspace',
    desc: 'Deletes the value in the current input and moves focus to the previous input',
  },
  {
    name: 'Delete',
    desc: 'Deletes the value in the current input',
  },
  {
    name: 'Control + V',
    desc: 'Pastes the value into the input fields',
  }
]
