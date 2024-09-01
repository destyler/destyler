<!-- Generated -->

<Props :value="[
  {
    'name': 'defaultOpen',
    'description': '<p>The open state of the tooltip when it is initially rendered.\nUse when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'delayDuration',
    'description': '<p>Override the duration given to the <code>Provider</code> to customise\nthe open delay for a specific tooltip.</p>\n',
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
    'description': '<p>When <code>true</code>, disable tooltip</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'disableHoverableContent',
    'description': '<p>Prevents Tooltip.Content from remaining open when hovering.\nDisabling this has accessibility consequences. Inherits\nfrom Tooltip.Provider.</p>\n',
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
    'description': '<p>The controlled open state of the tooltip.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'update:open',
    'description': '<p>Event handler called when the open state of the tooltip changes.</p>\n',
    'type': '[_value: boolean]'
  }
]" />
