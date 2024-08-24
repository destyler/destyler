<Props
  :value="[
    {
      name: 'as',
      type: 'AsTag | Component',
      default: 'span',
      description: 'The element or component this component should render as. <br/>Can be overwrite by <code>asChild</code>',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'Change the default rendered element for the one passed as a child, merging their props and behavior. <br/><br/>Read our Composition guide for more details.',
    },
  ]"
/>

<Slots
  :value="[
    {
      name: 'text',
      type: 'string',
      description: 'item text',
    }
  ]"
/>
