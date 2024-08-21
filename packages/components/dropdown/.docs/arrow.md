<Props
  :value="[
    {
      name: 'as',
      type: 'AsTag | Component',
      default: 'svg',
      description: 'The element or component this component should render as. <br/>Can be overwrite by <code>asChild</code>',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'Change the default rendered element for the one passed as a child, merging their props and behavior. <br/><br/>Read our Composition guide for more details.',
    },
    {
      name: 'height',
      type: 'number',
      default: '5',
      description: 'The height of the arrow in pixels.',
    },
    {
      name: 'width',
      type: 'number',
      default: '10',
      description: 'The width of the arrow in pixels.',
    },
  ]"
/>
