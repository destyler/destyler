export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; resizeTrigger: (id: string) => string; label: (id: string) => string; panel: (id: string | number) => string; }>',
    desc: 'The ids of the elements in the splitter. Useful for composition.',
  },
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    desc: 'The orientation of the splitter. Can be `horizontal` or `vertical`',
  },
  {
    name: 'size',
    type: 'PanelSizeData[]',
    desc: 'The size data of the panels',
  },
  {
    name: 'onSizeChange',
    type: '(details: SizeChangeDetails) => void',
    desc: 'Function called when the splitter is resized.',
  },
  {
    name: 'onSizeChangeEnd',
    type: '(details: SizeChangeDetails) => void',
    desc: 'Function called when the splitter resize ends.',
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.',
  },
]

export const matchApi = [
  {
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the splitter is focused.',
  },
  {
    name: 'dragging',
    type: 'boolean',
    desc: 'Whether the splitter is being dragged.',
  },
  {
    name: 'bounds',
    type: 'PanelBounds | undefined',
    desc: 'The bounds of the currently dragged splitter handle.',
  },
  {
    name: 'setToMinSize',
    type: '(id: PanelId) => void',
    desc: 'Function to set a panel to its minimum size.',
  },
  {
    name: 'setToMaxSize',
    type: '(id: PanelId) => void',
    desc: 'Function to set a panel to its maximum size.',
  },
  {
    name: 'setSize',
    type: '(id: PanelId, size: number) => void',
    desc: 'Function to set the size of a panel.',
  },
]

export const styleApi = {
  root: [
    { name: 'data-scope', desc: 'splitter' },
    { name: 'data-part', desc: 'root' },
    { name: 'data-orientation', desc: 'The orientation of the slider' },
  ],
  panel: [
    { name: 'data-scope', desc: 'splitter' },
    { name: 'data-part', desc: 'panel' },
    { name: 'data-orientation', desc: 'The orientation of the slider' },
  ],
  resizeTrigger: [
    { name: 'data-scope', desc: 'splitter' },
    { name: 'data-part', desc: 'resize-trigger' },
    { name: 'data-orientation', desc: 'The orientation of the slider' },
  ],
}
