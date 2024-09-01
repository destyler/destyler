<!-- Generated -->

<Props :value="[
  {
    'name': 'as',
    'description': '<p>The element or component this component should render as. Can be overwrite by <code>asChild</code></p>\n',
    'type': 'AsTag | Component',
    'required': false,
    'default': 'li'
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
    'description': '<p>The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'true'
  },
  {
    'name': 'duration',
    'description': '<p>Time in milliseconds that toast should remain visible for. Overrides value\ngiven to <code>ToastProvider</code>.</p>\n',
    'type': 'number',
    'required': false,
    'default': '-'
  },
  {
    'name': 'forceMount',
    'description': '<p>Used to force mounting when more control is needed. Useful when\ncontrolling animation with Vue animation libraries.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'open',
    'description': '<p>The controlled open state of the dialog. Can be bind as <code>v-model:open</code>.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'type',
    'description': '<p>Control the sensitivity of the toast for accessibility purposes.</p>\n<p>For toasts that are the result of a user action, choose <code>foreground</code>. Toasts generated from background tasks should use <code>background</code>.</p>\n',
    'type': '\'foreground\' | \'background\'',
    'required': false,
    'default': 'foreground'
  }
]" />

<Event :value="[
  {
    'name': 'escapeKeyDown',
    'description': '<p>Event handler called when the escape key is down. It can be prevented by calling <code>event.preventDefault</code>.</p>\n',
    'type': '[_event: KeyboardEvent]'
  },
  {
    'name': 'pause',
    'description': '<p>Event handler called when the dismiss timer is paused. This occurs when the pointer is moved over the viewport, the viewport is focused or when the window is blurred.</p>\n',
    'type': '[]'
  },
  {
    'name': 'resume',
    'description': '<p>Event handler called when the dismiss timer is resumed. This occurs when the pointer is moved away from the viewport, the viewport is blurred or when the window is focused.</p>\n',
    'type': '[]'
  },
  {
    'name': 'swipeCancel',
    'description': '',
    'type': '[_event: SwipeEvent]'
  },
  {
    'name': 'swipeEnd',
    'description': '<p>Event handler called at the end of a swipe interaction. It can be prevented by calling <code>event.preventDefault</code>.</p>\n',
    'type': '[_event: SwipeEvent]'
  },
  {
    'name': 'swipeMove',
    'description': '<p>Event handler called during a swipe interaction. It can be prevented by calling <code>event.preventDefault</code>.</p>\n',
    'type': '[_event: SwipeEvent]'
  },
  {
    'name': 'swipeStart',
    'description': '<p>Event handler called when starting a swipe interaction. It can be prevented by calling <code>event.preventDefault</code>.</p>\n',
    'type': '[_event: SwipeEvent]'
  },
  {
    'name': 'update:open',
    'description': '<p>Event handler called when the open state changes</p>\n',
    'type': '[_value: boolean]'
  }
]" />

<Slots :value="[
  {
    'name': 'remaining',
    'description': '<p>Remaining time (in ms)</p>\n',
    'type': 'number'
  }
]" />
