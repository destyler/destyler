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
      name: 'disableOutsidePointerEvents',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, hover/focus/click interactions will be disabled on elements outside the <code>DismissableLayer</code>. Users will need to click twice on outside elements to interact with them: once to close the <code>DismissableLayer</code>, and again to trigger the element.',
    },
    {
      name: 'forceMount',
      type: 'boolean',
      default: '-',
      description: 'Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries.',
    },
    {
      name: 'trapFocus',
      type: 'boolean',
      default: 'false',
      description: 'When <code>true</code>, focus cannot escape the <code>Content</code> via keyboard, pointer, or a programmatic focus.',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'escapeKeyDown',
      type: '[_event: KeyboardEvent]',
      description:'Event handler called when the escape key is down. Can be prevented.'
    },
    {
      name: 'pointerDownOutside',
      type: '[_event: PointerDownOutsideEvent]',
      description:'Event handler called when the a <code>pointerdown</code> event happens outside of the <code>DismissableLayer</code>. Can be prevented.'
    },
    {
      name: 'focusOutside',
      type: '[_event: FocusOutsideEvent]',
      description:'Event handler called when the focus moves outside of the DismissableLayer. Can be prevented.'
    },
    {
      name: 'interactOutside',
      type: '[_event: PointerDownOutsideEvent | FocusOutsideEvent]',
      description:'Event handler called when an interaction happens outside the <code>DismissableLayer</code>. Specifically, when a <code>pointerdown</code> event happens outside or focus moves outside of it. Can be prevented.'
    },
    {
      name: 'openAutoFocus',
      type: '[_event: Event]',
      description:'Event handler called when auto-focusing on open. Can be prevented.'
    },
    {
      name: 'closeAutoFocus',
      type: '[_event: Event]',
      description:'Event handler called when auto-focusing on close. Can be prevented.'
    }
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' \| \'close\'`
    },
  ]"
/>
