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
    'description': '<p>The controlled state of the switch.\nCan be bind as <code>v-model:checked</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'defaultChecked',
    'description': '<p>The state of the switch when it is initially rendered.\nUse when you do not need to control its state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the switch.</p>\n',
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
    'name': 'name',
    'description': '<p>The name of the switch. Submitted with its owning form as part of a name/value pair.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'required',
    'description': '<p>When <code>true</code>, indicates that the user must check the switch before the owning form can be submitted.</p>\n',
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
    'type': '[_checked: boolean]'
  }
]" />
