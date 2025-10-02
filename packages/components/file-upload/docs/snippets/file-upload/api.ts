export const matchContext = [
  {
    name: 'name',
    type: 'string',
    desc: 'The name of the underlying file input'
  },
  {
    name: 'ids',
    type: 'Partial<{ root: string; dropzone: string; hiddenInput: string; trigger: string; label: string; item(id: string): string; itemName(id: string): string; itemSizeText(id: string): string; itemPreview(id: string): string; }>',
    desc: 'The ids of the elements. Useful for composition.'
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'The localized messages to use.'
  },
  {
    name: 'accept',
    type: 'Record<string, string[]> | FileMimeType[]',
    desc: 'The accept file types'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the file input is disabled'
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the file input is required'
  },
  {
    name: 'allowDrop',
    type: 'boolean',
    desc: 'Whether to allow drag and drop in the dropzone element'
  },
  {
    name: 'maxFileSize',
    type: 'number',
    desc: 'The maximum file size in bytes'
  },
  {
    name: 'minFileSize',
    type: 'number',
    desc: 'The minimum file size in bytes'
  },
  {
    name: 'maxFiles',
    type: 'number',
    desc: 'The maximum number of files'
  },
  {
    name: 'preventDocumentDrop',
    type: 'boolean',
    desc: 'Whether to prevent the drop event on the document'
  },
  {
    name: 'validate',
    type: '(file: File, details: FileValidateDetails) => FileError[]',
    desc: 'Function to validate a file'
  },
  {
    name: 'onFileChange',
    type: '(details: FileChangeDetails) => void',
    desc: 'Function called when the value changes, whether accepted or rejected'
  },
  {
    name: 'onFileAccept',
    type: '(details: FileAcceptDetails) => void',
    desc: 'Function called when the file is accepted'
  },
  {
    name: 'onFileReject',
    type: '(details: FileRejectDetails) => void',
    desc: 'Function called when the file is rejected'
  },
  {
    name: 'capture',
    type: '"user" | "environment"',
    desc: 'The default camera to use when capturing media'
  },
  {
    name: 'directory',
    type: 'boolean',
    desc: 'Whether to accept directories, only works in webkit browsers'
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the file input is invalid'
  },
  {
    name: 'locale',
    type: 'string',
    desc: 'The current locale. Based on the BCP 47 definition.'
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
    desc: 'A root node to correctly resolve document in custom environments.'
  },
]

export const matchApi = [
  {
    name: 'dragging',
    type: 'boolean',
    desc: 'Whether the user is dragging something over the root element'
  },
  {
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the user is focused on the dropzone element'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the file input is disabled'
  },
  {
    name: 'openFilePicker',
    type: '() => void',
    desc: 'Function to open the file dialog'
  },
  {
    name: 'deleteFile',
    type: '(file: File) => void',
    desc: 'Function to delete the file from the list'
  },
  {
    name: 'acceptedFiles',
    type: 'File[]',
    desc: 'The accepted files that have been dropped or selected'
  },
  {
    name: 'rejectedFiles',
    type: 'FileRejection[]',
    desc: 'The files that have been rejected'
  },
  {
    name: 'setFiles',
    type: '(files: File[]) => void',
    desc: 'Function to set the value'
  },
  {
    name: 'clearFiles',
    type: '() => void',
    desc: 'Function to clear the value'
  },
  {
    name: 'clearRejectedFiles',
    type: '() => void',
    desc: 'Function to clear the rejected files'
  },
  {
    name: 'getFileSize',
    type: '(file: File) => string',
    desc: 'Function to format the file size (e.g. 1.2MB)'
  },
  {
    name: 'createFileUrl',
    type: '(file: File, cb: (url: string) => void) => VoidFunction',
    desc: 'Function to get the preview url of a file. Returns a function to revoke the url.'
  },
  {
    name: 'setClipboardFiles',
    type: '(dt: DataTransfer) => boolean',
    desc: 'Function to set the clipboard files. Returns `true` if the clipboard data contains files, `false` otherwise.'
  }
]

export const styleApi = {
  root: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-dragging',
      desc: 'Present when in the dragging state'
    },
  ],
  dropzone: [
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-dragging',
      desc: 'Present when in the dragging state'
    },
  ],
  trigger: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid'
    },
  ],
  itemGroup: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  item: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  itemName: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  itemSizeText: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  itemPreview: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  itemPreviewImage: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  itemDeleteTrigger: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  label: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
  clearTrigger: [
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    },
  ],
}
