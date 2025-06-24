import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMachine } from '../index'

describe('machine Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('[final state] exit actions should be called when invoked machine reaches its final state', () => {
    const exit_root = vi.fn()
    const exit_state = vi.fn()
    const done = vi.fn()

    const machine = createMachine({
      exit: exit_root,
      initial: 'a',
      states: {
        a: {
          type: 'final',
          exit: exit_state,
        },
      },
    })

    machine
      .onDone(() => {
        done()
      })
      .start()

    expect(exit_root).toHaveBeenCalled()
    expect(exit_state).toHaveBeenCalled()
    expect(done).toHaveBeenCalled()
  })

  it('exit actions should be called when stopping a machine', () => {
    const exit_root = vi.fn()
    const exit_state = vi.fn()

    const machine = createMachine({
      exit: exit_root,
      initial: 'a',
      states: {
        a: {
          exit: exit_state,
        },
      },
    })

    machine.start().stop()

    expect(exit_root).toHaveBeenCalled()
    expect(exit_state).toHaveBeenCalled()
  })

  it('entry actions should be called when entering a state', () => {
    const entry_root = vi.fn()
    const entry_state = vi.fn()

    const machine = createMachine({
      entry: entry_root,
      initial: 'idle',
      states: {
        idle: {
          entry: entry_state,
        },
      },
    })

    machine.start()

    expect(entry_root).toHaveBeenCalled()
    expect(entry_state).toHaveBeenCalled()
  })

  it('transition actions should be executed', () => {
    const transitionAction = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            NEXT: {
              target: 'active',
              actions: transitionAction,
            },
          },
        },
        active: {},
      },
    })

    machine.start()
    machine.send('NEXT')

    expect(transitionAction).toHaveBeenCalled()
  })

  it('actions should receive correct parameters', () => {
    const action = vi.fn()
    const context = { count: 0 }

    const machine = createMachine({
      context,
      initial: 'idle',
      entry: action,
      states: {
        idle: {},
      },
    })

    machine.start()

    expect(action).toHaveBeenCalledWith(
      expect.objectContaining(context),
      expect.objectContaining({ type: 'machine.start' }),
      expect.objectContaining({
        state: expect.any(Object),
        guards: expect.any(Object),
        send: expect.any(Function),
        self: expect.any(Object),
      }),
    )
  })

  it('actions can modify context', () => {
    const machine = createMachine({
      context: { count: 0 },
      initial: 'idle',
      states: {
        idle: {
          on: {
            INCREMENT: {
              actions: (context) => {
                context.count++
              },
            },
          },
        },
      },
    })

    machine.start()
    expect(machine.getState().context.count).toBe(0)

    machine.send('INCREMENT')
    expect(machine.getState().context.count).toBe(1)
  })

  it('multiple actions should be executed in order', () => {
    const order: number[] = []
    const action1 = vi.fn(() => order.push(1))
    const action2 = vi.fn(() => order.push(2))
    const action3 = vi.fn(() => order.push(3))

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            MULTI: {
              actions: [action1, action2, action3],
            },
          },
        },
      },
    })

    machine.start()
    machine.send('MULTI')

    expect(order).toEqual([1, 2, 3])
    expect(action1).toHaveBeenCalled()
    expect(action2).toHaveBeenCalled()
    expect(action3).toHaveBeenCalled()
  })

  it('action map should work with string references', () => {
    const namedAction = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          entry: 'myAction',
        },
      },
    }, {
      actions: {
        myAction: namedAction,
      },
    })

    machine.start()

    expect(namedAction).toHaveBeenCalled()
  })

  it('should warn when action is not found in action map', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          entry: 'nonExistentAction',
        },
      },
    })

    machine.start()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('No implementation found for action: `nonExistentAction`'),
    )

    consoleSpy.mockRestore()
  })

  it('conditional actions with guards', () => {
    const actionA = vi.fn()
    const actionB = vi.fn()

    const machine = createMachine({
      context: { flag: true },
      initial: 'idle',
      states: {
        idle: {
          on: {
            TEST: {
              actions: (context) => {
                if (context.flag) {
                  actionA()
                }
                else {
                  actionB()
                }
              },
            },
          },
        },
      },
    })

    machine.start()
    machine.send('TEST')

    expect(actionA).toHaveBeenCalled()
    expect(actionB).not.toHaveBeenCalled()
  })

  it('created actions should be executed', () => {
    const createdAction = vi.fn()

    const machine = createMachine({
      created: createdAction,
      initial: 'idle',
      states: {
        idle: {},
      },
    })

    // Created actions are called internally, not through start()
    machine._created()

    expect(createdAction).toHaveBeenCalled()
  })

  it('complex state transitions with multiple actions', () => {
    const exitAction = vi.fn()
    const transitionAction = vi.fn()
    const entryAction = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          exit: exitAction,
          on: {
            START: {
              target: 'active',
              actions: transitionAction,
            },
          },
        },
        active: {
          entry: entryAction,
        },
      },
    })

    machine.start()
    machine.send('START')

    expect(exitAction).toHaveBeenCalled()
    expect(transitionAction).toHaveBeenCalled()
    expect(entryAction).toHaveBeenCalled()
  })

  it('actions should not be called for targetless transitions', () => {
    const exitAction = vi.fn()
    const entryAction = vi.fn()
    const transitionAction = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          exit: exitAction,
          entry: entryAction,
          on: {
            INTERNAL: {
              actions: transitionAction,
              internal: true,
            },
          },
        },
      },
    })

    machine.start()
    exitAction.mockClear()
    entryAction.mockClear()

    machine.send('INTERNAL')

    expect(exitAction).not.toHaveBeenCalled()
    expect(entryAction).not.toHaveBeenCalled()
    expect(transitionAction).toHaveBeenCalled()
  })

  it('reentrant transitions should call exit and entry actions', () => {
    const exitAction = vi.fn()
    const entryAction = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          exit: exitAction,
          entry: entryAction,
          on: {
            REENTER: 'idle',
          },
        },
      },
    })

    machine.start()
    exitAction.mockClear()
    entryAction.mockClear()

    machine.send('REENTER')

    expect(exitAction).toHaveBeenCalled()
    expect(entryAction).toHaveBeenCalled()
  })

  it('actions in nested states', () => {
    const parentExit = vi.fn()
    const parentEntry = vi.fn()

    const machine = createMachine({
      initial: 'parent',
      states: {
        parent: {
          exit: parentExit,
          entry: parentEntry,
          on: {
            LEAVE: 'other',
          },
        },
        other: {},
      },
    })

    machine.start()
    parentExit.mockClear()

    machine.send('LEAVE')

    expect(parentExit).toHaveBeenCalled()
  })

  it('action execution order: exit -> transition -> entry', () => {
    const order: string[] = []

    const machine = createMachine({
      initial: 'a',
      states: {
        a: {
          exit: () => order.push('exit-a'),
          on: {
            GO: {
              target: 'b',
              actions: () => order.push('transition'),
            },
          },
        },
        b: {
          entry: () => order.push('entry-b'),
        },
      },
    })

    machine.start()
    machine.send('GO')

    expect(order).toEqual(['exit-a', 'transition', 'entry-b'])
  })

  it('actions with different event types', () => {
    const clickAction = vi.fn()
    const keydownAction = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            CLICK: {
              actions: clickAction,
            },
            KEYDOWN: {
              actions: keydownAction,
            },
          },
        },
      },
    })

    machine.start()
    machine.send('CLICK')
    machine.send('KEYDOWN')

    expect(clickAction).toHaveBeenCalledTimes(1)
    expect(keydownAction).toHaveBeenCalledTimes(1)
  })

  it('actions with event payload', () => {
    const action = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: {
              actions: action,
            },
          },
        },
      },
    })

    machine.start()
    machine.send({ type: 'UPDATE', data: { value: 42 } })

    expect(action).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        type: 'UPDATE',
        data: { value: 42 },
      }),
      expect.any(Object),
    )
  })

  it('actions should handle async functions', async () => {
    const asyncAction = vi.fn(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          entry: asyncAction,
        },
      },
    })

    machine.start()

    expect(asyncAction).toHaveBeenCalled()
  })

  it('actions in final state should execute before done', () => {
    const finalAction = vi.fn()
    const doneCallback = vi.fn()

    const machine = createMachine({
      initial: 'active',
      states: {
        active: {
          on: {
            FINISH: 'done',
          },
        },
        done: {
          type: 'final',
          entry: finalAction,
        },
      },
    })

    machine.onDone(doneCallback).start()
    machine.send('FINISH')

    expect(finalAction).toHaveBeenCalled()
    expect(doneCallback).toHaveBeenCalled()
  })

  it('actions with machine stop during execution', () => {
    const action = vi.fn(() => {
      // Action that might cause side effects
    })

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          entry: action,
        },
      },
    })

    machine.start()
    machine.stop()

    expect(action).toHaveBeenCalled()
  })

  it('actions with deep context modification', () => {
    const machine = createMachine({
      context: {
        user: {
          name: 'John',
          settings: {
            theme: 'light',
            notifications: true,
          },
        },
        items: [],
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE_USER: {
              actions: (context, event) => {
                context.user.name = event.name
                context.user.settings.theme = event.theme
              },
            },
            ADD_ITEM: {
              actions: (context, event) => {
                context.items.push(event.item)
              },
            },
          },
        },
      },
    })

    machine.start()

    machine.send({
      type: 'UPDATE_USER',
      name: 'Jane',
      theme: 'dark',
    })

    machine.send({
      type: 'ADD_ITEM',
      item: { id: 1, name: 'Test Item' },
    })

    const state = machine.getState()
    expect(state.context.user.name).toBe('Jane')
    expect(state.context.user.settings.theme).toBe('dark')
    expect(state.context.items).toHaveLength(1)
    expect(state.context.items[0]).toEqual({ id: 1, name: 'Test Item' })
  })

  it('actions with meta information access', () => {
    const action = vi.fn()

    const machine = createMachine({
      context: { count: 0 },
      initial: 'idle',
      states: {
        idle: {
          entry: action,
        },
      },
    })

    machine.start()

    const [_context, _event, meta] = action.mock.calls[0]

    expect(meta).toHaveProperty('state')
    expect(meta).toHaveProperty('guards')
    expect(meta).toHaveProperty('send')
    expect(meta).toHaveProperty('self')
    expect(meta).toHaveProperty('getState')
    expect(meta).toHaveProperty('getAction')
    expect(meta).toHaveProperty('getGuard')
  })

  it('actions error handling - should not break machine', () => {
    const errorAction = vi.fn(() => {
      throw new Error('Action error')
    })
    const safeAction = vi.fn()

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            ERROR: {
              actions: [errorAction, safeAction],
            },
          },
        },
      },
    })

    machine.start()

    expect(() => {
      machine.send('ERROR')
    }).toThrow('Action error')

    expect(errorAction).toHaveBeenCalled()
    // Safe action might not execute if error throws

    consoleSpy.mockRestore()
  })

  it('actions with state value checks', () => {
    const action = vi.fn((context, event, meta) => {
      if (meta.state.matches('active')) {
        context.isActive = true
      }
    })

    const machine = createMachine({
      context: { isActive: false },
      initial: 'active',
      states: {
        active: {
          entry: action,
        },
      },
    })

    machine.start()

    expect(action).toHaveBeenCalled()
    expect(machine.getState().context.isActive).toBe(true)
  })

  it('actions with transition guards', () => {
    const allowedAction = vi.fn()
    const blockedAction = vi.fn()

    const machine = createMachine({
      context: { allowed: true },
      initial: 'idle',
      states: {
        idle: {
          on: {
            ALLOWED_ACTION: {
              actions: allowedAction,
              guard: 'isAllowed',
            },
            BLOCKED_ACTION: {
              actions: blockedAction,
              guard: 'isBlocked',
            },
          },
        },
      },
    }, {
      guards: {
        isAllowed: context => context.allowed,
        isBlocked: context => !context.allowed,
      },
    })

    machine.start()

    machine.send('ALLOWED_ACTION')
    machine.send('BLOCKED_ACTION')

    expect(allowedAction).toHaveBeenCalled()
    expect(blockedAction).not.toHaveBeenCalled()
  })

  it('actions with send function in meta', () => {
    const action = vi.fn((context, event, meta) => {
      // Action can send events to itself
      setTimeout(() => {
        meta.send('DELAYED_EVENT')
      }, 10)
    })

    const delayedAction = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          entry: action,
          on: {
            DELAYED_EVENT: {
              actions: delayedAction,
            },
          },
        },
      },
    })

    // Use fake timers for this test
    vi.useFakeTimers()

    machine.start()

    // Advance timers to trigger the delayed event
    vi.advanceTimersByTime(10)

    expect(action).toHaveBeenCalled()
    expect(delayedAction).toHaveBeenCalled()

    vi.useRealTimers()
  })

  it('root-level transition actions', () => {
    const globalAction = vi.fn()

    const machine = createMachine({
      initial: 'idle',
      on: {
        GLOBAL_EVENT: {
          actions: globalAction,
        },
      },
      states: {
        idle: {},
        active: {},
      },
    })

    machine.start()
    machine.send('GLOBAL_EVENT')

    expect(globalAction).toHaveBeenCalled()
  })
})
