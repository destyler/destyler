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
    'name': 'defaultOpen',
    'description': '<p>The open state of the combobox when it is initially rendered.\nUse when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'defaultValue',
    'description': '<p>The value of the combobox when initially rendered.\nUse when you do not need to control the state of the Combobox</p>\n',
    'type': 'AcceptableValue | AcceptableValue[]',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the combobox when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': 'ltr'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with Combobox.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'displayValue',
    'description': '<p>The display value of input for selected item. Does not work with <code>multiple</code>.</p>\n',
    'type': '((val: AcceptableValue) => string)',
    'required': false,
    'default': '-'
  },
  {
    'name': 'filterFunction',
    'description': '<p>The custom filter function for filtering <code>ComboboxItem</code>.</p>\n',
    'type': '((val: string[] | number[] | false[] | true[] | Record<string, any>[], term: string) => string[] | number[] | false[] | true[] | Record<string, any>[])',
    'required': false,
    'default': '-'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled value of the Combobox. Can be binded-with with <code>v-model</code>.</p>\n',
    'type': 'AcceptableValue | AcceptableValue[]',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'multiple',
    'description': '<p>Whether multiple options can be selected or not.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'name',
    'description': '<p>The name of the Combobox. Submitted with its owning form as part of a name/value pair.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'open',
    'description': '<p>The controlled open state of the Combobox. Can be binded-with with <code>v-model:open</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'searchTerm',
    'description': '<p>The controlled search term of the Combobox.\nCan be binded-with with <code>v-model:searchTerm</code>.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the value changes.</p>\n',
    'type': '[_value: AcceptableValue]'
  },
  {
    'name': 'update:open',
    'description': '<p>Event handler called when the open state of the combobox changes.</p>\n',
    'type': '[_value: boolean]'
  },
  {
    'name': 'update:searchTerm',
    'description': '<p>Event handler called when the searchTerm of the combobox changes.</p>\n',
    'type': '[_value: string]'
  }
]" />

<Slots :value="[
  {
    'name': 'open',
    'description': '<p>Current open state</p>\n',
    'type': 'boolean'
  },
  {
    'name': 'modelValue',
    'description': '<p>Current active value</p>\n',
    'type': 'string | number | false | true | Record<string, any>'
  }
]" />
