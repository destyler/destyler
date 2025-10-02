export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ trigger: string; content: string; arrow: string; positioner: string; }>',
    desc: 'The ids of the elements in the tooltip. Useful for composition.'
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The `id` of the tooltip.'
  },
  {
    name: 'openDelay',
    type: 'number',
    desc: 'The open delay of the tooltip.'
  },
  {
    name: 'closeDelay',
    type: 'number',
    desc: 'The close delay of the tooltip.'
  },
  {
    name: 'closeOnPointerDown',
    type: 'boolean',
    desc: 'Whether to close the tooltip on pointerdown.'
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    desc: 'Whether to close the tooltip when the Escape key is pressed.'
  },
  {
    name: 'closeOnScroll',
    type: 'boolean',
    desc: 'Whether the tooltip should close on scroll'
  },
  {
    name: 'closeOnClick',
    type: 'boolean',
    desc: 'Whether the tooltip should close on click'
  },
  {
    name: 'interactive',
    type: 'boolean',
    desc: 'Whether the tooltip\'s content is interactive. In this mode, the tooltip will remain open when user hovers over the content.'
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Function called when the tooltip is opened.'
  },
  {
    name: 'aria-label',
    type: 'string',
    desc: 'Custom label for the tooltip.'
  },
  {
    name: 'positioning',
    type: 'PositioningOptions',
    desc: 'The user provided options used to position the popover content'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the tooltip is disabled'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the tooltip is open'
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the tooltip is controlled by the user'
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.'
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.'
  }
]

export const matchApi = [
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the tooltip is open.'
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open the tooltip.'
  },
  {
    name: 'reposition',
    type: '(options?: Partial<PositioningOptions>) => void',
    desc: 'Function to reposition the popover'
  }
]

export const styleApi = {
  trigger: [
    {
      name: 'data-scope',
      desc: 'tooltip'
    },
    {
      name: 'data-part',
      desc: 'trigger'
    },
    {
      name: 'data-expanded',
      desc: 'Present when expanded'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    }
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'tooltip'
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
      name: 'data-placement',
      desc: 'The placement of the content'
    }
  ]
}


export const keyboardApi = [
  {
    name: 'Tab',
    desc: 'Opens or Closes the tooltip without delay.'
  },
  {
    name: 'Escape',
    desc: 'If open, closes the tooltip without delay.'
  }
]
