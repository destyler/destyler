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
    'name': 'autoSaveId',
    'description': '',
    'type': 'string',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'direction',
    'description': '',
    'type': '\'horizontal\' | \'vertical\'',
    'required': true,
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
    'name': 'keyboardResizeBy',
    'description': '',
    'type': 'number',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'storage',
    'description': '',
    'type': 'PanelGroupStorage',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'layout',
    'description': '',
    'type': '[_layout: number[]]'
  }
]" />

<Slots :value="[
  {
    'name': 'layout',
    'description': '',
    'type': 'number[]'
  }
]" />