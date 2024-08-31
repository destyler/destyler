<!-- Generated -->

<Props :value="[
  {
    'name': 'asChild',
    'description': '<p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p>\n<p>Read our Composition guide for more details.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'disabled',
    'description': '<p>Whether or not an accordion item is disabled from user interaction.</p>\n<p>When <code>true</code>, prevents the user from interacting with the item.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'value',
    'description': '<p>A string value for the accordion item. All items within an accordion should use a unique value.</p>\n',
    'type': 'string',
    'required': true,
    'default': '-'
  }
]" />

<Slots :value="[
  {
    'name': 'open',
    'description': '<p>Current open state</p>\n',
    'type': 'boolean'
  }
]" />
