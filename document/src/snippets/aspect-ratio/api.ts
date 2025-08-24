export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; content: string; }>',
    desc: 'The ids of the elements in the aspect ratio. Useful for composition.'
  },
  {
    name: 'ratio',
    type: 'number',
    desc: 'The aspect ratio of the container. Eg: 16 / 9'
  },
];

export const matchApi = [
  {
    name: 'setRatio',
    type: '(ratio: number) => void',
    desc: 'Function to set the aspect ratio'
  },
];

export const styleApi = {
  root:[
    {
      name: 'data-scope',
      desc: 'aspect-ratio'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
  ],
  content: [
    {
      name: 'data-scope',
      desc: 'aspect-ratio'
    },
    {
      name: 'data-part',
      desc: 'content'
    },
  ],
}
