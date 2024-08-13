<Props
  :value="[
    {
      name: 'as',
      type: 'AsTag \| Component',
      default: 'button',
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
      description: 'When <code>true</code>, hover\/focus\/click interactions will be disabled on elements outside the <code>DismissableLayer</code>. Users will need to click twice on outside elements to interact with them: once to close the <code>DismissableLayer</code>, and again to trigger the element.',
    },
    {
      name: 'side',
      type: '\'top\' \| \'right\' \| \'bottom\' \| \'left\'',
      default: 'bottom',
      description: 'The preferred side of the trigger to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.',
    },
    {
      name: 'sideOffset',
      type: 'number',
      default: '0',
      description: 'The distance in pixels from the trigger.',
    },
    {
      name: 'align',
      type: '\'start\' \| \'center\' \| \'end\'',
      default: 'center',
      description: 'The preferred alignment against the trigger. May change when collisions occur.',
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
      type: 'Element \| (Element \| null)\[\] \| null',
      default: '() => never[]',
      description: 'The element used as the collision boundary. By default this is the viewport, though you can provide additional element(s) to be included in this check.',
    },
    {
      name: 'collisionPadding',
      type: 'number \| Partial\<Record\<\'top\' \| \'right\' \| \'bottom\' \| \'left\', number\>\>',
      default: '0',
      description: 'The distance in pixels from the boundary edges where collision detection should occur. Accepts a number (same for all sides), or a partial padding object, for example: \{ top\: 20, left\: 20 \}.',
    },
    {
      name: 'arrowPadding',
      type: 'number',
      default: '0',
      description: 'The padding between the arrow and the edges of the content. If your content has border-radius, this will prevent it from overflowing the corners.',
    },
    {
      name: 'sticky',
      type: '\'partial\' \| \'always\'',
      default: 'partial',
      description: 'The sticky behavior on the align axis. <code>partial</code> will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst \'always\' will keep the content in the boundary regardless.',
    },
    {
      name: 'hideWhenDetached',
      type: 'boolean',
      default: 'false',
      description: 'Whether to hide the content when the trigger becomes fully occluded.',
    },
    {
      name: 'updatePositionStrategy',
      type: '\'always\' \| \'optimized\'',
      default: 'optimized',
      description: 'Strategy to update the position of the floating element on every animation frame.',
    },
    {
      name: 'prioritizePosition',
      type: 'boolean',
      default: 'false',
      description: 'Force content to be position within the viewport.<br />Might overlap the reference element, which may not be desired.',
    },
    {
      name: 'position',
      type: '\'inline\' \| \'popper\'',
      default: 'inline',
      description: 'The positioning mode to use,inline is the default and you can control the position using CSS.<br />popper positions content in the same way as our other primitives, for example Popover or DropdownMenu.',
    },
    {
      name: 'bodyLock',
      type: 'boolean',
      default: '-',
      description: 'The document.body will be lock, and scrolling will be disabled.',
    },
    {
      name: 'dismissable',
      type: 'boolean',
      default: 'true',
      description: 'Allow component to be dismissableLayer.',
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
      description:'Event handler called when the focus moves outside of the <code>DismissableLayer</code>. Can be prevented.'
    },
    {
      name: 'interactOutside',
      type: '[_event: PointerDownOutsideEvent \| FocusOutsideEvent]',
      description:'Event handler called when an interaction happens outside the <code>DismissableLayer</code>. Specifically, when a <code>pointerdown</code> event happens outside or focus moves outside of it. Can be prevented.'
    }
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' \| \'closed\'`
    },
  ]"
/>

<Variable
  :value="[
    {
      name:'--destyler-combobox-content-transform-origin',
      description:`The <code>transform-origin</code> computed from the content and arrow positions \/ offsets. Only present when <code>position=\'popper\'</code>.`
    },
    {
      name:'--destyler-combobox-content-available-width',
      description:`The remaining width between the trigger and the boundary edge. Only present when <code>position=\'popper\'</code>.`
    },
    {
      name:'--destyler-combobox-content-available-height',
      description:`The remaining height between the trigger and the boundary edge. Only present when <code>position=\'popper\'</code>.`
    },
    {
      name:'--destyler-combobox-trigger-width',
      description:`The width of the trigger. Only present when <code>position=\'popper\'</code>.`
    },
    {
      name:'--destyler-combobox-trigger-height',
      description:`The height of the trigger. Only present when <code>position=\'popper\'</code>.`
    },
  ]"
/>
