import type { Machine, StateMachine } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export interface OpenChangeDetails {
  open: boolean
}
export type ElementIds = Partial<{
  root: string
  content: string
  trigger: string
}>

interface PublicContext extends DirectionProperty, CommonProperties {
  /**
   * The ids of the elements in the collapsible. Useful for composition.
   */
  'ids'?: ElementIds | undefined
  /**
   * Function called when the animation ends in the closed state.
   */
  'onExitComplete'?: (() => void) | undefined
  /**
   * Function called when the popup is opened
   */
  'onOpenChange'?: ((details: OpenChangeDetails) => void) | undefined
  /**
   * Whether the collapsible is open
   */
  'open'?: boolean | undefined
  /**
   * Whether the collapsible is disabled
   */
  'disabled'?: boolean | undefined
  /**
   *  Whether the collapsible open state is controlled by the user
   */
  'open.controlled'?: boolean | undefined
}

type ComputedContext = Readonly<{}>

interface PrivateContext {
  /**
   * @internal
   * The height of the content
   */
  height: number
  /**
   * @internal
   * The width of the content
   */
  width: number
  /**
   * @internal
   * The styles of the content
   */
  stylesRef: Record<string, any> | null
  /**
   * @internal
   * Whether the initial animation is allowed
   */
  initial: boolean
  /**
   * @internal
   * The requestAnimationFrame id
   */
  _rafCleanup?: VoidFunction | undefined
  /**
   * @internal
   * The unmount animation name
   */
  unmountAnimationName: string | null
}

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

export interface MachineContext extends PublicContext, PrivateContext, ComputedContext {}

export interface MachineState {
  value: 'open' | 'closed' | 'closing'
}

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export type Service = Machine<MachineContext, MachineState, StateMachine.AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the collapsible is open.
   */
  open: boolean
  /**
   * Whether the collapsible is visible (open or closing)
   */
  visible: boolean
  /**
   * Whether the collapsible is disabled
   */
  disabled: boolean
  /**
   * Function to open or close the collapsible.
   */
  setOpen: (open: boolean) => void
  /**
   * Function to measure the size of the content.
   */
  measureSize: () => void

  getRootProps: () => T['element']
  getTriggerProps: () => T['button']
  getContentProps: () => T['element']
}
