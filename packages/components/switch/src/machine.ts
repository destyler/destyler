import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { dispatchInputCheckedEvent, trackFormControl, trackPress } from '@destyler/dom'
import { trackFocusVisible } from '@destyler/focus-visible'
import { compact, isControlled, isEqual, isPropUserProvided, resolveControllableProp, withControllableProvided } from '@destyler/utils'
import { createMachine, guards } from '@destyler/xstate'
import { dom } from './dom'

const { not } = guards

const invoke = {
  change: (ctx: MachineContext, checked: boolean) => {
    ctx.onCheckedChange?.({ checked })
  },
}

const set = {
  checked: (ctx: MachineContext, checked: boolean) => {
    if (isEqual(ctx.checked, checked))
      return
    // Phase 2 dual-track: flag or stamped prop presence (#103)
    if (isControlled(ctx, 'checked')) {
      invoke.change(ctx, checked)
      return
    }
    ctx.checked = checked
    invoke.change(ctx, checked)
  },
}

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(withControllableProvided(userContext as Record<string, unknown>, ['checked'])) as typeof userContext
  const { initial: initialChecked } = resolveControllableProp({
    value: ctx.checked,
    defaultValue: ctx.defaultChecked,
    valueProvided: isPropUserProvided(ctx as Record<string, unknown>, 'checked'),
    fallback: false,
  })
  return createMachine<MachineContext, MachineState>(
    {
      id: 'switch',
      initial: 'ready',

      context: {
        label: 'switch',
        value: 'on',
        disabled: false,
        ...ctx,
        // Resolve after spread so defaultChecked / legacy checked seed win consistently
        checked: initialChecked,
        fieldsetDisabled: false,
        focusVisible: false,
      },

      computed: {
        isDisabled: ctx => !!ctx.disabled || ctx.fieldsetDisabled,
      },

      watch: {
        disabled: 'removeFocusIfNeeded',
        checked: 'syncInputElement',
      },

      activities: ['trackFormControlState', 'trackPressEvent', 'trackFocusVisible'],

      on: {
        'CHECKED.TOGGLE': [
          {
            guard: not('isTrusted'),
            actions: ['toggleChecked', 'dispatchChangeEvent'],
          },
          {
            actions: ['toggleChecked'],
          },
        ],
        'CHECKED.SET': [
          {
            guard: not('isTrusted'),
            actions: ['setChecked', 'dispatchChangeEvent'],
          },
          {
            actions: ['setChecked'],
          },
        ],
        'CONTEXT.SET': {
          actions: ['setContext'],
        },
      },

      states: {
        ready: {},
      },
    },
    {
      guards: {
        isTrusted: (_ctx, evt) => !!evt.isTrusted,
      },
      activities: {
        trackPressEvent(ctx) {
          if (ctx.isDisabled)
            return
          return trackPress({
            pointerNode: dom.getRootEl(ctx),
            keyboardNode: dom.getHiddenInputEl(ctx),
            isValidKey: event => event.key === ' ',
            onPress: () => (ctx.active = false),
            onPressStart: () => (ctx.active = true),
            onPressEnd: () => (ctx.active = false),
          })
        },
        trackFocusVisible(ctx) {
          if (ctx.isDisabled)
            return
          return trackFocusVisible({ root: dom.getRootNode(ctx) })
        },
        trackFormControlState(ctx, _evt, { send, initialContext }) {
          return trackFormControl(dom.getHiddenInputEl(ctx), {
            onFieldsetDisabledChange(disabled) {
              ctx.fieldsetDisabled = disabled
            },
            onFormReset() {
              send({ type: 'CHECKED.SET', checked: !!initialContext.checked, src: 'form-reset' })
            },
          })
        },
      },

      actions: {
        setContext(ctx, evt) {
          Object.assign(ctx, evt.context)
        },
        syncInputElement(ctx) {
          const inputEl = dom.getHiddenInputEl(ctx)
          if (!inputEl)
            return
          inputEl.checked = !!ctx.checked
        },
        removeFocusIfNeeded(ctx) {
          if (ctx.disabled && ctx.focused) {
            ctx.focused = false
          }
        },
        setChecked(ctx, evt) {
          set.checked(ctx, evt.checked)
        },
        toggleChecked(ctx, _evt) {
          set.checked(ctx, !ctx.checked)
        },
        dispatchChangeEvent(ctx) {
          const inputEl = dom.getHiddenInputEl(ctx)
          dispatchInputCheckedEvent(inputEl, { checked: !!ctx.checked })
        },
      },
    },
  )
}
