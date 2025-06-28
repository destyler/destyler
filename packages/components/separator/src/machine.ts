import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { compact } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'

export function machine(userContext: UserDefinedContext) {
  const ctx = compact({
    orientation: 'horizontal' as const,
    ...userContext,
  })

  return createMachine<MachineContext, MachineState>(
    {
      id: 'separator',
      initial: 'idle',
      context: ctx,

      states: {
        idle: {},
      },
    },
  )
}
