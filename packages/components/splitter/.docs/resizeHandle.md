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
    'name': 'disabled',
    'description': '<p>Disable drag handle</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'hitAreaMargins',
    'description': '<p>Allow this much margin when determining resizable handle hit detection</p>\n',
    'type': 'PointerHitAreaMargins',
    'required': false,
    'default': '-'
  },
  {
    'name': 'id',
    'description': '<p>Resize handle id (unique within group);\nfalls back to <code>useId</code> when not provided</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'tabindex',
    'description': '<p>Tabindex for the handle</p>\n',
    'type': 'number',
    'required': false,
    'default': '0'
  }
]" />

<Event :value="[
  {
    'name': 'dragging',
    'description': '<p>Event handler called when dragging the handler.</p>\n',
    'type': '[_isDragging: boolean]'
  }
]" />
