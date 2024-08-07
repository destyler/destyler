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
      name: 'type',
      type: `\'single\' | \'multiple\'`,
      default: '-',
      description: `Determines whether one or multiple items can be opened at the same time.`,
    },
    {
      name: 'modelValue',
      type: `string | string[]`,
      default: 'undefined',
      description: `The controlled value of the active item(s). <br/> Use this when you need to control the state of the items.<br/>Can be binded with <code>v-model</code>`,
    },
    {
      name: 'defaultValue',
      type: `string | string[]`,
      default: 'undefined',
      description: `The default active value of the item(s).<br />Use when you do not need to control the state of the item(s).`,
    },
    {
      name: 'collapsible',
      type: `boolean`,
      default: 'false',
      description: `When type is \'single\', allows closing content when clicking trigger for an open item.`,
    },
    {
      name: 'disabled',
      type: `boolean`,
      default: 'false',
      description: `When <code>true</code>, prevents the user from interacting with the accordion and all its items`,
    },
    {
      name: 'dir',
      type: `\'ltr\' | \'rtl\'`,
      default: 'ltr',
      description: `The reading direction of the accordion when applicable. If omitted, assumes <code>LTR (left-to-right)</code> reading mode.`,
    },
    {
      name: 'orientation',
      type: `\'vertical\' | \'horizontal\'`,
      default: 'vertical',
      description: `The orientation of the accordion.`,
    }
  ]"
/>

<Event
  :value="[
    {
      name: 'update:modelValue',
      type: '[_value: string | string[]]',
      description:'Event handler called when the expanded state of an item changes.'
    }
  ]"
/>

<Slots
  :value="[
    {
      name: 'modelValue',
      description: 'Current active value',
      type: 'string | string[] | undefined'
    }
  ]"
/>
