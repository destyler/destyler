import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { clickIfLink, getFocusables, isAnchorElement, nextTick, raf } from '@destyler/dom'
import { trackElementRect } from '@destyler/element-rect'
import { compact, isControlledByFlag, isEqual, resolveControllableProp } from '@destyler/utils'
import { createMachine, guards } from '@destyler/xstate'
import { dom } from './dom'

const { not } = guards

const invoke = {
  change: (ctx: MachineContext, value: string | null) => {
    if (value == null)
      return
    ctx.onValueChange?.({ value })
  },
  focusChange: (ctx: MachineContext) => {
    if (ctx.focusedValue == null)
      return
    ctx.onFocusChange?.({ focusedValue: ctx.focusedValue })
  },
}

const set = {
  value: (ctx: MachineContext, value: string | null) => {
    if (isEqual(value, ctx.value))
      return
    // Dual-track: only defer context writes when value.controlled is set
    if (isControlledByFlag(ctx, 'value')) {
      invoke.change(ctx, value)
      return
    }
    ctx.value = value
    invoke.change(ctx, value)
  },
  focusedValue: (ctx: MachineContext, value: string | null) => {
    if (isEqual(value, ctx.focusedValue))
      return
    ctx.focusedValue = value
    invoke.focusChange(ctx)
  },
}

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)
  const { initial: initialValue } = resolveControllableProp({
    value: ctx.value,
    defaultValue: ctx.defaultValue,
    controlledFlag: ctx['value.controlled'],
    fallback: null as string | null,
  })
  return createMachine<MachineContext, MachineState>(
    {
      initial: 'idle',

      context: {
        dir: 'ltr',
        orientation: 'horizontal',
        activationMode: 'automatic',
        loopFocus: true,
        composite: true,
        navigate(details) {
          clickIfLink(details.node)
        },
        ...ctx,
        // Resolve after spread so defaultValue / legacy value seed win consistently
        value: initialValue,
        focusedValue: initialValue ?? null,
        ssr: true,
        indicatorState: {
          rendered: false,
          transition: false,
          rect: { left: '0px', top: '0px', width: '0px', height: '0px' },
        },
      },

      watch: {
        value: ['allowIndicatorTransition', 'syncIndicatorRect', 'syncTabIndex', 'navigateIfNeeded'],
        dir: ['syncIndicatorRect'],
        orientation: ['syncIndicatorRect'],
      },

      on: {
        SET_VALUE: {
          actions: 'setValue',
        },
        CLEAR_VALUE: {
          actions: 'clearValue',
        },
        SET_INDICATOR_RECT: {
          actions: 'setIndicatorRect',
        },
        SYNC_TAB_INDEX: {
          actions: 'syncTabIndex',
        },
      },

      created: ['syncFocusedValue'],

      entry: ['checkRenderedElements', 'syncIndicatorRect', 'syncTabIndex', 'syncSsr'],

      exit: ['cleanupObserver'],

      states: {
        idle: {
          on: {
            TAB_FOCUS: {
              target: 'focused',
              actions: 'setFocusedValue',
            },
            TAB_CLICK: {
              target: 'focused',
              actions: ['setFocusedValue', 'setValue'],
            },
          },
        },
        focused: {
          on: {
            TAB_CLICK: {
              target: 'focused',
              actions: ['setFocusedValue', 'setValue'],
            },
            ARROW_PREV: [
              {
                guard: 'selectOnFocus',
                actions: ['focusPrevTab', 'selectFocusedTab'],
              },
              {
                actions: 'focusPrevTab',
              },
            ],
            ARROW_NEXT: [
              {
                guard: 'selectOnFocus',
                actions: ['focusNextTab', 'selectFocusedTab'],
              },
              {
                actions: 'focusNextTab',
              },
            ],
            HOME: [
              {
                guard: 'selectOnFocus',
                actions: ['focusFirstTab', 'selectFocusedTab'],
              },
              {
                actions: 'focusFirstTab',
              },
            ],
            END: [
              {
                guard: 'selectOnFocus',
                actions: ['focusLastTab', 'selectFocusedTab'],
              },
              {
                actions: 'focusLastTab',
              },
            ],
            ENTER: {
              guard: not('selectOnFocus'),
              actions: 'selectFocusedTab',
            },
            TAB_FOCUS: {
              actions: ['setFocusedValue'],
            },
            TAB_BLUR: {
              target: 'idle',
              actions: 'clearFocusedValue',
            },
          },
        },
      },
    },
    {
      guards: {
        selectOnFocus: ctx => ctx.activationMode === 'automatic',
      },

      actions: {
        syncFocusedValue(ctx) {
          if (ctx.value != null && ctx.focusedValue == null) {
            ctx.focusedValue = ctx.value
          }
        },
        selectFocusedTab(ctx) {
          raf(() => {
            const nullable = ctx.deselectable && ctx.value === ctx.focusedValue
            const value = nullable ? null : ctx.focusedValue
            set.value(ctx, value)
          })
        },
        setFocusedValue(ctx, evt) {
          if (evt.value == null)
            return
          set.focusedValue(ctx, evt.value)
        },
        clearFocusedValue(ctx) {
          set.focusedValue(ctx, null)
        },
        setValue(ctx, evt) {
          const nullable = ctx.deselectable && ctx.value === ctx.focusedValue
          const value = nullable ? null : evt.value
          set.value(ctx, value)
        },
        clearValue(ctx) {
          set.value(ctx, null)
        },
        focusFirstTab(ctx) {
          raf(() => {
            dom.getFirstTriggerEl(ctx)?.focus()
          })
        },
        focusLastTab(ctx) {
          raf(() => {
            dom.getLastTriggerEl(ctx)?.focus()
          })
        },
        focusNextTab(ctx) {
          if (!ctx.focusedValue)
            return
          const triggerEl = dom.getNextTriggerEl(ctx, ctx.focusedValue)
          raf(() => {
            if (ctx.composite) {
              triggerEl?.focus()
            }
            else if (triggerEl?.dataset.value != null) {
              set.focusedValue(ctx, triggerEl.dataset.value)
            }
          })
        },
        focusPrevTab(ctx) {
          if (!ctx.focusedValue)
            return
          const triggerEl = dom.getPrevTriggerEl(ctx, ctx.focusedValue)
          raf(() => {
            if (ctx.composite) {
              triggerEl?.focus()
            }
            else if (triggerEl?.dataset.value != null) {
              set.focusedValue(ctx, triggerEl.dataset.value)
            }
          })
        },
        checkRenderedElements(ctx) {
          ctx.indicatorState.rendered = !!dom.getIndicatorEl(ctx)
        },
        syncTabIndex(ctx) {
          raf(() => {
            const contentEl = dom.getSelectedContentEl(ctx)
            if (!contentEl)
              return
            const focusables = getFocusables(contentEl)
            if (focusables.length > 0) {
              contentEl.removeAttribute('tabindex')
            }
            else {
              contentEl.setAttribute('tabindex', '0')
            }
          })
        },
        cleanupObserver(ctx) {
          ctx.indicatorCleanup?.()
        },
        allowIndicatorTransition(ctx) {
          ctx.indicatorState.transition = true
        },
        setIndicatorRect(ctx, evt) {
          const value = evt.id ?? ctx.value
          if (!ctx.indicatorState.rendered || !value)
            return

          const triggerEl = dom.getTriggerEl(ctx, value)
          if (!triggerEl)
            return

          ctx.indicatorState.rect = dom.getRectById(ctx, value)
          nextTick(() => {
            ctx.indicatorState.transition = false
          })
        },
        syncSsr(ctx) {
          ctx.ssr = false
        },
        syncIndicatorRect(ctx) {
          ctx.indicatorCleanup?.()

          const value = ctx.value
          if (!ctx.indicatorState.rendered || !value)
            return

          const triggerEl = dom.getSelectedTriggerEl(ctx)
          if (!triggerEl)
            return

          ctx.indicatorCleanup = trackElementRect(triggerEl, {
            getRect(el) {
              return dom.getOffsetRect(el)
            },
            onChange(rect) {
              ctx.indicatorState.rect = dom.resolveRect(rect)
              nextTick(() => {
                ctx.indicatorState.transition = false
              })
            },
          })
        },
        navigateIfNeeded(ctx) {
          const triggerEl = dom.getSelectedTriggerEl(ctx)
          if (!isAnchorElement(triggerEl))
            return
          ctx.navigate({ value: ctx.value, node: triggerEl })
        },
      },
    },
  )
}
