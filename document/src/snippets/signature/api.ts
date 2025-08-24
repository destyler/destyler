export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; control: string; hiddenInput: string; label: string; }>',
    desc: 'The ids of the signature elements. Useful for composition.'
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'The translations of the signature. Useful for internationalization.'
  },
  {
    name: 'onDraw',
    type: '(details: DrawDetails) => void',
    desc: 'Callback when the signature is drawing.'
  },
  {
    name: 'onDrawEnd',
    type: '(details: DrawEndDetails) => void',
    desc: 'Callback when the signature is done drawing.'
  },
  {
    name: 'drawing',
    type: 'DrawingOptions',
    desc: 'The drawing options.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the signature is disabled.'
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the signature is required.'
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the signature is read-only.'
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name of the signature. Useful for form submission.'
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
    name: 'empty',
    type: 'boolean',
    desc: 'Whether the signature is empty.'
  },
  {
    name: 'drawing',
    type: 'boolean',
    desc: 'Whether the user is currently drawing.'
  },
  {
    name: 'currentPath',
    type: 'string',
    desc: 'The current path being drawn.'
  },
  {
    name: 'paths',
    type: 'string[]',
    desc: 'The paths of the signature.'
  },
  {
    name: 'getDataUrl',
    type: '(type: DataUrlType, quality?: number) => Promise<string>',
    desc: 'Returns the data URL of the signature.'
  },
  {
    name: 'clear',
    type: '() => void',
    desc: 'Clears the signature.'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'signature'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  label: [
    {
      name: 'data-scope',
      desc: 'signature'
    },
    {
      name: 'data-part',
      desc: 'label'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  control: [
    {
      name: 'data-scope',
      desc: 'signature'
    },
    {
      name: 'data-part',
      desc: 'control'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  guide: [
    {
      name: 'data-scope',
      desc: 'signature'
    },
    {
      name: 'data-part',
      desc: 'guide'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ]
}
