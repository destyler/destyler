import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'
import { MachineController } from '../src/controllers/machine-controller'

interface Context { count: number }
interface State { value: 'idle' }

function createSource(count: number) {
  const listeners = new Set<(context: Partial<Context>) => void>()
  const calls = { subscribe: 0, dispose: 0 }
  const hooks: { dispose?: () => void } = {}
  return {
    listeners,
    calls,
    hooks,
    get: () => ({ count }),
    subscribe(listener: (context: Partial<Context>) => void) {
      calls.subscribe++
      listeners.add(listener)
      return () => {
        calls.dispose++
        listeners.delete(listener)
        hooks.dispose?.()
      }
    },
  }
}

function createFixture(proxied = false) {
  const hooks: { exit?: () => void, beforeStop?: () => void, afterStop?: () => void, update?: () => void } = {}
  const calls = { active: 0, acquired: 0, cleaned: 0, stop: 0, exit: 0, depth: 0, maxDepth: 0 }
  const source = createSource(1)
  const service = createMachine<Context, State>({
    initial: 'idle',
    context: { count: 0 },
    exit: () => {
      calls.exit++
      hooks.exit?.()
    },
    activities: [() => {
      calls.active++
      calls.acquired++
      return () => {
        calls.active--
        calls.cleaned++
      }
    }],
    states: { idle: {} },
  })
  const stop = service.stop
  service.stop = () => {
    calls.stop++
    calls.maxDepth = Math.max(calls.maxDepth, ++calls.depth)
    try {
      hooks.beforeStop?.()
      const result = stop()
      hooks.afterStop?.()
      return result
    }
    finally { calls.depth-- }
  }
  const host = {
    updateComplete: Promise.resolve(true),
    addController() {},
    removeController() {},
    requestUpdate() { hooks.update?.() },
  }
  class Consumer extends MachineController<Context, State> {
    stopService = 'caller-owned'
    stopOwner = 'caller-owner'
  }
  const options = Object.freeze({ context: source, sync: true })
  const original = new Consumer(host, service, options)
  const controller = proxied ? new Proxy(original, {}) : original
  return {
    controller,
    service,
    source,
    options,
    hooks,
    calls,
    interruptStart() {
      controller.hostConnected()
      controller.hostDisconnected()
      let interrupted = false
      hooks.update = () => {
        if (!interrupted && service.status === MachineStatus.Stopped) {
          interrupted = true
          controller.hostDisconnected()
        }
      }
      controller.hostConnected()
      hooks.update = undefined
      expect(interrupted).toBe(true)
    },
    expectReleased() {
      expect(service.status).toBe(MachineStatus.Stopped)
      expect(source.listeners.size).toBe(0)
      expect(calls.active).toBe(0)
      expect(calls.cleaned).toBe(calls.acquired)
      expect(source.calls.dispose).toBe(source.calls.subscribe)
      expect(controller.stopService).toBe('caller-owned')
      expect(controller.stopOwner).toBe('caller-owner')
      expect(options.context).toBe(source)
    },
    cleanup() {
      hooks.exit = undefined
      hooks.beforeStop = undefined
      hooks.afterStop = undefined
      hooks.update = undefined
      source.hooks.dispose = undefined
      controller.hostDisconnected()
      service.stop()
    },
  }
}

describe('controller explicit stop recovery', () => {
  it.each([false, true])('recovers after a real root exit failure (Proxy: %s)', (proxied) => {
    const t = createFixture(proxied)
    const failure = new Error('root exit failed')
    let fail = true
    t.hooks.exit = () => {
      if (fail) {
        fail = false
        throw failure
      }
    }
    try {
      t.controller.hostConnected()
      let caught: unknown
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { caught = error }
      expect(caught).toBe(failure)
      t.controller.hostDisconnected()
      t.expectReleased()
      t.controller.hostConnected()
      expect(t.source.listeners.size).toBe(1)
      t.controller.hostDisconnected()
      t.expectReleased()
    }
    finally { t.cleanup() }
  })

  it.each([
    [false, 1],
    [false, 2],
    [true, 1],
    [true, 2],
  ] as const)('retains explicit retries across failures (interrupted: %s, failures: %s)', (interrupted, failures) => {
    const t = createFixture()
    const errors = Array.from({ length: failures }, (_, index) => new Error(`stop failed ${index}`))
    let attempts = 0
    const observed: unknown[] = []
    try {
      if (interrupted)
        t.interruptStart()
      else
        t.controller.hostConnected()
      t.hooks.beforeStop = () => {
        if (attempts < errors.length)
          throw errors[attempts++]
      }
      for (let index = 0; index <= failures; index++) {
        try {
          t.controller.hostDisconnected()
        }
        catch (error) { observed.push(error) }
      }
      expect(observed).toEqual(errors.slice(0, attempts))
      if (!interrupted)
        expect(attempts).toBe(failures)
      t.expectReleased()
      expect(t.calls.maxDepth).toBe(1)
    }
    finally { t.cleanup() }
  })

  it('keeps recursive disconnect inactive while a stop attempt throws', () => {
    const t = createFixture()
    const failure = new Error('recursive exit failed')
    let fail = true
    t.hooks.exit = () => {
      t.controller.hostDisconnected()
      if (fail) {
        fail = false
        throw failure
      }
    }
    try {
      t.controller.hostConnected()
      let caught: unknown
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { caught = error }
      expect(caught).toBe(failure)
      t.controller.hostDisconnected()
      t.expectReleased()
      expect(t.calls.maxDepth).toBe(1)
    }
    finally { t.cleanup() }
  })

  it('does not stop a newer connection acquired during source cleanup', () => {
    const t = createFixture()
    const next = createSource(9)
    let takeover = true
    t.source.hooks.dispose = () => {
      if (!takeover)
        return
      takeover = false
      t.controller.setOptions({ context: next })
      t.controller.hostConnected()
    }
    try {
      t.controller.hostConnected()
      const stops = t.calls.stop
      t.controller.hostDisconnected()
      expect(t.calls.stop).toBe(stops)
      expect(next.listeners.size).toBe(1)
      expect(t.service.contextSnapshot.count).toBe(9)
      for (const listener of next.listeners)
        listener({ count: 10 })
      expect(t.controller.state.context.count).toBe(10)
      t.controller.hostDisconnected()
      expect(next.listeners.size).toBe(0)
      expect(next.calls.dispose).toBe(next.calls.subscribe)
      t.expectReleased()
    }
    finally { t.cleanup() }
  })

  it('leaves a newer connection owned when the earlier stop throws', () => {
    const t = createFixture()
    const next = createSource(9)
    const failure = new Error('old stop failed')
    let takeover = true
    t.hooks.exit = () => {
      if (!takeover)
        return
      takeover = false
      t.controller.setOptions({ context: next })
      t.controller.hostConnected()
      throw failure
    }
    try {
      t.controller.hostConnected()
      let caught: unknown
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { caught = error }
      expect(caught).toBe(failure)
      expect(next.listeners.size).toBe(1)
      expect(t.calls.stop).toBe(1)
      t.controller.hostDisconnected()
      expect(next.listeners.size).toBe(0)
      expect(next.calls.dispose).toBe(next.calls.subscribe)
      t.expectReleased()
    }
    finally { t.cleanup() }
  })

  it('preserves stop-error precedence over a cleanup error and permits retry', () => {
    const t = createFixture()
    const sourceFailure = new Error('source cleanup failed')
    const stopFailure = new Error('stop failed')
    let fail = true
    t.source.hooks.dispose = () => {
      throw sourceFailure
    }
    t.hooks.exit = () => {
      if (fail) {
        fail = false
        throw stopFailure
      }
    }
    try {
      t.controller.hostConnected()
      let caught: unknown
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { caught = error }
      expect(caught).toBe(stopFailure)
      t.source.hooks.dispose = undefined
      t.controller.hostDisconnected()
      t.expectReleased()
    }
    finally { t.cleanup() }
  })

  it.each(['success', 'failure'] as const)('preserves a newer stop outcome when the older stop throws (%s)', (outcome) => {
    const t = createFixture()
    const outerFailure = new Error('older stop failed')
    const newerFailure = new Error('newer stop failed')
    let takeover = true
    let nestedError: unknown
    t.hooks.beforeStop = () => {
      if (outcome === 'failure' && t.calls.stop === 2)
        throw newerFailure
    }
    t.hooks.exit = () => {
      if (!takeover)
        return
      takeover = false
      t.controller.hostConnected()
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { nestedError = error }
      throw outerFailure
    }
    try {
      t.controller.hostConnected()
      let caught: unknown
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { caught = error }
      expect(caught).toBe(outerFailure)
      expect(nestedError).toBe(outcome === 'failure' ? newerFailure : undefined)
      const completedCalls = t.calls.stop
      t.controller.hostDisconnected()
      t.expectReleased()
      if (outcome === 'success')
        expect(t.calls.stop).toBe(completedCalls)
    }
    finally { t.cleanup() }
  })

  it('keeps dormant and completed disconnects inert', () => {
    const t = createFixture()
    try {
      t.controller.hostDisconnected()
      t.controller.hostDisconnected()
      expect(t.calls.stop).toBe(0)
      expect(t.source.calls.subscribe).toBe(0)
      t.controller.hostConnected()
      t.controller.hostDisconnected()
      const stops = t.calls.stop
      t.controller.hostDisconnected()
      expect(t.calls.stop).toBe(stops)
      t.expectReleased()
    }
    finally { t.cleanup() }
  })

  it('clears an inner failed attempt after the outer stop completes', () => {
    const t = createFixture()
    const failure = new Error('inner stop failed')
    let nestedError: unknown
    let takeover = true
    t.hooks.beforeStop = () => {
      if (t.calls.stop === 2)
        throw failure
    }
    t.hooks.exit = () => {
      if (!takeover)
        return
      takeover = false
      t.controller.hostConnected()
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { nestedError = error }
    }
    try {
      t.controller.hostConnected()
      t.controller.hostDisconnected()
      expect(nestedError).toBe(failure)
      t.expectReleased()
      const completedCalls = t.calls.stop
      t.controller.hostDisconnected()
      expect(t.calls.stop).toBe(completedCalls)
    }
    finally { t.cleanup() }
  })

  it('retains a newer failed run started after the older underlying stop completed', () => {
    const t = createFixture()
    const failure = new Error('newer run stop failed')
    let nestedError: unknown
    let takeover = true
    t.hooks.beforeStop = () => {
      if (t.calls.stop === 2)
        throw failure
    }
    t.hooks.afterStop = () => {
      if (!takeover)
        return
      takeover = false
      t.controller.hostConnected()
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { nestedError = error }
    }
    try {
      t.controller.hostConnected()
      t.controller.hostDisconnected()
      expect(nestedError).toBe(failure)
      t.controller.hostDisconnected()
      t.expectReleased()
    }
    finally { t.cleanup() }
  })

  it('preserves an error after completed cleanup without retaining an obsolete retry', () => {
    const t = createFixture()
    const failure = new Error('error after completed stop')
    t.hooks.afterStop = () => {
      throw failure
    }
    try {
      t.controller.hostConnected()
      let caught: unknown
      try {
        t.controller.hostDisconnected()
      }
      catch (error) { caught = error }
      expect(caught).toBe(failure)
      t.expectReleased()
      const completedCalls = t.calls.stop
      t.controller.hostDisconnected()
      expect(t.calls.stop).toBe(completedCalls)
    }
    finally { t.cleanup() }
  })
})
