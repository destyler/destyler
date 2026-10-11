import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { createMachine } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { MachineController } from '../../src/controllers/machine-controller'

class Host implements ReactiveControllerHost {
  updateComplete = Promise.resolve(true)
  addController(_controller: ReactiveController) {}
  removeController(_controller: ReactiveController) {}
  requestUpdate() {}
}

function createService<TContext extends Record<string, unknown>>(context: TContext, created?: (context: TContext) => void) {
  return createMachine<TContext>({
    id: 'lit.context-discriminator',
    initial: 'idle',
    context,
    created,
    states: { idle: {} },
  })
}

describe('unresolved context classification requirements (expected to fail)', () => {
  it.each(['absent', 'undefined', 'null', 'callable'] as const)(
    'known residual: initializes ordinary subscribe data before created with %s get',
    (kind) => {
      const created = vi.fn()
      const machine = createService({ count: 0, subscribe: 'initial' }, created)
      const context = Object.freeze({
        count: 9,
        subscribe: 'ordinary-data',
        ...(kind === 'absent'
          ? {}
          : {
              get: kind === 'undefined' ? undefined : kind === 'null' ? null : () => ({ count: 42 }),
            }),
      })
      const controller = new MachineController(new Host(), machine, { context, sync: true })
      try {
        expect(created.mock.calls[0][0]).toMatchObject(context)
        controller.hostConnected()
        controller.setOptions({ context: { count: 10, subscribe: 'updated-data' } })
        expect(controller.state.context).toMatchObject({ count: 10, subscribe: 'updated-data' })
      }
      finally {
        controller.hostDisconnected()
      }
    },
  )
})
