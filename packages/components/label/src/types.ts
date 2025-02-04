import type { StateMachine } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export interface ElementIds {
  root?: string
}

interface PublicContext extends CommonProperties, DirectionProperty {
  ids?: ElementIds
}

interface PrivateContext {
  isHovered: boolean
}

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

export interface MachineContext extends PublicContext, PrivateContext {}

export interface MachineState {
  value: 'idle' | 'hovered'
}

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  isHovered: boolean
  getRootProps: () => T['label']
}
