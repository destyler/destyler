<!-- Generated -->

<Props :value="[
  {
    'name': 'align',
    'description': '',
    'type': '\'start\' | \'center\' | \'end\'',
    'required': false,
    'default': '-'
  },
  {
    'name': 'alignOffset',
    'description': '',
    'type': 'number',
    'required': false,
    'default': '-'
  },
  {
    'name': 'ariaLabel',
    'description': '',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'arrowPadding',
    'description': '',
    'type': 'number',
    'required': false,
    'default': '-'
  },
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
    'default': '-'
  },
  {
    'name': 'avoidCollisions',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'collisionBoundary',
    'description': '',
    'type': 'Element | (Element | null)[] | null',
    'required': false,
    'default': '-'
  },
  {
    'name': 'collisionPadding',
    'description': '',
    'type': 'number | Partial<Record<\'top\' | \'right\' | \'bottom\' | \'left\', number>>',
    'required': false,
    'default': '-'
  },
  {
    'name': 'hideWhenDetached',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'side',
    'description': '',
    'type': '\'top\' | \'right\' | \'bottom\' | \'left\'',
    'required': false,
    'default': '-'
  },
  {
    'name': 'sideOffset',
    'description': '',
    'type': 'number',
    'required': false,
    'default': '-'
  },
  {
    'name': 'sticky',
    'description': '',
    'type': '\'partial\' | \'always\'',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'escapeKeyDown',
    'description': '<p>Event handler called when the escape key is down.\nCan be prevented.</p>\n',
    'type': '[_event: KeyboardEvent]'
  },
  {
    'name': 'pointerDownOutside',
    'description': '<p>Event handler called when the a <code>pointerdown</code> event happens outside of the <code>DismissableLayer</code>.\nCan be prevented.</p>\n',
    'type': '[_event: Event]'
  }
]" />

<Slots :value="[
  {
    'name': 'text',
    'description': '<p>The text to be item</p>\n',
    'type': 'string'
  }
]" />
