export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ trigger: string; content: string; positioner: string; arrow: string; }>',
    desc: 'The ids of the elements in the popover. Useful for composition.'
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Function called when the hover card opens or closes.'
  },
  {
    name: 'openDelay',
    type: 'number',
    desc: 'The duration from when the mouse enters the trigger until the hover card opens.'
  },
  {
    name: 'closeDelay',
    type: 'number',
    desc: 'The duration from when the mouse leaves the trigger or content until the hover card closes.'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the hover card is open'
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the hover card is controlled by the user'
  },
  {
    name: 'positioning',
    type: 'PositioningOptions',
    desc: 'The user provided options used to position the popover content'
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
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.'
  },
];

export const matchApi = [
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the hover card is open'
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open the hover card'
  },
  {
    name: 'reposition',
    type: '(options?: Partial<PositioningOptions>) => void',
    desc: 'Function to reposition the popover'
  },
];


export const styleApi = {
  trigger:[
    {
      name: 'data-scope',
      desc: 'hover-card'
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
  content: [
    {
      name: 'data-scope',
      desc: 'hover-card'
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
    },
  ],
  arrow:[
    {
      name: 'data-scope',
      desc: 'hover-card'
    },
    {
      name: 'data-part',
      desc: 'arrow-tip'
    },
  ],
}
