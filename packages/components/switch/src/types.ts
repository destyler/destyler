import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@destyler/types'
import type { AnyEventObject, Machine, XSend, XState } from '@destyler/xstate'

export interface CheckedChangeDetails {
  checked: boolean
}

export type ElementIds = Partial<{
  root: string
  hiddenInput: string
  control: string
  label: string
  thumb: string
}>

interface PublicContext extends DirectionProperty, CommonProperties {
  /**
   * The ids of the elements in the switch. Useful for composition.
   */
  ids?: ElementIds | undefined
  /**
   * Specifies the localized strings that identifies the accessibility elements and their states
   */
  label: string
  /**
   * Whether the switch is disabled.
   */
  disabled?: boolean | undefined
  /**
   * If `true`, the switch is marked as invalid.
   */
  invalid?: boolean | undefined
  /**
   * If `true`, the switch input is marked as required,
   */
  required?: boolean | undefined
  /**
   * Whether the switch is read-only
   */
  readOnly?: boolean | undefined
  /**
   * Function to call when the switch is clicked.
   */
  onCheckedChange?: ((details: CheckedChangeDetails) => void) | undefined
  /**
   * Whether the switch is checked.
   */
  checked: boolean
  /**
   * The name of the input field in a switch
   * (Useful for form submission).
   */
  name?: string | undefined
  /**
   * The id of the form that the switch belongs to
   */
  form?: string | undefined
  /**
   * The value of switch input. Useful for form submission.
   * @default "on"
   */
  value?: string | number | undefined
}

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

type ComputedContext = Readonly<{
  /**
   * Whether the switch is disabled
   */
  isDisabled: boolean
}>

interface PrivateContext {
  /**
   * @internal
   * Whether the checkbox is pressed
   */
  active?: boolean | undefined
  /**
   * @internal
   * Whether the checkbox has focus
   */
  focused?: boolean | undefined
  /**
   * @internal
   * Whether the checkbox has focus visible
   */
  focusVisible?: boolean | undefined
  /**
   * @internal
   * Whether the checkbox is hovered
   */
  hovered?: boolean | undefined
  /**
   * @internal
   * Whether the checkbox fieldset is disabled
   */
  fieldsetDisabled: boolean
}

export interface MachineContext extends PublicContext, PrivateContext, ComputedContext {}

export interface MachineState {
  value: 'ready'
}

export type State = XState<MachineContext, MachineState>

export type Send = XSend<AnyEventObject>

export type Service = Machine<MachineContext, MachineState, AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the checkbox is checked
   */
  checked: boolean
  /**
   * Whether the checkbox is disabled
   */
  disabled: boolean | undefined
  /**
   * Whether the checkbox is focused
   */
  focused: boolean | undefined
  /**
   * Function to set the checked state of the switch.
   */
  setChecked: (checked: boolean) => void
  /**
   * Function to toggle the checked state of the checkbox
   */
  toggleChecked: () => void

  getRootProps: () => T['label']
  getLabelProps: () => T['element']
  getThumbProps: () => T['element']
  getControlProps: () => T['element']
  getHiddenInputProps: () => T['input']
}
