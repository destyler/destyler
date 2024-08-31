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
    'name': 'collapsedSize',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'collapsible',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'defaultSize',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'id',
    'description': '',
    'type': 'string',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'maxSize',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'minSize',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'order',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'collapse',
    'description': '',
    'type': '[]'
  },
  {
    'name': 'expand',
    'description': '',
    'type': '[]'
  },
  {
    'name': 'resize',
    'description': '',
    'type': '[_size: number, _prevSize: number]'
  }
]" />

<Slots :value="[
  {
    'name': 'isCollapsed',
    'description': '',
    'type': 'boolean'
  },
  {
    'name': 'isExpanded',
    'description': '',
    'type': 'boolean'
  }
]" />
