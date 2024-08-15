<Props
  :value="[
    {
      name: 'as',
      type: 'AsTag | Component',
      default: 'template',
      description: 'The element or component this component should render as. <br/>Can be overwrite by <code>asChild</code>',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'Change the default rendered element for the one passed as a child, merging their props and behavior. <br/><br/>Read our Composition guide for more details.',
    },
    {
      name: 'duration',
      type: 'number',
      default: '0',
      description: 'The duration of the countdown (unit is millisecond). Not reactive.',
    },
    {
      name: 'active',
      type: 'boolean',
      default: '-',
      description: 'Whether countdown is active.',
    },
    {
      name: 'precision',
      type: '0 \| 1 \| 2 \| 3',
      default: '0',
      description: 'The precision of the second.',
    },
    {
      name: 'render',
      type: '(props: CountdownTimeInfo) => VNodeChild',
      default: '-',
      description: 'Time\'s render function',
    },
    {
      name: 'onFinish',
      type: '() => void',
      default: '-',
      description: 'The callback on countdown is finished.',
    },
  ]"
/>
