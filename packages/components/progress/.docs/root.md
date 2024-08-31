<!-- Generated -->

<Props :value="[
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'AsTag | Component',
    'required': false,
    'default': 'div'
  },
  {
    'name': 'asChild',
    'description': '<p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p>\n<p>Read our Composition guide for more details.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'getValueLabel',
    'description': '',
    'type': '((value: number, max: number) => string)',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'max',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'modelValue',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:max',
    'description': '',
    'type': '[_value: number]'
  },
  {
    'name': 'update:modelValue',
    'description': '',
    'type': '[_value: string[]]'
  }
]" />
