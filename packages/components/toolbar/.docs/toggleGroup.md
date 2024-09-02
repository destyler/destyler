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
    'default': false
  },
  {
    'name': 'defaultValue',
    'description': '<p>The default value for the calendar</p>\n',
    'type': 'string | string[]',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the calendar when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': 'ltr'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the accordion and all its items</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'loop',
    'description': '<p>When <code>true</code>, keyboard navigation will loop from last item to first, and vice versa.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled checked state of the calendar. Can be bound as <code>v-model</code>.</p>\n',
    'type': 'string | string[]',
    'required': false,
    'default': '-'
  },
  {
    'name': 'orientation',
    'description': '<p>The orientation of the accordion.</p>\n',
    'type': 'DataOrientation',
    'required': false,
    'default': 'vertical'
  },
  {
    'name': 'rovingFocus',
    'description': '<p>When <code>false</code>, navigating through the items using arrow keys will be disabled.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'true'
  },
  {
    'name': 'type',
    'description': '<p>Determines whether a &quot;single&quot; or &quot;multiple&quot; items can be pressed at a time.</p>\n<p>This prop will be ignored if any of <code>v-model</code> or <code>defaultValue</code> is defined, as the type will be inferred from the value.</p>\n',
    'type': 'TypeEnum',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called whenever the model value changes</p>\n',
    'type': '[_value: string]'
  }
]" />
