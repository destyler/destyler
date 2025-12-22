import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { raf } from '@destyler/dom'
import { compact, isEqual } from '@destyler/utils'
import { createMachine, guards } from '@destyler/xstate'
import { dom } from './dom'

const { not, and } = guards

const set = {
  value(ctx: MachineContext, value: string | null) {
    if (isEqual(ctx.value, value))
      return
    ctx.previousValue = ctx.value
    ctx.value = value
    ctx.onValueChange?.({ value })
  },
}

function clearOpenTimer(ctx: MachineContext) {
  if (ctx.openTimer !== null) {
    globalThis.clearTimeout(ctx.openTimer)
    ctx.openTimer = null
  }
}

function clearCloseTimer(ctx: MachineContext) {
  if (ctx.closeTimer !== null) {
    globalThis.clearTimeout(ctx.closeTimer)
    ctx.closeTimer = null
  }
}

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)
  return createMachine<MachineContext, MachineState>(
    {
      id: 'navigation-menu',
      initial: ctx.defaultValue ? 'open' : 'idle',
      context: {
        value: null,
        openDelay: 200,
        closeDelay: 300,
        orientation: 'horizontal',
        disableClickTrigger: false,
        disableHoverTrigger: false,
        disablePointerLeaveClose: false,
        ...ctx,
        previousValue: null,
        openTimer: null,
        closeTimer: null,
        isViewportHovered: false,
        isTriggerHovered: false,
      },

      computed: {
        isRtl: ctx => ctx.dir === 'rtl',
        isHorizontal: ctx => ctx.orientation === 'horizontal',
        isOpen: ctx => ctx.value !== null,
      },

      entry: ['setInitialValue'],

      watch: {
        value: 'syncValue',
      },

      on: {
        'VALUE.SET': [
          {
            guard: 'isValueControlled',
            actions: ['invokeOnValueChange'],
          },
          {
            actions: ['setValue', 'invokeOnValueChange'],
          },
        ],
        'CLOSE': [
          {
            guard: 'isValueControlled',
            actions: ['invokeOnClose'],
          },
          {
            target: 'idle',
            actions: ['clearValue', 'invokeOnClose'],
          },
        ],
        'ARROW_NEXT': {
          actions: 'focusNextTrigger',
        },
        'ARROW_PREV': {
          actions: 'focusPrevTrigger',
        },
        'HOME': {
          actions: 'focusFirstTrigger',
        },
        'END': {
          actions: 'focusLastTrigger',
        },
      },

      states: {
        idle: {
          tags: ['closed'],
          entry: ['clearTimers'],
          on: {
            'CONTROLLED.OPEN': {
              target: 'open',
            },
            'TRIGGER_ENTER': {
              guard: not('isHoverDisabled'),
              actions: ['clearCloseTimer', 'setOpenTimer'],
            },
            'TRIGGER_CLICK': [
              {
                guard: and(not('isClickDisabled'), 'isValueControlled'),
                actions: ['invokeOnValueChange'],
              },
              {
                guard: not('isClickDisabled'),
                target: 'open',
                actions: ['setValue'],
              },
            ],
            'OPEN_TIMER_COMPLETE': [
              {
                guard: 'isValueControlled',
                actions: ['invokeOnValueChange'],
              },
              {
                target: 'open',
                actions: ['setValue'],
              },
            ],
          },
        },

        open: {
          tags: ['open'],
          entry: ['clearTimers'],
          on: {
            'CONTROLLED.CLOSE': {
              target: 'idle',
              actions: ['clearValue'],
            },
            'TRIGGER_ENTER': {
              guard: not('isHoverDisabled'),
              actions: ['clearCloseTimer', 'setValueWithDelay'],
            },
            'TRIGGER_LEAVE': {
              guard: and(not('isHoverDisabled'), not('isPointerLeaveCloseDisabled')),
              actions: ['setCloseTimer'],
            },
            'TRIGGER_CLICK': [
              {
                guard: and(not('isClickDisabled'), 'isSameValue', 'isValueControlled'),
                actions: ['invokeOnClose'],
              },
              {
                guard: and(not('isClickDisabled'), 'isSameValue'),
                target: 'idle',
                actions: ['clearValue'],
              },
              {
                guard: and(not('isClickDisabled'), 'isValueControlled'),
                actions: ['invokeOnValueChange'],
              },
              {
                guard: not('isClickDisabled'),
                actions: ['setValue'],
              },
            ],
            'CONTENT_ENTER': {
              actions: ['setViewportHovered', 'clearCloseTimer'],
            },
            'CONTENT_LEAVE': {
              guard: not('isPointerLeaveCloseDisabled'),
              actions: ['clearViewportHovered', 'setCloseTimer'],
            },
            'VIEWPORT_ENTER': {
              actions: ['setViewportHovered', 'clearCloseTimer'],
            },
            'VIEWPORT_LEAVE': {
              guard: not('isPointerLeaveCloseDisabled'),
              actions: ['clearViewportHovered', 'setCloseTimer'],
            },
            'CLOSE_TIMER_COMPLETE': [
              {
                guard: and(not('isViewportHovered'), not('isTriggerHovered'), 'isValueControlled'),
                actions: ['invokeOnClose'],
              },
              {
                guard: and(not('isViewportHovered'), not('isTriggerHovered')),
                target: 'idle',
                actions: ['clearValue'],
              },
            ],
            'OPEN_TIMER_COMPLETE': [
              {
                guard: 'isValueControlled',
                actions: ['invokeOnValueChange'],
              },
              {
                actions: ['setValue'],
              },
            ],
          },
        },
      },
    },
    {
      guards: {
        isValueControlled: ctx => !!ctx['value.controlled'],
        isHoverDisabled: ctx => ctx.disableHoverTrigger,
        isClickDisabled: ctx => ctx.disableClickTrigger,
        isPointerLeaveCloseDisabled: ctx => ctx.disablePointerLeaveClose,
        isSameValue: (ctx, evt) => ctx.value === evt.value,
        isViewportHovered: ctx => ctx.isViewportHovered,
        isTriggerHovered: ctx => ctx.isTriggerHovered,
      },

      actions: {
        setInitialValue(ctx) {
          if (ctx.defaultValue) {
            set.value(ctx, ctx.defaultValue)
          }
        },
        setValue(ctx, evt) {
          set.value(ctx, evt.value)
        },
        clearValue(ctx) {
          set.value(ctx, null)
        },
        setValueWithDelay(ctx, evt, { send }) {
          clearOpenTimer(ctx)
          ctx.isTriggerHovered = true
          if (ctx.value === evt.value)
            return

          ctx.openTimer = globalThis.setTimeout(() => {
            send({ type: 'OPEN_TIMER_COMPLETE', value: evt.value })
          }, ctx.openDelay)
        },
        setOpenTimer(ctx, evt, { send }) {
          clearOpenTimer(ctx)
          ctx.isTriggerHovered = true

          ctx.openTimer = globalThis.setTimeout(() => {
            send({ type: 'OPEN_TIMER_COMPLETE', value: evt.value })
          }, ctx.openDelay)
        },
        setCloseTimer(ctx, _evt, { send }) {
          clearCloseTimer(ctx)
          ctx.isTriggerHovered = false

          ctx.closeTimer = globalThis.setTimeout(() => {
            send({ type: 'CLOSE_TIMER_COMPLETE' })
          }, ctx.closeDelay)
        },
        clearCloseTimer(ctx) {
          clearCloseTimer(ctx)
        },
        clearTimers(ctx) {
          clearOpenTimer(ctx)
          clearCloseTimer(ctx)
        },
        setViewportHovered(ctx) {
          ctx.isViewportHovered = true
        },
        clearViewportHovered(ctx) {
          ctx.isViewportHovered = false
        },
        invokeOnValueChange(ctx, evt) {
          ctx.onValueChange?.({ value: evt.value ?? null })
        },
        invokeOnClose(ctx) {
          ctx.onValueChange?.({ value: null })
        },
        syncValue(ctx, evt, { send }) {
          const isOpen = ctx.value !== null
          send({ type: isOpen ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE', previousEvent: evt })
        },
        focusTrigger(ctx) {
          raf(() => {
            const triggerEl = dom.getActiveTriggerEl(ctx)
            triggerEl?.focus({ preventScroll: true })
          })
        },
        focusNextTrigger(ctx, evt) {
          raf(() => {
            const next = dom.getNextTriggerEl(ctx, evt.id)
            next?.focus({ preventScroll: true })
          })
        },
        focusPrevTrigger(ctx, evt) {
          raf(() => {
            const prev = dom.getPrevTriggerEl(ctx, evt.id)
            prev?.focus({ preventScroll: true })
          })
        },
        focusFirstTrigger(ctx) {
          raf(() => {
            const first = dom.getFirstTriggerEl(ctx)
            first?.focus({ preventScroll: true })
          })
        },
        focusLastTrigger(ctx) {
          raf(() => {
            const last = dom.getLastTriggerEl(ctx)
            last?.focus({ preventScroll: true })
          })
        },
      },
    },
  )
}
