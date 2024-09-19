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
    'name': 'aspectRatio',
    'description': '<p>The desired ratio</p>\n',
    'type': 'number',
    'required': false,
    'default': '1'
  }
]" />

<Slots :value="[
  {
    'name': 'aspect',
    'description': '<p>Current aspect ratio (in <code>%</code>)</p>\n',
    'type': 'number'
  }
]" />
