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
    'name': 'calendarLabel',
    'description': '<p>The accessible label for the calendar</p>\n',
    'type': 'string',
    'required': false,
    'default': '-'
  },
  {
    'name': 'defaultPlaceholder',
    'description': '<p>The default placeholder date</p>\n',
    'type': 'DateValue',
    'required': false,
    'default': '-'
  },
  {
    'name': 'defaultValue',
    'description': '<p>The default value for the calendar</p>\n',
    'type': 'DateRange',
    'required': false,
    'default': '`() => ({ start: undefined, end: undefined })`'
  },
  {
    'name': 'dir',
    'description': '<p>The reading direction of the calendar when applicable.</p>\n',
    'type': 'Direction',
    'required': false,
    'default': 'ltr'
  },
  {
    'name': 'disabled',
    'description': '<p>Whether or not the calendar is disabled</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'fixedWeeks',
    'description': '<p>Whether or not to always display 6 weeks in the calendar</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'initialFocus',
    'description': '<p>Whether or not the calendar is readonly</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'isDateDisabled',
    'description': '<p>A function that returns whether or not a date is disabled</p>\n',
    'type': 'Matcher',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'isDateUnavailable',
    'description': '<p>A function that returns whether or not a date is unavailable</p>\n',
    'type': 'Matcher',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'locale',
    'description': '<p>The locale to use for formatting dates</p>\n',
    'type': '\'tr\' | \'th\' | \'ach\' | \'af\' | \'am\' | \'an\' | \'ar\' | \'ast\' | \'az\' | \'be\' | \'bg\' | \'bn\' | \'br\' | \'bs\' | \'ca\' | \'cak\' | \'ckb\' | \'cs\' | \'cy\' | \'da\' | \'de\' | \'dsb\' | \'el\' | \'en\' | \'eo\' | \'es\' | ... 49 more ...',
    'required': false,
    'default': '-'
  },
  {
    'name': 'maxValue',
    'description': '<p>The maximum date that can be selected</p>\n',
    'type': 'DateValue',
    'required': false,
    'default': '-'
  },
  {
    'name': 'minValue',
    'description': '<p>The minimum date that can be selected</p>\n',
    'type': 'DateValue',
    'required': false,
    'default': '-'
  },
  {
    'name': 'modelValue',
    'description': '<p>The maximum date that can be selected</p>\n',
    'type': 'DateRange',
    'required': false,
    'default': '-'
  },
  {
    'name': 'numberOfMonths',
    'description': '<p>The number of months to display at once</p>\n',
    'type': 'number',
    'required': false,
    'default': '1'
  },
  {
    'name': 'pagedNavigation',
    'description': '<p>This property causes the previous and next buttons\nto navigate by the number of months displayed at\nonce, rather than one month</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'placeholder',
    'description': '<p>The placeholder date, which is used to determine what month to\ndisplay when no date is selected. This updates as the user navigates\nthe calendar and can be used to programmatically control the\ncalendar view</p>\n',
    'type': 'DateValue',
    'required': false,
    'default': 'undefined'
  },
  {
    'name': 'preventDeselect',
    'description': '<p>Whether or not to prevent the user from deselecting\na date without selecting another date first</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'readonly',
    'description': '<p>Whether or not the calendar is readonly</p>\n',
    'type': 'boolean',
    'required': false,
    'default': 'false'
  },
  {
    'name': 'weekdayFormat',
    'description': '<p>The format to use for the weekday strings provided via the weekdays slot prop</p>\n',
    'type': 'WeekDayFormat',
    'required': false,
    'default': 'narrow'
  },
  {
    'name': 'weekStartsOn',
    'description': '<p>The day of the week to start the calendar on</p>\n',
    'type': '0 | 1 | 2 | 3 | 4 | 5 | 6',
    'required': false,
    'default': '0'
  }
]" />

<Event :value="[
  {
    'name': 'update:modelValue',
    'description': '<p>Event handler called whenever the model value changes</p>\n',
    'type': '[_date: DateRange]'
  },
  {
    'name': 'update:placeholder',
    'description': '<p>Event handler called whenever the placeholder value changes</p>\n',
    'type': '[_date: DateValue]'
  },
  {
    'name': 'update:startValue',
    'description': '',
    'type': '[_date: DateValue]'
  }
]" />

<Slots :value="[
  {
    'name': 'date',
    'description': '',
    'type': 'DateValue'
  },
  {
    'name': 'grid',
    'description': '',
    'type': 'Grid<DateValue>'
  },
  {
    'name': 'weekDays',
    'description': '',
    'type': 'string[]'
  }
]" />
