<Props
  :value="[
    {
      name: 'dir',
      type: '\'ltr\' \| \'rtl\'',
      default: '-',
      description: 'The reading direction of the combobox when applicable.'
    },
    {
      name: 'modal',
      type: 'boolean',
      default: 'true',
      description: `The modality of the dropdown menu.<br/><br/>When set to <code>true</code>, interaction with outside elements will be disabled and only menu content will be visible to screen readers.`
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
