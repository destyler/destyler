import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { ContextSource } from '../src/controllers/context-input'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { contextSource, contextValue } from '../src/controllers/context-input'
import { MachineController } from '../src/controllers/machine-controller'

class Host implements ReactiveControllerHost {
  updateComplete = Promise.resolve(true)
  requestUpdate = vi.fn()
  removeController(_controller: ReactiveController) {}

  constructor(private connected = false) {}

  addController(controller: ReactiveController) {
    if (this.connected)
      controller.hostConnected?.()
  }
}

function createService<TContext extends Record<string, any>>(context: TContext, created?: (context: TContext) => void) {
  return createMachine<TContext>({
    initial: 'idle',
    context,
    created,
    states: { idle: {} },
  })
}

function createSource(count = 1) {
  const listeners = new Set<(context: Partial<{ count: number }>) => void>()
  const seen: Array<(context: Partial<{ count: number }>) => void> = []
  const cleanup = vi.fn()
  const hooks: { get?: () => void, subscribe?: () => void, cleanup?: () => void } = {}
  const source: ContextSource<{ count: number }> = {
    get() {
      hooks.get?.()
      return { count }
    },
    subscribe(listener) {
      listeners.add(listener)
      seen.push(listener)
      hooks.subscribe?.()
      return () => {
        listeners.delete(listener)
        cleanup()
        hooks.cleanup?.()
      }
    },
  }
  return {
    source,
    listeners,
    seen,
    cleanup,
    hooks,
    emit(value: number) {
      count = value
      for (const listener of listeners)
        listener({ count })
    },
  }
}

describe('explicit context inputs', () => {
  it.each(['absent', 'undefined', 'null', 'callable'] as const)(
    'applies ordinary subscribe data before created with %s get',
    (kind) => {
      const created = vi.fn()
      const get = vi.fn(() => ({ count: 42 }))
      const context = Object.freeze({
        count: 9,
        subscribe: 'ordinary-data',
        ...(kind === 'absent' ? {} : { get: kind === 'undefined' ? undefined : kind === 'null' ? null : get }),
      })
      const service = createService({ count: 0, subscribe: 'initial' }, created)
      const controller = new MachineController(new Host(), service, { context: contextValue(context), sync: true })
      try {
        expect(created.mock.calls[0][0]).toMatchObject({ count: 9, subscribe: 'ordinary-data' })
        // Machine.setContext omits undefined values, including an undefined get.
        expect(created.mock.calls[0][0].get).toBe(context.get)
        expect(get).not.toHaveBeenCalled()
        controller.hostConnected()
        controller.setOptions({ context: contextValue({ count: 10, subscribe: 'updated-data' }) })
        expect(controller.state.context).toMatchObject({ count: 10, subscribe: 'updated-data' })
        expect(get).not.toHaveBeenCalled()
      }
      finally {
        controller.hostDisconnected()
      }
    },
  )

  it('keeps callable get and subscribe as ordinary values on an already connected host', () => {
    const get = vi.fn(() => ({ count: 42 }))
    const subscribe = vi.fn(() => () => {})
    const context = Object.freeze({ count: 9, get, subscribe })
    const created = vi.fn()
    const service = createService({ count: 0, get, subscribe }, created)
    const controller = new MachineController(new Host(true), service, { context: contextValue(context), sync: true })
    try {
      expect(created.mock.calls[0][0]).toMatchObject(context)
      expect(controller.state.context.count).toBe(9)
      expect(controller.state.context.get).toBe(get)
      expect(controller.state.context.subscribe).toBe(subscribe)
      expect(service.status).toBe(MachineStatus.Running)
      service.setContext({ count: 10 })
      controller.hostDisconnected()
      controller.hostConnected()
      expect(controller.state.context.count).toBe(10)
      expect(get).not.toHaveBeenCalled()
      expect(subscribe).not.toHaveBeenCalled()
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('does not inspect inputs when wrapping, or probe source members when applying ordinary data', () => {
    const data = new Proxy({ count: 8, subscribe: 'data' }, {
      has() { throw new Error('unexpected classification probe') },
      get(target, key, receiver) {
        if (key === 'get')
          throw new Error('unexpected source getter')
        return Reflect.get(target, key, receiver)
      },
    })
    const input = contextValue(data)
    const source = new Proxy({} as ContextSource<{ count: number }>, {
      get() { throw new Error('wrapping must be lazy') },
      has() { throw new Error('wrapping must be lazy') },
    })
    expect(() => contextSource(source)).not.toThrow()
    const controller = new MachineController(new Host(), createService({ count: 0, subscribe: '' }), { context: input })
    try {
      controller.hostConnected()
      expect(controller.state.context.count).toBe(8)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('reads ordinary accessors exactly as setContext does, without calling their function values', () => {
    const trace: string[] = []
    const get = vi.fn(() => ({ count: 42 }))
    const subscribe = vi.fn(() => () => {})
    const context = {
      count: 8,
      get get() {
        trace.push('get:read')
        return get
      },
      get subscribe() {
        trace.push('subscribe:read')
        return subscribe
      },
    }
    const reference = createService({ count: 0, get, subscribe })
    reference.setContext(context)
    const expectedReads = trace.slice()
    trace.length = 0
    const input = contextValue(context)
    expect(trace).toEqual([])
    const controller = new MachineController(new Host(), createService({ count: 0, get, subscribe }), { context: input })
    try {
      expect(trace).toEqual(expectedReads)
      controller.hostConnected()
      expect(trace).toEqual(expectedReads)
      controller.setOptions({ context: input })
      expect(trace).toEqual([...expectedReads, ...expectedReads])
      expect(get).not.toHaveBeenCalled()
      expect(subscribe).not.toHaveBeenCalled()
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('preserves ordinary property errors at application rather than reading them in the factory', () => {
    const error = new Error('ordinary data read failed')
    const context = Object.defineProperty({ count: 8 }, 'subscribe', {
      enumerable: true,
      get() { throw error },
    })
    const input = contextValue(context)
    expect(() => new MachineController(new Host(), createService({ count: 0 }), { context: input })).toThrow(error)
  })

  it('orders source reads around created and connection and keeps the source receiver', () => {
    const trace: string[] = []
    let reads = 0
    const source: ContextSource<{ count: number }> = {
      get get() {
        trace.push('get:read')
        const count = ++reads
        return function () {
          expect(this).toBe(source)
          trace.push('get:call')
          return { count }
        }
      },
      get subscribe() {
        trace.push('subscribe:read')
        return function () {
          expect(this).toBe(source)
          trace.push('subscribe:call')
          return () => trace.push('cleanup')
        }
      },
    }
    const input = contextSource(source)
    expect(trace).toEqual([])
    const controller = new MachineController(new Host(), createService({ count: 0 }, () => trace.push('created')), { context: input, sync: true })
    try {
      expect(trace).toEqual(['get:read', 'get:call', 'created'])
      trace.length = 0
      controller.setOptions({ context: input })
      expect(trace).toEqual(['get:read', 'get:call'])
      trace.length = 0
      controller.hostConnected()
      expect(trace).toEqual(['get:read', 'get:call', 'subscribe:read', 'subscribe:call'])
      expect(controller.state.context.count).toBe(3)
    }
    finally {
      controller.hostDisconnected()
    }
    expect(trace.at(-1)).toBe('cleanup')
  })

  it('subscribes to an explicit source without probing for a subscribe property', () => {
    const original = createSource(4)
    const source = new Proxy(original.source, {
      has() { throw new Error('explicit sources do not need structural detection') },
    })
    const controller = new MachineController(new Host(true), createService({ count: 0 }), { context: contextSource(source), sync: true })
    try {
      expect(controller.state.context.count).toBe(4)
      expect(original.listeners.size).toBe(1)
      original.emit(5)
      expect(controller.state.context.count).toBe(5)
    }
    finally {
      controller.hostDisconnected()
    }
    expect(original.cleanup).toHaveBeenCalledOnce()
  })

  it('supports subscribe-only sources and clears their listener', () => {
    const original = createSource()
    const source = { subscribe: original.source.subscribe }
    const controller = new MachineController(new Host(), createService({ count: 0 }), { context: contextSource(source), sync: true })
    try {
      expect(controller.state.context.count).toBe(0)
      expect(original.listeners.size).toBe(0)
      controller.hostConnected()
      original.emit(6)
      expect(controller.state.context.count).toBe(6)
      controller.setOptions({ context: undefined })
      expect(original.listeners.size).toBe(0)
      original.seen[0]({ count: 99 })
      expect(controller.state.context.count).toBe(6)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('accepts an explicitly selected callable source object', () => {
    const original = createSource(6)
    const source = Object.assign(vi.fn(), original.source)
    const controller = new MachineController(new Host(true), createService({ count: 0 }), { context: contextSource(source), sync: true })
    try {
      expect(controller.state.context.count).toBe(6)
      expect(original.listeners.size).toBe(1)
      expect(source).not.toHaveBeenCalled()
    }
    finally {
      controller.hostDisconnected()
    }
    expect(original.listeners.size).toBe(0)
  })

  it('switches between explicit sources, ordinary values and legacy inputs without stale updates', () => {
    const first = createSource(1)
    const second = createSource(10)
    const controller = new MachineController(new Host(), createService({ count: 0 }), { context: contextSource(first.source), sync: true })
    try {
      controller.hostConnected()
      controller.setOptions({ context: contextValue({ count: 2 }) })
      expect(first.cleanup).toHaveBeenCalledOnce()
      first.seen[0]({ count: 99 })
      expect(controller.state.context.count).toBe(2)
      controller.setOptions({ context: contextSource(second.source) })
      expect(second.listeners.size).toBe(1)
      expect(controller.state.context.count).toBe(10)
      controller.hostDisconnected()
      second.emit(11)
      controller.hostConnected()
      expect(controller.state.context.count).toBe(11)
      expect(second.listeners.size).toBe(1)
      controller.setOptions({ context: first.source })
      expect(second.listeners.size).toBe(0)
      expect(first.listeners.size).toBe(1)
      controller.setOptions({ context: { count: 12 } })
      expect(first.listeners.size).toBe(0)
      expect(controller.state.context.count).toBe(12)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it.each(['get', 'subscribe', 'cleanup'] as const)('retains an explicit ordinary replacement during source %s', (boundary) => {
    const first = createSource()
    const next = createSource(2)
    const controller = new MachineController(new Host(), createService({ count: 0 }), { context: contextSource(first.source), sync: true })
    try {
      controller.hostConnected()
      const replace = () => controller.setOptions({ context: contextValue({ count: 9 }) })
      if (boundary === 'cleanup')
        first.hooks.cleanup = replace
      else
        next.hooks[boundary] = replace
      controller.setOptions({ context: contextSource(next.source) })
      expect(controller.state.context.count).toBe(9)
      expect(first.listeners.size).toBe(0)
      expect(next.listeners.size).toBe(0)
      next.seen.at(-1)?.({ count: 99 })
      expect(controller.state.context.count).toBe(9)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('keeps get, created and subscribe errors ordered for explicit sources', () => {
    const getError = new Error('get failed')
    const createdError = new Error('created failed')
    const subscribeError = new Error('subscribe failed')
    const source: ContextSource<{ count: number }> = {
      get() { throw getError },
      get subscribe(): ContextSource<{ count: number }>['subscribe'] { throw subscribeError },
    }
    const input = contextSource(source)
    expect(() => new MachineController(new Host(), createService({ count: 0 }), { context: input })).toThrow(getError)
    source.get = () => ({ count: 3 })
    expect(() => new MachineController(new Host(), createService({ count: 0 }, () => {
      throw createdError
    }), { context: input })).toThrow(createdError)
    const controller = new MachineController(new Host(), createService({ count: 0 }), { context: input })
    try {
      expect(() => controller.hostConnected()).toThrow(subscribeError)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('does not reinterpret an invalid explicit source as ordinary data at a JavaScript boundary', () => {
    const input = Reflect.apply(contextSource, undefined, [{ count: 99, get: 'ordinary-data', subscribe: () => () => {} }])
    expect(() => new MachineController(new Host(), createService({ count: 0 }), { context: input })).toThrow(TypeError)
  })

  it('preserves legacy option getter reads as well as source member order', () => {
    const trace: string[] = []
    const source: ContextSource<{ count: number }> = {
      get() {
        trace.push('get')
        return { count: 5 }
      },
      subscribe() {
        trace.push('subscribe')
        return () => {}
      },
    }
    const options = {
      get context() {
        trace.push('context')
        return source
      },
    }
    const controller = new MachineController(new Host(), createService({ count: 0 }, () => trace.push('created')), options)
    try {
      expect(trace).toEqual(['context', 'context', 'context', 'get', 'created'])
      trace.length = 0
      controller.hostConnected()
      expect(trace).toEqual(['context', 'get', 'subscribe'])
    }
    finally {
      controller.hostDisconnected()
    }
  })
})
