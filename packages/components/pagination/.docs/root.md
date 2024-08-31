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
    'name': 'defaultPage',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'disabled',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'itemsPerPage',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'page',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'showEdges',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'siblingCount',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'total',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:page',
    'description': '',
    'type': '[_value: number]'
  }
]" />

<Slots :value="[
  {
    'name': 'page',
    'description': '',
    'type': 'number'
  },
  {
    'name': 'pageCount',
    'description': '',
    'type': 'number'
  }
]" />