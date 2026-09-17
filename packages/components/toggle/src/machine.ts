import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { raf } from '@destyler/dom'
import { add, compact, isControlled, isEqual, isPropUserProvided, remove, resolveControllableProp, withControllableProvided } from '@destyler/utils'
import { createMachine, guards } from '@destyler/xstate'
import { dom } from './dom'

const { not, and } = guards

const invoke = {
  change(ctx: MachineContext, value: string[]) {
    ctx.onValueChange?.({ value: Array.from(value) })
  },
}

const set = {
  value(ctx: MachineContext, value: string[]) {
    if (isEqual(ctx.value, value))
      return
    // Phase 2 dual-track: flag or stamped prop presence (#103)
    if (isControlled(ctx, 'value')) {
      invoke.change(ctx, value)
      return
    }
    ctx.value = value
    invoke.change(ctx, value)
  },
}

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(withControllableProvided(userContext as Record<string, unknown>, ['value'])) as typeof userContext
  const { initial: initialValue } = resolveControllableProp({
    value: ctx.value,
    defaultValue: ctx.defaultValue,
    controlledFlag: ctx['value.controlled'],
    valueProvided: isPropUserProvided(ctx as Record<string, unknown>, 'value'),
    fallback: [] as string[],
  })
  return createMachine<MachineContext, MachineState>(
    {
      id: 'toggle-group',
      initial: 'idle',

      context: {
        disabled: false,
        orientation: 'horizontal',
        rovingFocus: true,
        loopFocus: true,
        ...ctx,
        // Resolve after spread so defaultValue / legacy value seed win consistently
        value: initialValue,
        focusedId: null,
        isTabbingBackward: false,
        isClickFocus: false,
        isWithinToolbar: false,
      },

      computed: {
        currentLoopFocus: ctx => ctx.loopFocus && !ctx.isWithinToolbar,
      },

      entry: ['checkIfWithinToolbar'],

      on: {
        'VALUE.SET': {
          actions: ['setValue'],
        },
        'TOGGLE.CLICK': {
          actions: ['setValue'],
        },
        'ROOT.MOUSE_DOWN': {
          actions: ['setClickFocus'],
        },
      },

      states: {
        idle: {
          on: {
            'ROOT.FOCUS': {
              target: 'focused',
              guard: not(and('isClickFocus', 'isTabbingBackward')),
              actions: ['focusFirstToggle', 'clearClickFocus'],
            },
            'TOGGLE.FOCUS': {
              target: 'focused',
              actions: ['setFocusedId'],
            },
          },
        },

        focused: {
          on: {
            'ROOT.BLUR': {
              target: 'idle',
              actions: ['clearIsTabbingBackward'],
            },
            'TOGGLE.FOCUS': {
              actions: ['setFocusedId'],
            },
            'TOGGLE.FOCUS_NEXT': {
              actions: ['focusNextToggle'],
            },
            'TOGGLE.FOCUS_PREV': {
              actions: ['focusPrevToggle'],
            },
            'TOGGLE.FOCUS_FIRST': {
              actions: ['focusFirstToggle'],
            },
            'TOGGLE.FOCUS_LAST': {
              actions: ['focusLastToggle'],
            },
            'TOGGLE.SHIFT_TAB': {
              target: 'idle',
              actions: ['setIsTabbingBackward'],
            },
          },
        },
      },
    },
    {
      guards: {
        isClickFocus: ctx => ctx.isClickFocus,
        isTabbingBackward: ctx => ctx.isTabbingBackward,
      },
      actions: {
        setIsTabbingBackward(ctx) {
          ctx.isTabbingBackward = true
        },
        clearIsTabbingBackward(ctx) {
          ctx.isTabbingBackward = false
        },
        setClickFocus(ctx) {
          ctx.isClickFocus = true
        },
        clearClickFocus(ctx) {
          ctx.isClickFocus = false
        },
        checkIfWithinToolbar(ctx) {
          const closestToolbar = dom.getRootEl(ctx)?.closest('[role=toolbar]')
          ctx.isWithinToolbar = !!closestToolbar
        },
        setFocusedId(ctx, evt) {
          ctx.focusedId = evt.id
        },
        clearFocusedId(ctx) {
          ctx.focusedId = null
        },
        setValue(ctx, evt) {
          if (!evt.value)
            return
          let next = Array.from(ctx.value)
          if (ctx.multiple) {
            next = next.includes(evt.value) ? remove(next, evt.value) : add(next, evt.value)
          }
          else {
            next = isEqual(ctx.value, [evt.value]) ? [] : [evt.value]
          }
          set.value(ctx, next)
        },
        focusNextToggle(ctx) {
          raf(() => {
            if (!ctx.focusedId)
              return
            dom.getNextEl(ctx, ctx.focusedId)?.focus({ preventScroll: true })
          })
        },
        focusPrevToggle(ctx) {
          raf(() => {
            if (!ctx.focusedId)
              return
            dom.getPrevEl(ctx, ctx.focusedId)?.focus({ preventScroll: true })
          })
        },
        focusFirstToggle(ctx) {
          raf(() => {
            dom.getFirstEl(ctx)?.focus({ preventScroll: true })
          })
        },
        focusLastToggle(ctx) {
          raf(() => {
            dom.getLastEl(ctx)?.focus({ preventScroll: true })
          })
        },
      },
    },
  )
}
