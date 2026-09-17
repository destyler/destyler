import type { CheckedState, MachineContext, MachineState, UserDefinedContext } from './types'
import { dispatchInputCheckedEvent, setElementChecked, trackFormControl, trackPress } from '@destyler/dom'
import { trackFocusVisible } from '@destyler/focus-visible'
import { compact, isControlled, isEqual, isPropUserProvided, resolveControllableProp, withControllableProvided } from '@destyler/utils'
import { createMachine, guards } from '@destyler/xstate'
import { dom } from './dom'

const { not } = guards

function isIndeterminate(checked?: CheckedState): checked is 'indeterminate' {
  return checked === 'indeterminate'
}

function isChecked(checked?: CheckedState): checked is boolean {
  return isIndeterminate(checked) ? false : !!checked
}

const invoke = {
  change: (ctx: MachineContext, checked: CheckedState) => {
    ctx.onCheckedChange?.({ checked })
  },
}

const set = {
  checked: (ctx: MachineContext, checked: CheckedState) => {
    if (isEqual(ctx.checked, checked))
      return
    // Phase 2 dual-track: flag or stamped presence of `checked`
    if (isControlled(ctx, 'checked')) {
      invoke.change(ctx, checked)
      return
    }
    ctx.checked = checked
    invoke.change(ctx, checked)
  },
}

export function machine(userContext: UserDefinedContext) {
  // Phase 2: record user-provided `checked` before compact drops undefined keys
  const ctx = compact(withControllableProvided(userContext as Record<string, unknown>, ['checked'])) as typeof userContext
  const { initial: initialChecked } = resolveControllableProp({
    value: ctx.checked,
    defaultValue: ctx.defaultChecked,
    controlledFlag: ctx['checked.controlled'],
    valueProvided: isPropUserProvided(ctx as Record<string, unknown>, 'checked'),
    fallback: false as CheckedState,
  })
  return createMachine<MachineContext, MachineState>(
    {
      id: 'checkbox',
      initial: 'ready',

      context: {
        value: 'on',
        disabled: false,
        ...ctx,
        // Resolve after spread so defaultChecked / legacy checked seed win consistently
        checked: initialChecked,
        fieldsetDisabled: false,
        focusVisible: false,
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

      computed: {
        isIndeterminate: ctx => isIndeterminate(ctx.checked),
        isChecked: ctx => isChecked(ctx.checked),
        isDisabled: ctx => !!ctx.disabled || ctx.fieldsetDisabled,
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
              send({ type: 'CHECKED.SET', checked: !!initialContext.checked })
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
          setElementChecked(inputEl, ctx.isChecked)
          inputEl.indeterminate = ctx.isIndeterminate
        },
        removeFocusIfNeeded(ctx) {
          if (ctx.disabled && ctx.focused) {
            ctx.focused = false
            ctx.focusVisible = false
          }
        },
        setChecked(ctx, evt) {
          set.checked(ctx, evt.checked)
        },
        toggleChecked(ctx) {
          const checked = isIndeterminate(ctx.checked) ? true : !ctx.checked
          set.checked(ctx, checked)
        },
        dispatchChangeEvent(ctx) {
          const inputEl = dom.getHiddenInputEl(ctx)
          dispatchInputCheckedEvent(inputEl, { checked: isChecked(ctx.checked) })
        },
      },
    },
  )
}
