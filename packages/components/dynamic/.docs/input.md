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
      name: 'placeholder',
      type: 'string',
      default: '-',
      description: 'The placeholder character to use for empty tags input.',
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      default: '-',
      description: 'Focus on element when mounted.',
    },
    {
      name: 'maxLength',
      type: 'number',
      default: '-',
      description: 'Maximum number of character allowed.',
    },
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-invalid]',
      value:`Present when disabled`
    },
  ]"
/>
