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
    'description': '<p>The size of panel when it is collapsed.</p>\n',
    'type': 'number',
    'required': false,
    'default': '-'
  },
  {
    'name': 'collapsible',
    'description': '<p>Should panel collapse when resized beyond its <code>minSize</code>. When <code>true</code>, it will be collapsed to <code>collapsedSize</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'defaultSize',
    'description': '<p>Initial size of panel (numeric value between 1-100)</p>\n',
    'type': 'number',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'id',
    'description': '<p>Id of the element</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'maxSize',
    'description': '<p>The maximum allowable size of panel (numeric value between 1-100); defaults to <code>100</code></p>\n',
    'type': 'number',
    'required': false,
    'default': '-'
  },
  {
    'name': 'minSize',
    'description': '<p>The minimum allowable size of panel (numeric value between 1-100); defaults to <code>10</code></p>\n',
    'type': 'number',
    'required': false,
    'default': '-'
  },
  {
    'name': 'order',
    'description': '<p>The order of panel within group; required for groups with conditionally rendered panels</p>\n',
    'type': 'number',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'collapse',
    'description': '<p>Event handler called when panel is collapsed.</p>\n',
    'type': '[]'
  },
  {
    'name': 'expand',
    'description': '<p>Event handler called when panel is expanded.</p>\n',
    'type': '[]'
  },
  {
    'name': 'resize',
    'description': '<p>Event handler called when panel is resized;\nsize parameter is a numeric value\nbetween 1-100.</p>\n',
    'type': '[_size: number, _prevSize: number]'
  }
]" />

<Slots :value="[
  {
    'name': 'isCollapsed',
    'description': '<p>Is the panel collapsed</p>\n',
    'type': 'boolean'
  },
  {
    'name': 'isExpanded',
    'description': '<p>Is the panel expanded</p>\n',
    'type': 'boolean'
  }
]" />
