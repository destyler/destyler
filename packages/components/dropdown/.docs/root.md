<!-- Generated -->

<Props :value="[
  {
    'name': 'defaultOpen',
    'description': '<p>The open state of the dropdown menu when it is initially rendered.\nUse when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the combobox when applicable.</p>\n',
    'type': '\'ltr\' | \'rtl\'',
    'required': false,
    'default': '-'
  },
  {
    'name': 'modal',
    'description': '<p>The modality of the dropdown menu.\nWhen set to true, interaction with\noutside elements will be disabled and\nonly menu content will be visible to\nscreen readers.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'open',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:open',
    'description': '<p>Event handler called when the open state of the dialog changes.</p>\n',
    'type': '[_open: boolean]'
  }
]" />
