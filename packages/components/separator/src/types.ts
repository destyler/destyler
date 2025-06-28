import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@destyler/types'
import type { AnyEventObject, XSend, XState } from '@destyler/xstate'

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

export type State = XState<MachineContext, MachineState>

export type Send = XSend<AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the divider is vertical
   */
  isVertical: boolean
  getRootProps: (orientation?: Orientation) => T['element']
}
