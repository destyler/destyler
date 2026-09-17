import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { add, compact, isControlled, isEqual, isPropUserProvided, remove, resolveControllableProp, withControllableProvided } from '@destyler/utils'
import { createMachine, guards } from '@destyler/xstate'
import { dom } from './dom'

const { and, not } = guards

const invoke = {
  change(ctx: MachineContext, value: string[]) {
    ctx.onValueChange?.({ value: Array.from(value) })
  },
  focusChange(ctx: MachineContext) {
    ctx.onFocusChange?.({ value: ctx.focusedValue })
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
  focusedValue(ctx: MachineContext, value: string | null) {
    if (isEqual(ctx.focusedValue, value))
      return
    ctx.focusedValue = value
    invoke.focusChange(ctx)
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
      id: 'accordion',
      initial: 'idle',

      context: {
        focusedValue: null,
        collapsible: false,
        multiple: false,
        orientation: 'vertical',
        ...ctx,
        // Resolve after spread so defaultValue / legacy value seed win consistently
        value: initialValue,
      },

      watch: {
        value: 'coarseValue',
        multiple: 'coarseValue',
      },

      created: 'coarseValue',

      computed: {
        isHorizontal: ctx => ctx.orientation === 'horizontal',
      },

      on: {
        'VALUE.SET': {
          actions: ['setValue'],
        },
      },

      states: {
        idle: {
          on: {
            'TRIGGER.FOCUS': {
              target: 'focused',
              actions: 'setFocusedValue',
            },
          },
        },
        focused: {
          on: {
            'GOTO.NEXT': {
              actions: 'focusNextTrigger',
            },
            'GOTO.PREV': {
              actions: 'focusPrevTrigger',
            },
            'TRIGGER.CLICK': [
              {
                guard: and('isExpanded', 'canToggle'),
                actions: ['collapse'],
              },
              {
                guard: not('isExpanded'),
                actions: ['expand'],
              },
            ],
            'GOTO.FIRST': {
              actions: 'focusFirstTrigger',
            },
            'GOTO.LAST': {
              actions: 'focusLastTrigger',
            },
            'TRIGGER.BLUR': {
              target: 'idle',
              actions: 'clearFocusedValue',
            },
          },
        },
      },
    },
    {
      guards: {
        canToggle: ctx => !!ctx.collapsible || !!ctx.multiple,
        isExpanded: (ctx, evt) => ctx.value.includes(evt.value),
      },
      actions: {
        collapse(ctx, evt) {
          const next = ctx.multiple ? remove(ctx.value, evt.value) : []
          set.value(ctx, ctx.multiple ? next : [])
        },
        expand(ctx, evt) {
          const next = ctx.multiple ? add(ctx.value, evt.value) : [evt.value]
          set.value(ctx, next)
        },
        focusFirstTrigger(ctx) {
          dom.getFirstTriggerEl(ctx)?.focus()
        },
        focusLastTrigger(ctx) {
          dom.getLastTriggerEl(ctx)?.focus()
        },
        focusNextTrigger(ctx) {
          if (!ctx.focusedValue)
            return
          const triggerEl = dom.getNextTriggerEl(ctx, ctx.focusedValue)
          triggerEl?.focus()
        },
        focusPrevTrigger(ctx) {
          if (!ctx.focusedValue)
            return
          const triggerEl = dom.getPrevTriggerEl(ctx, ctx.focusedValue)
          triggerEl?.focus()
        },
        setFocusedValue(ctx, evt) {
          set.focusedValue(ctx, evt.value)
        },
        clearFocusedValue(ctx) {
          set.focusedValue(ctx, null)
        },
        setValue(ctx, evt) {
          set.value(ctx, evt.value)
        },
        coarseValue(ctx) {
          if (!ctx.multiple && ctx.value.length > 1) {
            ctx.value = [ctx.value[0]]
            throw new Error(`The value of accordion should be a single value when multiple is false.`)
          }
        },
      },
    },
  )
}
