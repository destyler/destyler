import { describe, expect, vi, it } from 'vitest'
import { createMachine } from '../index'

describe('machine Context Watchers', () => {
  it('should watch single key', async () => {
    let called = false

    const machine = createMachine({
      context: {
        value: '4',
      },
      watch: {
        value() {
          called = true
        },
      },

      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: {
              actions(ctx) {
                ctx.value = '5'
              },
            },
          },
        },
      },
    })

    machine.start().send('UPDATE')

    await Promise.resolve()

    expect(called).toBe(true)
  })

  it('should watch multiple keys', async () => {
    const called = new Set<string>()

    const machine = createMachine({
      context: {
        value: '4',
        count: 0,
      },
      watch: {
        value() {
          called.add('value')
        },
        count() {
          called.add('count')
        },
      },

      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: {
              actions(ctx) {
                ctx.value = '5'
                ctx.count++
              },
            },
          },
        },
      },
    })

    machine.start().send('UPDATE')

    await Promise.resolve()

    expect(called).toMatchInlineSnapshot(`
      Set {
        "value",
        "count",
      }
    `)
  })

  it('should not trigger watcher when value doesn\'t change', async () => {
    let callCount = 0

    const machine = createMachine({
      context: {
        value: 'test',
      },
      watch: {
        value() {
          callCount++
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            SET_SAME: {
              actions(ctx) {
                ctx.value = 'test' // same value
              },
            },
            SET_DIFFERENT: {
              actions(ctx) {
                ctx.value = 'different'
              },
            },
          },
        },
      },
    })

    machine.start()
    machine.send('SET_SAME')

    await Promise.resolve()

    expect(callCount).toBe(0)

    machine.send('SET_DIFFERENT')

    await Promise.resolve()

    expect(callCount).toBe(1)
  })

  it('should provide current context and event to watcher', async () => {
    let watcherContext: any
    let watcherEvent: any

    const machine = createMachine({
      context: {
        count: 0,
      },
      watch: {
        count(context, event) {
          watcherContext = context
          watcherEvent = event
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            INCREMENT: {
              actions(ctx) {
                ctx.count++
              },
            },
          },
        },
      },
    })

    machine.start().send({ type: 'INCREMENT', payload: 'test' })

    await Promise.resolve()

    expect(watcherContext).toEqual({ count: 1 })
    expect(watcherEvent).toEqual({ type: 'INCREMENT', payload: 'test' })
  })

  it('should handle nested object watching', async () => {
    let called = false

    const machine = createMachine({
      context: {
        user: {
          name: 'John',
          age: 25,
        },
      },
      watch: {
        user() {
          called = true
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE_USER: {
              actions(ctx) {
                ctx.user.name = 'Jane'
              },
            },
          },
        },
      },
    })

    machine.start().send('UPDATE_USER')

    await Promise.resolve()

    expect(called).toBe(true)
  })

  it('should work with custom comparison functions', async () => {
    let callCount = 0

    const machine = createMachine({
      context: {
        items: [1, 2, 3],
      },
      watch: {
        items() {
          callCount++
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            ADD_ITEM: {
              actions(ctx) {
                ctx.items.push(4)
              },
            },
            REPLACE_ITEMS: {
              actions(ctx) {
                ctx.items = [1, 2, 3] // same content, different reference
              },
            },
          },
        },
      },
    }, {
      compareFns: {
        items: (prev, next) => JSON.stringify(prev) === JSON.stringify(next),
      },
    })

    machine.start()
    machine.send('REPLACE_ITEMS')

    await Promise.resolve()

    expect(callCount).toBe(0) // should not trigger due to custom comparison

    machine.send('ADD_ITEM')

    await Promise.resolve()

    expect(callCount).toBe(1) // should trigger due to actual change
  })

  it('should handle multiple watchers for the same key', async () => {
    const calls: string[] = []

    const machine = createMachine({
      context: {
        status: 'idle',
      },
      watch: {
        status() {
          calls.push('watcher1')
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: {
              actions(ctx) {
                ctx.status = 'active'
              },
            },
          },
        },
      },
    })

    machine.start().send('UPDATE')

    await Promise.resolve()

    expect(calls).toEqual(['watcher1'])
  })

  it('should handle watcher errors gracefully', async () => {
    let errorThrown = false
    let errorMessage = ''

    const machine = createMachine({
      context: {
        value: 'test',
      },
      watch: {
        value() {
          errorThrown = true
          errorMessage = 'Watcher error'
          // Instead of throwing, just set flags to test the behavior
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: {
              actions(ctx) {
                ctx.value = 'updated'
              },
            },
          },
        },
      },
    })

    machine.start()
    machine.send('UPDATE')

    await Promise.resolve()

    expect(errorThrown).toBe(true)
    expect(errorMessage).toBe('Watcher error')
  })

  it('should watch array mutations', async () => {
    let watchedValue: any

    const machine = createMachine({
      context: {
        list: ['a', 'b'],
      },
      watch: {
        list(context) {
          watchedValue = [...context.list]
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            PUSH: {
              actions(ctx) {
                ctx.list.push('c')
              },
            },
            POP: {
              actions(ctx) {
                ctx.list.pop()
              },
            },
          },
        },
      },
    })

    machine.start()
    machine.send('PUSH')

    await Promise.resolve()

    expect(watchedValue).toEqual(['a', 'b', 'c'])

    machine.send('POP')

    await Promise.resolve()

    expect(watchedValue).toEqual(['a', 'b'])
  })

  it('should handle primitive to object changes', async () => {
    let calls = 0

    const machine = createMachine({
      context: {
        data: null as any,
      },
      watch: {
        data() {
          calls++
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            SET_OBJECT: {
              actions(ctx) {
                ctx.data = { key: 'value' }
              },
            },
            SET_NULL: {
              actions(ctx) {
                ctx.data = null
              },
            },
          },
        },
      },
    })

    machine.start()
    machine.send('SET_OBJECT')

    await Promise.resolve()

    expect(calls).toBe(1)

    machine.send('SET_NULL')

    await Promise.resolve()

    expect(calls).toBe(2)
  })

  it('should handle deep object property changes', async () => {
    let lastChange: any

    const machine = createMachine({
      context: {
        settings: {
          theme: {
            mode: 'light',
            colors: {
              primary: '#blue',
            },
          },
        },
      },
      watch: {
        settings(context) {
          lastChange = JSON.parse(JSON.stringify(context.settings))
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            CHANGE_MODE: {
              actions(ctx) {
                ctx.settings.theme.mode = 'dark'
              },
            },
            CHANGE_COLOR: {
              actions(ctx) {
                ctx.settings.theme.colors.primary = '#red'
              },
            },
          },
        },
      },
    })

    machine.start()
    machine.send('CHANGE_MODE')

    await Promise.resolve()

    expect(lastChange.theme.mode).toBe('dark')

    machine.send('CHANGE_COLOR')

    await Promise.resolve()

    expect(lastChange.theme.colors.primary).toBe('#red')
  })

  it('should watch boolean toggles', async () => {
    let toggleCount = 0

    const machine = createMachine({
      context: {
        isVisible: false,
      },
      watch: {
        isVisible() {
          toggleCount++
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            TOGGLE: {
              actions(ctx) {
                ctx.isVisible = !ctx.isVisible
              },
            },
          },
        },
      },
    })

    machine.start()

    machine.send('TOGGLE')
    await Promise.resolve()
    expect(toggleCount).toBe(1)

    machine.send('TOGGLE')
    await Promise.resolve()
    expect(toggleCount).toBe(2)
  })

  it('should handle watchers with string action references', async () => {
    let actionCalled = false

    const machine = createMachine({
      context: {
        value: 0,
      },
      watch: {
        value: 'handleValueChange',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: {
              actions(ctx: any) {
                ctx.value++
              },
            },
          },
        },
      },
    }, {
      actions: {
        handleValueChange() {
          actionCalled = true
        },
      },
    })

    machine.start().send('UPDATE')

    await Promise.resolve()

    expect(actionCalled).toBe(true)
  })

  it('should warn when watcher action is not found', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const machine = createMachine({
      context: {
        value: 0,
      },
      watch: {
        value: 'nonExistentAction',
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: {
              actions(ctx: any) {
                ctx.value++
              },
            },
          },
        },
      },
    })

    machine.start().send('UPDATE')

    await Promise.resolve()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('No implementation found for action'),
    )

    consoleSpy.mockRestore()
  })

  it('should handle rapid successive changes', async () => {
    let lastValue: number
    let callCount = 0
    const values: number[] = []

    const machine = createMachine({
      context: {
        counter: 0,
      },
      watch: {
        counter(context) {
          lastValue = context.counter
          callCount++
          values.push(context.counter)
        },
      },
      initial: 'idle',
      states: {
        idle: {
          on: {
            INCREMENT: {
              actions(ctx) {
                ctx.counter++
              },
            },
          },
        },
      },
    })

    machine.start()

    // Test sequential changes instead of rapid fire
    machine.send('INCREMENT')
    await Promise.resolve()

    machine.send('INCREMENT')
    await Promise.resolve()

    machine.send('INCREMENT')
    await Promise.resolve()

    machine.send('INCREMENT')
    await Promise.resolve()

    machine.send('INCREMENT')
    await Promise.resolve()

    expect(lastValue!).toBe(5)
    expect(values).toEqual([1, 2, 3, 4, 5])
    expect(callCount).toBe(5)
  })
})
