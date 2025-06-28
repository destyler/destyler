import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@destyler/types'
import type { AnyEventObject, XSend, XState } from '@destyler/xstate'

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

export type State = XState<MachineContext, MachineState>

export type Send = XSend<AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  isHovered: boolean
  getRootProps: () => T['label']
}
