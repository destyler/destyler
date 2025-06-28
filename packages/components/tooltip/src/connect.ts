import { dataAttr } from "@destyler/dom"
import { isFocusVisible } from "@destyler/focus-visible"
import { getPlacementStyles } from "@destyler/popper"
import type { NormalizeProps, PropTypes } from "@destyler/types"
import { parts } from "./anatomy"
import { dom } from "./dom"
import { store } from "./store"
import type { MachineApi, Send, State } from "./types"

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  const id = state.context.id
  const hasAriaLabel = state.context.hasAriaLabel

  const open = state.hasTag("open")

  const triggerId = dom.getTriggerId(state.context)
  const contentId = dom.getContentId(state.context)

  const disabled = state.context.disabled

  const popperStyles = getPlacementStyles({
    ...state.context.positioning,
    placement: state.context.currentPlacement,
  })

  return {
    open: open,
    setOpen(nextOpen) {
      if (nextOpen === open) return
      send(nextOpen ? "OPEN" : "CLOSE")
    },
    reposition(options = {}) {
      send({ type: "POSITIONING.SET", options })
    },

    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        id: triggerId,
        dir: state.context.dir,
        "data-expanded": dataAttr(open),
        "data-state": open ? "open" : "closed",
        "aria-describedby": open ? contentId : undefined,
        onClick(event) {
          if (event.defaultPrevented) return
          if (disabled) return
          if (!state.context.closeOnClick) return
          send({ type: "CLOSE", src: "trigger.click" })
        },
        onFocus(event) {
          if (event.defaultPrevented) return
          if (disabled) return
          if (state.event.src === "trigger.pointerdown") return
          if (!isFocusVisible()) return
          send({ type: "OPEN", src: "trigger.focus" })
        },
        onBlur(event) {
          if (event.defaultPrevented) return
          if (disabled) return
          if (id === store.id) {
            send({ type: "CLOSE", src: "trigger.blur" })
          }
        },
        onPointerDown(event) {
          if (event.defaultPrevented) return
          if (disabled) return
          if (!state.context.closeOnPointerDown) return
          if (id === store.id) {
            send({ type: "CLOSE", src: "trigger.pointerdown" })
          }
        },
        onPointerMove(event) {
          if (event.defaultPrevented) return
          if (disabled) return
          if (event.pointerType === "touch") return
          send("POINTER_MOVE")
        },
        onPointerLeave() {
          if (disabled) return
          send("POINTER_LEAVE")
        },
        onPointerCancel() {
          if (disabled) return
          send("POINTER_LEAVE")
        },
      })
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
        dir: state.context.dir,
        hidden: !open,
        "data-state": open ? "open" : "closed",
        role: hasAriaLabel ? undefined : "tooltip",
        id: hasAriaLabel ? undefined : contentId,
        "data-placement": state.context.currentPlacement,
        onPointerEnter() {
          send("CONTENT.POINTER_MOVE")
        },
        onPointerLeave() {
          send("CONTENT.POINTER_LEAVE")
        },
        style: {
          pointerEvents: state.context.interactive ? "auto" : "none",
        },
      })
    },
  }
}
