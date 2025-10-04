export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; input: string; hiddenInput: string; clearBtn: string; label: string; control: string; item(opts: ItemProps): string; }>',
    desc: 'The ids of the elements in the dynamic. Useful for composition.',
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'Specifies the localized strings that identifies the accessibility elements and their states',
  },
  {
    name: 'maxLength',
    type: 'number',
    desc: 'The max length of the input.',
  },
  {
    name: 'delimiter',
    type: 'string | RegExp',
    desc: 'The character that serves has: - event key to trigger the addition of a new tag - character used to split tags when pasting into the input',
  },
  {
    name: 'autoFocus',
    type: 'boolean',
    desc: 'Whether the input should be auto-focused',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the dynamic should be disabled',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the dynamic should be read-only',
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the dynamic is invalid',
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the dynamic is required',
  },
  {
    name: 'editable',
    type: 'boolean',
    desc: 'Whether a tag can be edited after creation, by pressing `Enter` or double clicking.',
  },
  {
    name: 'inputValue',
    type: 'string',
    desc: 'The tag input\'s value',
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The tag values',
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Callback fired when the tag values is updated',
  },
  {
    name: 'onInputValueChange',
    type: '(details: InputValueChangeDetails) => void',
    desc: 'Callback fired when the input value is updated',
  },
  {
    name: 'onHighlightChange',
    type: '(details: HighlightChangeDetails) => void',
    desc: 'Callback fired when a tag is highlighted by pointer or keyboard navigation',
  },
  {
    name: 'onValueInvalid',
    type: '(details: ValidityChangeDetails) => void',
    desc: 'Callback fired when the max tag count is reached or the `validateTag` function returns `false`',
  },
  {
    name: 'validate',
    type: '(details: ValidateArgs) => boolean',
    desc: 'Returns a boolean that determines whether a tag can be added. Useful for preventing duplicates or invalid tag values.',
  },
  {
    name: 'blurBehavior',
    type: '"clear" | "add"',
    desc: 'The behavior of the dynamic when the input is blurred - `"add"`: add the input value as a new tag - `"clear"`: clear the input value',
  },
  {
    name: 'addOnPaste',
    type: 'boolean',
    desc: 'Whether to add a tag when you paste values into the tag input',
  },
  {
    name: 'max',
    type: 'number',
    desc: 'The max number of tags',
  },
  {
    name: 'allowOverflow',
    type: 'boolean',
    desc: 'Whether to allow tags to exceed max. In this case, we\'ll attach `data-invalid` to the root',
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name attribute for the input. Useful for form submissions',
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The associate form of the underlying input element.',
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.',
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
  {
    name: 'onPointerDownOutside',
    type: '(event: PointerDownOutsideEvent) => void',
    desc: 'Function called when the pointer is pressed down outside the component',
  },
  {
    name: 'onFocusOutside',
    type: '(event: FocusOutsideEvent) => void',
    desc: 'Function called when the focus is moved outside the component',
  },
  {
    name: 'onInteractOutside',
    type: '(event: InteractOutsideEvent) => void',
    desc: 'Function called when an interaction happens outside the component',
  },
]

export const matchApi = [
  {
    name: 'empty',
    type: 'boolean',
    desc: 'Whether the tags are empty',
  },
  {
    name: 'inputValue',
    type: 'string',
    desc: 'The value of the tags entry input.',
  },
  {
    name: 'value',
    type: 'string[]',
    desc: 'The value of the tags as an array of strings.',
  },
  {
    name: 'valueAsString',
    type: 'string',
    desc: 'The value of the tags as a string.',
  },
  {
    name: 'count',
    type: 'number',
    desc: 'The number of the tags.',
  },
  {
    name: 'atMax',
    type: 'boolean',
    desc: 'Whether the tags have reached the max limit.',
  },
  {
    name: 'setValue',
    type: '(value: string[]) => void',
    desc: 'Function to set the value of the tags.',
  },
  {
    name: 'clearValue',
    type: '(id?: string) => void',
    desc: 'Function to clear the value of the tags.',
  },
  {
    name: 'addValue',
    type: '(value: string) => void',
    desc: 'Function to add a tag to the tags.',
  },
  {
    name: 'setValueAtIndex',
    type: '(index: number, value: string) => void',
    desc: 'Function to set the value of a tag at the given index.',
  },
  {
    name: 'setInputValue',
    type: '(value: string) => void',
    desc: 'Function to set the value of the tags entry input.',
  },
  {
    name: 'clearInputValue',
    type: '() => void',
    desc: 'Function to clear the value of the tags entry input.',
  },
  {
    name: 'focus',
    type: '() => void',
    desc: 'Function to focus the tags entry input.',
  },
  {
    name: 'getItemState',
    type: '(props: ItemProps) => ItemState',
    desc: 'Returns the state of a tag',
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'dynamic',
    },
    {
      name: 'data-part',
      desc: 'root',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
  ],
  label: [
    {
      name: 'data-scope',
      desc: 'dynamic',
    },
    {
      name: 'data-part',
      desc: 'label',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
  ],
  control: [
    {
      name: 'data-scope',
      desc: 'dynamic',
    },
    {
      name: 'data-part',
      desc: 'control',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-focus',
      desc: 'Present when focused',
    },
  ],
  input: [
    {
      name: 'data-scope',
      desc: 'dynamic',
    },
    {
      name: 'data-part',
      desc: 'input',
    },
    {
      name: 'data-invalid',
      desc: 'Present when invalid',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'dynamic',
    },
    {
      name: 'data-part',
      desc: 'item',
    },
    {
      name: 'data-value',
      desc: 'The value of the item',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
  ],
  itemPreview: [
    {
      name: 'data-scope',
      desc: 'dynamic',
    },
    {
      name: 'data-part',
      desc: 'item-preview',
    },
    {
      name: 'data-value',
      desc: 'The value of the item',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-highlighted',
      desc: 'Present when highlighted',
    },
  ],
  itemText: [
    {
      name: 'data-scope',
      desc: 'dynamic',
    },
    {
      name: 'data-part',
      desc: 'item-text',
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled',
    },
    {
      name: 'data-highlighted',
      desc: 'Present when highlighted',
    },
  ],
  clearTrigger: [
    {
      name: 'data-scope',
      desc: 'dynamic',
    },
    {
      name: 'data-part',
      desc: 'clear-trigger',
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only',
    },
  ],
}

export const keyboardApi = [
  {
    name: 'ArrowLeft',
    desc: 'Moves focus to the previous tag item',
  },
  {
    name: 'ArrowRight',
    desc: 'Moves focus to the next tag item',
  },
  {
    name: 'Backspace',
    desc: 'Deletes the tag item that has visual focus or the last tag item',
  },
  {
    name: 'Enter',
    desc: 'When a tag item has visual focus, it puts the tag in edit mode. When the input has focus, it adds the value to the list of tags',
  },
  {
    name: 'Delete',
    desc: 'Deletes the tag item that has visual focus',
  },
  {
    name: 'Control + V',
    desc: 'When `addOnPaste` is set. Adds the pasted value as a tags',
  },
]
