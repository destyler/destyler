export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; }>',
    desc: 'The ids of the elements in the separator. Useful for composition.',
  },
  {
    name: 'orientation',
    type: '"vertical" | "horizontal"',
    desc: 'The orientation of the separator',
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.',
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.',
  },
]

export const matchApi = [
  {
    name: 'isVertical',
    type: 'boolean',
    desc: 'Whether the separator is vertical',
  },
]

export const styleApi = {
  root: [
    { name: 'data-scope', desc: 'separator' },
    { name: 'data-part', desc: 'root' },
    { name: 'data-orientation', desc: 'The orientation of the separator' },
  ],
}
