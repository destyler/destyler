<!-- Generated -->

<Props :value="[
  {
    'name': 'defaultOpen',
    'description': '<p>The open state of the submenu when it is initially rendered. Use when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'open',
    'description': '<p>The controlled open state of the collapsible. Can be binded with <code>v-model</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
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
    'description': '<p>Whether the submenu is open.</p>\n',
    'type': 'boolean | undefined'
  }
]" />
