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
    'name': 'collapsible',
    'description': '<p>When type is &quot;single&quot;, allows closing content when clicking trigger for an open item.\nWhen type is &quot;multiple&quot;, this prop has no effect.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'defaultValue',
    'description': '<p>The default active value of the item(s).</p>\n<p>Use when you do not need to control the state of the item(s).</p>\n',
    'type': 'string | string[]',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the accordion when applicable.\nIf omitted, assumes LTR (left-to-right) reading mode.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': 'ltr'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the accordion and all its items</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'modelValue',
    'description': '<p>The controlled value of the active item(s).</p>\n<p>Use this when you need to control the state of the items. Can be binded with <code>v-model</code></p>\n',
    'type': 'string | string[]',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'orientation',
    'description': '<p>The orientation of the accordion.</p>\n',
    'type': 'DataOrientation',
    'required': false,
    'default': 'vertical'
  },
  {
    'name': 'type',
    'description': '<p>Determines whether a &quot;single&quot; or &quot;multiple&quot; items can be pressed at a time.</p>\n<p>This prop will be ignored if any of <code>v-model</code> or <code>defaultValue</code> is defined, as the type will be inferred from the value.</p>\n',
    'type': '\'single\' | \'multiple\'',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called when the expanded state of an item changes</p>\n',
    'type': '[_value: string | string[]]'
  }
]" />

<Slots :value="[
  {
    'name': 'modelValue',
    'description': '<p>Current active value</p>\n',
    'type': 'string | string[] | undefined'
  }
]" />
