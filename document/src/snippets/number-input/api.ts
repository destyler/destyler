export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; label: string; input: string; incrementTrigger: string; decrementTrigger: string; scrubber: string; }>',
    desc: 'The ids of the elements in the number input. Useful for composition.'
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name attribute of the number input. Useful for form submission.'
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The associate form of the input element.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the number input is disabled.'
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the number input is readonly'
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the number input value is invalid.'
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the number input is required'
  },
  {
    name: 'pattern',
    type: 'string',
    desc: 'The pattern used to check the <input> element\'s value against'
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The value of the input'
  },
  {
    name: 'min',
    type: 'number',
    desc: 'The minimum value of the number input'
  },
  {
    name: 'max',
    type: 'number',
    desc: 'The maximum value of the number input'
  },
  {
    name: 'step',
    type: 'number',
    desc: 'The amount to increment or decrement the value by'
  },
  {
    name: 'allowMouseWheel',
    type: 'boolean',
    desc: 'Whether to allow mouse wheel to change the value'
  },
  {
    name: 'allowOverflow',
    type: 'boolean',
    desc: 'Whether to allow the value overflow the min/max range'
  },
  {
    name: 'clampValueOnBlur',
    type: 'boolean',
    desc: 'Whether to clamp the value when the input loses focus (blur)'
  },
  {
    name: 'focusInputOnChange',
    type: 'boolean',
    desc: 'Whether to focus input when the value changes'
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'Specifies the localized strings that identifies the accessibility elements and their states'
  },
  {
    name: 'formatOptions',
    type: 'Intl.NumberFormatOptions',
    desc: 'The options to pass to the Intl.NumberFormat constructor'
  },
  {
    name: 'inputMode',
    type: 'InputMode',
    desc: 'Hints at the type of data that might be entered by the user. It also determines the type of keyboard shown to the user on mobile devices'
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Function invoked when the value changes'
  },
  {
    name: 'onValueInvalid',
    type: '(details: ValueInvalidDetails) => void',
    desc: 'Function invoked when the value overflows or underflows the min/max range'
  },
  {
    name: 'onFocusChange',
    type: '(details: FocusChangeDetails) => void',
    desc: 'Function invoked when the number input is focused'
  },
  {
    name: 'spinOnPress',
    type: 'boolean',
    desc: 'Whether to spin the value when the increment/decrement button is pressed'
  },
  {
    name: 'locale',
    type: 'string',
    desc: 'The current locale. Based on the BCP 47 definition.'
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
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the input is focused.'
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the input is invalid.'
  },
  {
    name: 'empty',
    type: 'boolean',
    desc: 'Whether the input value is empty.'
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The formatted value of the input.'
  },
  {
    name: 'valueAsNumber',
    type: 'number',
    desc: 'The value of the input as a number.'
  },
  {
    name: 'setValue',
    type: '(value: number) => void',
    desc: 'Function to set the value of the input.'
  },
  {
    name: 'clearValue',
    type: '() => void',
    desc: 'Function to clear the value of the input.'
  },
  {
    name: 'increment',
    type: '() => void',
    desc: 'Function to increment the value of the input by the step.'
  },
  {
    name: 'decrement',
    type: '() => void',
    desc: 'Function to decrement the value of the input by the step.'
  },
  {
    name: 'setToMax',
    type: '() => void',
    desc: 'Function to set the value of the input to the max.'
  },
  {
    name: 'setToMin',
    type: '() => void',
    desc: 'Function to set the value of the input to the min.'
  },
  {
    name: 'focus',
    type: '() => void',
    desc: 'Function to focus the input.'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'number-input'
    },
    {
      name: 'data-part',
      desc: 'root'
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
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
  ],
  label: [
    {
      name: 'data-scope',
      desc: 'number-input'
    },
    {
      name: 'data-part',
      desc: 'label'
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
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
  ],
  control: [
    {
      name: 'data-scope',
      desc: 'number-input'
    },
    {
      name: 'data-part',
      desc: 'control'
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
    },
  ],
  valueText: [
    {
      name: 'data-scope',
      desc: 'number-input'
    },
    {
      name: 'data-part',
      desc: 'value-text'
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
    },
  ],
  input: [
    {
      name: 'data-scope',
      desc: 'number-input'
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
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  decrementTrigger: [
    {
      name: 'data-scope',
      desc: 'number-input'
    },
    {
      name: 'data-part',
      desc: 'decrement-trigger'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  incrementTrigger: [
    {
      name: 'data-scope',
      desc: 'number-input'
    },
    {
      name: 'data-part',
      desc: 'increment-trigger'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  scrubber: [
    {
      name: 'data-scope',
      desc: 'number-input'
    },
    {
      name: 'data-part',
      desc: 'scrubber'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
}

export const keyboardApi = [
  {
    name: 'ArrowUp',
    desc: 'Increments the value of the number input by a predefined step.'
  },
  {
    name: 'ArrowDown',
    desc: 'Decrements the value of the number input by a predefined step.'
  },
  {
    name: 'PageUp',
    desc: 'Increments the value of the number input by a larger predefined step.'
  },
  {
    name: 'PageDown',
    desc: 'Decrements the value of the number input by a larger predefined step.'
  },
  {
    name: 'Home',
    desc: 'Sets the value of the number input to its minimum allowed value.'
  },
  {
    name: 'End',
    desc: 'Sets the value of the number input to its maximum allowed value.'
  },
  {
    name: 'Enter',
    desc: 'Submits the value entered in the number input.'
  }
]
