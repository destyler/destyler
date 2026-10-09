import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { createMachine, ref } from '@destyler/xstate'

function getAnimationName(styles?: CSSStyleDeclaration | null) {
  return styles?.animationName || 'none'
}

function hasAnimationName(animationNames: string, name: string) {
  // Decode valid computed CSS names, preserving quoted/escaped commas and spaces.
  const names = animationNames.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:\\(?:[\da-f]{1,6}[\t\n\f\r ]?|[^\da-f])|[^\t\n\f\r ,\\])+/gi) ?? []
  return names.some((value) => {
    let nameValue = value
    if (nameValue[0] === '"' || nameValue[0] === '\'')
      nameValue = nameValue.slice(1, -1)
    nameValue = nameValue.replace(/\\(?:([\da-f]{1,6})[\t\n\f\r ]?|([^\da-f]))/gi, (_, hex, character) => {
      if (!hex)
        return character
      const point = Number.parseInt(hex, 16)
      return String.fromCodePoint(point === 0 || point > 0x10FFFF || (point >= 0xD800 && point <= 0xDFFF) ? 0xFFFD : point)
    })
    return nameValue === name
  })
}

function parseMs(value: string | undefined) {
  return Number.parseFloat(value || '0') * 1000
}

// Extra frame margin to account for event loop slowdowns
const ANIMATION_TIMEOUT_MARGIN = 16.667

// Microtasks cannot be unscheduled, so guard them as well as cancelling frames.
function defer(immediate: boolean | undefined, callback: () => void) {
  let active = true
  let frame: number | undefined
  const run = () => {
    if (!active)
      return
    active = false
    callback()
  }
  if (immediate)
    queueMicrotask(run)
  else
    frame = requestAnimationFrame(run)

  return () => {
    if (!active)
      return
    active = false
    if (frame !== undefined)
      cancelAnimationFrame(frame)
  }
}

export function machine(ctx: Partial<UserDefinedContext>) {
  let cancelMount: (() => void) | undefined
  let cancelUnmount: (() => void) | undefined
  return createMachine<MachineContext, MachineState>(
    {
      initial: ctx.present ? 'mounted' : 'unmounted',

      context: {
        node: null,
        styles: null,
        unmountAnimationName: null,
        prevAnimationName: null,
        present: false,
        initial: false,
        ...ctx,
      },

      exit: ['cancelPendingTasks', 'clearInitial', 'cleanupNode'],

      watch: {
        present: ['setInitial', 'syncPresence'],
      },

      on: {
        'NODE.SET': {
          actions: ['setNode', 'setStyles'],
        },
      },

      states: {
        mounted: {
          on: {
            'MOUNT': { actions: ['setPrevAnimationName'] },
            'UNMOUNT': {
              target: 'unmounted',
              actions: ['invokeOnExitComplete'],
            },
            'UNMOUNT.SUSPEND': 'unmountSuspended',
          },
        },
        unmountSuspended: {
          activities: ['trackAnimationEvents'],
          after: {
            // Fallback to timeout to ensure we exit this state even if the `animationend` event
            // did not get trigger
            ANIMATION_DURATION: {
              target: 'unmounted',
              actions: ['invokeOnExitComplete'],
            },
          },
          on: {
            MOUNT: {
              target: 'mounted',
              actions: ['setPrevAnimationName'],
            },
            UNMOUNT: {
              target: 'unmounted',
              actions: ['invokeOnExitComplete'],
            },
          },
        },
        unmounted: {
          entry: ['cancelPendingTasks', 'clearPrevAnimationName'],
          on: {
            MOUNT: {
              target: 'mounted',
              actions: ['setPrevAnimationName'],
            },
          },
        },
      },
    },
    {
      delays: {
        ANIMATION_DURATION(ctx) {
          return parseMs(ctx.styles?.animationDuration) + parseMs(ctx.styles?.animationDelay) + ANIMATION_TIMEOUT_MARGIN
        },
      },
      actions: {
        cancelPendingTasks() {
          cancelMount?.()
          cancelUnmount?.()
        },
        setInitial(ctx) {
          ctx.initial = true
        },
        clearInitial(ctx) {
          ctx.initial = false
        },
        cleanupNode(ctx) {
          ctx.node = null
          ctx.styles = null
        },
        invokeOnExitComplete(ctx) {
          ctx.onExitComplete?.()
        },
        setNode(ctx, evt) {
          ctx.node = ref(evt.node)
        },
        setStyles(ctx, evt) {
          const win = evt.node.ownerDocument.defaultView || window
          ctx.styles = ref(win.getComputedStyle(evt.node))
        },
        syncPresence(ctx, _evt, { send }) {
          cancelUnmount?.()
          if (ctx.present) {
            send({ type: 'MOUNT', src: 'presence.changed' })
            return
          }

          // A mount callback must not sample styles from the following exit.
          cancelMount?.()
          if (ctx.node?.ownerDocument.visibilityState === 'hidden') {
            send({ type: 'UNMOUNT', src: 'visibilitychange' })
            return
          }

          const animationName = getAnimationName(ctx.styles)
          cancelUnmount = defer(ctx.immediate, () => {
            if (ctx.present)
              return
            ctx.unmountAnimationName = animationName
            if (
              animationName === 'none'
              || animationName === ctx.prevAnimationName
              || ctx.styles?.display === 'none'
              || ctx.styles?.animationDuration === '0s'
            ) {
              send({ type: 'UNMOUNT', src: 'presence.changed' })
            }
            else {
              send({ type: 'UNMOUNT.SUSPEND' })
            }
          })
        },
        setPrevAnimationName(ctx) {
          cancelMount?.()
          // A new mount must not inherit an animation sampled during the previous exit.
          ctx.prevAnimationName = null
          cancelMount = defer(ctx.immediate, () => {
            if (ctx.present)
              ctx.prevAnimationName = getAnimationName(ctx.styles)
          })
        },
        clearPrevAnimationName(ctx) {
          ctx.prevAnimationName = null
        },
      },
      activities: {
        trackAnimationEvents(ctx, _evt, { send }) {
          const node = ctx.node
          if (!node)
            return

          const onStart = (event: AnimationEvent) => {
            const target = event.composedPath?.()?.[0] ?? event.target
            if (target === node) {
              ctx.prevAnimationName = getAnimationName(ctx.styles)
            }
          }

          const onEnd = (event: AnimationEvent) => {
            const animationName = getAnimationName(ctx.styles)
            const target = event.composedPath?.()?.[0] ?? event.target
            // Preserve generic/manual events that do not identify an animation.
            const isCurrentAnimation = !event.animationName || hasAnimationName(animationName, event.animationName)
            if (target === node && animationName === ctx.unmountAnimationName && isCurrentAnimation) {
              send({ type: 'UNMOUNT', src: 'animationend' })
            }
          }

          node.addEventListener('animationstart', onStart)
          node.addEventListener('animationcancel', onEnd)
          node.addEventListener('animationend', onEnd)

          return () => {
            node.removeEventListener('animationstart', onStart)
            node.removeEventListener('animationcancel', onEnd)
            node.removeEventListener('animationend', onEnd)
          }
        },
      },
    },
  )
}
