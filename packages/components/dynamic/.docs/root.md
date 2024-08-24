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
      type: 'string[]',
      default: '()=>[]',
      description: 'The controlled value of the tags input. Can be bind as <code>v-model</code>.',
    },
    {
      name: 'defaultValue',
      type: 'string[]',
      default: '-',
      description: 'The value of the tags that should be added. Use when you do not need to control the state of the tags input',
    },
    {
      name: 'addOnPaste',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, allow adding tags on paste. Work in conjunction with delimiter prop.',
    },
    {
      name: 'addOnTab',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code> allow adding tags on tab keydown',
    },
    {
      name: 'addOnBlur',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code> allow adding tags blur input',
    },
    {
      name: 'duplicate',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, allow duplicated tags.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, prevents the user from interacting with the tags input.',
    },
    {
      name: 'delimiter',
      type: 'string',
      default: ',',
      description: 'The character to trigger the addition of a new tag. Also used to split tags for <code>@paste</code> event',
    },
    {
      name: 'dir',
      type: 'Direction',
      default: '-',
      description: 'The reading direction of the combobox when applicable.',
    },
    {
      name: 'max',
      type: 'Direction',
      default: '0',
      description: 'Maximum number of tags.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, indicates that the user must add the tags input before the owning form can be submitted.',
    },
    {
      name: 'name',
      type: 'string',
      default: '-',
      description: 'The name of the tags input submitted with its owning form as part of a name/value pair.',
    },
    {
      name: 'id',
      type: 'string',
      default: '-',
      description: 'Id of the element',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'invalid',
      type: '[_invalid: string]',
      description:'Event handler called when the value is invalid'
    },
    {
      name: 'update:modelValue',
      type: '[_value: string[]]',
      description:'Event handler called when the value changes'
    }
  ]"
/>

<Slots
  :value="[
    {
      name: 'modelValue',
      type: 'string[]',
      description: 'Current input values',
    }
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-invalid]',
      value:`Present when disabled`
    },
    {
      name: '[data-disabled]',
      value:`Present when focus on input`
    },
    {
      name: '[data-focused]',
      value:`Present when input value is invalid`
    },
  ]"
/>
