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
    'description': '<p>The controlled checked state of the checkbox. Can be binded with <code>v-model</code>.</p>\n',
    'type': 'boolean | \'indeterminate\'',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'defaultChecked',
    'description': '<p>The checked state of the checkbox when it is initially rendered.\nUse when you do not need to control its checked state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the checkbox.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'id',
    'description': '<p>Id of the element</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'name',
    'description': '<p>The name of the checkbox. Submitted with its owning form as part of a name/value pair.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'required',
    'description': '<p>When <code>true</code>, indicates that the user must check the checkbox before the owning form can be submitted.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'value',
    'description': '<p>The value given as data when submitted with a <code>name</code>.</p>\n',
    'type': 'string',
    'required': false,
    'default': 'on'
  }
]" />

<Event :value="[
  {
    'name': 'update:checked',
    'description': '<p>Event handler called when the checked state of the checkbox changes.</p>\n',
    'type': '[_checked: boolean]'
  }
]" />
