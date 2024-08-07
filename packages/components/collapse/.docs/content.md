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
    }
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' \| \'close\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
    {
      name: '[data-orientation]',
      value:`\'vertical\' \| \'horizontal\'`
    }
  ]"
/>

<Variable
  :value="[
    {
      name: '--destyler-collapse-content-width',
      description:`The width of the content when it opens/closes`
    },
    {
      name: '--destyler-collapse-content-height',
      description:`The height of the content when it opens/closes`
    },
  ]"
/>
