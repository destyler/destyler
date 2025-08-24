export const matchContext = [
  {
    name: 'collection',
    type: 'TreeCollection<T>',
    desc: 'The tree collection data'
  },
  {
    name: 'ids',
    type: 'Partial<{ root: string; tree: string; label: string; node(value: string): string; }>',
    desc: 'The ids of the tree elements. Useful for composition.'
  },
  {
    name: 'expandedValue',
    type: 'string[]',
    desc: 'The id of the expanded nodes'
  },
  {
    name: 'selectedValue',
    type: 'string[]',
    desc: 'The id of the selected nodes'
  },
  {
    name: 'focusedValue',
    type: 'string',
    desc: 'The id of the focused node'
  },
  {
    name: 'selectionMode',
    type: '"single" | "multiple"',
    desc: 'Whether the tree supports multiple selection - "single": only one node can be selected - "multiple": multiple nodes can be selected'
  },
  {
    name: 'onExpandedChange',
    type: '(details: ExpandedChangeDetails) => void',
    desc: 'Called when the tree is opened or closed'
  },
  {
    name: 'onSelectionChange',
    type: '(details: SelectionChangeDetails) => void',
    desc: 'Called when the selection changes'
  },
  {
    name: 'onFocusChange',
    type: '(details: FocusChangeDetails) => void',
    desc: 'Called when the focused node changes'
  },
  {
    name: 'expandOnClick',
    type: 'boolean',
    desc: 'Whether clicking on a branch should open it or not'
  },
  {
    name: 'typeahead',
    type: 'boolean',
    desc: 'Whether the tree supports typeahead search'
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
    name: 'collection',
    type: 'TreeCollection<V>',
    desc: 'The tree collection data'
  },
  {
    name: 'expandedValue',
    type: 'string[]',
    desc: 'The id of the expanded nodes'
  },
  {
    name: 'setExpandedValue',
    type: '(value: string[]) => void',
    desc: 'Function to set the expanded value'
  },
  {
    name: 'selectedValue',
    type: 'string[]',
    desc: 'The id of the selected nodes'
  },
  {
    name: 'setSelectedValue',
    type: '(value: string[]) => void',
    desc: 'Function to set the selected value'
  },
  {
    name: 'getVisibleNodes',
    type: '() => V[]',
    desc: 'Function to get the visible nodes'
  },
  {
    name: 'expand',
    type: '(value?: string[]) => void',
    desc: 'Function to expand nodes. If no value is provided, all nodes will be expanded'
  },
  {
    name: 'collapse',
    type: '(value?: string[]) => void',
    desc: 'Function to collapse nodes If no value is provided, all nodes will be collapsed'
  },
  {
    name: 'select',
    type: '(value?: string[]) => void',
    desc: 'Function to select nodes If no value is provided, all nodes will be selected'
  },
  {
    name: 'deselect',
    type: '(value?: string[]) => void',
    desc: 'Function to deselect nodes If no value is provided, all nodes will be deselected'
  },
  {
    name: 'focus',
    type: '(value: string) => void',
    desc: 'Function to focus an item node'
  },
  {
    name: 'selectParent',
    type: '(value: string) => void',
    desc: 'Function to select the parent node of the focused node'
  },
  {
    name: 'expandParent',
    type: '(value: string) => void',
    desc: 'Function to expand the parent node of the focused node'
  },
]

export const styleApi = {
  item: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'item'
    },
    {
      name: 'data-path',
      desc: 'The path of the item'
    },
    {
      name: 'data-value',
      desc: 'The value of the item'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-selected',
      desc: 'Present when selected'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-depth',
      desc: 'The depth of the item'
    }
  ],
  itemText: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'item-text'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-selected',
      desc: 'Present when selected'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    }
  ],
  itemIndicator: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'item-indicator'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-selected',
      desc: 'Present when selected'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    }
  ],
  branch: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'branch'
    },
    {
      name: 'data-depth',
      desc: 'The depth of the item'
    },
    {
      name: 'data-value',
      desc: 'The value of the item'
    },
    {
      name: 'data-path',
      desc: 'The path of the item'
    },
    {
      name: 'data-selected',
      desc: 'Present when selected'
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
  branchIndicator: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'branch-indicator'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-selected',
      desc: 'Present when selected'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    }
  ],
  branchTrigger: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'branch-trigger'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-value',
      desc: 'The value of the item'
    }
  ],
  branchControl: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'branch-control'
    },
    {
      name: 'data-path',
      desc: 'The path of the item'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-selected',
      desc: 'Present when selected'
    },
    {
      name: 'data-focus',
      desc: 'Present when focused'
    },
    {
      name: 'data-value',
      desc: 'The value of the item'
    },
    {
      name: 'data-depth',
      desc: 'The depth of the item'
    }
  ],
  branchText: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'branch-text'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    }
  ],
  branchContent: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'branch-content'
    },
    {
      name: 'data-state',
      desc: '"open" | "closed"'
    },
    {
      name: 'data-depth',
      desc: 'The depth of the item'
    },
    {
      name: 'data-path',
      desc: 'The path of the item'
    },
    {
      name: 'data-value',
      desc: 'The value of the item'
    }
  ],
  branchIndentGuide: [
    {
      name: 'data-scope',
      desc: 'tree-view'
    },
    {
      name: 'data-part',
      desc: 'branch-indent-guide'
    },
    {
      name: 'data-depth',
      desc: 'The depth of the item'
    }
  ]
}

export const keyboardApi = [
  {
    name: 'Tab',
    desc: 'Moves focus to the tree view, placing the first tree view item in focus.'
  },
  {
    name: 'Enter',
    desc: 'Selects the item or branch node'
  },
  {
    name: 'Space',
    desc: 'Selects the item or branch node'
  },
  {
    name: 'ArrowDown',
    desc: 'Moves focus to the next node'
  },
  {
    name: 'ArrowUp',
    desc: 'Moves focus to the previous node'
  },
  {
    name: 'ArrowRight',
    desc: 'When focus is on a closed branch node, opens the branch. When focus is on an open branch node, moves focus to the first item node.'
  },
  {
    name: 'ArrowLeft',
    desc: 'When focus is on an open branch node, closes the node. When focus is on an item or branch node, moves focus to its parent branch node.'
  },
  {
    name: 'Home',
    desc: 'Moves focus to first node without opening or closing a node.'
  },
  {
    name: 'End',
    desc: 'Moves focus to the last node that can be focused without expanding any nodes that are closed.'
  },
  {
    name: 'a-z, A-Z',
    desc: 'Focus moves to the next node with a name that starts with the typed character. The search logic ignores nodes that are descendants of closed branch.'
  },
  {
    name: '*',
    desc: 'Expands all sibling nodes that are at the same depth as the focused node.'
  },
  {
    name: 'Shift + ArrowDown',
    desc: 'Moves focus to and toggles the selection state of the next node.'
  },
  {
    name: 'Shift + ArrowUp',
    desc: 'Moves focus to and toggles the selection state of the previous node.'
  },
  {
    name: 'Ctrl + A',
    desc: 'Selects all nodes in the tree. If all nodes are selected, unselects all nodes.'
  }
]
