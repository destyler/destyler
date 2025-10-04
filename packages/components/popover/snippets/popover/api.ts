export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ anchor: string; trigger: string; content: string; title: string; description: string; closeTrigger: string; positioner: string; arrow: string; }>',
    desc: 'The ids of the elements in the popover. Useful for composition.'
  },
  {
    name: 'modal',
    type: 'boolean',
    desc: 'Whether the popover should be modal. When set to `true`: - interaction with outside elements will be disabled - only popover content will be visible to screen readers - scrolling is blocked - focus is trapped within the popover'
  },
  {
    name: 'portalled',
    type: 'boolean',
    desc: 'Whether the popover is portalled. This will proxy the tabbing behavior regardless of the DOM position of the popover content.'
  },
  {
    name: 'autoFocus',
    type: 'boolean',
    desc: 'Whether to automatically set focus on the first focusable content within the popover when opened.'
  },
  {
    name: 'initialFocusEl',
    type: '() => HTMLElement',
    desc: 'The element to focus on when the popover is opened.'
  },
  {
    name: 'closeOnInteractOutside',
    type: 'boolean',
    desc: 'Whether to close the popover when the user clicks outside of the popover.'
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    desc: 'Whether to close the popover when the escape key is pressed.'
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Function invoked when the popover opens or closes'
  },
  {
    name: 'positioning',
    type: 'PositioningOptions',
    desc: 'The user provided options used to position the popover content'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the popover is open'
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the popover is controlled by the user'
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.'
  },
  {
    name: 'getRootNode',
    type: '() => Node | ShadowRoot | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.'
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.'
  },
  {
    name: 'onEscapeKeyDown',
    type: '(event: KeyboardEvent) => void',
    desc: 'Function called when the escape key is pressed'
  },
  {
    name: 'onPointerDownOutside',
    type: '(event: PointerDownOutsideEvent) => void',
    desc: 'Function called when the pointer is pressed down outside the component'
  },
  {
    name: 'onFocusOutside',
    type: '(event: FocusOutsideEvent) => void',
    desc: 'Function called when the focus is moved outside the component'
  },
  {
    name: 'onInteractOutside',
    type: '(event: InteractOutsideEvent) => void',
    desc: 'Function called when an interaction happens outside the component'
  },
  {
    name: 'persistentElements',
    type: '(() => Element)[]',
    desc: 'Returns the persistent elements that: - should not have pointer-events disabled - should not trigger the dismiss event'
  },
]

export const matchApi = [
  {
    name: 'portalled',
    type: 'boolean',
    desc: 'Whether the popover is portalled.'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the popover is open'
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open or close the popover'
  },
  {
    name: 'reposition',
    type: '(options?: Partial<PositioningOptions>) => void',
    desc: 'Function to reposition the popover'
  },
]

export const keyboardApi = [
  {
    name: 'Space',
    desc: 'Opens/closes the popover.'
  },
  {
    name: 'Enter',
    desc: 'Opens/closes the popover.'
  },
  {
    name: 'Tab',
    desc: 'Moves focus to the next focusable element within the content.\nNote: If there are no focusable elements, focus is moved to the next focusable element after the trigger.'
  },
  {
    name: 'Shift + Tab',
    desc: 'Moves focus to the previous focusable element within the content\nNote: If there are no focusable elements, focus is moved to the trigger.'
  },
  {
    name: 'Esc',
    desc: 'Closes the popover and moves focus to the trigger.'
  },
]

export const styleApi = {
  trigger: [
    {
      name: 'data-scope',
      desc: 'popover'
    },
    {
      name: 'data-part',
      desc: 'trigger'
    },
    {
      name: 'data-placement',
      desc: 'The placement of the trigger'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
  ],
  indicator: [
    {
      name: 'data-scope',
      desc: 'popover'
    },
    {
      name: 'data-part',
      desc: 'indicator'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
  ],
   positioner: [
    {
      name: 'data-scope',
      desc: 'popover'
    },
    {
      name: 'data-part',
      desc: 'positioner'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'popover'
    },
    {
      name: 'data-part',
      desc: 'content'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-expanded',
      desc: 'Present when expanded'
    },
    {
      name: 'data-placement',
      desc: 'The placement of the content'
    },
  ],
  title: [
    {
      name: 'data-scope',
      desc: 'popover'
    },
    {
      name: 'data-part',
      desc: 'content'
    },
  ],
  description: [
    {
      name: 'data-scope',
      desc: 'popover'
    },
    {
      name: 'data-part',
      desc: 'description'
    },
  ],
  closeTrigger: [
    {
      name: 'data-scope',
      desc: 'popover'
    },
    {
      name: 'data-part',
      desc: 'close-trigger'
    },
  ],
}
