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
    'type': 'number | Partial<Record<\'left\' | \'right\' | \'top\' | \'bottom\', number>>',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disableOutsidePointerEvents',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disableOutsideScroll',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'forceMount',
    'description': '<p>Used to force mounting when more control is needed. Useful when\ncontrolling animation with Vue animation libraries.</p>\n',
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
    'name': 'side',
    'description': '',
    'type': '\'left\' | \'right\' | \'top\' | \'bottom\'',
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
    'name': 'trapFocus',
    'description': '',
    'type': 'boolean',
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
    'type': '[_event: CustomEvent<{ originalEvent: FocusEvent; }>]'
  },
  {
    'name': 'interactOutside',
    'description': '<p>Event handler called when an interaction happens outside the <code>DismissableLayer</code>.\nSpecifically, when a <code>pointerdown</code> event happens outside or focus moves outside of it.\nCan be prevented.</p>\n',
    'type': '[_event: CustomEvent<{ originalEvent: PointerEvent; }> | CustomEvent<{ originalEvent: FocusEvent; }>]'
  },
  {
    'name': 'pointerDownOutside',
    'description': '<p>Event handler called when the a <code>pointerdown</code> event happens outside of the <code>DismissableLayer</code>.\nCan be prevented.</p>\n',
    'type': '[_event: CustomEvent<{ originalEvent: PointerEvent; }>]'
  }
]" />
