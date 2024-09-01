<!-- Generated -->

<Props :value="[
  {
    'name': 'alignOffset',
    'description': '<p>An offset in pixels from the <code>start</code> or <code>end</code> alignment options.</p>\n',
    'type': 'number',
    'required': false,
    'default': '0'
  },
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
    'name': 'avoidCollisions',
    'description': '<p>When <code>true</code>, overrides the side andalign preferences\nto prevent collisions with boundary edges.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'true'
  },
  {
    'name': 'collisionBoundary',
    'description': '<p>The element used as the collision boundary. By default\nthis is the viewport, though you can provide additional\nelement(s) to be included in this check.</p>\n',
    'type': 'Element | (Element | null)[] | null',
    'required': false,
    'default': '() => []'
  },
  {
    'name': 'collisionPadding',
    'description': '<p>The distance in pixels from the boundary edges where collision\ndetection should occur. Accepts a number (same for all sides),\nor a partial padding object, for example: { top: 20, left: 20 }.</p>\n',
    'type': 'number | Partial<Record<\'left\' | \'right\' | \'top\' | \'bottom\', number>>',
    'required': false,
    'default': '0'
  },
  {
    'name': 'forceMount',
    'description': '<p>Used to force mounting when more control is needed.\nUseful when controlling animation with Vue animation libraries.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'hideWhenDetached',
    'description': '<p>Whether to hide the content when the trigger becomes fully occluded.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'loop',
    'description': '<p>When <code>true</code>, keyboard navigation will loop from last item to first, and vice versa.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': '-'
  },
  {
    'name': 'prioritizePosition',
    'description': '<p>Force content to be position within the viewport.</p>\n<p>Might overlap the reference element, which may not be desired.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'sticky',
    'description': '<p>The sticky behavior on the align axis. <code>partial</code> will keep the\ncontent in the boundary as long as the trigger is at least partially\nin the boundary whilst &quot;always&quot; will keep the content in the boundary regardless.</p>\n',
    'type': '\'partial\' | \'always\'',
    'required': false,
    'default': 'partial'
  }
]" />

<Event :value="[
  {
    'name': 'closeAutoFocus',
    'description': '',
    'type': '[_event: Event]'
  },
  {
    'name': 'escapeKeyDown',
    'description': '',
    'type': '[_event: KeyboardEvent]'
  },
  {
    'name': 'focusOutside',
    'description': '',
    'type': '[_event: CustomEvent<{ originalEvent: FocusEvent; }>]'
  },
  {
    'name': 'interactOutside',
    'description': '',
    'type': '[_event: CustomEvent<{ originalEvent: PointerEvent; }> | CustomEvent<{ originalEvent: FocusEvent; }>]'
  },
  {
    'name': 'pointerDownOutside',
    'description': '',
    'type': '[_event: CustomEvent<{ originalEvent: PointerEvent; }>]'
  }
]" />
