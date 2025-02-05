import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { MachineApi, Send, State } from './types'
import { dataAttr } from '@zag-js/dom-query'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  const visible = state.matches('open', 'closing')
  const open = state.matches('open')

  const height = state.context.height
  const width = state.context.width
  const disabled = !!state.context.disabled

  const skip = !state.context.initial && open

  return {
    disabled,
    visible,
    open,
    measureSize() {
      send('SIZE.MEASURE')
    },
    setOpen(nextOpen) {
      if (nextOpen === open)
        return
      send(nextOpen ? 'OPEN' : 'CLOSE')
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'data-state': open ? 'open' : 'closed',
        'dir': state.context.dir,
        'id': dom.getRootId(state.context),
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'data-collapsible': '',
        'data-state': skip ? undefined : open ? 'open' : 'closed',
        'id': dom.getContentId(state.context),
        'data-disabled': dataAttr(disabled),
        'hidden': !visible,
        'style': {
          '--destyler-height': height != null ? `${height}px` : undefined,
          '--destyler-width': width != null ? `${width}px` : undefined,
        },
      })
    },

    getTriggerProps() {
      return normalize.element({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(state.context),
        'dir': state.context.dir,
        'type': 'button',
        'data-state': open ? 'open' : 'closed',
        'data-disabled': dataAttr(disabled),
        'aria-controls': dom.getContentId(state.context),
        'aria-expanded': visible || false,
        onClick(event) {
          if (event.defaultPrevented)
            return
          if (disabled)
            return
          send({ type: open ? 'CLOSE' : 'OPEN', src: 'trigger.click' })
        },
      })
    },
  }
}
