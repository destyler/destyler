import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { createMachine } from '@destyler/xstate'
import { compact } from '@destyler/utils'

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
