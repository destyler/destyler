<!-- Generated -->

<Props :value="[
  {
    'name': 'defaultValue',
    'description': '<p>The value of the menu that should be open when initially rendered. Use when you do not need to control the value state.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the combobox when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': '-'
  },
  {
    'name': 'loop',
    'description': '<p>When <code>true</code>, keyboard navigation will loop from last item to first, and vice versa.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled value of the menu to open.\nCan be used as <code>v-model</code>.</p>\n',
    'type': 'string',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the value changes.</p>\n',
    'type': '[_value: string]'
  }
]" />
