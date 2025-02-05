import type { StateMachine } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export type ElementIds = Partial<{
  root: string
  content: string
}>

interface PublicContext extends CommonProperties, DirectionProperty {
  /**
   * The aspect ratio of the container
   */
  ratio?: number
  /**
   * The ids of the elements in the aspect ratio. Useful for composition.
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
   * Function to set the aspect ratio
   */
  setRatio: (ratio: number) => void

  getRootProps: () => T['element']
  getContentProps: () => T['element']
}
