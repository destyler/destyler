import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { createMachine, ref } from '@zag-js/core'
import { getComputedStyle, getEventTarget, raf } from '@zag-js/dom-query'
import { compact } from '@zag-js/utils'
import { dom } from './dom'

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)
  return createMachine<MachineContext, MachineState>(
    {
      id: 'collapsible',
      initial: ctx.open ? 'open' : 'closed',

      context: {
        ...ctx,
        height: 0,
        width: 0,
        initial: false,
        stylesRef: null,
        unmountAnimationName: null,
      },

      watch: {
        open: ['setInitial', 'computeSize', 'toggleVisibility'],
      },

      exit: ['clearInitial', 'cleanupNode'],

      states: {
        closed: {
          tags: ['closed'],
          on: {
            'CONTROLLED.OPEN': 'open',
            'OPEN': [
              {
                guard: 'isOpenControlled',
                actions: ['invokeOnOpen'],
              },
              {
                target: 'open',
                actions: ['setInitial', 'computeSize', 'invokeOnOpen'],
              },
            ],
          },
        },

        closing: {
          tags: ['open'],
          activities: ['trackExitAnimation'],
          on: {
            'CONTROLLED.CLOSE': 'closed',
            'CONTROLLED.OPEN': 'open',
            'OPEN': [
              {
                guard: 'isOpenControlled',
                actions: ['invokeOnOpen'],
              },
              {
                target: 'open',
                actions: ['setInitial', 'invokeOnOpen'],
              },
            ],
            'CLOSE': [
              {
                guard: 'isOpenControlled',
                actions: ['invokeOnExitComplete'],
              },
              {
                target: 'closed',
                actions: ['setInitial', 'computeSize', 'invokeOnExitComplete'],
              },
            ],
            'ANIMATION.END': {
              target: 'closed',
              actions: ['invokeOnExitComplete', 'clearInitial'],
            },
          },
        },

        open: {
          tags: ['open'],
          activities: ['trackEnterAnimation'],
          on: {
            'CONTROLLED.CLOSE': 'closing',
            'CLOSE': [
              {
                guard: 'isOpenControlled',
                actions: ['invokeOnClose'],
              },
              {
                target: 'closing',
                actions: ['setInitial', 'computeSize', 'invokeOnClose'],
              },
            ],
            'SIZE.MEASURE': {
              actions: ['measureSize'],
            },
            'ANIMATION.END': {
              actions: ['clearInitial'],
            },
          },
        },
      },
    },
    {
      guards: {
        isOpenControlled: ctx => !!ctx['open.controlled'],
      },
      activities: {
        trackEnterAnimation(ctx, _evt, { send }) {
          let cleanup: VoidFunction | undefined

          const rafCleanup = raf(() => {
            const contentEl = dom.getContentEl(ctx)
            if (!contentEl)
              return

            // if there's no animation, send ANIMATION.END immediately
            const animationName = getComputedStyle(contentEl).animationName
            const hasNoAnimation = !animationName || animationName === 'none'

            if (hasNoAnimation) {
              send({ type: 'ANIMATION.END' })
              return
            }

            const onEnd = (event: AnimationEvent) => {
              const target = getEventTarget<Element>(event)
              if (target === contentEl) {
                send({ type: 'ANIMATION.END' })
              }
            }

            contentEl.addEventListener('animationend', onEnd)
            cleanup = () => {
              contentEl.removeEventListener('animationend', onEnd)
            }
          })

          return () => {
            rafCleanup()
            cleanup?.()
          }
        },

        trackExitAnimation(ctx, _evt, { send }) {
          let cleanup: VoidFunction | undefined

          const rafCleanup = raf(() => {
            const contentEl = dom.getContentEl(ctx)
            if (!contentEl)
              return

            // if there's no animation, send ANIMATION.END immediately
            const animationName = getComputedStyle(contentEl).animationName
            const hasNoAnimation = !animationName || animationName === 'none'

            if (hasNoAnimation) {
              send({ type: 'ANIMATION.END' })
              return
            }

            const onEnd = (event: AnimationEvent) => {
              const win = contentEl.ownerDocument.defaultView || window
              const animationName = win.getComputedStyle(contentEl).animationName

              const target = getEventTarget<Element>(event)
              if (target === contentEl && animationName === ctx.unmountAnimationName) {
                send({ type: 'ANIMATION.END' })
              }
            }

            contentEl.addEventListener('animationend', onEnd)
            cleanup = () => {
              contentEl.removeEventListener('animationend', onEnd)
            }
          })

          return () => {
            rafCleanup()
            cleanup?.()
          }
        },
      },
      actions: {
        setInitial(ctx) {
          ctx.initial = true
        },
        clearInitial(ctx) {
          raf(() => {
            ctx.initial = false
          })
        },
        cleanupNode(ctx) {
          ctx.stylesRef = null
        },
        measureSize(ctx) {
          const contentEl = dom.getContentEl(ctx)
          if (!contentEl)
            return
          const { height, width } = contentEl.getBoundingClientRect()
          ctx.height = height
          ctx.width = width
        },
        computeSize(ctx, evt) {
          ctx._rafCleanup?.()

          ctx._rafCleanup = raf(() => {
            const contentEl = dom.getContentEl(ctx)
            if (!contentEl)
              return

            ctx.stylesRef ||= ref({
              animationName: contentEl.style.animationName,
              animationDuration: contentEl.style.animationDuration,
            })

            if (evt.type === 'CLOSE' || !ctx.open) {
              const win = contentEl.ownerDocument.defaultView || window
              ctx.unmountAnimationName = win.getComputedStyle(contentEl).animationName
            }

            const hidden = contentEl.hidden

            // block any animations/transitions so the element renders at its full dimensions
            contentEl.style.animationName = 'none'
            contentEl.style.animationDuration = '0s'
            contentEl.hidden = false

            const rect = contentEl.getBoundingClientRect()
            ctx.height = rect.height
            ctx.width = rect.width

            // kick off any animations/transitions that were originally set up if it isn't the initial mount
            if (ctx.initial) {
              contentEl.style.animationName = ctx.stylesRef.animationName
              contentEl.style.animationDuration = ctx.stylesRef.animationDuration
            }

            contentEl.hidden = hidden
          })
        },
        invokeOnOpen: (ctx) => {
          ctx.onOpenChange?.({ open: true })
        },
        invokeOnClose: (ctx) => {
          ctx.onOpenChange?.({ open: false })
        },
        invokeOnExitComplete(ctx) {
          ctx.onExitComplete?.()
        },
        toggleVisibility: (ctx, _evt, { send }) => {
          send({ type: ctx.open ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
        },
      },
    },
  )
}
