import { createMachine, MachineStatus } from '@destyler/xstate'
import { describe, expect, it, vi } from 'vitest'
import { useActor } from '../src/hooks/use-actor'
import { useSnapshot } from '../src/hooks/use-snapshot'

function createService() {
  return createMachine({
    initial: 'idle',
    context: { count: 0, label: 'before' },
    states: { idle: {} },
  }).start()
}

describe('vanilla explicit snapshot reads', () => {
  it('returns current fields that were not read from the previous snapshot', () => {
    const service = createService()
    const target = {}
    try {
      const before = useSnapshot(target, service)
      expect(before.value).toBe('idle')
      service.setContext({ count: 1 })
      const current = useSnapshot(target, service)
      expect(current.context.count).toBe(1)
      expect(before.context.count).toBe(0)
    }
    finally {
      service.stop()
    }
  })

  it('refreshes unread sibling fields when an observed field is unchanged', () => {
    const service = createService()
    const target = {}
    try {
      expect(useSnapshot(target, service).context.count).toBe(0)
      service.setContext({ label: 'after' })
      expect(useSnapshot(target, service).context.label).toBe('after')
    }
    finally {
      service.stop()
    }
  })

  it('continues tracking after a read that reused an unchanged snapshot', () => {
    const service = createService()
    const target = {}
    try {
      expect(useActor(target, service)[0].value).toBe('idle')
      expect(useActor(target, service)[0].context.count).toBe(0)
      service.setContext({ count: 2 })
      expect(useActor(target, service)[0].context.count).toBe(2)
    }
    finally {
      service.stop()
    }
  })

  it('retains identity within one version and keeps earlier versions immutable', () => {
    const service = createService()
    const target = {}
    try {
      const before = useSnapshot(target, service)
      expect(useSnapshot(target, service)).toBe(before)
      expect(useSnapshot(target, service, { context: { count: 0 } })).toBe(before)

      const current = useSnapshot(target, service, { context: { count: 4 } })
      expect(current).not.toBe(before)
      expect(current.context.count).toBe(4)
      expect(before.context.count).toBe(0)
      expect(useSnapshot(target, service)).toBe(current)
    }
    finally {
      service.stop()
    }
  })

  it('does not reuse another actor snapshot when the caller target is shared', () => {
    const first = createService()
    const second = createService()
    const target = {}
    second.setContext({ count: 9 })
    try {
      expect(useActor(target, first)[0].value).toBe('idle')
      const [state, send] = useActor(target, second)
      expect(state.context.count).toBe(9)
      expect(send).toBe(second.send)
      expect(useActor(target, first)[0].context.count).toBe(0)
    }
    finally {
      first.stop()
      second.stop()
    }
  })

  it('reads an unstarted service without acquiring lifecycle ownership', () => {
    const service = createMachine({ initial: 'idle', context: { count: 0 }, states: { idle: {} } })
    const start = vi.spyOn(service, 'start')
    const subscribe = vi.spyOn(service, 'subscribe')
    const stop = vi.spyOn(service, 'stop')
    const target = {}
    expect(useSnapshot(target, service, { context: { count: 3 } }).context.count).toBe(3)
    expect(service.status).toBe(MachineStatus.NotStarted)
    expect(start).not.toHaveBeenCalled()
    expect(subscribe).not.toHaveBeenCalled()
    expect(stop).not.toHaveBeenCalled()
  })
})
