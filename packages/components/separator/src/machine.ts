import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { createMachine } from '@zag-js/core'
import { compact } from '@zag-js/utils'

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
