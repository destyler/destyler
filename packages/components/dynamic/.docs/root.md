<!-- Generated -->

<Props :value="[
  {
    'name': 'addOnBlur',
    'description': '<p>When <code>true</code> allow adding tags blur input</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'addOnPaste',
    'description': '<p>When <code>true</code>, allow adding tags on paste.\nWork in conjunction with delimiter prop.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'addOnTab',
    'description': '<p>When <code>true</code> allow adding tags on tab keydown</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
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
    'name': 'defaultValue',
    'description': '<p>The value of the tags that should be added.\nUse when you do not need to control the state of the tags input</p>\n',
    'type': 'string[]',
    'required': false,
    'default': '-'
  },
  {
    'name': 'delimiter',
    'description': '<p>The character to trigger the addition of a new tag.\nAlso used to split tags for <code>@paste</code> event</p>\n',
    'type': 'string',
    'required': false,
    'default': ','
  },
  {
    'name': 'dir',
    'description': '<p>s* The reading direction of the combobox when applicable.</p>\n',
    'type': '\'ltr\' | \'rtl\'',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the tags input.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'duplicate',
    'description': '<p>When <code>true</code>, allow duplicated tags.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'id',
    'description': '<p>The unique identifier of the machine.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'max',
    'description': '<p>Maximum number of tags.</p>\n',
    'type': 'number',
    'required': false,
    'default': '0'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled value of the tags input. Can be bind as <code>v-model</code>.</p>\n',
    'type': 'string[]',
    'required': false,
    'default': '() => []'
  },
  {
    'name': 'name',
    'description': '<p>The name of the tags input submitted with its\nowning form as part of a name/value pair.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'required',
    'description': '<p>When <code>true</code>, indicates that the user must add the\ntags input before the owning form can be submitted.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  }
]" />

<Event :value="[
  {
    'name': 'invalid',
    'description': '<p>Event handler called when the value is invalid</p>\n',
    'type': '[_payload: string]'
  },
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the value changes</p>\n',
    'type': '[_value: string[]]'
  }
]" />

<Slots :value="[
  {
    'name': 'modelValue',
    'description': '<p>Current input values</p>\n',
    'type': 'string[]'
  }
]" />
