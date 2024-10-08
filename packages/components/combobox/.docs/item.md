<!-- Generated -->

<Props :value="[
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'AsTag | Component',
    'required': false,
    'default': 'div'
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
    'description': '<p>When true, prevents the user from interacting with the <code>item</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'value',
    'description': '<p>The value given as data when submitted with a <code>name</code>.</p>\n',
    'type': 'AcceptableValue',
    'required': true,
    'default': 'on'
  }
]" />

<Event :value="[
  {
    'name': 'select',
    'description': '<p>Event handler called when the selecting item. &lt;br&gt;\nIt can be prevented by calling <code>event.preventDefault</code>.</p>\n',
    'type': '[_ev: SelectEvent<AcceptableValue>]'
  }
]" />
