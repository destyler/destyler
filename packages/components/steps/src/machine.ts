import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { compact, isControlled, isEqual, isPropUserProvided, isValueWithinRange, resolveControllableProp, withControllableProvided } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'

function validateStep(ctx: MachineContext, step: number) {
  if (!isValueWithinRange(step, 0, ctx.count)) {
    throw new RangeError(`[destyler/steps] step index ${step} is out of bounds`)
  }
}

const set = {
  value(ctx: MachineContext, step: number) {
    if (isEqual(ctx.step, step))
      return
    validateStep(ctx, step)

    // Phase 2 dual-track: flag or stamped prop presence (#103)
    if (isControlled(ctx, 'step')) {
      ctx.onStepChange?.({ step })
      if (step === ctx.count)
        ctx.onStepComplete?.()
      return
    }

    ctx.step = step
    ctx.onStepChange?.({ step })

    if (ctx.completed) {
      ctx.onStepComplete?.()
    }
  },
}

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(withControllableProvided(userContext as Record<string, unknown>, ['step'])) as typeof userContext
  const { initial: initialStep } = resolveControllableProp({
    value: ctx.step,
    defaultValue: ctx.defaultStep,
    controlledFlag: ctx['step.controlled'],
    valueProvided: isPropUserProvided(ctx as Record<string, unknown>, 'step'),
    fallback: 0,
  })
  return createMachine<MachineContext, MachineState>(
    {
      id: 'steps',
      initial: 'idle',

      context: {
        step: 0,
        count: 1,
        linear: false,
        orientation: 'horizontal',
        ...ctx,
        // Resolve after spread so defaultStep / legacy step seed win consistently
        step: initialStep,
      },

      computed: {
        percent: ctx => (ctx.step / ctx.count) * 100,
        hasNextStep: ctx => ctx.step < ctx.count,
        hasPrevStep: ctx => ctx.step > 0,
        completed: ctx => ctx.step === ctx.count,
      },

      states: {
        idle: {
          on: {
            'STEP.SET': {
              actions: 'setStep',
            },
            'STEP.NEXT': {
              actions: 'goToNextStep',
            },
            'STEP.PREV': {
              actions: 'goToPrevStep',
            },
            'STEP.RESET': {
              actions: 'resetStep',
            },
          },
        },
      },
    },
    {
      actions: {
        goToNextStep(ctx) {
          const value = Math.min(ctx.step + 1, ctx.count)
          set.value(ctx, value)
        },
        goToPrevStep(ctx) {
          const value = Math.max(ctx.step - 1, 0)
          set.value(ctx, value)
        },
        resetStep(ctx) {
          set.value(ctx, 0)
        },
        setStep(ctx, evt) {
          set.value(ctx, evt.value)
        },
      },
    },
  )
}
