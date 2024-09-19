<!-- Generated -->

<Props :value="[
  {
    'name': 'defaultOpen',
    'description': '<p>The open state of the dialog when it is initially rendered.\nUse when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'modal',
    'description': '<p>The modality of the dialog When set to true,\ninteraction with outside elements will be\ndisabled and only dialog content will\nbe visible to screen readers.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'true'
  },
  {
    'name': 'open',
    'description': '<p>The controlled open state of the dialog. Can be binded as <code>v-model:open</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:open',
    'description': '<p>Event handler called when the open state of the dialog changes.</p>\n',
    'type': '[_value: boolean]'
  }
]" />
