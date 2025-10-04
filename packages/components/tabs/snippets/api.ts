export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; trigger: string; list: string; content: string; indicator: string; }>',
    desc: 'The ids of the elements in the tabs. Useful for composition.',
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'Specifies the localized strings that identifies the accessibility elements and their states',
  },
  {
    name: 'loopFocus',
    type: 'boolean',
    desc: 'Whether the keyboard navigation will loop from last tab to first, and vice versa.',
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The selected tab id',
  },
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    desc: 'The orientation of the tabs. Can be `horizontal` or `vertical` - `horizontal`: only left and right arrow key navigation will work. - `vertical`: only up and down arrow key navigation will work.',
  },
  {
    name: 'activationMode',
    type: '"manual" | "automatic"',
    desc: 'The activation mode of the tabs. Can be `manual` or `automatic` - `manual`: Tabs are activated when clicked or press `enter` key. - `automatic`: Tabs are activated when receiving focus',
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Callback to be called when the selected/active tab changes',
  },
  {
    name: 'onFocusChange',
    type: '(details: FocusChangeDetails) => void',
    desc: 'Callback to be called when the focused tab changes',
  },
  {
    name: 'composite',
    type: 'boolean',
    desc: 'Whether the tab is composite',
  },
  {
    name: 'deselectable',
    type: 'boolean',
    desc: 'Whether the active tab can be deselected when clicking on it.',
  },
  {
    name: 'navigate',
    type: '(details: NavigateDetails) => void',
    desc: 'Function to navigate to the selected tab when clicking on it. Useful if tab triggers are anchor elements.',
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.',
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.',
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.',
  },
]

export const matchApi = [
  {
    name: 'value',
    type: 'string',
    desc: 'The current value of the tabs.',
  },
  {
    name: 'focusedValue',
    type: 'string',
    desc: 'The value of the tab that is currently focused.',
  },
  {
    name: 'setValue',
    type: '(value: string) => void',
    desc: 'Sets the value of the tabs.',
  },
  {
    name: 'clearValue',
    type: '() => void',
    desc: 'Clears the value of the tabs.',
  },
  {
    name: 'setIndicatorRect',
    type: '(value: string) => void',
    desc: 'Sets the indicator rect to the tab with the given value',
  },
  {
    name: 'syncTabIndex',
    type: '() => void',
    desc: 'Synchronizes the tab index of the content element. Useful when rendering tabs within a select or combobox',
  },
  {
    name: 'focus',
    type: '() => void',
    desc: 'Set focus on the selected tab trigger',
  },
  {
    name: 'selectNext',
    type: '(fromValue?: string) => void',
    desc: 'Selects the next tab',
  },
  {
    name: 'selectPrev',
    type: '(fromValue?: string) => void',
    desc: 'Selects the previous tab',
  },
  {
    name: 'getTriggerState',
    type: '(props: TriggerProps) => TriggerState',
    desc: 'Returns the state of the trigger with the given props',
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'tabs',
    },
    {
      name: 'data-part',
      desc: 'root',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the tabs',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
  ],
  list: [
    {
      name: 'data-scope',
      desc: 'tabs',
    },
    {
      name: 'data-part',
      desc: 'list',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the list',
    },
  ],
  trigger: [
    {
      name: 'data-scope',
      desc: 'tabs',
    },
    {
      name: 'data-part',
      desc: 'trigger',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the trigger',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-value',
      desc: 'The value of the item',
    },
    {
      name: 'data-selected',
      desc: 'Present when selected',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'tabs',
    },
    {
      name: 'data-part',
      desc: 'content',
    },
    {
      name: 'data-selected',
      desc: 'Present when selected',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the content',
    },
  ],
  indicator: [
    {
      name: 'data-scope',
      desc: 'tabs',
    },
    {
      name: 'data-part',
      desc: 'indicator',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the indicator',
    },
  ],
}

export const keyboardApi = [
  {
    name: 'Tab',
    desc: 'When focus moves onto the tabs, focuses the active trigger. When a trigger is focused, moves focus to the active content.',
  },
  {
    name: 'ArrowDown',
    desc: 'Moves focus to the next trigger in vertical orientation and activates its associated content.',
  },
  {
    name: 'ArrowRight',
    desc: 'Moves focus to the next trigger in horizontal orientation and activates its associated content.',
  },
  {
    name: 'ArrowUp',
    desc: 'Moves focus to the previous trigger in vertical orientation and activates its associated content.',
  },
  {
    name: 'ArrowLeft',
    desc: 'Moves focus to the previous trigger in horizontal orientation and activates its associated content.',
  },
  {
    name: 'Home',
    desc: 'Moves focus to the first trigger and activates its associated content.',
  },
  {
    name: 'End',
    desc: 'Moves focus to the last trigger and activates its associated content.',
  },
  {
    name: 'Enter + Space',
    desc: 'In manual mode, when a trigger is focused, moves focus to its associated content.',
  },
]
