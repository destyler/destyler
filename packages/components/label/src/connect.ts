import type { NormalizeProps, PropTypes } from '@destyler/types'
import type { MachineApi, Send, State } from './types'
import { parts } from './anatomy'

export function connect<T extends PropTypes>(
  state: State,
  send: Send,
  normalize: NormalizeProps<T>,
): MachineApi<T> {
  const isHovered = state.matches('hovered')

  return {
    isHovered,
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        dir: state.context.dir,
        style: {
          userSelect: 'none',
          WebkitUserSelect: 'none',
        },
        onMouseEnter() {
          send({ type: 'MOUSE_ENTER' })
        },
        onMouseLeave() {
          send({ type: 'MOUSE_LEAVE' })
        },
      })
    },
  }
}
