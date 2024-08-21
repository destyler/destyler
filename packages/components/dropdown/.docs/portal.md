<Props
  :value="[
    {
      name: 'to',
      type: 'string | HTMLElement',
      default: 'body',
      description: 'Vue native teleport component prop <code>:to</code>',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable teleport and render the component inline',
    },
    {
      name: 'forceMount',
      type: 'boolean',
      default: 'false',
      description: 'Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries.',
    }
  ]"
/>
