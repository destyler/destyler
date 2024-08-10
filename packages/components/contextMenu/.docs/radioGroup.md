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
      name: 'modelValue',
      type: 'string',
      default: '-',
      description: 'The value of the selected item in the group.',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'update:modelValue',
      type: '[payload: string]',
      description:'Event handler called when the value changes.'
    }
  ]"
/>
