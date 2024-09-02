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
    'name': 'dir',
    'description': '<p>The reading direction of the scroll area when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': 'ltr'
  },
  {
    'name': 'scrollHideDelay',
    'description': '<p>If type is set to either <code>scroll</code> or <code>hover</code>,\nthis prop determines the length of time,\nin milliseconds, &lt;br&gt;\nbefore the scrollbars are hidden after\nthe user stops interacting with scrollbars.</p>\n',
    'type': 'number',
    'required': false,
    'default': '600'
  },
  {
    'name': 'type',
    'description': '<p>Describes the nature of scrollbar visibility, similar to how the scrollbar preferences in MacOS control visibility of native scrollbars.</p>\n<p><code>auto</code> - means that scrollbars are visible when content is overflowing on the corresponding orientation. &lt;br&gt;\n<code>always</code> - means that scrollbars are always visible regardless of whether the content is overflowing.&lt;br&gt;\n<code>scroll</code> - means that scrollbars are visible when the user is scrolling along its corresponding orientation.&lt;br&gt;\n<code>hover</code> - when the user is scrolling along its corresponding orientation and when the user is hovering over the scroll area.</p>\n',
    'type': 'ScrollType',
    'required': false,
    'default': 'hover'
  }
]" />
