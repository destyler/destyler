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
      name: 'defaultChecked',
      type: 'boolean',
      default: '-',
      description: 'The checked state of the checkbox when it is initially rendered. Use when you do not need to control its checked state.',
    },
    {
      name: 'checked',
      type: 'boolean | \'indeterminate\'',
      default: 'undefined',
      description: 'The checked state of the checkbox when it is initially rendered. Use when you do not need to control its checked state.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, prevents the user from interacting with the checkbox.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: '-',
      description: 'When <code>true</code>, indicates that the user must check the checkbox before the owning form can be submitted.',
    },
    {
      name: 'name',
      type: 'string',
      default: '-',
      description: 'The name of the checkbox. Submitted with its owning form as part of a name/value pair.',
    },
    {
      name: 'value',
      type: 'string',
      default: 'on',
      description: 'The value given as data when submitted with a <code>name</code>.',
    },
    {
      name: 'id',
      type: 'string',
      default: '-',
      description: 'Id of the element',
    }
  ]"
/>

<Event
  :value="[
    {
      name: 'update:checked',
      type: '[_checked: boolean]',
      description:'Event handler called when the checked state of the checkbox changes.'
    }
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'checked\' \| \'unchecked\' \| \'indeterminate\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    }
  ]"
/>
