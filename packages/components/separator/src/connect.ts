import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { MachineApi, Orientation, Send, State } from './types'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  const isVertical = state.context.orientation === 'vertical'

  return {
    isVertical,

    getRootProps(orientation?: Orientation) {
      return normalize.element({
        ...parts.root.attrs,
        'role': 'separator',
        'aria-orientation': orientation || state.context.orientation,
        'data-orientation': orientation || state.context.orientation,
        'dir': state.context.dir,
        'id': dom.getRootId(state.context),
      })
    },
  }
}
