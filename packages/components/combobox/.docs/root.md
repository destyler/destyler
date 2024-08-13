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
      type: 'AcceptableValue | AcceptableValue[]',
      default: 'undefined',
      description: 'The controlled value of the Combobox. Can be binded-with with <code>v-model</code>.',
    },
    {
      name: 'defaultValue',
      type: 'AcceptableValue | AcceptableValue[]',
      default: 'undefined',
      description: 'The value of the combobox when initially rendered. Use when you do not need to control the state of the Combobox.',
    },
    {
      name: 'open',
      type: 'boolean',
      default: 'undefined',
      description: 'The controlled open state of the Combobox. Can be binded-with with <code>v-model:open</code>.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: '-',
      description: 'The open state of the combobox when it is initially rendered.<br/>Use when you do not need to control its open state.',
    },
    {
      name: 'searchTerm',
      type: 'string',
      default: '-',
      description: 'The controlled search term of the Combobox. Can be binded-with with <code>v-model:searchTerm.</code>',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Whether multiple options can be selected or not.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, prevents the user from interacting with Combobox',
    },
    {
      name: 'name',
      type: 'string',
      default: '-',
      description: 'The name of the Combobox. Submitted with its owning form as part of a name/value pair.',
    },
    {
      name: 'dir',
      type: 'Direction',
      default: '-',
      description: 'The reading direction of the combobox when applicable.',
    },
    {
      name: 'filterFunction',
      type: '(val: ArrayOrWrapped<AcceptableValue>, term: string) => ArrayOrWrapped<AcceptableValue>',
      default: '-',
      description: 'The custom filter function for filtering <code>ComboboxItem</code>.',
    },
    {
      name: 'displayValue',
      type: '(val: AcceptableValue) => string',
      default: '-',
      description: 'The display value of input for selected item. Does not work with <code>multiple</code>.',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'update:modelValue',
      type: '[_value: AcceptableValue]',
      description:'Event handler called when the value changes.'
    },
    {
      name: 'update:open',
      type: '[_value: boolean]',
      description:'Event handler called when the open state of the combobox changes.'
    },
    {
      name: 'update:searchTerm',
      type: '[_value: string]',
      description:'Event handler called when the searchTerm of the combobox changes.'
    }
  ]"
/>

<Slots
  :value="[
    {
      name: 'open',
      description: 'Current open state',
      type: 'boolean'
    },
    {
      name: 'modelValue',
      description: 'Current active value',
      type: 'AcceptableValue'
    }
  ]"
/>
