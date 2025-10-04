export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; content: string; trigger: string; }>',
    desc: 'The ids of the elements in the collapsible. Useful for composition.'
  },
  {
    name: 'onExitComplete',
    type: '() => void',
    desc: 'Function called when the animation ends in the closed state.'
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Function called when the popup is opened'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the collapsible is open'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the collapsible is disabled'
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the collapsible open state is controlled by the user'
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
]

export const matchApi = [
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the collapsible is open.'
  },
  {
    name: 'visible',
    type: 'boolean',
    desc: 'Whether the collapsible is visible (open or closing)'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the collapsible is disabled'
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open or close the collapsible.'
  },
  {
    name: 'measureSize',
    type: '() => void',
    desc: 'Function to measure the size of the content.'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'collapsible'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    }
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'collapsible'
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
      name: 'data-disabled',
      desc: 'Present when disabled'
    }
  ],
  trigger: [
    {
      name: 'data-scope',
      desc: 'collapsible'
    },
    {
      name: 'data-part',
      desc: 'trigger'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    }
  ]
}

export const keyboardApi = [
  {
    name: 'Space',
    desc: 'Opens/closes the collapsible.'
  },
  {
    name: 'Enter',
    desc: 'Opens/closes the collapsible.'
  }
]
