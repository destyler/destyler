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
    'name': 'forceMount',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'isDismissable',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'trapFocus',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'closeAutoFocus',
    'description': '<p>Event handler called when the a <code>pointerdown</code> event happens\noutside of the <code>DismissableLayer</code>. Can be prevented.</p>\n',
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
    'name': 'openAutoFocus',
    'description': '<p>Event handler called when auto-focusing on open. Can be prevented.</p>\n',
    'type': '[_event: Event]'
  },
  {
    'name': 'pointerDownOutside',
    'description': '<p>Event handler called when the a <code>pointerdown</code> event happens outside of the <code>DismissableLayer</code>.\nCan be prevented.</p>\n',
    'type': '[_event: CustomEvent<{ originalEvent: PointerEvent; }>]'
  }
]" />
