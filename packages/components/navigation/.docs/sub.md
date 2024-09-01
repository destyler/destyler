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
    'name': 'defaultValue',
    'description': '<p>The value of the menu item that should be active when initially rendered.</p>\n<p>Use when you do not need to control the value state.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled value of the sub menu item to activate.\nCan be used as <code>v-model</code>.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'orientation',
    'description': '<p>The orientation of the menu.</p>\n',
    'type': '\'horizontal\' | \'vertical\'',
    'required': false,
    'default': 'horizontal'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the value changes.</p>\n',
    'type': '[_value: string]'
  }
]" />
