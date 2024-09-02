<!-- Generated -->

<Props :value="[
  {
    'name': 'active',
    'description': '<p>Used to identify the link as the currently active page.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'true'
  },
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'AsTag | Component',
    'required': false,
    'default': 'a'
  },
  {
    'name': 'asChild',
    'description': '<p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p>\n<p>Read our Composition guide for more details.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  }
]" />

<Event :value="[
  {
    'name': 'select',
    'description': '<p>Event handler called when the user selects a link (via mouse or keyboard).</p>\n<p>Calling <code>event.preventDefault</code> in this handler will prevent the navigation menu from closing when selecting that link.</p>\n',
    'type': '[_ev: MouseEvent]'
  }
]" />
