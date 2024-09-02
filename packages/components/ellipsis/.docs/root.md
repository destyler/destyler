<!-- Generated -->

<Props :value="[
  {
    'name': 'defaultOpen',
    'description': '<p>The open state of the dropdown menu when it is initially rendered.\nUse when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'delayDuration',
    'description': '<p>The duration from when the pointer enters the trigger until the tooltip gets opened.</p>\n',
    'type': 'number',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disableClosingTrigger',
    'description': '<p>When <code>true</code>, clicking on trigger will not close the content.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disabled',
    'description': '<p>When <code>true</code>, prevents the user from interacting with the accordion and all its items</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'disableHoverableContent',
    'description': '<p>When <code>true</code>, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'ignoreNonKeyboardFocus',
    'description': '<p>Prevent the tooltip from opening if the focus did not come from\nthe keyboard by matching against the <code>:focus-visible</code> selector.\nThis is useful if you want to avoid opening it when switching\nbrowser tabs or closing a dialog.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'open',
    'description': '<p>The controlled open state of the Ellipsis. Can be binded-with with <code>v-model:open</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  }
]" />

<Event :value="[
  {
    'name': 'update:open',
    'description': '<p>Emitted when the open state of the Ellipsis changes.</p>\n',
    'type': '[_open: boolean]'
  }
]" />
