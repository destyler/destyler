import type { NormalizeProps, PropTypes } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = { element: (value: unknown) => value } as NormalizeProps<PropTypes>
const cleanups: (() => void)[] = []

export function dragFixture(otherDocument = false, nativeCapture = false, shadowMode?: ShadowRootMode) {
  const frame = otherDocument ? document.createElement('iframe') : undefined
  if (frame)
    document.body.append(frame)
  const owner = frame?.contentDocument ?? document
  const host = owner.createElement('div')
  const shadow = shadowMode ? host.attachShadow({ mode: shadowMode }) : undefined
  const scope = shadow ?? owner
  const root = shadow ?? host
  root.innerHTML = '<div id="drag-viewport"><div id="drag-content"></div></div><div id="drag-thumb"></div>'
  owner.body.append(host)
  const viewport = root.querySelector<HTMLElement>('#drag-viewport')!
  viewport.style.cssText = 'width: 100px; height: 100px; overflow: scroll'
  root.querySelector<HTMLElement>('#drag-content')!.style.cssText = 'width: 1000px; height: 1000px'
  const thumb = root.querySelector<HTMLElement>('#drag-thumb')!
  thumb.style.cssText = 'width: 20px; height: 30px'
  thumb.dataset.testid = 'lifetime-thumb'
  const service = machine({
    id: 'drag-lifetime',
    ids: { viewport: 'drag-viewport', content: 'drag-content' },
    type: 'always',
    getRootNode: () => scope,
  })
  const captures = new Set<number>()
  const capture = vi.fn((id: number) => captures.add(id))
  const release = vi.fn((id: number) => captures.delete(id))
  if (!nativeCapture) {
    Object.defineProperties(thumb, {
      setPointerCapture: { configurable: true, value: capture },
      hasPointerCapture: { configurable: true, value: (id: number) => captures.has(id) },
      releasePointerCapture: { configurable: true, value: release },
    })
  }
  const registrations: { target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions }[] = []
  cleanups.push(() => {
    try {
      service.stop()
    }
    finally {
      // Baseline failures must not leak, or send terminal events to unrelated drags.
      for (const item of registrations)
        item.target.removeEventListener(item.type, item.listener, item.options)
      host.remove()
      frame?.remove()
    }
  })
  service.start()
  service.send({ type: 'RESIZE', viewportHeight: 100, viewportWidth: 100, contentHeight: 1000, contentWidth: 1000 })
  const api = () => connect(service.getState(), service.send, normalize)
  let orientation: 'horizontal' | 'vertical' = 'vertical'
  thumb.addEventListener('pointerdown', (event) => {
    const targets = Array.from(new Set<EventTarget>([document, owner, thumb]))
    const spies = targets.map(target => ({ target, spy: vi.spyOn(target, 'addEventListener') }))
    try {
      api().getThumbProps({ orientation }).onPointerDown!(event as any)
    }
    finally {
      for (const { target, spy } of spies) {
        for (const [type, listener, options] of spy.mock.calls) {
          if (listener && ['pointermove', 'pointerup', 'pointercancel', 'lostpointercapture'].includes(type))
            registrations.push({ target, type, listener, options })
        }
        spy.mockRestore()
      }
    }
  })
  const down = (pointerId = 1, axis: 'horizontal' | 'vertical' = 'vertical') => {
    orientation = axis
    thumb.dispatchEvent(new PointerEvent('pointerdown', { pointerId, clientX: 0, clientY: 0, bubbles: true, cancelable: true }))
  }
  return { owner, host, service, viewport, thumb, down, api, capture, release, captures, registrations }
}

afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse())
    cleanup()
  vi.restoreAllMocks()
})

describe('scroll-area drag ownership probes', () => {
  it('starts dragging an already visible thumb from idle', () => {
    const { service, down, api } = dragFixture()
    expect(api().scrollbarYVisible).toBe(true)
    down()
    expect(service.getState().value).toBe('dragging')
  })

  it('removes the drag pointer listeners when the service stops', () => {
    const { service, down, registrations } = dragFixture()
    const remove = vi.spyOn(document, 'removeEventListener')
    service.send('POINTER_ENTER')
    down()
    expect(registrations.length).toBeGreaterThanOrEqual(2)
    service.stop()
    for (const { target, type, listener, options } of registrations) {
      if (target === document)
        expect(remove.mock.calls.some(([removedType, removedListener, removedOptions]) => removedType === type && removedListener === listener && removedOptions === options)).toBe(true)
    }
  })

  it('routes dragging through the thumb owner document', () => {
    const { service, down, owner, viewport } = dragFixture(true)
    service.send('POINTER_ENTER')
    down()
    owner.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientY: 10 }))
    expect(viewport.scrollTop).toBe(100)
  })

  it('ends an active drag on pointer cancellation', () => {
    const { service, down, owner } = dragFixture()
    service.send('POINTER_ENTER')
    down()
    owner.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1 }))
    expect(service.getState().context.isDragging).toBe(false)
  })

  it('preserves ordinary pointer-up completion', () => {
    const { service, down, owner, viewport } = dragFixture()
    service.send('POINTER_ENTER')
    down()
    owner.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientY: 10 }))
    expect(viewport.scrollTop).toBe(100)
    owner.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }))
    expect(service.getState().context.isDragging).toBe(false)
  })

  it('can start again after the scroll-hide timer expires while the pointer remains inside', async () => {
    const { service, down } = dragFixture()
    service.setContext({ scrollHideDelay: 1 })
    service.send('POINTER_ENTER')
    service.send('SCROLL_START')
    await vi.waitFor(() => expect(service.getState().value).toBe('idle'))
    down()
    expect(service.getState().value).toBe('dragging')
  })

  it.each(['horizontal', 'vertical'] as const)('preserves %s drag distance and ordinary completion', (orientation) => {
    const { service, down, owner, viewport } = dragFixture()
    service.send('POINTER_ENTER')
    down(1, orientation)
    owner.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientX: 10, clientY: 20 }))
    expect(viewport.scrollLeft).toBe(orientation === 'horizontal' ? 100 : 0)
    expect(viewport.scrollTop).toBe(orientation === 'vertical' ? 200 : 0)
    owner.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }))
    expect(service.getState().value).toBe('hovering')
  })

  it('ignores movement from a second pointer', () => {
    const { service, down, owner, viewport } = dragFixture()
    service.send('POINTER_ENTER')
    down(1)
    owner.dispatchEvent(new PointerEvent('pointermove', { pointerId: 2, clientY: 10 }))
    expect(viewport.scrollTop).toBe(0)
    owner.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientY: 10 }))
    expect(viewport.scrollTop).toBe(100)
  })

  it.each(['pointerup', 'pointercancel'])('ignores another pointer’s %s', (type) => {
    const { service, down, owner } = dragFixture()
    service.send('POINTER_ENTER')
    down(0)
    owner.dispatchEvent(new PointerEvent(type, { pointerId: 2 }))
    expect(service.getState().value).toBe('dragging')
    owner.dispatchEvent(new PointerEvent(type, { pointerId: 0 }))
    expect(service.getState().value).toBe('hovering')
  })

  it('does not create another listener session for a second pointerdown', () => {
    const { service, down, capture, registrations } = dragFixture()
    service.send('POINTER_ENTER')
    down(1)
    const size = registrations.length
    down(2)
    // Capture remains connector-owned before transition, as on the baseline.
    expect(capture.mock.calls).toEqual([[1], [2]])
    expect(registrations).toHaveLength(size)
  })

  it('preserves the pre-transition state if the browser rejects pointer capture', () => {
    const { service, thumb, api, capture, registrations } = dragFixture()
    service.send('POINTER_ENTER')
    capture.mockImplementationOnce(() => {
      throw new DOMException('Pointer is no longer active', 'NotFoundError')
    })
    const handler = api().getThumbProps({ orientation: 'vertical' }).onPointerDown!
    expect(() => handler({ currentTarget: thumb, pointerId: 1, preventDefault() {}, stopPropagation() {} } as any)).toThrow('Pointer is no longer active')
    expect(service.getState().value).toBe('hovering')
    expect(service.getState().context.isDragging).toBe(false)
    expect(registrations).toEqual([])
  })

  it('ends the session if pointer capture is lost', () => {
    const { service, down, thumb } = dragFixture()
    service.send('POINTER_ENTER')
    down()
    thumb.dispatchEvent(new PointerEvent('lostpointercapture', { pointerId: 1, bubbles: true }))
    expect(service.getState().context.isDragging).toBe(false)
  })

  it('ignores capture loss from another target', () => {
    const { service, down, owner } = dragFixture()
    service.send('POINTER_ENTER')
    down()
    owner.body.dispatchEvent(new PointerEvent('lostpointercapture', { pointerId: 1, bubbles: true }))
    expect(service.getState().value).toBe('dragging')
  })

  it('receives document-targeted capture loss after its thumb is removed', () => {
    const { service, down, owner, thumb } = dragFixture()
    service.send('POINTER_ENTER')
    down()
    thumb.remove()
    owner.dispatchEvent(new PointerEvent('lostpointercapture', { pointerId: 1 }))
    expect(service.getState().context.isDragging).toBe(false)
  })

  it.each(['open', 'closed'] as const)('ends capture loss inside an %s ShadowRoot', (mode) => {
    const { service, down, thumb } = dragFixture(false, false, mode)
    service.send('POINTER_ENTER')
    down()
    thumb.dispatchEvent(new PointerEvent('lostpointercapture', { pointerId: 1, bubbles: true, composed: true }))
    expect(service.getState().context.isDragging).toBe(false)
  })

  it('stop is idempotent and releases only the active pointer capture', () => {
    const { service, down, release, captures } = dragFixture()
    service.send('POINTER_ENTER')
    down(0)
    captures.add(9)
    service.stop()
    service.stop()
    expect(release.mock.calls).toEqual([[0]])
    expect(captures).toEqual(new Set([9]))
    expect(service.getState().context.isDragging).toBe(false)
  })

  it('old pointer events cannot control a restarted service', () => {
    const { service, down, owner, viewport } = dragFixture()
    service.send('POINTER_ENTER')
    down(1)
    service.stop()
    service.start()
    service.send({ type: 'RESIZE', viewportHeight: 100, viewportWidth: 100, contentHeight: 1000, contentWidth: 1000 })
    service.send('POINTER_ENTER')
    down(2)
    owner.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientY: 10 }))
    expect(viewport.scrollTop).toBe(0)
    owner.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }))
    expect(service.getState().value).toBe('dragging')
    owner.dispatchEvent(new PointerEvent('pointermove', { pointerId: 2, clientY: 10 }))
    expect(viewport.scrollTop).toBe(100)
  })

  it('does not listen to a foreign outer document during an iframe drag', () => {
    const { service, down, owner, viewport } = dragFixture(true)
    service.send('POINTER_ENTER')
    down()
    document.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientY: 10 }))
    document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }))
    expect(viewport.scrollTop).toBe(0)
    expect(service.getState().value).toBe('dragging')
    owner.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, clientY: 10 }))
    expect(viewport.scrollTop).toBe(100)
  })
})
