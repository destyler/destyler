<Props
  :value="[
    {
      name: 'open',
      type: 'boolean',
      default: 'undefined',
      description: 'The controlled open state of the hover card. Can be binded as <code>v-model:open</code>.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      description: 'The open state of the hover card when it is initially rendered. Use when you do not need to control its open state.',
    },
    {
      name: 'openDelay',
      type: 'number',
      default: '700',
      description: 'The duration from when the mouse enters the trigger until the hover card opens.',
    },
    {
      name: 'closeDelay',
      type: 'number',
      default: '300',
      description: 'The duration from when the mouse leaves the trigger or content until the hover card closes.',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'update:open',
      type: '[_value: boolean]',
      description:'Event handler called when the open state of the hover card changes.'
    }
  ]"
/>
