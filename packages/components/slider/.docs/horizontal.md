<!-- Generated -->

<Props :value="[
  {
    'name': 'dir',
    'description': '<p>The reading direction of the calendar when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': 'ltr'
  },
  {
    'name': 'inverted',
    'description': '',
    'type': 'boolean',
    'required': true,
    'default': '-'
  },
  {
    'name': 'max',
    'description': '<p>Maximum number of tags.</p>\n',
    'type': 'number',
    'required': true,
    'default': '0'
  },
  {
    'name': 'min',
    'description': '',
    'type': 'number',
    'required': true,
    'default': '-'
  }
]" />

<Event :value="[
  {
    'name': 'endKeyDown',
    'description': '',
    'type': '[_event: KeyboardEvent]'
  },
  {
    'name': 'homeKeyDown',
    'description': '',
    'type': '[_event: KeyboardEvent]'
  },
  {
    'name': 'slideEnd',
    'description': '',
    'type': '[]'
  },
  {
    'name': 'slideMove',
    'description': '',
    'type': '[_value: number]'
  },
  {
    'name': 'slideStart',
    'description': '',
    'type': '[_value: number]'
  },
  {
    'name': 'stepKeyDown',
    'description': '',
    'type': '[_event: KeyboardEvent, _direction: number]'
  }
]" />
