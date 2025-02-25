import type { Machine, StateMachine } from '@zag-js/core'
import type { Placement, PositioningOptions } from '@zag-js/popper'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export interface OpenChangeDetails {
  open: boolean
}

export type ElementIds = Partial<{
  trigger: string
  content: string
  positioner: string
  arrow: string
}>

interface PublicContext extends DirectionProperty, CommonProperties {
  /**
   * The ids of the elements in the popover. Useful for composition.
   */
  'ids'?: ElementIds | undefined
  /**
   * Function called when the hover card opens or closes.
   */
  'onOpenChange'?: ((details: OpenChangeDetails) => void) | undefined
  /**
   * The duration from when the mouse enters the trigger until the hover card opens.
   * @default 700
   */
  'openDelay': number
  /**
   * The duration from when the mouse leaves the trigger or content until the hover card closes.
   * @default 300
   */
  'closeDelay': number
  /**
   * Whether the hover card is open
   */
  'open'?: boolean | undefined
  /**
   * Whether the hover card is controlled by the user
   */
  'open.controlled'?: boolean | undefined
  /**
   * The user provided options used to position the popover content
   */
  'positioning': PositioningOptions
}

interface PrivateContext {
  /**
   * @internal
   * The computed placement of the tooltip.
   */
  currentPlacement?: Placement | undefined
  /**
   * @internal
   * Whether the hover card is open by pointer
   */
  isPointer?: boolean | undefined
}

type ComputedContext = Readonly<{}>

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

export type MachineContext = PublicContext & PrivateContext & ComputedContext

export interface MachineState {
  value: 'opening' | 'open' | 'closing' | 'closed'
  tags: 'open' | 'closed'
}

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export type Service = Machine<MachineContext, MachineState, StateMachine.AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the hover card is open
   */
  open: boolean
  /**
   * Function to open the hover card
   */
  setOpen: (open: boolean) => void
  /**
   * Function to reposition the popover
   */
  reposition: (options?: Partial<PositioningOptions>) => void

  getArrowProps: () => T['element']
  getArrowTipProps: () => T['element']
  getTriggerProps: () => T['element']
  getPositionerProps: () => T['element']
  getContentProps: () => T['element']
}

export type { Placement, PositioningOptions }
