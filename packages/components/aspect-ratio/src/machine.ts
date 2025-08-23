import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { compact } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'

export function machine(userContext: UserDefinedContext) {
  const ctx = compact({
    ratio: 1,
    ...userContext,
  })

  return createMachine<MachineContext, MachineState>(
    {
      id: 'aspect-ratio',
      initial: 'idle',
      context: ctx,

      states: {
        idle: {
          on: {
            'RATIO.SET': {
              actions: ['setRatio'],
            },
          },
        },
      },
    },
    {
      actions: {
        setRatio(ctx, evt) {
          ctx.ratio = evt.ratio
        },
      },
    },
  )
}
