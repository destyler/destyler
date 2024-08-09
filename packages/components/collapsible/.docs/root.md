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
      name: 'defaultOpen',
      type: `boolean`,
      default: 'false',
      description: `The open state of the collapsible when it is initially rendered.
      Use when you do not need to control its open state.`,
    },
    {
      name: 'open',
      type: `boolean`,
      default: 'undefined',
      description: `The controlled open state of the collapsible. Can be binded with  <code>v-model</code>.`,
    },
    {
      name: 'disabled',
      type: `boolean`,
      default: '-',
      description: `When <code>true</code>, prevents the user from interacting with the collapsible.`,
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'update:open',
      type: '[_value: boolean]',
      description:'Event handler called when the open state of the collapsible changes.'
    }
  ]"
/>

<Slots
  :value="[
    {
      name: 'open',
      description: 'Current open state',
      type: 'boolean'
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
  ]"
/>
