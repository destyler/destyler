import type { Machine, StateMachine } from '@zag-js/core'
import type { CommonProperties, DirectionProperty, PropTypes, RequiredBy } from '@zag-js/types'

export type LoadStatus = 'error' | 'loaded'

export interface StatusChangeDetails {
  status: LoadStatus
}

export type ElementIds = Partial<{
  root: string
  image: string
  fallback: string
}>

interface PublicContext extends CommonProperties, DirectionProperty {
  /**
   * Functional called when the image loading status changes.
   */
  onStatusChange?: ((details: StatusChangeDetails) => void) | undefined
  /**
   * The ids of the elements in the image. Useful for composition.
   */
  ids?: ElementIds | undefined
}

interface PrivateContext {}

type ComputedContext = Readonly<any>

export type UserDefinedContext = RequiredBy<PublicContext, 'id'>

export interface MachineContext extends PublicContext, PrivateContext, ComputedContext {}

export interface MachineState {
  value: 'loading' | 'error' | 'loaded'
}

export type State = StateMachine.State<MachineContext, MachineState>

export type Send = StateMachine.Send<StateMachine.AnyEventObject>

export type Service = Machine<MachineContext, MachineState, StateMachine.AnyEventObject>

export interface MachineApi<T extends PropTypes = PropTypes> {
  /**
   * Whether the image is loaded.
   */
  loaded: boolean
  /**
   * Function to set new src.
   */
  setSrc: (src: string) => void
  /**
   * Function to set loaded state.
   */
  setLoaded: () => void
  /**
   * Function to set error state.
   */
  setError: () => void

  getRootProps: () => T['element']
  getImageProps: () => T['img']
  getFallbackProps: () => T['element']
}
