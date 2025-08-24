export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; input: string; label: string; }>',
    desc: 'The ids of the elements in the clipboard. Useful for composition.'
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The value to be copied to the clipboard'
  },
  {
    name: 'onStatusChange',
    type: '(details: CopyStatusDetails) => void',
    desc: 'The function to be called when the value is copied to the clipboard'
  },
  {
    name: 'timeout',
    type: 'number',
    desc: 'The timeout for the copy operation'
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
    name: 'copied',
    type: 'boolean',
    desc: 'Whether the value has been copied to the clipboard'
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The value to be copied to the clipboard'
  },
  {
    name: 'setValue',
    type: '(value: string) => void',
    desc: 'Set the value to be copied to the clipboard'
  },
  {
    name: 'copy',
    type: '() => void',
    desc: 'Copy the value to the clipboard'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'clipboard'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
    {
      name: 'data-copied',
      desc: 'Present when copied state is true'
    }
  ],
  label: [
    {
      name: 'data-scope',
      desc: 'clipboard'
    },
    {
      name: 'data-part',
      desc: 'label'
    },
    {
      name: 'data-copied',
      desc: 'Present when copied state is true'
    }
  ],
  control: [
    {
      name: 'data-scope',
      desc: 'clipboard'
    },
    {
      name: 'data-part',
      desc: 'control'
    },
    {
      name: 'data-copied',
      desc: 'Present when copied state is true'
    }
  ],
  input: [
    {
      name: 'data-scope',
      desc: 'clipboard'
    },
    {
      name: 'data-part',
      desc: 'input'
    },
    {
      name: 'data-copied',
      desc: 'Present when copied state is true'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    }
  ],
  trigger: [
    {
      name: 'data-scope',
      desc: 'clipboard'
    },
    {
      name: 'data-part',
      desc: 'trigger'
    },
    {
      name: 'data-copied',
      desc: 'Present when copied state is true'
    }
  ]
}
