<Props
  :value="[
    {
      name: 'open',
      type: 'boolean',
      default: 'undefined',
      description: 'The controlled open state of the dialog. Can be binded as <code>v-model:open</code>.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.',
    },
    {
      name: 'modal',
      type: 'boolean',
      default: 'true',
      description: 'The modality of the dialog When set to <code>true</code>,interaction with outside elements will be disabled and only dialog content will be visible to screen readers.',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'update:open',
      type: '[_open: boolean]',
      description:'Event handler called when the open state of the submenu changes.'
    }
  ]"
/>
