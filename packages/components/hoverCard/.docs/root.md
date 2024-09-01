<!-- Generated -->

<Props :value="[
  {
    'name': 'closeDelay',
    'description': '<p>The duration from when the mouse leaves the trigger\nor content until the hover card closes.</p>\n',
    'type': 'number',
    'required': false,
    'default': '300'
  },
  {
    'name': 'defaultOpen',
    'description': '<p>The open state of the hover card when it is initially rendered.\nUse when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'open',
    'description': '<p>The controlled open state of the hover card.\nCan be binded as <code>v-model:open</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'openDelay',
    'description': '<p>The duration from when the mouse enters the\ntrigger until the hover card opens.</p>\n',
    'type': 'number',
    'required': false,
    'default': '700'
  }
]" />

<Event :value="[
  {
    'name': 'update:open',
    'description': '<p>Event handler called when the open state of the hover card changes.</p>\n',
    'type': '[_value: boolean]'
  }
]" />
