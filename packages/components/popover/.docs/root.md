<!-- Generated -->

<Props :value="[
  {
    'name': 'defaultOpen',
    'description': '<p>The open state of the popover when it is initially rendered. Use when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'modal',
    'description': '<p>The modality of the popover. When set to true, interaction with outside elements will be disabled and only popover content will be visible to screen readers.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'open',
    'description': '<p>The controlled open state of the popover.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:open',
    'description': '<p>Event handler called when the open state of the popover changes.</p>\n',
    'type': '[_value: boolean]'
  }
]" />
