import type { Machine, StateMachine } from '@zag-js/core'
import type { InteractOutsideHandlers } from '@zag-js/interact-outside'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export interface ValueChangeDetails {
  value: string
}

export interface EditChangeDetails {
  edit: boolean
}

export type ActivationMode = 'focus' | 'dblclick' | 'click'

export type SubmitMode = 'enter' | 'blur' | 'both' | 'none'

export interface IntlTranslations {
  edit: string
  submit: string
  cancel: string
  input: string
}

export type ElementIds = Partial<{
  root: string
  area: string
  label: string
  preview: string
  input: string
  control: string
  submitTrigger: string
  cancelTrigger: string
  editTrigger: string
}>

interface PublicContext extends DirectionProperty, CommonProperties, InteractOutsideHandlers {
  /**
   * The ids of the elements in the editable. Useful for composition.
   */
  'ids'?: ElementIds | undefined
  /**
   * Whether the input's value is invalid.
   */
  'invalid'?: boolean | undefined
  /**
   * The name attribute of the editable component. Used for form submission.
   */
  'name'?: string | undefined
  /**
   * The associate form of the underlying input.
   */
  'form'?: string | undefined
  /**
   * Whether the editable should auto-resize to fit the content.
   */
  'autoResize'?: boolean | undefined
  /**
   * The activation mode for the preview element.
   *
   * - "focus" - Enter edit mode when the preview is focused
   * - "dblclick" - Enter edit mode when the preview is double-clicked
   * - "click" - Enter edit mode when the preview is clicked
   *
   * @default "focus"
   */
  'activationMode': ActivationMode
  /**
   * The action that triggers submit in the edit mode:
   *
   * - "enter" - Trigger submit when the enter key is pressed
   * - "blur" - Trigger submit when the editable is blurred
   * - "none" - No action will trigger submit. You need to use the submit button
   * - "both" - Pressing `Enter` and blurring the input will trigger submit
   *
   * @default "both"
   */
  'submitMode': SubmitMode
  /**
   * Whether the editable is in edit mode.
   */
  'edit'?: boolean | undefined
  /**
   * Whether the editable is controlled
   */
  'edit.controlled'?: boolean | undefined
  /**
   * Whether to select the text in the input when it is focused.
   * @default true
   */
  'selectOnFocus'?: boolean | undefined
  /**
   * The value of the editable in both edit and preview mode
   */
  'value': string
  /**
   * The maximum number of characters allowed in the editable
   */
  'maxLength'?: number | undefined
  /**
   * Whether the editable is disabled
   */
  'disabled'?: boolean | undefined
  /**
   * Whether the editable is readonly
   */
  'readOnly'?: boolean | undefined
  /**
   * Whether the editable is required
   */
  'required'?: boolean | undefined
  /**
   * The callback that is called when the editable's value is changed
   */
  'onValueChange'?: ((details: ValueChangeDetails) => void) | undefined
  /**
   * The callback that is called when the esc key is pressed or the cancel button is clicked
   */
  'onValueRevert'?: ((details: ValueChangeDetails) => void) | undefined
  /**
   * The callback that is called when the editable's value is submitted.
   */
  'onValueCommit'?: ((details: ValueChangeDetails) => void) | undefined
  /**
   * The callback that is called when the edit mode is changed
   */
  'onEditChange'?: ((details: EditChangeDetails) => void) | undefined
  /**
   * The placeholder value to show when the `value` is empty
   */
  'placeholder'?: string | { edit: string, preview: string } | undefined
  /**
   * Specifies the localized strings that identifies the accessibility elements and their states
   */
  'translations': IntlTranslations
  /**
   * The element that should receive focus when the editable is closed.
   * By default, it will focus on the trigger element.
   */
  'finalFocusEl'?: (() => HTMLElement | null) | undefined
}

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

type ComputedContext = Readonly<{
  /**
   * @computed
   * Whether the editable can be interacted with
   */
  isInteractive: boolean
  /**
   * @computed
   * Whether to submit on enter press
   */
  submitOnEnter: boolean
  /**
   * @computed
   * Whether to submit on blur
   */
  submitOnBlur: boolean
}>

interface PrivateContext {
  /**
   * @internal
   * The previous value of the editable. Used to revert in case of cancel/escape
   */
  previousValue: string
}

export interface MachineContext extends PublicContext, PrivateContext, ComputedContext {}

export interface MachineState {
  value: 'preview' | 'edit'
}

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export type Service = Machine<MachineContext, MachineState, StateMachine.AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the editable is in edit mode
   */
  editing: boolean
  /**
   * Whether the editable value is empty
   */
  empty: boolean
  /**
   * The current value of the editable
   */
  value: string
  /**
   * The current value of the editable, or the placeholder if the value is empty
   */
  valueText: string
  /**
   * Function to set the value of the editable
   */
  setValue: (value: string) => void
  /**
   * Function to clear the value of the editable
   */
  clearValue: () => void
  /**
   * Function to enter edit mode
   */
  edit: () => void
  /**
   * Function to exit edit mode, and discard any changes
   */
  cancel: () => void
  /**
   * Function to exit edit mode, and submit any changes
   */
  submit: () => void

  getRootProps: () => T['element']
  getAreaProps: () => T['element']
  getLabelProps: () => T['label']
  getInputProps: () => T['input']
  getPreviewProps: () => T['element']
  getEditTriggerProps: () => T['button']
  getControlProps: () => T['element']
  getSubmitTriggerProps: () => T['button']
  getCancelTriggerProps: () => T['button']
}
