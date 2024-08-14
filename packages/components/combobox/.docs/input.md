<Props
  :value="[
    {
      name: 'as',
      type: 'AsTag | Component',
      default: 'input',
      description: 'The element or component this component should render as. <br/>Can be overwrite by <code>asChild</code>',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'Change the default rendered element for the one passed as a child, merging their props and behavior. <br/><br/>Read our Composition guide for more details.',
    },
    {
      name: 'type',
      type: 'string',
      default: 'text',
      description: 'Native input type',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: '-',
      description: 'When <code>true</code>, prevents the user from interacting with item',
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      default: '-',
      description: 'Focus on element when mounted.',
    },
  ]"
/>