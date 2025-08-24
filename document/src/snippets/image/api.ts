export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; image: string; fallback: string; }>',
    desc: 'The ids of the elements in the avatar. Useful for composition.'
  },
  {
    name: 'onStatusChange',
    type: '(details: StatusChangeDetails) => void',
    desc: 'Functional called when the image loading status changes.'
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
    name: 'loaded',
    type: 'boolean',
    desc: 'Whether the image is loaded.'
  },
  {
    name: 'setSrc',
    type: '(src: string) => void',
    desc: 'Function to set new src.'
  },
  {
    name: 'setLoaded',
    type: '() => void',
    desc: 'Function to set loaded state.'
  },
  {
    name: 'setError',
    type: '() => void',
    desc: 'Function to set error state.'
  },
];

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'image'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
  ],
  image: [
    {
      name: 'data-scope',
      desc: 'image'
    },
    {
      name: 'data-part',
      desc: 'image'
    },
    {
      name: 'data-state',
      desc: '"visible" | "hidden"'
    },
  ],
  fallback: [
    {
      name: 'data-scope',
      desc: 'image'
    },
    {
      name: 'data-part',
      desc: 'fallback'
    },
    {
      name: 'data-state',
      desc: '"hidden" | "visible"'
    },
  ],
};
