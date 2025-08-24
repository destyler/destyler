export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; }>',
    desc: 'The ids of the elements in the label. Useful for composition.',
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.',
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments.',
  },
]

export const matchApi = [
  {
    name: 'isHovered',
    type: 'boolean',
    desc: 'Whether the label is hover',
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'label',
    },
    {
      name: 'data-part',
      desc: 'root',
    },
  ],
}
