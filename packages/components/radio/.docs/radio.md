<!-- Generated -->

<Props :value="[
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'AsTag | Component',
    'required': false,
    'default': 'button'
  },
  {
    'name': 'asChild',
    'description': '<p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p>\n<p>Read our Composition guide for more details.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'checked',
    'description': '<p>The controlled value of the radio item to check. Can be binded as <code>v-model</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the radio item.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'id',
    'description': '<p>The name of the input fields in the radio (Useful for form submission).</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'name',
    'description': '<p>The name of the input fields in the radio (Useful for form submission).</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'required',
    'description': '<p>When <code>true</code>, indicates that the user must check the radio item before the owning form can be submitted.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'value',
    'description': '<p>The value given as data when submitted with a <code>name</code>.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'update:checked',
    'description': '<p>Event handler called when the radio item is checked.</p>\n',
    'type': '[_value: boolean]'
  }
]" />
