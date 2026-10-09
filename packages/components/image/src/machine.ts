import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { observeAttributes, observeChildren } from '@destyler/dom'
import { compact } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'
import { dom } from './dom'

function hasLoaded(image: HTMLImageElement) {
  return image.complete && image.naturalWidth !== 0 && image.naturalHeight !== 0
}

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)
  return createMachine<MachineContext, MachineState>(
    {
      id: 'avatar',
      initial: 'loading',
      activities: ['trackImageRemoval'],

      context: ctx,

      on: {
        'SRC.SET': {
          actions: ['setSrc'],
        },
        'SRC.CHANGE': {
          target: 'loading',
        },
        'IMG.UNMOUNT': {
          target: 'error',
        },
      },

      states: {
        loading: {
          activities: ['trackSrcChange'],
          entry: ['checkImageStatus'],
          on: {
            'IMG.LOADED': {
              target: 'loaded',
              actions: ['invokeOnLoad'],
            },
            'IMG.ERROR': {
              target: 'error',
              actions: ['invokeOnError'],
            },
          },
        },
        error: {
          activities: ['trackSrcChange'],
          on: {
            'IMG.LOADED': {
              target: 'loaded',
              actions: ['invokeOnLoad'],
            },
          },
        },
        loaded: {
          activities: ['trackSrcChange'],
          on: {
            'IMG.ERROR': {
              target: 'error',
              actions: ['invokeOnError'],
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
            attributes: ['src', 'srcset'],
            callback() {
              send({ type: 'SRC.CHANGE' })
            },
          })
        },
        trackImageRemoval(ctx, _evt, { send }) {
          const rootEl = dom.getRootEl(ctx)
          return observeChildren(rootEl, {
            callback(records) {
              if (rootEl?.contains(dom.getImageEl(ctx)))
                return

              const imageId = dom.getImageId(ctx)
              const removed = records.some(record => Array.from(record.removedNodes).some((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE)
                  return false
                const element = node as Element
                return element.id === imageId
                  || Array.from(element.querySelectorAll('[id]')).some(child => child.id === imageId)
              }))
              if (removed) {
                send({ type: 'IMG.UNMOUNT' })
              }
            },
          })
        },
      },
      actions: {
        setSrc(ctx, evt) {
          dom.getImageEl(ctx)?.setAttribute('src', evt.src)
        },
        invokeOnLoad(ctx) {
          ctx.onStatusChange?.({ status: 'loaded' })
        },
        invokeOnError(ctx) {
          ctx.onStatusChange?.({ status: 'error' })
        },
        checkImageStatus(ctx, _evt, { send }) {
          const imageEl = dom.getImageEl(ctx)
          if (imageEl?.complete) {
            const type = hasLoaded(imageEl) ? 'IMG.LOADED' : 'IMG.ERROR'
            send({ type, src: 'ssr' })
          }
        },
      },
    },
  )
}
