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
    'name': 'autoSaveId',
    'description': '<p>Unique id used to auto-save group\narrangement via <code>localStorage</code>.</p>\n',
    'type': 'string',
    'required': false,
    'default': 'null'
  },
  {
    'name': 'direction',
    'description': '<p>The group orientation of splitter.</p>\n',
    'type': 'Direction',
    'required': true,
    'default': '-'
  },
  {
    'name': 'id',
    'description': '<p>Group id; falls back to <code>useId</code> when not provided.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'keyboardResizeBy',
    'description': '<p>Step size when arrow key was pressed.</p>\n',
    'type': 'number',
    'required': false,
    'default': '10'
  },
  {
    'name': 'storage',
    'description': '<p>Custom storage API; defaults to localStorage</p>\n',
    'type': 'PanelGroupStorage',
    'required': false,
    'default': '() => defaultStorage'
  }
]" />

<Event :value="[
  {
    'name': 'layout',
    'description': '<p>Event handler called when group layout changes</p>\n',
    'type': '[_layout: number[]]'
  }
]" />

<Slots :value="[
  {
    'name': 'layout',
    'description': '<p>Current size of layout</p>\n',
    'type': 'number[]'
  }
]" />
