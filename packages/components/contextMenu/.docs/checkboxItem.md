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
    'description': '<p>Event handler called when the selecting item. &lt;br&gt;\nIt can be prevented by calling <code>event.preventDefault</code>.</p>\n',
    'type': '[_event: Event]'
  },
  {
    'name': 'update:checked',
    'description': '<p>Event handler called when the checked state of the checkbox changes.</p>\n',
    'type': '[_checked: CheckedState]'
  }
]" />
