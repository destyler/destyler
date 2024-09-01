<!-- Generated -->

<Props :value="[
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
    'description': '',
    'type': '[_event: KeyboardEvent]'
  },
  {
    'name': 'focusOutside',
    'description': '',
    'type': '[_event: CustomEvent<{ originalEvent: FocusEvent; }>]'
  },
  {
    'name': 'interactOutside',
    'description': '',
    'type': '[_event: CustomEvent<{ originalEvent: PointerEvent; }> | CustomEvent<{ originalEvent: FocusEvent; }>]'
  },
  {
    'name': 'openAutoFocus',
    'description': '<p>Event handler called when auto-focusing on open. Can be prevented.</p>\n',
    'type': '[_event: Event]'
  },
  {
    'name': 'pointerDownOutside',
    'description': '',
    'type': '[_event: CustomEvent<{ originalEvent: PointerEvent; }>]'
  }
]" />
