<!-- Generated -->

<Props :value="[
  {
    'name': 'active',
    'description': '<p>Whether countdown is active.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'true'
  },
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'AsTag | Component',
    'required': false,
    'default': 'template'
  },
  {
    'name': 'asChild',
    'description': '<p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p>\n<p>Read our Composition guide for more details.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'duration',
    'description': '<p>The duration of the countdown (unit is millisecond).\nNot reactive.</p>\n',
    'type': 'number',
    'required': false,
    'default': '0'
  },
  {
    'name': 'precision',
    'description': '<p>The precision of the second.</p>\n',
    'type': '0 | 1 | 2 | 3',
    'required': false,
    'default': '0'
  },
  {
    'name': 'render',
    'description': '<p>Time is render function</p>\n',
    'type': '((props: CountdownTimeInfo) => VNodeChild)',
    'required': false,
    'default': '-'
  }
]" />
