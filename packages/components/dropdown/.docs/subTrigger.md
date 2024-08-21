<Props
  :value="[
    {
      name: 'as',
      type: 'AsTag | Component',
      default: 'button',
      description: 'The element or component this component should render as. <br/>Can be overwrite by <code>asChild</code>',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'Change the default rendered element for the one passed as a child, merging their props and behavior. <br/><br/>Read our Composition guide for more details.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: '-',
      description: 'When <code>true</code>, prevents the user from interacting with item',
    },
    {
      name: 'textValue',
      type: 'string',
      default: '-',
      description: 'Optional text used for typeahead purposes. By default the typeahead behavior will use the <code>.textContent</code> of the item.<br/>Use this when the content is complex, or you have non-textual content inside.',
    },
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-highlighted]',
      value: `Present when highlighted`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>
