import type { Context } from '../index'
import { createNormalizer } from '@destyler/types'
import { createMachine } from '@destyler/xstate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const normalize = createNormalizer(props => props)

describe('popover rendered-element lifecycle', () => {
  let host: HTMLDivElement
  let frameId: number
  let frames: Map<number, FrameRequestCallback>
  const services: Array<ReturnType<typeof machine>> = []

  beforeEach(() => {
    host = document.createElement('div')
    document.body.appendChild(host)
    frameId = 0
    frames = new Map()
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.set(++frameId, callback)
      return frameId
    })
    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((id) => {
      frames.delete(id)
    })
  })

  afterEach(() => {
    services.forEach(service => service.stop())
    services.length = 0
    host.remove()
    vi.restoreAllMocks()
  })

  async function flushFrame() {
    // Call only the callbacks still owned by this frame. Nested RAFs wait for
    // another frame, just as they do in a browser.
    for (const id of [...frames.keys()]) {
      const callback = frames.get(id)
      frames.delete(id)
      callback?.(performance.now())
    }
    await Promise.resolve()
  }

  function setup(context: Partial<Context> = {}, createService = machine) {
    const service = createService({
      id: 'aria-lifecycle',
      autoFocus: false,
      portalled: false,
      ...context,
    })
    services.push(service)
    const api = () => connect(service.getState(), service.send, normalize)
    const trigger = document.createElement('button')
    trigger.id = api().getTriggerProps().id!
    host.appendChild(trigger)

    function mountContent({ title = true, description = true } = {}) {
      const content = document.createElement('div')
      content.id = api().getContentProps().id!
      if (title) {
        const element = document.createElement('h2')
        element.id = api().getTitleProps().id!
        element.textContent = 'Popover title'
        content.appendChild(element)
      }
      if (description) {
        const element = document.createElement('p')
        element.id = api().getDescriptionProps().id!
        element.textContent = 'Popover description'
        content.appendChild(element)
      }
      host.appendChild(content)
      return content
    }

    function expectReferences(title: boolean, description: boolean) {
      const content = api().getContentProps()
      expect(content['aria-labelledby']).toBe(title ? api().getTitleProps().id : undefined)
      expect(content['aria-describedby']).toBe(description ? api().getDescriptionProps().id : undefined)
    }

    return { service, api, mountContent, expectReferences }
  }

  it.each([
    { title: true, description: true },
    { title: true, description: false },
    { title: false, description: true },
    { title: false, description: false },
  ])('preserves the initial closed snapshot for mounted parts: %j', async (parts) => {
    const { service, mountContent, expectReferences } = setup()
    mountContent(parts)
    service.start()
    expectReferences(true, true)
    await flushFrame()
    expect(service.state.matches('closed')).toBe(true)
    expectReferences(parts.title, parts.description)
  })

  it.each([
    { title: true, description: true },
    { title: true, description: false },
    { title: false, description: true },
    { title: false, description: false },
  ])('refreshes lazy-mounted parts on open: %j', async (parts) => {
    const { service, mountContent, expectReferences } = setup()
    service.start()
    await flushFrame()
    expectReferences(false, false)
    mountContent(parts)
    service.send('OPEN')
    await flushFrame()
    expect(service.state.matches('open')).toBe(true)
    expectReferences(parts.title, parts.description)
  })

  it('retains naming for content that stays mounted while closed', async () => {
    const { service, mountContent, expectReferences } = setup()
    mountContent()
    service.start()
    await flushFrame()
    expectReferences(true, true)
    service.send('OPEN')
    await flushFrame()
    expect(service.state.matches('open')).toBe(true)
    expectReferences(true, true)
  })

  it.each([{ defaultOpen: true }, { open: true }])('checks initial open content after mount: %j', async (context) => {
    const { service, mountContent, expectReferences } = setup(context)
    service.start()
    mountContent({ title: true, description: false })
    await flushFrame()
    expect(service.state.matches('open')).toBe(true)
    expectReferences(true, false)
  })

  it('resolves custom IDs for content mounted after the open transition', async () => {
    const { service, api, mountContent, expectReferences } = setup({
      ids: { content: 'custom-content', title: 'custom-title', description: 'custom-description' },
    })
    service.start()
    await flushFrame()
    service.send('OPEN')
    const content = mountContent()
    await flushFrame()
    expect(content.id).toBe('custom-content')
    expectReferences(true, true)
    expect(api().getContentProps()['aria-labelledby']).toBe('custom-title')
    expect(api().getContentProps()['aria-describedby']).toBe('custom-description')
  })

  it('refreshes after unmount-on-exit and lazy reopening with different parts', async () => {
    const { service, mountContent, expectReferences } = setup()
    service.start()
    await flushFrame()
    service.send('OPEN')
    const first = mountContent({ title: true, description: false })
    await flushFrame()
    expectReferences(true, false)
    service.send({ type: 'CLOSE', restoreFocus: false })
    first.remove()
    await flushFrame()
    // Closing preserves the last rendered snapshot instead of inspecting
    // a subtree that may still be playing its exit animation.
    expectReferences(true, false)
    service.send('OPEN')
    mountContent({ title: false, description: true })
    await flushFrame()
    expectReferences(false, true)
  })

  it('does not recheck vetoed controlled proposals, then checks delayed parent acceptance', async () => {
    const onOpenChange = vi.fn()
    const { service, mountContent, expectReferences } = setup({ open: false, onOpenChange })
    service.start()
    await flushFrame()
    mountContent()
    service.send('OPEN')
    service.send('TOGGLE')
    service.send('CLOSE')
    await flushFrame()
    expect(service.state.matches('closed')).toBe(true)
    expect(onOpenChange.mock.calls).toEqual([[{ open: true }], [{ open: true }]])
    expectReferences(false, false)
    expect(frames.size).toBe(0)
    service.setContext({ open: true })
    await Promise.resolve()
    await flushFrame()
    expect(service.state.matches('open')).toBe(true)
    expectReferences(true, true)
    expect(onOpenChange).toHaveBeenCalledTimes(2)
  })

  it('keeps the open snapshot when a controlled close is vetoed', async () => {
    const { service, mountContent, expectReferences } = setup({ open: true })
    const content = mountContent({ title: true, description: false })
    service.start()
    await flushFrame()
    content.querySelector('h2')!.remove()
    service.send('CLOSE')
    await flushFrame()
    expect(service.state.matches('open')).toBe(true)
    expectReferences(true, false)
  })

  it('cancels the initial closed check when opening before the first frame', async () => {
    const { service, mountContent, expectReferences } = setup({ open: false })
    service.start()
    const initialFrames = [...frames.keys()]
    service.setContext({ open: true })
    await Promise.resolve()
    expect(initialFrames.every(id => !frames.has(id))).toBe(true)
    mountContent({ title: false, description: true })
    await flushFrame()
    expectReferences(false, true)
  })

  it('cancels an open check when closed before its frame', async () => {
    const { service, mountContent, expectReferences } = setup()
    service.start()
    await flushFrame()
    service.send('OPEN')
    mountContent()
    service.send({ type: 'CLOSE', restoreFocus: false })
    await flushFrame()
    expect(service.state.matches('closed')).toBe(true)
    expectReferences(false, false)
  })

  it.each([false, true])('cancels pending checks when stopped (initialOpen=%s)', async (defaultOpen) => {
    const { service, expectReferences } = setup({ defaultOpen })
    service.start()
    service.stop()
    await flushFrame()
    expectReferences(true, true)
  })

  it('restarts with only the current lifecycle check', async () => {
    const { service, mountContent, expectReferences } = setup()
    service.start()
    const oldFrames = [...frames.keys()]
    service.stop()
    service.start()
    expect(oldFrames.every(id => !frames.has(id))).toBe(true)
    expect(frames.size).toBe(1)
    mountContent({ title: true, description: false })
    await flushFrame()
    expectReferences(true, false)
  })

  it('checks only the latest accepted open after rapid controlled close and reopen', async () => {
    const { service, mountContent, expectReferences } = setup({ open: false })
    service.start()
    await flushFrame()
    service.setContext({ open: true })
    await Promise.resolve()
    service.setContext({ open: false })
    await Promise.resolve()
    service.setContext({ open: true })
    await Promise.resolve()
    mountContent({ title: true, description: false })
    const lookup = vi.spyOn(document, 'getElementById')
    await flushFrame()
    expectReferences(true, false)
    expect(lookup.mock.calls.filter(([id]) => id === 'popover:aria-lifecycle:title')).toHaveLength(1)
    expect(lookup.mock.calls.filter(([id]) => id === 'popover:aria-lifecycle:desc')).toHaveLength(1)
  })

  it.each([false, true])('preserves synchronous startup action overrides (initialOpen=%s)', async (defaultOpen) => {
    const { service, mountContent } = setup({ defaultOpen })
    if (defaultOpen)
      mountContent()
    const returnedFunction = vi.fn()
    const invocations: unknown[] = []
    const checkRenderedElements = vi.fn(function (this: unknown, ctx, event, meta) {
      invocations.push({
        receiver: this,
        contextIsLive: ctx === service.state.context,
        eventType: event.type,
        stateValue: meta.state.value,
      })
      return returnedFunction
    })
    service.setOptions({ actions: { checkRenderedElements } })
    service.start()
    expect(invocations).toEqual([{
      receiver: undefined,
      contextIsLive: true,
      eventType: 'machine.start',
      stateValue: '',
    }])
    await flushFrame()
    expect(checkRenderedElements).toHaveBeenCalledTimes(1)
    service.stop()
    // ActionMap returns were historically ignored, even if a callback happened
    // to return a function. Only the default implementation owns a RAF cleanup.
    expect(returnedFunction).not.toHaveBeenCalled()
  })

  it('uses the current action override only when a controlled open is accepted', async () => {
    const { service, mountContent } = setup({ open: false })
    const initialCheck = vi.fn()
    service.setOptions({ actions: { checkRenderedElements: initialCheck } })
    service.start()
    await flushFrame()
    expect(initialCheck).toHaveBeenCalledTimes(1)
    const returnedFunction = vi.fn()
    const nextCheck = vi.fn((_ctx, _event, _meta) => returnedFunction)
    service.setOptions({ actions: { checkRenderedElements: nextCheck } })
    service.send('OPEN')
    expect(nextCheck).not.toHaveBeenCalled()
    service.setContext({ open: true })
    await Promise.resolve()
    expect(nextCheck).toHaveBeenCalledTimes(1)
    expect(nextCheck.mock.calls[0][1]).toMatchObject({ type: 'CONTROLLED.OPEN' })
    mountContent()
    await flushFrame()
    service.setContext({ open: false })
    await Promise.resolve()
    service.stop()
    expect(nextCheck).toHaveBeenCalledTimes(1)
    expect(returnedFunction).not.toHaveBeenCalled()
  })

  it('does not share pending checks between separate machines', async () => {
    const first = setup({ id: 'first-popover' })
    const second = setup({ id: 'second-popover' })
    first.service.start()
    second.service.start()
    first.service.stop()
    second.mountContent({ title: true, description: false })
    await flushFrame()
    first.expectReferences(true, true)
    second.expectReferences(true, false)
  })

  it('isolates checks when machines reuse the same configuration and action functions', async () => {
    const first = setup({ id: 'original-popover' })
    const second = setup({ id: 'reconstructed-popover' }, (context) => {
      const service = createMachine({
        ...first.service.config,
        context: { ...first.service.config.context! },
      }, first.service.options)
      service.setContext(context)
      return service
    })
    expect(second.service.state.context).not.toBe(first.service.state.context)
    expect(second.service.options.actions!.checkRenderedElements)
      .toBe(first.service.options.actions!.checkRenderedElements)
    first.service.start()
    second.service.start()
    first.service.send('OPEN')
    first.mountContent()
    second.service.send('OPEN')
    second.mountContent({ title: false, description: true })
    first.service.stop()
    await flushFrame()
    expect(second.service.state.matches('open')).toBe(true)
    second.expectReferences(false, true)
  })
  it.each([false, true])('does not resume an accepted open after its callback stops the run (restart=%s)', async (restart) => {
    let fixture: ReturnType<typeof setup>
    const onOpenChange = vi.fn(() => {
      fixture.service.stop()
      if (restart)
        fixture.service.start()
    })
    fixture = setup({ onOpenChange })
    fixture.service.start()
    await flushFrame()
    fixture.mountContent({ title: false, description: true })
    fixture.service.send('OPEN')
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(fixture.service.status).toBe(restart ? 'Running' : 'Stopped')
    expect(fixture.service.state.matches('open')).toBe(false)
    expect(frames.size).toBe(restart ? 1 : 0)
    await flushFrame()
    fixture.expectReferences(false, restart)
  })

  it.each([false, true])('owns only its run when an accepted-open action override stops during activity acquisition (restart=%s)', async (restart) => {
    const fixture = setup()
    fixture.service.start()
    await flushFrame()
    const original = fixture.service.options.actions!.checkRenderedElements!
    let first = true
    fixture.service.setOptions({ actions: {
      setInitialFocus() {},
      checkRenderedElements(ctx, evt, meta) {
        original(ctx, evt, meta)
        if (first) {
          first = false
          fixture.service.stop()
          if (restart)
            fixture.service.start()
        }
      },
    } })
    fixture.mountContent()
    fixture.service.send('OPEN')
    expect(fixture.service.status).toBe(restart ? 'Running' : 'Stopped')
    expect(frames.size).toBe(restart ? 1 : 0)
    await flushFrame()
    fixture.expectReferences(restart, restart)
  })

  it.each([false, true])('cancels startup ARIA work when its action override stops before state activities (restart=%s)', async (restart) => {
    const fixture = setup()
    const original = fixture.service.options.actions!.checkRenderedElements!
    let first = true
    fixture.service.setOptions({ actions: {
      checkRenderedElements(ctx, evt, meta) {
        original(ctx, evt, meta)
        if (first) {
          first = false
          fixture.service.stop()
          if (restart)
            fixture.service.start()
        }
      },
    } })
    fixture.service.start()
    expect(fixture.service.status).toBe(restart ? 'Running' : 'Stopped')
    expect(frames.size).toBe(restart ? 1 : 0)
    fixture.mountContent({ title: true, description: false })
    await flushFrame()
    fixture.expectReferences(true, !restart)
  })
  it('allocates one closed-startup frame and performs no continuing polling', async () => {
    const fixture = setup()
    const schedule = vi.mocked(globalThis.requestAnimationFrame)
    fixture.service.start()
    fixture.service.start()
    expect(schedule).toHaveBeenCalledTimes(1)
    expect(frames.size).toBe(1)
    await flushFrame()
    expect(frames.size).toBe(0)
    await flushFrame()
    expect(schedule).toHaveBeenCalledTimes(1)
    fixture.service.stop()
    fixture.service.start()
    expect(schedule).toHaveBeenCalledTimes(2)
    expect(frames.size).toBe(1)
    fixture.service.stop()
    expect(frames.size).toBe(0)
  })

  it('retries a failed cancellation before acquiring the restarted run', async () => {
    const fixture = setup()
    fixture.service.start()
    const oldFrame = [...frames.keys()][0]
    const failure = new Error('cancel failed')
    const cancel = vi.mocked(globalThis.cancelAnimationFrame)
    cancel.mockImplementationOnce(() => {
      throw failure
    })
    expect(() => fixture.service.stop()).toThrow(failure)
    expect(frames.has(oldFrame)).toBe(true)
    expect(fixture.service.status).toBe('Running')
    fixture.service.stop()
    expect(fixture.service.status).toBe('Stopped')
    expect(frames.has(oldFrame)).toBe(false)
    fixture.service.start()
    const currentFrame = [...frames.keys()].find(id => id !== oldFrame)!
    expect(currentFrame).toBeDefined()
    fixture.service.stop()
    expect(frames.size).toBe(0)
    expect(cancel.mock.calls.filter(([id]) => id === oldFrame)).toHaveLength(2)
    expect(cancel.mock.calls.filter(([id]) => id === currentFrame)).toHaveLength(1)
    fixture.service.stop()
    await flushFrame()
    fixture.expectReferences(true, true)
  })
  it('disposes state ownership before root ownership and cancels the shared frame once', () => {
    const fixture = setup()
    const activity = fixture.service.options.activities!.trackRenderedElements!
    const trace: string[] = []
    fixture.service.setOptions({ activities: {
      trackRenderedElements(ctx, evt, meta) {
        trace.push(`acquire:${evt.type}`)
        const cleanup = activity(ctx, evt, meta)
        return () => {
          trace.push(`dispose:${evt.type}`)
          cleanup?.()
        }
      },
    } })
    fixture.service.start()
    const frame = [...frames.keys()][0]
    fixture.service.stop()
    expect(trace).toEqual([
      'acquire:machine.start',
      'acquire:machine.init',
      'dispose:machine.init',
      'dispose:machine.start',
    ])
    expect(globalThis.cancelAnimationFrame).toHaveBeenCalledExactlyOnceWith(frame)
    expect(frames.size).toBe(0)
  })
})
