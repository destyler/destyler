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
    'name': 'defaultOpen',
    'description': '<p>The open state of the collapsible when it is initially rendered.\nUse when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the collapsible.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'open',
    'description': '<p>The controlled open state of the collapsible. Can be binded with <code>v-model</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:open',
    'description': '<p>Event handler called when the open state of the collapsible changes.</p>\n',
    'type': '[_open: boolean]'
  }
]" />

<Slots :value="[
  {
    'name': 'open',
    'description': '<p>Current open state</p>\n',
    'type': 'boolean'
  }
]" />
