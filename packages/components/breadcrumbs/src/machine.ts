import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { compact } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'

export function machine(userContext: UserDefinedContext) {
  const ctx = compact({
    separator: '/',
    items: [],
    ...userContext,
  })

  return createMachine<MachineContext, MachineState>(
    {
      id: 'breadcrumbs',
      initial: 'idle',
      context: ctx,
      states: {
        idle: {},
      },
    },
  )
}
