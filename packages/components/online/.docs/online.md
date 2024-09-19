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
    'name': 'favicon',
    'description': 'Override the default <code>favicon.ico</code> image location.',
    'type': 'string',
    'required': false,
    'default': '/favicon.ico'
  },
  {
    'name': 'logError',
    'description': 'Should error messages be printed to the console.',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'timeout',
    'description': 'Set a timeout in milliseconds.',
    'type': 'number',
    'required': false,
    'default': '0'
  },
  {
    'name': 'url',
    'description': 'Pinging any url to double check if you are online or not.',
    'type': 'string',
    'required': false,
    'default': 'https://google.com'
  }
]" />

<Event :value="[
  {
    'name': 'networkStatus',
    'description': '',
    'type': '[_value: boolean]'
  }
]" />
