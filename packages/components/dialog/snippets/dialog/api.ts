export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ trigger: string; positioner: string; backdrop: string; content: string; closeTrigger: string; title: string; description: string; }>',
    desc: 'The ids of the elements in the dialog. Useful for composition.'
  },
  {
    name: 'trapFocus',
    type: 'boolean',
    desc: 'Whether to trap focus inside the dialog when it\'s opened'
  },
  {
    name: 'preventScroll',
    type: 'boolean',
    desc: 'Whether to prevent scrolling behind the dialog when it\'s opened'
  },
  {
    name: 'modal',
    type: 'boolean',
    desc: 'Whether to prevent pointer interaction outside the element and hide all content below it'
  },
  {
    name: 'initialFocusEl',
    type: '() => HTMLElement',
    desc: 'Element to receive focus when the dialog is opened'
  },
  {
    name: 'finalFocusEl',
    type: '() => HTMLElement',
    desc: 'Element to receive focus when the dialog is closed'
  },
  {
    name: 'restoreFocus',
    type: 'boolean',
    desc: 'Whether to restore focus to the element that had focus before the dialog was opened'
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Callback to be invoked when the dialog is opened or closed'
  },
  {
    name: 'closeOnInteractOutside',
    type: 'boolean',
    desc: 'Whether to close the dialog when the outside is clicked'
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    desc: 'Whether to close the dialog when the escape key is pressed'
  },
  {
    name: 'aria-label',
    type: 'string',
    desc: 'Human readable label for the dialog, in event the dialog title is not rendered'
  },
  {
    name: 'role',
    type: '"dialog" | "alertdialog"',
    desc: 'The dialog\'s role'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the dialog is open'
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the dialog is controlled by the user'
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.'
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
    name: 'open',
    type: 'boolean',
    desc: 'Whether the dialog is open'
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open or close the dialog'
  },
]

export const styleApi = {
  trigger: [
    {
      name: 'data-scope',
      desc: 'dialog'
    },
    {
      name: 'data-part',
      desc: 'trigger'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
  ],
  backdrop: [
    {
      name: 'data-scope',
      desc: 'dialog'
    },
    {
      name: 'data-part',
      desc: 'backdrop'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'dialog'
    },
    {
      name: 'data-part',
      desc: 'content'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
  ],
}

export const keyboardApi = [
  {
    name: 'Enter',
    desc: 'When focus is on the trigger, opens the dialog.'
  },
  {
    name: 'Tab',
    desc: 'Moves focus to the next focusable element within the content. Focus is trapped within the dialog.'
  },
  {
    name: 'Shift + Tab',
    desc: 'Moves focus to the previous focusable element. Focus is trapped within the dialog.'
  },
  {
    name: 'Esc',
    desc: 'Closes the dialog and moves focus to trigger or the defined final focus element'
  },
]
