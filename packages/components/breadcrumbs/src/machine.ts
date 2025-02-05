import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { createMachine } from '@zag-js/core'
import { compact } from '@zag-js/utils'

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
