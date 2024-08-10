<Props
  :value="[
    {
      name: 'open',
      type: 'boolean',
      default: 'undefined',
      description: 'The controlled open state of the menu. Can be used as <code>v-model:open</code>.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: '-',
      description: 'The open state of the submenu when it is initially rendered. <br/>Use when you do not need to control its open state.',
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

<Slots
  :value="[
    {
      name: 'open',
      description: 'Current open state',
      type: 'boolean'
    }
  ]"
/>
