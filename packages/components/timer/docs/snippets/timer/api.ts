export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; area: string; }>',
    desc: 'The ids of the timer parts'
  },
  {
    name: 'countdown',
    type: 'boolean',
    desc: 'Whether the timer should countdown, decrementing the timer on each tick.'
  },
  {
    name: 'startMs',
    type: 'number',
    desc: 'The total duration of the timer in milliseconds.'
  },
  {
    name: 'targetMs',
    type: 'number',
    desc: 'The minimum count of the timer in milliseconds.'
  },
  {
    name: 'autoStart',
    type: 'boolean',
    desc: 'Whether the timer should start automatically'
  },
  {
    name: 'interval',
    type: 'number',
    desc: 'The interval in milliseconds to update the timer count.'
  },
  {
    name: 'onTick',
    type: '(details: TickDetails) => void',
    desc: 'Function invoked when the timer ticks'
  },
  {
    name: 'onComplete',
    type: '() => void',
    desc: 'Function invoked when the timer is completed'
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
]

export const matchApi = [
  {
    name: 'running',
    type: 'boolean',
    desc: 'Whether the timer is running.'
  },
  {
    name: 'paused',
    type: 'boolean',
    desc: 'Whether the timer is paused.'
  },
  {
    name: 'time',
    type: 'Time<number>',
    desc: 'The formatted timer count value.'
  },
  {
    name: 'formattedTime',
    type: 'Time<string>',
    desc: 'The formatted time parts of the timer count.'
  },
  {
    name: 'start',
    type: '() => void',
    desc: 'Function to start the timer.'
  },
  {
    name: 'pause',
    type: '() => void',
    desc: 'Function to pause the timer.'
  },
  {
    name: 'resume',
    type: '() => void',
    desc: 'Function to resume the timer.'
  },
  {
    name: 'reset',
    type: '() => void',
    desc: 'Function to reset the timer.'
  },
  {
    name: 'restart',
    type: '() => void',
    desc: 'Function to restart the timer.'
  },
  {
    name: 'progressPercent',
    type: 'number',
    desc: 'The progress percentage of the timer.'
  },
]
