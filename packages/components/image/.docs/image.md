<!-- Generated -->

<Props :value="[
  {
    'name': 'asChild',
    'description': '<p>Change the default rendered element for the one passed as a child, merging their props and behavior.</p>\n<p>Read our Composition guide for more details.</p>\n',
    'type': 'boolean',
    'required': false,
    'default': false
  },
  {
    'name': 'src',
    'description': '<p>image source</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'loadingStatusChange',
    'description': '<p>A callback providing information about the loading status of the image. &lt;br&gt;\nThis is useful in case you want to control more precisely what to render as the image is loading.</p>\n',
    'type': '[_status: ImageLoadingStatus]'
  }
]" />
