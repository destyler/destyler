<!-- Generated -->

<Props :value="[
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'AsTag | Component',
    'required': false,
    'default': 'nav'
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
    'description': '<p>The value of the menu item that should be active when initially rendered.</p>\n<p>Use when you do not need to control the value state.</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'delayDuration',
    'description': '<p>The duration from when the pointer enters the trigger until the tooltip gets opened.</p>\n',
    'type': 'number',
    'required': false,
    'default': '200'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the navigation when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disableClickTrigger',
    'description': '<p>If <code>true</code>, menu cannot be open by click on trigger</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disableHoverTrigger',
    'description': '<p>If <code>true</code>, menu cannot be open by hover on trigger</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled value of the menu item to activate.\nCan be used as <code>v-model</code>.</p>\n',
    'type': 'string',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'orientation',
    'description': '<p>The orientation of the menu.</p>\n',
    'type': 'Orientation',
    'required': false,
    'default': 'horizontal'
  },
  {
    'name': 'skipDelayDuration',
    'description': '<p>How much time a user has to enter another trigger without incurring a delay again.</p>\n',
    'type': 'number',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the value changes.</p>\n',
    'type': '[_value: string]'
  }
]" />
