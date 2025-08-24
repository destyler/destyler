export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; area: string; label: string; preview: string; input: string; control: string; submitTrigger: string; cancelTrigger: string; editTrigger: string; }>',
    desc: 'The ids of the elements in the editable. Useful for composition.'
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the input\'s value is invalid.'
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name attribute of the editable component. Used for form submission.'
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The associate form of the underlying input.'
  },
  {
    name: 'autoResize',
    type: 'boolean',
    desc: 'Whether the editable should auto-resize to fit the content.'
  },
  {
    name: 'activationMode',
    type: 'ActivationMode',
    desc: 'The activation mode for the preview element. - "focus" - Enter edit mode when the preview is focused - "dblclick" - Enter edit mode when the preview is double-clicked - "click" - Enter edit mode when the preview is clicked'
  },
  {
    name: 'submitMode',
    type: 'SubmitMode',
    desc: 'The action that triggers submit in the edit mode: - "enter" - Trigger submit when the enter key is pressed - "blur" - Trigger submit when the editable is blurred - "none" - No action will trigger submit. You need to use the submit button - "both" - Pressing `Enter` and blurring the input will trigger submit'
  },
  {
    name: 'edit',
    type: 'boolean',
    desc: 'Whether the editable is in edit mode.'
  },
  {
    name: 'edit.controlled',
    type: 'boolean',
    desc: 'Whether the editable is controlled.'
  },
  {
    name: 'selectOnFocus',
    type: 'boolean',
    desc: 'Whether to select the text in the input when it is focused.'
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The value of the editable in both edit and preview mode.'
  },
  {
    name: 'maxLength',
    type: 'number',
    desc: 'The maximum number of characters allowed in the editable.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the editable is disabled.'
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the editable is readonly.'
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the editable is required.'
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'The callback that is called when the editable\'s value is changed.'
  },
  {
    name: 'onValueRevert',
    type: '(details: ValueChangeDetails) => void',
    desc: 'The callback that is called when the esc key is pressed or the cancel button is clicked.'
  },
  {
    name: 'onValueCommit',
    type: '(details: ValueChangeDetails) => void',
    desc: 'The callback that is called when the editable\'s value is submitted.'
  },
  {
    name: 'onEditChange',
    type: '(details: EditChangeDetails) => void',
    desc: 'The callback that is called when the edit mode is changed.'
  },
  {
    name: 'placeholder',
    type: 'string | { edit: string; preview: string; }',
    desc: 'The placeholder value to show when the `value` is empty.'
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'Specifies the localized strings that identifies the accessibility elements and their states.'
  },
  {
    name: 'finalFocusEl',
    type: '() => HTMLElement',
    desc: 'The element that should receive focus when the editable is closed. By default, it will focus on the trigger element.'
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.'
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.'
  },
  {
    name: 'getRootNode',
    type: '() => Node | ShadowRoot | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.'
  },
  {
    name: 'onPointerDownOutside',
    type: '(event: PointerDownOutsideEvent) => void',
    desc: 'Function called when the pointer is pressed down outside the component.'
  },
  {
    name: 'onFocusOutside',
    type: '(event: FocusOutsideEvent) => void',
    desc: 'Function called when the focus is moved outside the component.'
  },
  {
    name: 'onInteractOutside',
    type: '(event: InteractOutsideEvent) => void',
    desc: 'Function called when an interaction happens outside the component.'
  },
]

export const matchApi = [
  {
    name: 'editing',
    type: 'boolean',
    desc: 'Whether the editable is in edit mode'
  },
  {
    name: 'empty',
    type: 'boolean',
    desc: 'Whether the editable value is empty'
  },
  {
    name: 'value',
    type: 'string',
    desc: 'The current value of the editable'
  },
  {
    name: 'valueText',
    type: 'string',
    desc: 'The current value of the editable, or the placeholder if the value is empty'
  },
  {
    name: 'setValue',
    type: '(value: string) => void',
    desc: 'Function to set the value of the editable'
  },
  {
    name: 'clearValue',
    type: '() => void',
    desc: 'Function to clear the value of the editable'
  },
  {
    name: 'edit',
    type: '() => void',
    desc: 'Function to enter edit mode'
  },
  {
    name: 'cancel',
    type: '() => void',
    desc: 'Function to exit edit mode, and discard any changes'
  },
  {
    name: 'submit',
    type: '() => void',
    desc: 'Function to exit edit mode, and submit any changes'
  },
]

export const styleApi = {
  area: [
    { name: 'data-scope', desc: 'editable' },
    { name: 'data-part', desc: 'area' },
    { name: 'data-focus', desc: 'Present when focused' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-placeholder-shown', desc: 'Present when placeholder is shown' },
  ],
  label: [
    { name: 'data-scope', desc: 'editable' },
    { name: 'data-part', desc: 'label' },
    { name: 'data-focus', desc: 'Present when focused' },
    { name: 'data-invalid', desc: 'Present when invalid' },
  ],
  input: [
    { name: 'data-scope', desc: 'editable' },
    { name: 'data-part', desc: 'input' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-readonly', desc: 'Present when read-only' },
    { name: 'data-invalid', desc: 'Present when invalid' },
  ],
  preview: [
    { name: 'data-scope', desc: 'editable' },
    { name: 'data-part', desc: 'preview' },
    { name: 'data-placeholder-shown', desc: 'Present when placeholder is shown' },
    { name: 'data-readonly', desc: 'Present when read-only' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-invalid', desc: 'Present when invalid' },
  ],
}

export const keyboardApi = [
  {
    name: 'Enter',
    desc: 'Saves the edited content and exits edit mode.'
  },
  {
    name: 'Escape',
    desc: 'Discards the changes and exits edit mode.'
  }
]
