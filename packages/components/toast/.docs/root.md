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
    'name': 'defaultOpen',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'duration',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'forceMount',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'open',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'type',
    'description': '',
    'type': '\'foreground\' | \'background\'',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'escapeKeyDown',
    'description': '',
    'type': '[_event: KeyboardEvent]'
  },
  {
    'name': 'pause',
    'description': '',
    'type': '[]'
  },
  {
    'name': 'resume',
    'description': '',
    'type': '[]'
  },
  {
    'name': 'swipeCancel',
    'description': '',
    'type': '[_event: SwipeEvent]'
  },
  {
    'name': 'swipeEnd',
    'description': '',
    'type': '[_event: SwipeEvent]'
  },
  {
    'name': 'swipeMove',
    'description': '',
    'type': '[_event: SwipeEvent]'
  },
  {
    'name': 'swipeStart',
    'description': '',
    'type': '[_event: SwipeEvent]'
  },
  {
    'name': 'update:open',
    'description': '',
    'type': '[_value: boolean]'
  }
]" />

<Slots :value="[
  {
    'name': 'remaining',
    'description': '',
    'type': 'number'
  }
]" />
