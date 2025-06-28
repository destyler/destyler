import type { MachineContext, MachineState, UserDefinedContext } from './types'
import { compact } from '@destyler/utils'
import { createMachine } from '@destyler/xstate'

export function machine(userContext: UserDefinedContext) {
  const ctx = compact(userContext)
  return createMachine<MachineContext, MachineState>(
    {
      id: 'label',
      initial: 'idle',
      context: {
        ...ctx,
        isHovered: false,
      },

      states: {
        idle: {
          on: {
            MOUSE_ENTER: {
              target: 'hovered',
              actions: ['setHovered'],
            },
          },
        },
        hovered: {
          on: {
            MOUSE_LEAVE: {
              target: 'idle',
              actions: ['clearHovered'],
            },
          },
        },
      },
    },
    {
      actions: {
        setHovered(ctx) {
          ctx.isHovered = true
        },
        clearHovered(ctx) {
          ctx.isHovered = false
        },
      },
    },
  )
}
