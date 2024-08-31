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
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'defaultValue',
    'description': '',
    'type': 'AcceptableValue | AcceptableValue[]',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'dir',
    'description': '',
    'type': '\'ltr\' | \'rtl\'',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'disabled',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'displayValue',
    'description': '',
    'type': '((val: AcceptableValue) => string)',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'filterFunction',
    'description': '',
    'type': '((val: string[] | number[] | false[] | true[] | Record<string, any>[], term: string) => string[] | number[] | false[] | true[] | Record<string, any>[])',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'modelValue',
    'description': '',
    'type': 'AcceptableValue | AcceptableValue[]',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'multiple',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'name',
    'description': '',
    'type': 'string',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'open',
    'description': '',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'searchTerm',
    'description': '',
    'type': 'string',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '',
    'type': '[_value: AcceptableValue]'
  },
  {
    'name': 'update:open',
    'description': '',
    'type': '[_value: boolean]'
  },
  {
    'name': 'update:searchTerm',
    'description': '',
    'type': '[_value: string]'
  }
]" />

<Slots :value="[
  {
    'name': 'open',
    'description': '',
    'type': 'boolean'
  },
  {
    'name': 'modelValue',
    'description': '',
    'type': 'string | number | false | true | Record<string, any>'
  }
]" />
