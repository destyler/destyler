import { describe, expect, it, vi } from 'vitest'
import { createMachine, guards } from '../index'

const { stateIn, and, or, not } = guards

interface Context {
  count: number
}
interface State {
  value: 'open' | 'closed'
}

const service = createMachine<Context, State>({
  initial: 'open',
  context: { count: 0 },
  on: {
    CHECK: {
      guard: stateIn('open'),
      actions: ctx => ctx.count++,
    },
  },
  states: {
    open: {
      on: {
        TOGGLE: 'closed',
      },
    },
    closed: {
      on: {
        TOGGLE: 'open',
      },
    },
  },
})

describe('guards', () => {
  it('should work with \'in\' guard', () => {
    service.start().send('TOGGLE')
    expect(service.state.value).toBe('closed')

    service.send('CHECK')
    expect(service.state.context.count).toBe(0)

    service.send('TOGGLE')
    expect(service.state.value).toBe('open')

    service.send('CHECK')
    expect(service.state.context.count).toBe(1)
  })

  it('should work with \'and\' guard', () => {
    let actionExecuted = false

    const machine = createMachine({
      context: { value: 10, enabled: true },
      initial: 'idle',
      states: {
        idle: {
          on: {
            TEST: {
              guard: and(
                (ctx: any) => ctx.value > 5,
                (ctx: any) => ctx.enabled,
              ),
              actions: () => { actionExecuted = true },
            },
          },
        },
      },
    })

    machine.start().send('TEST')
    expect(actionExecuted).toBe(true)

    actionExecuted = false
    machine.setContext({ enabled: false })
    machine.send('TEST')
    expect(actionExecuted).toBe(false)
  })

  it('should work with \'or\' guard', () => {
    let actionExecuted = false

    const machine = createMachine({
      context: { admin: false, premium: true },
      initial: 'idle',
      states: {
        idle: {
          on: {
            ACCESS: {
              guard: or(
                (ctx: any) => ctx.admin,
                (ctx: any) => ctx.premium,
              ),
              actions: () => { actionExecuted = true },
            },
          },
        },
      },
    })

    machine.start().send('ACCESS')
    expect(actionExecuted).toBe(true)

    actionExecuted = false
    machine.setContext({ admin: false, premium: false })
    machine.send('ACCESS')
    expect(actionExecuted).toBe(false)
  })

  it('should work with \'not\' guard', () => {
    let actionExecuted = false

    const machine = createMachine({
      context: { loading: false },
      initial: 'idle',
      states: {
        idle: {
          on: {
            SUBMIT: {
              guard: not((ctx: any) => ctx.loading),
              actions: () => { actionExecuted = true },
            },
          },
        },
      },
    })

    machine.start().send('SUBMIT')
    expect(actionExecuted).toBe(true)

    actionExecuted = false
    machine.setContext({ loading: true })
    machine.send('SUBMIT')
    expect(actionExecuted).toBe(false)
  })

  it('should work with nested guard combinations', () => {
    let result = ''

    const machine = createMachine({
      context: { user: { role: 'admin', active: true }, quota: 100 },
      initial: 'idle',
      states: {
        idle: {
          on: {
            COMPLEX_CHECK: {
              guard: and(
                or(
                  (ctx: any) => ctx.user.role === 'admin',
                  (ctx: any) => ctx.user.role === 'moderator',
                ),
                (ctx: any) => ctx.user.active,
                not((ctx: any) => ctx.quota <= 0),
              ),
              actions: () => { result = 'allowed' },
            },
          },
        },
      },
    })

    machine.start().send('COMPLEX_CHECK')
    expect(result).toBe('allowed')

    result = ''
    machine.setContext({ user: { role: 'user', active: true }, quota: 100 })
    machine.send('COMPLEX_CHECK')
    expect(result).toBe('')
  })

  it('should work with string-based guards', () => {
    let actionExecuted = false

    const machine = createMachine({
      context: { authenticated: true },
      initial: 'idle',
      states: {
        idle: {
          on: {
            PROTECTED_ACTION: {
              guard: 'isAuthenticated',
              actions: () => { actionExecuted = true },
            },
          },
        },
      },
    }, {
      guards: {
        isAuthenticated: (ctx: any) => ctx.authenticated,
      },
    })

    machine.start().send('PROTECTED_ACTION')
    expect(actionExecuted).toBe(true)

    actionExecuted = false
    machine.setContext({ authenticated: false })
    machine.send('PROTECTED_ACTION')
    expect(actionExecuted).toBe(false)
  })

  it('should handle multiple guards with stateIn', () => {
    let results: string[] = []

    const machine = createMachine({
      context: { value: 0 },
      initial: 'a',
      on: {
        GLOBAL_CHECK: [
          {
            guard: stateIn('a'),
            actions: () => results.push('in-a'),
          },
          {
            guard: stateIn('b', 'c'),
            actions: () => results.push('in-b-or-c'),
          },
          {
            actions: () => results.push('fallback'),
          },
        ],
      },
      states: {
        a: { on: { NEXT: 'b' } },
        b: { on: { NEXT: 'c' } },
        c: { on: { NEXT: 'a' } },
      },
    })

    machine.start()

    machine.send('GLOBAL_CHECK')
    expect(results).toEqual(['in-a'])

    results = []
    machine.send('NEXT') // a -> b
    machine.send('GLOBAL_CHECK')
    expect(results).toEqual(['in-b-or-c'])

    results = []
    machine.send('NEXT') // b -> c
    machine.send('GLOBAL_CHECK')
    expect(results).toEqual(['in-b-or-c'])
  })

  it('should handle guards in transitions with multiple conditions', () => {
    let executedActions: string[] = []

    const machine = createMachine({
      context: { score: 85, premium: false },
      initial: 'idle',
      states: {
        idle: {
          on: {
            EVALUATE: [
              {
                guard: and(
                  (ctx: any) => ctx.score >= 90,
                  (ctx: any) => ctx.premium,
                ),
                actions: () => executedActions.push('premium-high'),
                target: 'premium',
              },
              {
                guard: (ctx: any) => ctx.score >= 90,
                actions: () => executedActions.push('high-score'),
                target: 'high',
              },
              {
                guard: (ctx: any) => ctx.score >= 70,
                actions: () => executedActions.push('medium-score'),
                target: 'medium',
              },
              {
                actions: () => executedActions.push('low-score'),
                target: 'low',
              },
            ],
          },
        },
        premium: {},
        high: {},
        medium: {},
        low: {},
      },
    })

    machine.start().send('EVALUATE')
    expect(executedActions).toEqual(['medium-score'])
    expect(machine.state.value).toBe('medium')

    executedActions = []
    machine.setContext({ score: 95, premium: true })
    machine.transition('idle', 'EVALUATE')
    expect(executedActions).toEqual(['premium-high'])
  })

  it('should handle guard errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    let actionExecuted = false

    const machine = createMachine({
      context: { value: 10 },
      initial: 'idle',
      states: {
        idle: {
          on: {
            TEST: {
              guard: 'nonExistentGuard',
              actions: () => { actionExecuted = true },
            },
          },
        },
      },
    })

    machine.start().send('TEST')
    expect(actionExecuted).toBe(true)

    consoleSpy.mockRestore()
  })

  it('should work with guards returning false', () => {
    let actionExecuted = false

    const machine = createMachine({
      context: { allowed: false },
      initial: 'idle',
      states: {
        idle: {
          on: {
            TRY_ACTION: {
              guard: (ctx: any) => ctx.allowed,
              actions: () => { actionExecuted = true },
            },
          },
        },
      },
    })

    machine.start().send('TRY_ACTION')
    expect(actionExecuted).toBe(false)
  })

  it('should evaluate guards in correct order', () => {
    const evaluationOrder: number[] = []

    const machine = createMachine({
      context: { value: 5 },
      initial: 'idle',
      states: {
        idle: {
          on: {
            TEST: [
              {
                guard: (ctx: any) => {
                  evaluationOrder.push(1)
                  return ctx.value > 10
                },
                actions: () => {},
              },
              {
                guard: (ctx: any) => {
                  evaluationOrder.push(2)
                  return ctx.value > 3
                },
                actions: () => {},
              },
              {
                guard: () => {
                  evaluationOrder.push(3)
                  return true
                },
                actions: () => {},
              },
            ],
          },
        },
      },
    })

    machine.start().send('TEST')
    expect(evaluationOrder).toEqual([1, 2, 2])
  })
})
