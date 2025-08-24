export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ trigger: string; contextTrigger: string; content: string; groupLabel(id: string): string; group(id: string): string; positioner: string; arrow: string; }>',
    desc: 'The ids of the elements in the menu. Useful for composition.'
  },
  {
    name: 'highlightedValue',
    type: 'string',
    desc: 'The value of the highlighted menu item.'
  },
  {
    name: 'onHighlightChange',
    type: '(details: HighlightChangeDetails) => void',
    desc: 'Function called when the highlighted menu item changes.'
  },
  {
    name: 'onSelect',
    type: '(details: SelectionDetails) => void',
    desc: 'Function called when a menu item is selected.'
  },
  {
    name: 'anchorPoint',
    type: 'Point',
    desc: 'The positioning point for the menu. Can be set by the context menu trigger or the button trigger.'
  },
  {
    name: 'loopFocus',
    type: 'boolean',
    desc: 'Whether to loop the keyboard navigation.'
  },
  {
    name: 'positioning',
    type: 'PositioningOptions',
    desc: 'The options used to dynamically position the menu'
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    desc: 'Whether to close the menu when an option is selected'
  },
  {
    name: 'aria-label',
    type: 'string',
    desc: 'The accessibility label for the menu'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the menu is open'
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Function called when the menu opens or closes'
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the menu\'s open state is controlled by the user'
  },
  {
    name: 'typeahead',
    type: 'boolean',
    desc: 'Whether the pressing printable characters should trigger typeahead navigation'
  },
  {
    name: 'composite',
    type: 'boolean',
    desc: 'Whether the menu is a composed with other composite widgets like a combobox or tabs'
  },
  {
    name: 'navigate',
    type: '(details: NavigateDetails) => void',
    desc: 'Function to navigate to the selected item if it\'s an anchor element'
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
]

export const matchApi = [
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the menu is open'
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open or close the menu'
  },
  {
    name: 'highlightedValue',
    type: 'string',
    desc: 'The id of the currently highlighted menuitem'
  },
  {
    name: 'setHighlightedValue',
    type: '(value: string) => void',
    desc: 'Function to set the highlighted menuitem'
  },
  {
    name: 'setParent',
    type: '(parent: Service) => void',
    desc: 'Function to register a parent menu. This is used for submenus'
  },
  {
    name: 'setChild',
    type: '(child: Service) => void',
    desc: 'Function to register a child menu. This is used for submenus'
  },
  {
    name: 'reposition',
    type: '(options?: Partial<PositioningOptions>) => void',
    desc: 'Function to reposition the popover'
  },
  {
    name: 'getOptionItemState',
    type: '(props: OptionItemProps) => OptionItemState',
    desc: 'Returns the state of the option item'
  },
  {
    name: 'getItemState',
    type: '(props: ItemProps) => ItemState',
    desc: 'Returns the state of the menu item'
  },
]

export const styleApi = {
  trigger: [
    {
      name: 'data-scope',
      desc: 'menu'
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
      desc: 'menu'
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
  content: [
    {
      name: 'data-scope',
      desc: 'menu'
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
  item: [
    {
      name: 'data-scope',
      desc: 'menu'
    },
    {
      name: 'data-part',
      desc: 'item'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-highlighted',
      desc: 'Present when highlighted'
    },
    {
      name: 'data-valuetext',
      desc: 'The human-readable value'
    },
  ],
  optionItem: [
    {
      name: 'data-scope',
      desc: 'menu'
    },
    {
      name: 'data-part',
      desc: 'option-item'
    },
    {
      name: 'data-type',
      desc: 'The type of the item'
    },
    {
      name: 'data-value',
      desc: 'The value of the item'
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-highlighted',
      desc: 'Present when highlighted'
    },
    {
      name: 'data-valuetext',
      desc: 'The human-readable value'
    },
  ],
  itemIndicator: [
    {
      name: 'data-scope',
      desc: 'menu'
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
      name: 'data-highlighted',
      desc: 'Present when highlighted'
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"'
    },
  ],
  itemText: [
    {
      name: 'data-scope',
      desc: 'menu'
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
      name: 'data-highlighted',
      desc: 'Present when highlighted'
    },
    {
      name: 'data-state',
      desc: '"checked" | "unchecked"'
    },
  ],
}

export const keyboardApi = [
  {
    name: 'Space',
    desc: 'Activates/Selects the highlighted item'
  },
  {
    name: 'Enter',
    desc: 'Activates/Selects the highlighted item'
  },
  {
    name: 'ArrowDown',
    desc: 'Highlights the next item in the menu'
  },
  {
    name: 'ArrowUp',
    desc: 'Highlights the previous item in the menu'
  },
  {
    name: 'ArrowRight/ArrowLeft',
    desc: 'When focus is on trigger, opens or closes the submenu depending on reading direction.'
  },
  {
    name: 'Esc',
    desc: 'Closes the menu and moves focus to the trigger'
  }
]
