<Props
  :value="[
    {
      name: 'as',
      type: 'AsTag | Component',
      default: 'div',
      description: 'The element or component this component should render as. <br/>Can be overwrite by <code>asChild</code>',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'Change the default rendered element for the one passed as a child, merging their props and behavior. <br/><br/>Read our Composition guide for more details.',
    },
    {
      name: 'value',
      type: 'string',
      default: '-',
      description: 'Value associated with the tags',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, prevents the user from interacting with the tags input.',
    },
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-disabled]',
      value:`Present when focus on input`
    },
    {
      name: '[data-state]',
      value:`\'active\' | \'inactive\'`
    },
  ]"
/>
