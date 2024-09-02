<!-- Generated -->

<Props :value="[
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'AsTag | Component',
    'required': false,
    'default': '\'div\''
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
    'description': '<p>The value of the radio item that should be checked when initially rendered.</p>\n<p>Use when you do not need to control the state of the radio items.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the radio when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with radio items.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'loop',
    'description': '<p>When <code>true</code>, keyboard navigation will loop from last item to first, and vice versa.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'true'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled value of the radio item to check. Can be binded as <code>v-model</code>.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'name',
    'description': '<p>The name of the group. Submitted with its owning form as part of a name/value pair.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'orientation',
    'description': '<p>The orientation of the component.</p>\n',
    'type': 'DataOrientation',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'required',
    'description': '<p>When <code>true</code>, indicates that the user must check a radio item before the owning form can be submitted.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the radio group value changes</p>\n',
    'type': '[_value: string]'
  }
]" />
