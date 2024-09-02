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
    'description': '<p>The default value of the pin inputs when it is initially rendered. Use when you do not need to control its checked state.</p>\n',
    'type': 'string[]',
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
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the pin input</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'id',
    'description': '<p>Id of the element</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'mask',
    'description': '<p>When <code>true</code>, pin inputs will be treated as password.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled checked state of the pin input.\nCan be binded as <code>v-model</code>.</p>\n',
    'type': 'string[]',
    'required': false,
    'default': '-'
  },
  {
    'name': 'name',
    'description': '<p>The name of the pin input. Submitted with its owning form as part of a name/value pair.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'otp',
    'description': '<p>When <code>true</code>, mobile devices will autodetect the OTP from messages or clipboard, and enable the autocomplete field.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'placeholder',
    'description': '<p>The placeholder character to use for empty pin-inputs.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'required',
    'description': '<p>When <code>true</code>, indicates that the user must check the pin input before the owning form can be submitted.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'type',
    'description': '<p>Input type for the inputs.</p>\n',
    'type': '\'number\' | \'text\'',
    'required': false,
    'default': 'text'
  }
]" />

<Event :value="[
  {
    'name': 'complete',
    'description': '<p>Processing complete operations.</p>\n',
    'type': '[_value: string[]]'
  },
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the value changes.</p>\n',
    'type': '[_value: string[]]'
  }
]" />

<Slots :value="[
  {
    'name': 'modelValue',
    'description': '<p>Current input values</p>\n',
    'type': 'string[]'
  }
]" />
