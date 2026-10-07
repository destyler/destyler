import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'
import { MachineController } from '../src/controllers/machine-controller'

interface Context { count: number }
type Listener = (context: Context) => void

function createSource(count = 1) {
  const listeners = new Set<Listener>()
  const seen: Listener[] = []
  const calls = { subscribe: 0, dispose: 0 }
  const hooks: {
    get?: () => void
    beforeSubscribe?: () => void
    subscribe?: () => void
    beforeDispose?: () => void
    afterDispose?: () => void
  } = {}
  return {
    listeners,
    seen,
    calls,
    hooks,
    get() {
      hooks.get?.()
      return { count }
    },
    subscribe(listener: Listener) {
      hooks.beforeSubscribe?.()
      calls.subscribe++
      listeners.add(listener)
      seen.push(listener)
      hooks.subscribe?.()
      return () => {
        hooks.beforeDispose?.()
        listeners.delete(listener)
        calls.dispose++
        hooks.afterDispose?.()
      }
    },
    set(value: number) { count = value },
    emit(value: number) {
      count = value
      for (const listener of Array.from(listeners))
        listener({ count })
    },
  }
}

function createFixture(proxied = false) {
  let active = 0
  let update: (() => void) | undefined
  const source = createSource()
  const service = createMachine<Context, { value: 'idle' | 'alternate' }>({
    initial: 'idle',
    context: { count: 0 },
    activities: [() => {
      active++
      return () => {
        active--
      }
    }],
    states: { idle: {}, alternate: {} },
  })
  const host = {
    updateComplete: Promise.resolve(true),
    addController() {},
    removeController() {},
    requestUpdate() { update?.() },
  }
  const options = { context: source, sync: true }
  const original = new MachineController(host, service, options)
  const controller = proxied ? new Proxy(original, {}) : original
  return {
    controller,
    service,
    source,
    options,
    get active() { return active },
    onUpdate(callback?: () => void) { update = callback },
    dispose() {
      update = undefined
      controller.hostDisconnected()
      service.stop()
    },
  }
}

function exerciseSetup(boundary: 'get' | 'refresh' | 'subscribe', takeover: boolean, proxied = false) {
  const fixture = createFixture(proxied)
  const { controller, service, source } = fixture
  const next = createSource(9)
  let armed = false
  let interrupted = false
  const interrupt = () => {
    if (!armed || interrupted)
      return
    interrupted = true
    controller.hostDisconnected()
    if (takeover) {
      controller.setOptions({ context: next, state: { value: 'alternate' } })
      controller.hostConnected()
    }
  }
  try {
    controller.hostConnected()
    controller.hostDisconnected()
    source.set(5)
    if (boundary === 'get')
      source.hooks.get = interrupt
    if (boundary === 'subscribe')
      source.hooks.subscribe = interrupt
    if (boundary === 'refresh') {
      fixture.onUpdate(() => {
        if (controller.state.context.count === 5)
          interrupt()
      })
    }
    armed = true
    controller.hostConnected()
    expect(interrupted).toBe(true)
    expect(source.listeners.size).toBe(0)
    expect(source.calls.dispose).toBe(source.calls.subscribe)
    expect(fixture.options.context).toBe(source)
    expect('state' in fixture.options).toBe(false)
    expect(service.status).toBe(takeover ? MachineStatus.Running : MachineStatus.Stopped)
    expect(fixture.active).toBe(takeover ? 1 : 0)
    expect(next.listeners.size).toBe(takeover ? 1 : 0)
    if (takeover) {
      expect(controller.state.value).toBe('alternate')
      expect(controller.state.context.count).toBe(9)
      source.seen.at(-1)?.({ count: 99 })
      expect(controller.state.context.count).toBe(9)
    }
  }
  finally {
    armed = false
    fixture.dispose()
  }
  expect(next.listeners.size).toBe(0)
  expect(fixture.active).toBe(0)
}

describe('controller connection ownership', () => {
  it.each(['get', 'refresh', 'subscribe'] as const)('abandons setup after disconnect during %s', boundary => exerciseSetup(boundary, false))
  it.each(['get', 'refresh', 'subscribe'] as const)('retains the newest reconnect owner during %s', boundary => exerciseSetup(boundary, true))

  it('keeps ownership through a forwarded Proxy receiver', () => exerciseSetup('subscribe', true, true))

  it.each(['get', 'refresh', 'subscribe', 'dispose'] as const)('retains newer options during %s', boundary => exerciseOptions(boundary, false))
  it.each(['get', 'refresh', 'subscribe', 'dispose'] as const)('retains a newer connection during an options %s', boundary => exerciseOptions(boundary, true))

  it('preserves explicit disconnect cleanup after an interrupted core start resumes', () => {
    const fixture = createFixture()
    let armed = false
    let interrupted = false
    fixture.onUpdate(() => {
      if (armed && !interrupted) {
        interrupted = true
        fixture.controller.hostDisconnected()
      }
    })
    try {
      fixture.controller.hostConnected()
      fixture.controller.hostDisconnected()
      armed = true
      fixture.controller.hostConnected()
      expect(interrupted).toBe(true)
      // Core start may continue after the callback; an explicit cleanup must still work.
      fixture.controller.hostDisconnected()
      expect(fixture.service.status).toBe(MachineStatus.Stopped)
      expect(fixture.active).toBe(0)
      expect(fixture.source.listeners.size).toBe(0)
    }
    finally { fixture.dispose() }
  })

  it('does not reapply a plain initial context when reconnecting', () => {
    const fixture = createFixture()
    try {
      fixture.controller.setOptions({ context: { count: 2 } })
      fixture.controller.hostConnected()
      fixture.service.setContext({ count: 3 })
      fixture.controller.hostDisconnected()
      fixture.controller.hostConnected()
      expect(fixture.service.contextSnapshot.count).toBe(3)
    }
    finally { fixture.dispose() }
  })

  it.each(['get', 'subscribe'] as const)('preserves %s error identity', (boundary) => {
    const fixture = createFixture()
    const error = new Error(`failed ${boundary}`)
    const fail = () => {
      throw error
    }
    try {
      fixture.controller.hostConnected()
      fixture.controller.hostDisconnected()
      if (boundary === 'get')
        fixture.source.hooks.get = fail
      else
        fixture.source.hooks.beforeSubscribe = fail
      let caught: unknown
      try {
        fixture.controller.hostConnected()
      }
      catch (value) {
        caught = value
      }
      expect(caught).toBe(error)
      fixture.source.hooks.get = undefined
      fixture.source.hooks.beforeSubscribe = undefined
      fixture.controller.hostDisconnected()
      expect(fixture.source.listeners.size).toBe(0)
      expect(fixture.active).toBe(0)
      fixture.controller.hostConnected()
      expect(fixture.service.status).toBe(MachineStatus.Running)
      expect(fixture.source.listeners.size).toBe(1)
      expect(fixture.active).toBe(1)
    }
    finally {
      fixture.source.hooks.get = undefined
      fixture.source.hooks.beforeSubscribe = undefined
      fixture.dispose()
    }
  })

  it('retains a failed old disposer for an explicit cleanup retry', () => {
    const fixture = createFixture()
    const next = createSource(2)
    const error = new Error('old cleanup failed')
    try {
      fixture.controller.hostConnected()
      fixture.source.hooks.beforeDispose = () => {
        fixture.source.hooks.beforeDispose = undefined
        throw error
      }
      let caught: unknown
      try {
        fixture.controller.setOptions({ context: next })
      }
      catch (value) {
        caught = value
      }
      expect(caught).toBe(error)
      expect(next.calls.subscribe).toBe(0)
      fixture.controller.hostDisconnected()
      expect(fixture.source.listeners.size).toBe(0)
      expect(fixture.source.calls.dispose).toBe(1)
      expect(fixture.active).toBe(0)
    }
    finally {
      fixture.source.hooks.beforeDispose = undefined
      fixture.dispose()
    }
  })

  it('surfaces a late cleanup error without overwriting the newer owner', () => {
    const fixture = createFixture()
    const next = createSource(9)
    const error = new Error('late cleanup failed')
    try {
      fixture.controller.hostConnected()
      fixture.controller.hostDisconnected()
      fixture.source.hooks.subscribe = () => {
        fixture.controller.hostDisconnected()
        fixture.controller.setOptions({ context: next })
        fixture.controller.hostConnected()
      }
      fixture.source.hooks.afterDispose = () => {
        throw error
      }
      let caught: unknown
      try {
        fixture.controller.hostConnected()
      }
      catch (value) {
        caught = value
      }
      expect(caught).toBe(error)
      expect(fixture.source.listeners.size).toBe(0)
      expect(next.listeners.size).toBe(1)
      expect(fixture.service.status).toBe(MachineStatus.Running)
      expect(fixture.active).toBe(1)
      next.emit(10)
      expect(fixture.controller.state.context.count).toBe(10)
      fixture.controller.hostDisconnected()
      expect(next.listeners.size).toBe(0)
      expect(fixture.active).toBe(0)
    }
    finally {
      fixture.source.hooks.afterDispose = undefined
      fixture.dispose()
    }
  })
})

function exerciseOptions(boundary: 'get' | 'refresh' | 'subscribe' | 'dispose', takeover: boolean) {
  const fixture = createFixture()
  const { controller, service, source } = fixture
  const incoming = createSource(2)
  const next = createSource(3)
  const options = { context: incoming }
  let replaced = false
  const replace = () => {
    if (replaced)
      return
    replaced = true
    if (takeover)
      controller.hostDisconnected()
    controller.setOptions({ context: next, state: { value: 'alternate' } })
    if (takeover)
      controller.hostConnected()
  }
  try {
    controller.hostConnected()
    if (boundary === 'get')
      incoming.hooks.get = replace
    if (boundary === 'subscribe')
      incoming.hooks.subscribe = replace
    if (boundary === 'dispose')
      source.hooks.beforeDispose = replace
    if (boundary === 'refresh') {
      fixture.onUpdate(() => {
        if (controller.state.context.count === 2)
          replace()
      })
    }
    controller.setOptions(options)
    expect(replaced).toBe(true)
    expect(options.context).toBe(incoming)
    expect(fixture.options.context).toBe(source)
    expect(controller.state.context.count).toBe(3)
    expect(service.status).toBe(MachineStatus.Running)
    expect(fixture.active).toBe(1)
    expect(source.listeners.size).toBe(0)
    expect(incoming.listeners.size).toBe(0)
    expect(next.listeners.size).toBe(1)
    source.seen.at(-1)?.({ count: 77 })
    incoming.seen.at(-1)?.({ count: 88 })
    expect(controller.state.context.count).toBe(3)
    next.emit(4)
    expect(controller.state.context.count).toBe(4)
  }
  finally { fixture.dispose() }
  for (const item of [source, incoming, next]) {
    expect(item.listeners.size).toBe(0)
    expect(item.calls.dispose).toBe(item.calls.subscribe)
  }
  expect(fixture.active).toBe(0)
}
