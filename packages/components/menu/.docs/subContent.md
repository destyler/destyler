<!-- Generated -->

<Props :value="[
  {
    'name': 'alignOffset',
    'description': '',
    'type': 'number',
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
    'type': 'Component<any, any, any, ComputedOptions, MethodOptions, {}, any> | AsTag',
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
    'name': 'forceMount',
    'description': '',
    'type': 'boolean',
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
    'name': 'loop',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'prioritizePosition',
    'description': '',
    'type': 'boolean',
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
  },
  {
    'name': 'updatePositionStrategy',
    'description': '',
    'type': '\'always\' | \'optimized\'',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'closeAutoFocus',
    'description': '<p>Event handler called when auto-focusing on close.\nCan be prevented.</p>\n',
    'type': '[_event: Event]'
  },
  {
    'name': 'entryFocus',
    'description': '',
    'type': '[_event: Event]'
  },
  {
    'name': 'escapeKeyDown',
    'description': '<p>Event handler called when the escape key is down.\nCan be prevented.</p>\n',
    'type': '[_event: KeyboardEvent]'
  },
  {
    'name': 'focusOutside',
    'description': '<p>Event handler called when the focus moves outside of the <code>DismissableLayer</code>.\nCan be prevented.</p>\n',
    'type': '[_event: FocusOutsideEvent]'
  },
  {
    'name': 'interactOutside',
    'description': '<p>Event handler called when an interaction happens outside the <code>DismissableLayer</code>.\nSpecifically, when a <code>pointerdown</code> event happens outside or focus moves outside of it.\nCan be prevented.</p>\n',
    'type': '[_event: PointerDownOutsideEvent | FocusOutsideEvent]'
  },
  {
    'name': 'openAutoFocus',
    'description': '<p>Event handler called when auto-focusing on open. Can be prevented.</p>\n',
    'type': '[_event: Event]'
  },
  {
    'name': 'pointerDownOutside',
    'description': '<p>Event handler called when the a <code>pointerdown</code> event happens outside of the <code>DismissableLayer</code>.\nCan be prevented.</p>\n',
    'type': '[_event: PointerDownOutsideEvent]'
  }
]" />
