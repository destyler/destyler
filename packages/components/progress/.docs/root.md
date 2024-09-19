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
    'description': '<p>A function to get the accessible label text representing the current value in a human-readable format.</p>\n<p>If not provided, the value label will be read as the numeric value as a percentage of the max value.</p>\n',
    'type': '((value: number, max: number) => string)',
    'required': false,
    'default': '`(value: number, max: number) => string`'
  },
  {
    'name': 'max',
    'description': '<p>The maximum progress value.</p>\n',
    'type': 'number',
    'required': false,
    'default': '100'
  },
  {
    'name': 'modelValue',
    'description': '<p>The progress value. Can be bind as <code>v-model</code>.</p>\n',
    'type': 'number',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'update:max',
    'description': '<p>Event handler called when the max value changes</p>\n',
    'type': '[_value: number]'
  },
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the progres value changes</p>\n',
    'type': '[_value: string[]]'
  }
]" />
