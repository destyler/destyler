import { expect, it, describe } from 'vitest'
import { choose, guards } from '../index'

const { not, and, or, stateIn } = guards

const context = {
  values: [],
  focusable: true,
  disabled: true,
  count: 5,
}

const event = {
  type: 'testing',
  value: 'test-value',
}

const meta = {
  state: {
    matches: (...values: any[]) => values.includes('active') || values.includes('enabled')
  }
}

type Context = typeof context

const guardMap = {
  isEmpty: (ctx: Context) => ctx.values.length === 0,
  isDisabled: (ctx: Context) => !ctx.focusable && ctx.disabled,
  isFocusable: (ctx: Context) => ctx.focusable,
  hasValues: (ctx: Context) => ctx.values.length > 0,
  isCountPositive: (ctx: Context) => ctx.count > 0,
  isCountGreaterThan3: (ctx: Context) => ctx.count > 3,
}

describe('choose function', () => {
  it('resolve choose action - false guard', () => {
    const actions = choose([
      {
        guard: not('isEmpty'),
        actions: ['log'],
      },
      {
        actions: ['test'],
      },
    ])
    const getResult = actions.predicate(guardMap)
    expect(getResult(context, event, meta)).toMatchObject(['test'])
  })

  it('resolve choose action - true guard', () => {
    const actions = choose([
      {
        guard: 'isEmpty',
        actions: ['log'],
      },
      {
        actions: ['test'],
      },
    ])
    const getResult = actions.predicate(guardMap)
    expect(getResult(context, event, meta)).toMatchObject(['log'])
  })

  it('resolve choose action - no guard (default)', () => {
    const actions = choose([
      {
        actions: ['default'],
      },
    ])
    const getResult = actions.predicate(guardMap)
    expect(getResult(context, event, meta)).toMatchObject(['default'])
  })

  it('resolve choose action - function guard', () => {
    const actions = choose([
      {
        guard: (ctx: Context) => ctx.count > 10,
        actions: ['high'],
      },
      {
        guard: (ctx: Context) => ctx.count > 0,
        actions: ['positive'],
      },
    ])
    const getResult = actions.predicate(guardMap)
    expect(getResult(context, event, meta)).toMatchObject(['positive'])
  })

  it('resolve choose action - no matching guard', () => {
    const actions = choose([
      {
        guard: 'hasValues',
        actions: ['log'],
      },
    ])
    const getResult = actions.predicate(guardMap)
    expect(getResult(context, event, meta)).toBeUndefined()
  })
})

describe('guard helpers', () => {
  describe('not guard', () => {
    it('should negate string guard', () => {
      const notEmptyGuard = not('isEmpty')
      const getResult = notEmptyGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(false)
    })

    it('should negate function guard', () => {
      const notPositiveGuard = not((ctx: Context) => ctx.count > 0)
      const getResult = notPositiveGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(false)
    })
  })

  describe('and guard', () => {
    it('should return true when all guards are true', () => {
      const allTrueGuard = and('isEmpty', 'isFocusable')
      const getResult = allTrueGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(true)
    })

    it('should return false when any guard is false', () => {
      const mixedGuard = and('isEmpty', 'hasValues')
      const getResult = mixedGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(false)
    })

    it('should work with function guards', () => {
      const functionGuard = and(
        (ctx: Context) => ctx.count > 0,
        (ctx: Context) => ctx.count < 10
      )
      const getResult = functionGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(true)
    })
  })

  describe('or guard', () => {
    it('should return true when any guard is true', () => {
      const anyTrueGuard = or('isEmpty', 'hasValues')
      const getResult = anyTrueGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(true)
    })

    it('should return false when all guards are false', () => {
      const allFalseGuard = or('hasValues', 'isDisabled')
      const getResult = allFalseGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(false)
    })

    it('should work with mixed guard types', () => {
      const mixedGuard = or(
        'hasValues',
        (ctx: Context) => ctx.count > 0
      )
      const getResult = mixedGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(true)
    })
  })

  describe('stateIn guard', () => {
    it('should return true when state matches', () => {
      const stateGuard = stateIn('active', 'enabled')
      expect(stateGuard(context, event, meta)).toBe(true)
    })

    it('should return false when state does not match', () => {
      const stateGuard = stateIn('inactive', 'disabled')
      expect(stateGuard(context, event, meta)).toBe(false)
    })
  })

  describe('complex guard combinations', () => {
    it('should handle nested guard combinations', () => {
      const complexGuard = or(
        and('isEmpty', 'isFocusable'),
        not('isDisabled')
      )
      const getResult = complexGuard.predicate(guardMap)
      expect(getResult(context, event, meta)).toBe(true)
    })

    it('should work in choose with complex guards', () => {
      const actions = choose([
        {
          guard: and('isEmpty', not('isDisabled')),
          actions: ['complexAction'],
        },
        {
          actions: ['fallback'],
        },
      ])
      const getResult = actions.predicate(guardMap)
      expect(getResult(context, event, meta)).toMatchObject(['complexAction'])
    })
  })
})

describe('edge cases', () => {
  it('should handle empty guard map', () => {
    const actions = choose([
      {
        guard: (ctx: Context) => ctx.count > 0,
        actions: ['function-guard'],
      },
    ])
    const getResult = actions.predicate({})
    expect(getResult(context, event, meta)).toMatchObject(['function-guard'])
  })

  it('should handle undefined guard in choose', () => {
    const actions = choose([
      {
        actions: ['always-execute'],
      },
    ])
    const getResult = actions.predicate(guardMap)
    expect(getResult(context, event, meta)).toMatchObject(['always-execute'])
  })

  it('should handle non-existent guard in map', () => {
    const actions = choose([
      {
        guard: 'nonExistentGuard',
        actions: ['should-not-execute'],
      },
      {
        actions: ['fallback'],
      },
    ])
    const getResult = actions.predicate(guardMap)
    expect(getResult(context, event, meta)).toMatchObject(['fallback'])
  })
})
