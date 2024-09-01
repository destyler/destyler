<!-- Generated -->

<Props :value="[
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'Component<any, any, any, ComputedOptions, MethodOptions, {}, any> | AsTag',
    'required': false,
    'default': '\'div\''
  },
  {
    'name': 'asChild',
    'description': '<p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p>\n<p>Read our Composition guide for more details.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'checked',
    'description': '<p>The controlled checked state of the item.\nCan be used as <code>v-model:checked</code>.</p>\n',
    'type': 'false | true | \'indeterminate\'',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'disabled',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'textValue',
    'description': '',
    'type': 'string',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'select',
    'description': '<p>Event handler called when the user selects an item (via mouse or keyboard). &lt;br&gt;\nCalling <code>event.preventDefault</code> in this handler will prevent the menu from closing when selecting that item.</p>\n',
    'type': '[_event: Event]'
  },
  {
    'name': 'update:checked',
    'description': '<p>Event handler called when the checked state changes.</p>\n',
    'type': '[_checked: CheckedState]'
  }
]" />
