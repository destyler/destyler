export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; track: string; label: string; circle: string; }>',
    desc: 'The ids of the elements in the progress bar. Useful for composition.'
  },
  {
    name: 'value',
    type: 'number',
    desc: 'The current value of the progress bar.'
  },
  {
    name: 'min',
    type: 'number',
    desc: 'The minimum allowed value of the progress bar.'
  },
  {
    name: 'max',
    type: 'number',
    desc: 'The maximum allowed value of the progress bar.'
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'The localized messages to use.'
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Callback fired when the value changes.'
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.'
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.'
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.'
  },
  {
    name: 'orientation',
    type: 'Orientation',
    desc: 'The orientation of the element.'
  },
]

export const matchApi = [
  {
    name: 'value',
    type: 'number',
    desc: 'The current value of the progress bar.'
  },
  {
    name: 'valueAsString',
    type: 'string',
    desc: 'The current value of the progress bar as a string.'
  },
  {
    name: 'setValue',
    type: '(value: number) => void',
    desc: 'Sets the current value of the progress bar.'
  },
  {
    name: 'setToMax',
    type: '() => void',
    desc: 'Sets the current value of the progress bar to the max value.'
  },
  {
    name: 'setToMin',
    type: '() => void',
    desc: 'Sets the current value of the progress bar to the min value.'
  },
  {
    name: 'percent',
    type: 'number',
    desc: 'The percentage of the progress bar\'s value.'
  },
  {
    name: 'percentAsString',
    type: 'string',
    desc: 'The percentage of the progress bar\'s value as a string.'
  },
  {
    name: 'min',
    type: 'number',
    desc: 'The minimum allowed value of the progress bar.'
  },
  {
    name: 'max',
    type: 'number',
    desc: 'The maximum allowed value of the progress bar.'
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    desc: 'Whether the progress bar is indeterminate.'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'progress'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
    {
      name: 'data-value',
      desc: 'The value of the item'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the progress'
    },
  ],
  label: [
    {
      name: 'data-scope',
      desc: 'progress'
    },
    {
      name: 'data-part',
      desc: 'label'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the label'
    },
  ],
  range: [
    {
      name: 'data-scope',
      desc: 'progress'
    },
    {
      name: 'data-part',
      desc: 'range'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the range'
    },
  ],
  circleTrack: [
    {
      name: 'data-scope',
      desc: 'progress'
    },
    {
      name: 'data-part',
      desc: 'circle-track'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the circletrack'
    },
  ],
  circleRange: [
    {
      name: 'data-scope',
      desc: 'progress'
    },
    {
      name: 'data-part',
      desc: 'circle-range'
    },
  ],
  view: [
    {
      name: 'data-scope',
      desc: 'progress'
    },
    {
      name: 'data-part',
      desc: 'view'
    },
  ],
}
