import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { MachineController } from '../src/controllers/machine-controller'

class Host implements ReactiveControllerHost {
  requestUpdate = vi.fn<ReactiveControllerHost['requestUpdate']>()
  updateComplete = Promise.resolve(true)
  removeController = vi.fn()

  constructor(private connected = false) {}

  addController(controller: ReactiveController) {
    // Lit immediately connects controllers added to an already connected host.
    if (this.connected)
      controller.hostConnected?.()
  }
}

function createService() {
  return createMachine({
    id: 'lit.controller.lifecycle',
    initial: 'idle',
    context: { count: 0 },
    states: { idle: {} },
  })
}

function createSource(count = 1) {
  const listeners = new Set<(ctx: { count: number }) => void>()
  return {
    listeners,
    get: () => ({ count }),
    subscribe: vi.fn((listener: (ctx: { count: number }) => void) => {
      listeners.add(listener)
      return vi.fn(() => listeners.delete(listener))
    }),
    emit(value: number) {
      count = value
      listeners.forEach(listener => listener({ count }))
    },
  }
}

describe('lit controller lifecycle', () => {
  it('can be registered with an already connected host', () => {
    const service = createService()
    let controller: MachineController<any, any> | undefined
    try {
      controller = new MachineController(new Host(true), service, { sync: true })
      expect(service.status).toBe(MachineStatus.Running)
      expect(controller.state.value).toBe('idle')
    }
    finally {
      controller?.hostDisconnected()
    }
  })

  it('waits for connection before subscribing to options set before mount', () => {
    const source = createSource()
    const controller = new MachineController(new Host(), createService(), { sync: true })
    try {
      controller.setOptions({ context: source })
      expect(source.subscribe).not.toHaveBeenCalled()
      expect(controller.service.status).toBe(MachineStatus.NotStarted)

      controller.hostConnected()
      expect(source.listeners.size).toBe(1)
      source.emit(2)
      expect(controller.state.context.count).toBe(2)
    }
    finally {
      controller.hostDisconnected()
    }
    expect(source.listeners.size).toBe(0)
  })

  it('refreshes the external source after changes made while disconnected', () => {
    const source = createSource()
    const controller = new MachineController(new Host(), createService(), { context: source, sync: true })
    controller.hostConnected()
    expect(controller.state.context.count).toBe(1)
    controller.hostDisconnected()
    expect(source.listeners.size).toBe(0)

    source.emit(5)
    try {
      controller.hostConnected()
      expect(source.listeners.size).toBe(1)
      expect(controller.state.context.count).toBe(5)
    }
    finally {
      controller.hostDisconnected()
    }
    expect(source.listeners.size).toBe(0)
  })

  it('keeps a replacement source dormant until reconnecting', () => {
    const original = createSource()
    const replacement = createSource(10)
    const controller = new MachineController(new Host(), createService(), { context: original, sync: true })
    controller.hostConnected()
    controller.hostDisconnected()

    controller.setOptions({ context: replacement })
    expect(original.listeners.size).toBe(0)
    expect(replacement.listeners.size).toBe(0)
    replacement.emit(11)

    try {
      controller.hostConnected()
      expect(replacement.listeners.size).toBe(1)
      expect(controller.state.context.count).toBe(11)
      original.emit(99)
      expect(controller.state.context.count).toBe(11)
    }
    finally {
      controller.hostDisconnected()
    }
    expect(replacement.listeners.size).toBe(0)
  })

  it('disconnects an external source when the context option is cleared', () => {
    const source = createSource()
    const controller = new MachineController(new Host(), createService(), { context: source, sync: true })
    try {
      controller.hostConnected()
      controller.setOptions({ context: undefined })
      expect(source.listeners.size).toBe(0)
      source.emit(10)
      expect(controller.state.context.count).toBe(1)
    }
    finally {
      controller.hostDisconnected()
    }
  })
})
