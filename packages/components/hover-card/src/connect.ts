import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { MachineApi, Send, State } from './types'
import { getPlacementStyles } from '@zag-js/popper'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  const open = state.hasTag('open')

  const popperStyles = getPlacementStyles({
    ...state.context.positioning,
    placement: state.context.currentPlacement,
  })

  return {
    open,
    setOpen(nextOpen) {
      if (nextOpen === open)
        return
      send(nextOpen ? 'OPEN' : 'CLOSE')
    },
    reposition(options = {}) {
      send({ type: 'POSITIONING.SET', options })
    },

    getArrowProps() {
      return normalize.element({
        id: dom.getArrowId(state.context),
        ...parts.arrow.attrs,
        dir: state.context.dir,
        style: popperStyles.arrow,
      })
    },

    getArrowTipProps() {
      return normalize.element({
        ...parts.arrowTip.attrs,
        dir: state.context.dir,
        style: popperStyles.arrowTip,
      })
    },

    getTriggerProps() {
      return normalize.element({
        ...parts.trigger.attrs,
        'dir': state.context.dir,
        'data-placement': state.context.currentPlacement,
        'id': dom.getTriggerId(state.context),
        'data-state': open ? 'open' : 'closed',
        onPointerEnter(event) {
          if (event.pointerType === 'touch')
            return
          send({ type: 'POINTER_ENTER', src: 'trigger' })
        },
        onPointerLeave(event) {
          if (event.pointerType === 'touch')
            return
          send({ type: 'POINTER_LEAVE', src: 'trigger' })
        },
        onFocus() {
          send('TRIGGER_FOCUS')
        },
        onBlur() {
          send('TRIGGER_BLUR')
        },
      })
    },

    getPositionerProps() {
      return normalize.element({
        id: dom.getPositionerId(state.context),
        ...parts.positioner.attrs,
        dir: state.context.dir,
        style: popperStyles.floating,
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'dir': state.context.dir,
        'id': dom.getContentId(state.context),
        'hidden': !open,
        'data-state': open ? 'open' : 'closed',
        'data-placement': state.context.currentPlacement,
        onPointerEnter(event) {
          if (event.pointerType === 'touch')
            return
          send({ type: 'POINTER_ENTER', src: 'content' })
        },
        onPointerLeave(event) {
          if (event.pointerType === 'touch')
            return
          send({ type: 'POINTER_LEAVE', src: 'content' })
        },
      })
    },
  }
}
