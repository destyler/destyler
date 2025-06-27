import type { NormalizeProps, PropTypes } from '@destyler/types'
import type { MachineApi, Send, State } from './types'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  return {
    setRatio(ratio: number) {
      send({ type: 'RATIO.SET', ratio })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        dir: state.context.dir,
        id: dom.getRootId(state.context),
        style: {
          position: 'relative',
          width: '100%',
          paddingBottom: `${(1 / (state.context.ratio || 1)) * 100}%`,
        },
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        dir: state.context.dir,
        id: dom.getContentId(state.context),
        style: {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      })
    },
  }
}
