import { createMachine } from "@destyler/xstate"
import { observeAttributes, observeChildren } from "@destyler/dom"
import { compact } from "@destyler/utils"
import { dom } from "./dom"
import type { MachineContext, MachineState, UserDefinedContext } from "./types"


function hasLoaded(image: HTMLImageElement) {
  return image.complete && image.naturalWidth !== 0 && image.naturalHeight !== 0
}


export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)
  return createMachine<MachineContext, MachineState>(
    {
      id: "avatar",
      initial: "loading",
      activities: ["trackImageRemoval"],

      context: ctx,

      on: {
        "SRC.CHANGE": {
          target: "loading",
        },
        "IMG.UNMOUNT": {
          target: "error",
        },
      },

      states: {
        loading: {
          activities: ["trackSrcChange"],
          entry: ["checkImageStatus"],
          on: {
            "IMG.LOADED": {
              target: "loaded",
              actions: ["invokeOnLoad"],
            },
            "IMG.ERROR": {
              target: "error",
              actions: ["invokeOnError"],
            },
          },
        },
        error: {
          activities: ["trackSrcChange"],
          on: {
            "IMG.LOADED": {
              target: "loaded",
              actions: ["invokeOnLoad"],
            },
          },
        },
        loaded: {
          activities: ["trackSrcChange"],
          on: {
            "IMG.ERROR": {
              target: "error",
              actions: ["invokeOnError"],
            },
          },
        },
      },
    },
    {
      activities: {
        trackSrcChange(ctx, _evt, { send }) {
          const imageEl = dom.getImageEl(ctx)
          return observeAttributes(imageEl, {
            attributes: ["src", "srcset"],
            callback() {
              send({ type: "SRC.CHANGE" })
            },
          })
        },
        trackImageRemoval(ctx, _evt, { send }) {
          const rootEl = dom.getRootEl(ctx)
          return observeChildren(rootEl, {
            callback(records) {
              const removedNodes = Array.from(records[0].removedNodes) as HTMLElement[]
              const removed = removedNodes.find(
                (node) => node.nodeType === Node.ELEMENT_NODE && node.matches("[data-scope=avatar][data-part=image]"),
              )
              if (removed) {
                send({ type: "IMG.UNMOUNT" })
              }
            },
          })
        },
      },
      actions: {
        invokeOnLoad(ctx) {
          ctx.onStatusChange?.({ status: "loaded" })
        },
        invokeOnError(ctx) {
          ctx.onStatusChange?.({ status: "error" })
        },
        checkImageStatus(ctx, _evt, { send }) {
          const imageEl = dom.getImageEl(ctx)
          if (imageEl?.complete) {
            const type = hasLoaded(imageEl) ? "IMG.LOADED" : "IMG.ERROR"
            send({ type, src: "ssr" })
          }
        },
      },
    },
  )
}
