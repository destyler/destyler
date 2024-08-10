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
      name: 'alignOffset',
      type: 'number',
      default: '0',
      description: 'An offset in pixels from the <code>start</code> or <code>end</code> alignment options.',
    },
    {
      name: 'avoidCollisions',
      type: 'boolean',
      default: 'true',
      description: 'When <code>true</code>, overrides the side andalign preferences to prevent collisions with boundary edges.',
    },
    {
      name: 'collisionBoundary',
      type: `Element \| \(Element \| null\)\[\] \| null`,
      default: '\(\)\=\>\[\]',
      description: 'The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check.',
    },
    {
      name: 'collisionPadding',
      type: `number \| Partial\<Record\<\'left\' \| \'right\' \| \'top\' \| \'bottom\', number\>\>`,
      default: '0',
      description: 'The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: <code>\{ top\: 20, left\: 20 \}</code>.',
    },
    {
      name: 'sticky',
      type: `\'partial\' \| \'always\'`,
      default: 'partial',
      description: `The sticky behavior on the align axis. <code>partial</code> will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst \'always\' will keep the content in the boundary regardless.`,
    },
    {
      name: 'hideWhenDetached',
      type: 'boolean',
      default: 'false',
      description: 'Whether to hide the content when the trigger becomes fully occluded.',
    },
    {
      name: 'prioritizePosition',
      type: 'boolean',
      default: 'false',
      description: 'Force content to be position within the viewport.<br/><br/>Might overlap the reference element, which may not be desired.',
    },
    {
      name: 'loop',
      type: 'boolean',
      default: '-',
      description: 'When <code>true</code>, keyboard navigation will loop from last item to first, and vice versa.',
    },
    {
      name: 'forceMount',
      type: 'boolean',
      default: '-',
      description: 'Used to force mounting when more control is needed. Useful when controlling animation with Vue animation libraries.',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'closeAutoFocus',
      type: '[_event: Event]',
      description:'Event handler called when auto-focusing on close. Can be prevented.'
    },
    {
      name: 'escapeKeyDown',
      type: '[_event: KeyboardEvent]',
      description:'Event handler called when the escape key is down. Can be prevented.'
    },
    {
      name: 'pointerDownOutside',
      type: '[_event: CustomEvent\<\{originalEvent\: PointerEvent\}\>]',
      description:'Event handler called when the a <code>pointerdown</code> event happens outside of the <code>DismissableLayer</code>. Can be prevented.'
    },
    {
      name: 'focusOutside',
      type: '[_event: CustomEvent\<\{originalEvent\: FocusEvent\;\}\>]',
      description:'Event handler called when the focus moves outside of the <code>DismissableLayer</code>. Can be prevented.'
    },
    {
      name: 'interactOutside',
      type: `[_event: CustomEvent\<\{originalEvent\: PointerEvent\;\}\> | CustomEvent\<\{originalEvent\: FocusEvent\;\}\>]`,
      description:'Event handler called when the a <code>pointerdown</code> event happens outside of the <code>DismissableLayer</code>. Can be prevented.'
    },
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' \| \'close\'`
    },
    {
      name: '[data-side]',
      value:`\'left\' \| \'right\' \| \'bottom\' \| \'top\'`
    },
    {
      name: '[data-align]',
      value:`\'start\' \| \'end\' \| \'center\'`
    },
  ]"
/>

<Variable
  :value="[
    {
      name:'--destyler-context-menu-content-transform-origin',
      description:`The <code>transform-origin</code> computed from the content and arrow positions/offsets`
    },
    {
      name:'--destyler-context-menu-content-available-width',
      description:`The remaining width between the trigger and the boundary edge`
    },
    {
      name:'--destyler-context-menu-content-available-height',
      description:`The remaining height between the trigger and the boundary edge`
    },
    {
      name:'--destyler-context-menu-trigger-width',
      description:`The width of the trigger`
    },
    {
      name:'--destyler-context-menu-trigger-height',
      description:`The height of the trigger`
    },
  ]"
/>
