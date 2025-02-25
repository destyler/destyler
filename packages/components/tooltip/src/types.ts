import type { Machine, StateMachine } from '@zag-js/core'
import type { Placement, PositioningOptions } from '@zag-js/popper'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export interface OpenChangeDetails {
  open: boolean
}

export type ElementIds = Partial<{
  trigger: string
  content: string
  arrow: string
  positioner: string
}>

interface PublicContext extends DirectionProperty, CommonProperties {
  /**
   * The ids of the elements in the tooltip. Useful for composition.
   */
  'ids'?: ElementIds | undefined
  /**
   * The `id` of the tooltip.
   */
  'id': string
  /**
   * The open delay of the tooltip.
   * @default 1000
   */
  'openDelay': number
  /**
   * The close delay of the tooltip.
   * @default 500
   */
  'closeDelay': number
  /**
   * Whether to close the tooltip on pointerdown.
   * @default true
   */
  'closeOnPointerDown': boolean
  /**
   * Whether to close the tooltip when the Escape key is pressed.
   * @default true
   */
  'closeOnEscape'?: boolean | undefined
  /**
   * Whether the tooltip should close on scroll
   * @default true
   */
  'closeOnScroll'?: boolean | undefined
  /**
   * Whether the tooltip should close on click
   * @default true
   */
  'closeOnClick'?: boolean | undefined
  /**
   * Whether the tooltip's content is interactive.
   * In this mode, the tooltip will remain open when user hovers over the content.
   * @see https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus
   *
   * @default false
   */
  'interactive': boolean
  /**
   * Function called when the tooltip is opened.
   */
  'onOpenChange'?: (details: OpenChangeDetails) => void
  /**
   * Custom label for the tooltip.
   */
  'aria-label'?: string | undefined
  /**
   * The user provided options used to position the popover content
   */
  'positioning': PositioningOptions
  /**
   * Whether the tooltip is disabled
   */
  'disabled'?: boolean | undefined
  /**
   * Whether the tooltip is open
   */
  'open'?: boolean | undefined
  /**
   * Whether the tooltip is controlled by the user
   */
  'open.controlled'?: boolean | undefined
}

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

type ComputedContext = Readonly<{
  /**
   * @computed Whether an `aria-label` is set.
   */
  hasAriaLabel: boolean
}>

interface PrivateContext {
  /**
   * @internal
   * The computed placement of the tooltip.
   */
  currentPlacement?: Placement | undefined
  /**
   * @internal
   * Whether the pointermove already opened the tooltip.
   */
  hasPointerMoveOpened?: boolean | undefined
}

export interface MachineContext extends PublicContext, ComputedContext, PrivateContext {}

export interface MachineState {
  value: 'opening' | 'open' | 'closing' | 'closed'
  tags: 'open' | 'closed'
}

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export type Service = Machine<MachineContext, MachineState, StateMachine.AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the tooltip is open.
   */
  open: boolean
  /**
   * Function to open the tooltip.
   */
  setOpen: (open: boolean) => void
  /**
   * Function to reposition the popover
   */
  reposition: (options?: Partial<PositioningOptions>) => void

  getTriggerProps: () => T['button']
  getArrowProps: () => T['element']
  getArrowTipProps: () => T['element']
  getPositionerProps: () => T['element']
  getContentProps: () => T['element']
}

export type { Placement, PositioningOptions }
