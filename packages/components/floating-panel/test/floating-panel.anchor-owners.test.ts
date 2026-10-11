// @vitest-environment happy-dom
import type { UserDefinedContext } from '../src/types'
import { createMachine, Machine } from '@destyler/xstate'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

// Independently reconstructed controls; the historical 45-case fixture was unavailable.
type Panel = ReturnType<typeof machine>
type Construction = 'Machine' | 'createMachine'
type Interruption = 'close' | 'stop' | 'restart' | 'replace'
const constructors: Construction[] = ['Machine', 'createMachine']
const interruptions: Interruption[] = ['close', 'stop', 'restart', 'replace']
const panels: Panel[] = []
const nodes: HTMLElement[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
const origin = { x: 100, y: 80 }
const anchored = { x: 456, y: 234 }
let sequence = 0

function api(panel: Panel) {
  return connect(panel.state, panel.send, normalize)
}

function runAction(panel: Panel, name: 'setAnchorPosition' | 'clearAnchorPosition' | 'resetRect') {
  const action = panel.options.actions![name] as (...args: any[]) => void
  action(panel.state.context, { type: 'TEST' }, { initialContext: panel.initialContext })
}

function template(context: Partial<UserDefinedContext> = {}) {
  return machine({ id: `anchor-template-${++sequence}`, defaultOpen: false, position: origin, size: { width: 300, height: 200 }, ...context })
}

function reconstruct(kind: Construction, source: Panel, context: Partial<UserDefinedContext> = {}) {
  // Copy configuration/context while deliberately retaining the public action closures.
  const id = `anchor-owner-${++sequence}`
  const config = { ...source.config, context: { ...source.config.context!, ...context, id } }
  const panel = kind === 'Machine' ? new Machine(config, source.options) : createMachine(config, source.options)
  const positioner = document.createElement('div')
  positioner.id = `float-panel:${id}:positioner`
  document.body.appendChild(positioner)
  nodes.push(positioner)
  panels.push(panel)
  panel.start()
  return panel
}

function scheduler() {
  const frames = new Map<number, FrameRequestCallback>()
  let next = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++next, callback)
    return next
  })
  // Retain canceled callbacks so cancellation and stale-delivery safety are independent.
  const cancel = vi.fn((_id: number) => {})
  vi.stubGlobal('cancelAnimationFrame', cancel)
  return { frames, cancel, deliver: (id: number) => frames.get(id)!(0) }
}

function interrupt(panel: Panel, end: Interruption) {
  if (end === 'close') {
    api(panel).setOpen(false)
  }
  else if (end === 'stop') {
    panel.stop()
  }
  else if (end === 'restart') {
    panel.stop()
    panel.start()
    api(panel).setOpen(true)
  }
  else {
    runAction(panel, 'setAnchorPosition')
  }
}

afterEach(() => {
  // Restore injected throwing cancellation implementations before teardown.
  vi.mocked(globalThis.cancelAnimationFrame).mockReset()
  for (const panel of panels.splice(0)) panel.stop()
  for (const node of nodes.splice(0)) node.remove()
  vi.unstubAllGlobals()
})

describe('floating-panel reconstructed anchor owners', () => {
  // 12: both public reconstruction routes, both actor identities, three peer effects.
  for (const kind of constructors) {
    for (const ownerIndex of [0, 1]) {
      it.each(['schedule', 'close', 'stop'] as const)(`${kind} owner ${ownerIndex} survives peer %s`, (effect) => {
        const clock = scheduler()
        const source = template()
        const callbacks = [vi.fn(() => anchored), vi.fn(() => ({ x: 700, y: 500 }))]
        const actors = callbacks.map(getAnchorPosition => reconstruct(kind, source, { getAnchorPosition }))
        const owner = actors[ownerIndex]
        const peer = actors[1 - ownerIndex]
        api(owner).setOpen(true)
        api(peer).setOpen(true)
        if (effect !== 'schedule')
          interrupt(peer, effect)
        expect(clock.cancel.mock.calls.flat()).not.toContain(1)
        clock.deliver(1)
        expect(callbacks[ownerIndex]).toHaveBeenCalledTimes(1)
        expect(owner.state.context.position).toEqual(callbacks[ownerIndex].mock.results[0].value)
        clock.deliver(2)
        expect(callbacks[1 - ownerIndex]).toHaveBeenCalledTimes(effect === 'schedule' ? 1 : 0)
      })
    }
  }

  // 8: each user-controlled DOM lookup may invalidate the continuation.
  for (const getter of ['getRootNode', 'getBoundaryEl'] as const) {
    it.each(interruptions)(`${getter} %s prevents the old anchor callback and preserves replacement`, (end) => {
      const clock = scheduler()
      const callback = vi.fn(() => anchored)
      const panel = reconstruct('createMachine', template(), { getAnchorPosition: callback })
      const boundary = vi.fn(() => null)
      const trigger = document.createElement('button')
      trigger.id = `float-panel:${panel.state.context.id}:trigger`
      const measure = vi.fn(() => new DOMRect(10, 20, 30, 40))
      trigger.getBoundingClientRect = measure
      document.body.appendChild(trigger)
      nodes.push(trigger)
      let armed = false
      const hook = () => {
        if (armed) {
          armed = false
          interrupt(panel, end)
        }
        return getter === 'getRootNode' ? document : null
      }
      panel.setContext({ getBoundaryEl: boundary, [getter]: hook })
      api(panel).setOpen(true)
      armed = true
      boundary.mockClear()
      clock.deliver(1)
      expect(callback).not.toHaveBeenCalled()
      expect(measure).not.toHaveBeenCalled()
      expect(panel.state.context.position).toEqual(origin)
      if (getter === 'getRootNode' && (end === 'close' || end === 'stop'))
        expect(boundary).not.toHaveBeenCalled()
      if (end === 'restart' || end === 'replace') {
        clock.deliver(2)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(panel.state.context.position).toEqual(anchored)
      }
    })
  }

  // 8: callback return values belong only to their actor's current request.
  for (const kind of constructors) {
    it.each(interruptions)(`${kind} callback %s cannot commit retired coordinates`, (end) => {
      const clock = scheduler()
      const panel = reconstruct(kind, template())
      const callback = vi.fn().mockImplementationOnce(() => {
        interrupt(panel, end)
        return anchored
      }).mockReturnValue({ x: 777, y: 333 })
      panel.setContext({ getAnchorPosition: callback })
      api(panel).setOpen(true)
      clock.deliver(1)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(panel.state.context.position).toEqual(origin)
      if (end === 'restart' || end === 'replace') {
        clock.deliver(2)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(panel.state.context.position).toEqual({ x: 777, y: 333 })
      }
    })
  }

  // 6: failed cleanup must retain its exact resource and exception for retry.
  for (const kind of constructors) {
    it.each(['close', 'stop', 'replace'] as const)(`${kind} retries cancellation after throwing %s`, (end) => {
      const clock = scheduler()
      const callback = vi.fn(() => anchored)
      const panel = reconstruct(kind, template(), { getAnchorPosition: callback })
      const failure = new Error('cancel failed')
      clock.cancel.mockImplementationOnce(() => {
        throw failure
      })
      api(panel).setOpen(true)
      let caught: unknown
      try {
        interrupt(panel, end)
      }
      catch (error) {
        caught = error
      }
      expect(caught).toBe(failure)
      expect(clock.cancel.mock.calls).toEqual([[1]])
      clock.deliver(1)
      expect(callback).not.toHaveBeenCalled()
      expect(panel.state.context.position).toEqual(origin)
      interrupt(panel, end)
      expect(clock.cancel.mock.calls).toEqual([[1], [1]])
      if (end === 'replace') {
        clock.deliver(2)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(panel.state.context.position).toEqual(anchored)
      }
    })
  }

  // 4: successful old cleanup cannot delete an actor's reentrant replacement.
  for (const kind of constructors) {
    it.each(['clearAnchorPosition', 'resetRect'] as const)(`${kind} %s preserves the request created inside cancellation`, (action) => {
      const clock = scheduler()
      const callback = vi.fn(() => anchored)
      const panel = reconstruct(kind, template(), { getAnchorPosition: callback })
      api(panel).setOpen(true)
      clock.cancel.mockImplementationOnce(() => runAction(panel, 'setAnchorPosition'))
      runAction(panel, action)
      clock.deliver(1)
      expect(callback).not.toHaveBeenCalled()
      clock.deliver(2)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(panel.state.context.position).toEqual(anchored)
      // Scheduling itself can reenter during cleanup; the later request wins.
      runAction(panel, 'setAnchorPosition')
      clock.cancel.mockImplementationOnce(() => runAction(panel, 'setAnchorPosition'))
      runAction(panel, 'setAnchorPosition')
      runAction(panel, 'clearAnchorPosition')
      expect(clock.cancel).toHaveBeenLastCalledWith(4)
      clock.deliver(4)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  }

  // 4: a delivered frame no longer owns a cancelable scheduler handle.
  for (const kind of constructors) {
    it.each(['coordinates', 'empty'] as const)(`${kind} releases a completed frame returning %s`, (result) => {
      const clock = scheduler()
      const callback = vi.fn(() => anchored)
      const panel = reconstruct(kind, template(), { getAnchorPosition: result === 'coordinates' ? callback : undefined })
      api(panel).setOpen(true)
      clock.deliver(1)
      expect(callback).toHaveBeenCalledTimes(result === 'coordinates' ? 1 : 0)
      expect(panel.state.context.position).toEqual(result === 'coordinates' ? anchored : origin)
      api(panel).setOpen(false)
      panel.stop()
      expect(clock.cancel).not.toHaveBeenCalled()
    })
  }

  // 3: anchor ownership does not change initial-open or saved-rectangle policy.
  it('keeps initially-open anchoring unchanged until a later explicit open', () => {
    const clock = scheduler()
    const callback = vi.fn(() => anchored)
    const panel = reconstruct('createMachine', template({ defaultOpen: true, getAnchorPosition: callback }))
    expect(clock.frames.size).toBe(0)
    expect(callback).not.toHaveBeenCalled()
    expect(panel.state.context.position).toEqual(origin)
    api(panel).setOpen(false)
    api(panel).setOpen(true)
    clock.deliver(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it.each(['prevPosition', 'prevSize'] as const)('keeps persistRect policy when %s is retained', (key) => {
    const clock = scheduler()
    const callback = vi.fn(() => anchored)
    const panel = reconstruct('createMachine', template({ persistRect: true, getAnchorPosition: callback }))
    panel.setContext({ [key]: key === 'prevPosition' ? { x: 50, y: 60 } : { width: 400, height: 300 } })
    api(panel).setOpen(true)
    expect(clock.frames.size).toBe(0)
    expect(callback).not.toHaveBeenCalled()
    expect(panel.state.context.position).toEqual(origin)
  })
})
