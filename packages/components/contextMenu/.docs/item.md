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
      name: 'disabled',
      type: 'boolean',
      default: '-',
      description: 'When <code>true</code>, prevents the user from interacting with the item.',
    },
    {
      name: 'textValue',
      type: 'string',
      default: '-',
      description: 'Optional text used for typeahead purposes. By default the typeahead behavior will use the <code>.textContent</code> of the item.<br />Use this when the content is complex, or you have non-textual content inside.',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'select',
      type: '[_event: Event]',
      description:'Event handler called when the user selects an item (via mouse or keyboard).<br />Calling <code>event.preventDefault</code> in this handler will prevent the menu from closing when selecting that item.'
    }
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-highlighted]',
      value:`Present when highlighted`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    },
  ]"
/>
