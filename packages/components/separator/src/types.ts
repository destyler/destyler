import type { StateMachine } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
}>

export type Orientation = 'horizontal' | 'vertical'

interface PublicContext extends CommonProperties, DirectionProperty {
  /**
   * The orientation of divider
   * @default "horizontal"
   */
  orientation?: Orientation
  /**
   * The ids of the elements in the divider
   */
  ids?: ElementIds
}

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

export interface MachineContext extends PublicContext {}

export interface MachineState {
  value: 'idle'
}

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the divider is vertical
   */
  isVertical: boolean
  getRootProps: (orientation?: Orientation) => T['element']
}
