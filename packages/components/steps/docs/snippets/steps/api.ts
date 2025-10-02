export const matchContext = [
  {
    name: 'ids',
    type: 'ElementIds',
    desc: 'The custom ids for the stepper elements',
  },
  {
    name: 'step',
    type: 'number',
    desc: 'The current value of the stepper',
  },
  {
    name: 'onStepChange',
    type: '(details: StepChangeDetails) => void',
    desc: 'Callback to be called when the value changes',
  },
  {
    name: 'onStepComplete',
    type: 'VoidFunction',
    desc: 'Callback to be called when a step is completed',
  },
  {
    name: 'linear',
    type: 'boolean',
    desc: 'If `true`, the stepper requires the user to complete the steps in order',
  },
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    desc: 'The orientation of the stepper',
  },
  {
    name: 'count',
    type: 'number',
    desc: 'The total number of steps',
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
    type: 'number',
    desc: 'The value of the stepper.',
  },
  {
    name: 'percent',
    type: 'number',
    desc: 'The percentage of the stepper.',
  },
  {
    name: 'count',
    type: 'number',
    desc: 'The total number of steps.',
  },
  {
    name: 'hasNextStep',
    type: 'boolean',
    desc: 'Whether the stepper has a next step.',
  },
  {
    name: 'hasPrevStep',
    type: 'boolean',
    desc: 'Whether the stepper has a previous step.',
  },
  {
    name: 'isCompleted',
    type: 'boolean',
    desc: 'Whether the stepper is completed.',
  },
  {
    name: 'setStep',
    type: '(step: number) => void',
    desc: 'Function to set the value of the stepper.',
  },
  {
    name: 'goToNextStep',
    type: '() => void',
    desc: 'Function to go to the next step.',
  },
  {
    name: 'goToPrevStep',
    type: '() => void',
    desc: 'Function to go to the previous step.',
  },
  {
    name: 'resetStep',
    type: '() => void',
    desc: 'Function to go to reset the stepper.',
  },
  {
    name: 'getItemState',
    type: '(props: ItemProps) => ItemState',
    desc: 'Returns the state of the item at the given index.',
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'steps',
    },
    {
      name: 'data-part',
      desc: 'root',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the steps',
    },
  ],
  list: [
    {
      name: 'data-scope',
      desc: 'steps',
    },
    {
      name: 'data-part',
      desc: 'list',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the list',
    },
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'steps',
    },
    {
      name: 'data-part',
      desc: 'item',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the item',
    },
  ],
  trigger: [
    {
      name: 'data-scope',
      desc: 'steps',
    },
    {
      name: 'data-part',
      desc: 'trigger',
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the trigger',
    },
    {
      name: 'data-complete',
      desc: 'Present when the trigger value is complete',
    },
    {
      name: 'data-current',
      desc: 'Present when current',
    },
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'steps',
    },
    {
      name: 'data-part',
      desc: 'content',
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the content',
    },
  ],
  indicator: [
    {
      name: 'data-scope',
      desc: 'steps',
    },
    {
      name: 'data-part',
      desc: 'indicator',
    },
    {
      name: 'data-complete',
      desc: 'Present when the indicator value is complete',
    },
    {
      name: 'data-current',
      desc: 'Present when current',
    },
  ],
  separator: [
    {
      name: 'data-scope',
      desc: 'steps',
    },
    {
      name: 'data-part',
      desc: 'separator',
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the separator',
    },
    {
      name: 'data-complete',
      desc: 'Present when the separator value is complete',
    },
    {
      name: 'data-current',
      desc: 'Present when current',
    },
  ],
  progress: [
    {
      name: 'data-scope',
      desc: 'steps',
    },
    {
      name: 'data-part',
      desc: 'progress',
    },
    {
      name: 'data-complete',
      desc: 'Present when the progress value is complete',
    },
  ],
}
