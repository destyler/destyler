import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type { ContextSource } from '../src/controllers/machine-controller'
import { createMachine } from '@destyler/xstate'
import { describe, expect, it } from 'vitest'
import { MachineController } from '../src/controllers/machine-controller'

interface Context { count: number }
type Listener = (context: Partial<Context>) => void

class Host implements ReactiveControllerHost {
  updateComplete = Promise.resolve(true)
  addController(_controller: ReactiveController) {}
  removeController(_controller: ReactiveController) {}
  requestUpdate() {}
}

function createService(created?: () => void) {
  return createMachine<Context>({
    id: 'lit.context-accessor-compatibility',
    initial: 'idle',
    context: { count: 0 },
    created,
    states: { idle: {} },
  })
}

function construct(source: ContextSource<Context>, created?: () => void) {
  return new MachineController(new Host(), createService(created), { context: source, sync: true })
}

describe('context source accessor compatibility', () => {
  it('reads get exactly once per refresh and calls that exact value with its receiver', () => {
    const receivers: unknown[] = []
    let reads = 0
    const source: ContextSource<Context> = {
      get get() {
        const count = ++reads
        return function (this: unknown) {
          receivers.push(this)
          return { count }
        }
      },
      subscribe: () => () => {},
    }
    const controller = construct(source)
    try {
      expect(reads).toBe(1)
      expect(controller.state.context.count).toBe(1)
      controller.hostConnected()
      expect(reads).toBe(2)
      expect(controller.state.context.count).toBe(2)
      controller.setOptions({ context: source })
      expect(reads).toBe(3)
      expect(controller.state.context.count).toBe(3)
      controller.hostDisconnected()
      controller.setOptions({ context: source })
      expect(reads).toBe(4)
      expect(controller.service.contextSnapshot.count).toBe(4)
      expect(receivers).toEqual([source, source, source, source])
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('does not inspect subscribe before connection, including disconnected option updates', () => {
    let reads = 0
    const source: ContextSource<Context> = {
      get: () => ({ count: 1 }),
      get subscribe() {
        reads++
        return () => () => {}
      },
    }
    const controller = construct(source)
    try {
      expect(reads).toBe(0)
      controller.setOptions({ context: source })
      expect(reads).toBe(0)
      controller.hostConnected()
      expect(reads).toBe(1)
      controller.hostDisconnected()
      controller.setOptions({ context: source })
      expect(reads).toBe(1)
      controller.hostConnected()
      expect(reads).toBe(2)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('allows get to initialize the subscribe accessor before it is evaluated', () => {
    let initialized = false
    const source: ContextSource<Context> = {
      get() {
        initialized = true
        return { count: 7 }
      },
      get subscribe() {
        if (!initialized)
          throw new Error('subscribe read before initialization')
        return () => () => {}
      },
    }
    const controller = construct(source)
    try {
      expect(controller.state.context.count).toBe(7)
      initialized = false
      controller.hostConnected()
      expect(initialized).toBe(true)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('keeps get, created and subscribe exceptions in their original order', () => {
    const getError = new Error('get failed first')
    const subscribeError = new Error('subscribe failed later')
    const createdError = new Error('created failed before connection')
    const source: ContextSource<Context> = {
      get() { throw getError },
      get subscribe(): ContextSource<Context>['subscribe'] { throw subscribeError },
    }
    expect(() => construct(source)).toThrow(getError)
    source.get = () => ({ count: 3 })
    expect(() => construct(source, () => {
      throw createdError
    })).toThrow(createdError)
    const controller = construct(source)
    try {
      expect(controller.state.context.count).toBe(3)
      expect(() => controller.hostConnected()).toThrow(subscribeError)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('reads subscribe after get has replaced its callable member', () => {
    const calls: string[] = []
    const source: ContextSource<Context> = {
      get() {
        source.subscribe = function () {
          expect(this).toBe(source)
          calls.push('current')
          return () => {}
        }
        return { count: 1 }
      },
      subscribe() {
        calls.push('stale')
        return () => {}
      },
    }
    const controller = construct(source)
    try {
      source.subscribe = () => {
        calls.push('stale')
        return () => {}
      }
      controller.hostConnected()
      expect(calls).toEqual(['current'])
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it.each(['own', 'inherited', 'descriptor-copy', 'proxy'] as const)(
    'preserves source access order and receiver for %s accessors',
    (kind) => {
      const trace: string[] = []
      const listeners = new Set<Listener>()
      let source: ContextSource<Context>
      const template: ContextSource<Context> = {
        get get() {
          expect(this).toBe(source)
          trace.push('get:read')
          return function (this: unknown) {
            expect(this).toBe(source)
            trace.push('get:call')
            return { count: 6 }
          }
        },
        get subscribe() {
          expect(this).toBe(source)
          trace.push('subscribe:read')
          return function (this: unknown, listener: Listener) {
            expect(this).toBe(source)
            trace.push('subscribe:call')
            listeners.add(listener)
            return () => {
              listeners.delete(listener)
            }
          }
        },
      }
      if (kind === 'own')
        source = template
      else if (kind === 'inherited')
        source = Object.create(template)
      else if (kind === 'descriptor-copy')
        source = Object.defineProperties({}, Object.getOwnPropertyDescriptors(template)) as ContextSource<Context>
      else
        source = new Proxy(template, {})
      Object.freeze(source)
      const controller = construct(source, () => {
        trace.push('created')
      })
      try {
        expect(trace).toEqual(['get:read', 'get:call', 'created'])
        trace.length = 0
        controller.hostConnected()
        expect(trace).toEqual(['get:read', 'get:call', 'subscribe:read', 'subscribe:call'])
        expect(listeners.size).toBe(1)
        for (const listener of listeners)
          listener({ count: 8 })
        expect(controller.state.context.count).toBe(8)
      }
      finally {
        controller.hostDisconnected()
      }
      expect(listeners.size).toBe(0)
    },
  )

  it('preserves proxy has/get behavior without adding descriptor or prototype inspection', () => {
    const trace: string[] = []
    const source: ContextSource<Context> = new Proxy({}, {
      has(_target, key) {
        trace.push(`has:${String(key)}`)
        return key === 'get' || key === 'subscribe'
      },
      get(_target, key) {
        trace.push(`get:${String(key)}`)
        if (key === 'get')
          return () => ({ count: 5 })
        if (key === 'subscribe')
          return () => () => {}
      },
      getOwnPropertyDescriptor() { throw new Error('unexpected descriptor inspection') },
      getPrototypeOf() { throw new Error('unexpected prototype inspection') },
    }) as ContextSource<Context>
    const controller = construct(source)
    try {
      expect(trace).toEqual(['has:subscribe', 'get:get'])
      trace.length = 0
      controller.hostConnected()
      expect(trace).toEqual(['has:subscribe', 'get:get', 'get:subscribe'])
      expect(controller.state.context.count).toBe(5)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('calls a get function with a null prototype or a shadowed call property', () => {
    let source: ContextSource<Context>
    const get = Object.freeze(Object.assign(Object.setPrototypeOf(function (this: unknown) {
      expect(this).toBe(source)
      return { count: 12 }
    }, null), { call: 'ordinary-data' }))
    source = { get, subscribe: () => () => {} }
    const controller = construct(source)
    try {
      expect(controller.state.context.count).toBe(12)
      controller.hostConnected()
      expect(controller.state.context.count).toBe(12)
    }
    finally {
      controller.hostDisconnected()
    }
  })
})
