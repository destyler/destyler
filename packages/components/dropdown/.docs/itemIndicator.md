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
      name: 'forceMount',
      type: 'boolean',
      default: '-',
      description: 'Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries.',
    },
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' | \'unchecked\' | \'indeterminate\'`
    },
  ]"
/>
