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
    'name': 'currentTabStopId',
    'description': '',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'defaultCurrentTabStopId',
    'description': '',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'dir',
    'description': '<p>The direction of between items.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': 'ltr'
  },
  {
    'name': 'loop',
    'description': '<p>Whether keyboard should loop around</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'orientation',
    'description': '<p>The orientation of the group.\nMainly so arrow navigation is done accordingly (left &amp; right vs. up &amp; down)</p>\n',
    'type': 'Orientation',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'entryFocus',
    'description': '',
    'type': '[_event: Event]'
  },
  {
    'name': 'update:currentTabStopId',
    'description': '',
    'type': '[_value: string | null]'
  }
]" />
