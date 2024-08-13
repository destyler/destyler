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
      type: 'AcceptableValue',
      default: '-',
      description: 'The value given as data when submitted with a <code>name</code>.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: '-',
      description: 'When <code>true</code>, prevents the user from interacting with the item.',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'select',
      type: '[_value: SelectEvent<AcceptableValue>]',
      description:'Event handler called when the selecting item.<br/>It can be prevented by calling <code>event.preventDefault</code>.'
    },
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' \| \'unchecked\'`
    },
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
