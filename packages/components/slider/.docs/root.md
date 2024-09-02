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
    'name': 'defaultValue',
    'description': '<p>The value of the slider when initially rendered. Use when you do not need to control the state of the slider.</p>\n',
    'type': 'number[]',
    'required': false,
    'default': '() => [0]'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the slider when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the slider.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'inverted',
    'description': '<p>Whether the slider is visually inverted.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'max',
    'description': '<p>The maximum value for the range.</p>\n',
    'type': 'number',
    'required': false,
    'default': '100'
  },
  {
    'name': 'min',
    'description': '<p>The minimum value for the range.</p>\n',
    'type': 'number',
    'required': false,
    'default': '0'
  },
  {
    'name': 'minStepsBetweenThumbs',
    'description': '<p>The minimum permitted steps between multiple thumbs.</p>\n',
    'type': 'number',
    'required': false,
    'default': '0'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled value of the slider. Can be bind as <code>v-model</code>.</p>\n',
    'type': 'number[]',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'name',
    'description': '<p>The name of the checkbox. Submitted with its owning form as part of a name/value pair.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'orientation',
    'description': '<p>The orientation of the slider.</p>\n',
    'type': 'DataOrientation',
    'required': false,
    'default': 'horizontal'
  },
  {
    'name': 'step',
    'description': '<p>The stepping interval.</p>\n',
    'type': 'number',
    'required': false,
    'default': '1'
  }
]" />

<Slots :value="[
  {
    'name': 'modelValue',
    'description': '<p>Current slider values</p>\n',
    'type': 'number[]'
  }
]" />
