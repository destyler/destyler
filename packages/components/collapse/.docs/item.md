<Props
  :value="[
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
      description: 'A string value for the accordion item. <br/>All items within an accordion should use a unique value.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether or not an collapse item is disabled from user interaction. When <code>true</code>, prevents the user from interacting with the item.',
    },
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
    {
      name: '[data-orientation]',
      value:`\'vertical\' \| \'horizontal\'`
    }
  ]"
/>
