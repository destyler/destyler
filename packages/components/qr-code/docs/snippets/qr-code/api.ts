export const matchContext = [
  {
    name: 'value',
    type: 'string',
    desc: 'The value to encode.'
  },
  {
    name: 'ids',
    type: 'Partial<{ root: string; frame: string; }>',
    desc: 'The element ids.'
  },
  {
    name: 'encoding',
    type: 'QrCodeGenerateOptions',
    desc: 'The qr code encoding options.'
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Callback fired when the value changes.'
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
    name: 'value',
    type: 'string',
    desc: 'The value to encode.'
  },
  {
    name: 'setValue',
    type: '(value: string) => void',
    desc: 'Set the value to encode.'
  },
]
