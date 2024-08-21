<Props
  :value="[
    {
      name: 'dir',
      type: 'Direction',
      default: '-',
      description: 'The reading direction of the combobox when applicable.',
    },
    {
      name: 'modal',
      type: 'boolean',
      default: 'true',
      description: 'The modality of the dropdown menu.<br />When set to <code>true</code>, interaction with outside elements will be disabled and only menu content will be visible to screen readers.',
    },
    {
      name: 'open',
      type: 'boolean',
      default: 'undefined',
      description: 'The controlled open state of the menu. Can be used as <code>v-model:open</code>.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'undefined',
      description: 'The open state of the dropdown menu when it is initially rendered. Use when you do not need to control its open state.',
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
