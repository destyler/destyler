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
    'default': 'undefined'
  },
  {
    'name': 'disableOutsidePointerEvents',
    'description': '',
    'type': 'boolean',
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
    'name': 'isDismissable',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'trapFocus',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
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
    'description': '',
    'type': '[_event: Event]'
  },
  {
    'name': 'pointerDownOutside',
    'description': '',
    'type': '[_event: CustomEvent<{ originalEvent: PointerEvent; }>]'
  }
]" />
