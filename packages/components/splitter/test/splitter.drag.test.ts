// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'
import { setup } from './splitter.test-helper'

describe('splitter drag contracts', () => {
  it('starts a direct pointer gesture from idle without requiring hover', () => {
    const { service } = setup()
    service.send({ type: 'POINTER_DOWN', id: 'a:b', point: { x: 500, y: 0 } })
    expect(service.state.value).toBe('dragging')
  })

  it.each([
    { before: { minSize: 0, maxSize: 60 }, after: { minSize: 0, maxSize: 100 }, delta: 300, expected: [60, 40] },
    { before: { minSize: 0, maxSize: 100 }, after: { minSize: 40, maxSize: 100 }, delta: 300, expected: [60, 40] },
    { before: { minSize: 30, maxSize: 100 }, after: { minSize: 0, maxSize: 100 }, delta: -400, expected: [30, 70] },
  ])('keeps the resized pair total constant while honoring both constraints ($expected)', ({ before, after, delta, expected }) => {
    const { service } = setup({ defaultSize: [{ id: 'a', size: 50, ...before }, { id: 'b', size: 50, ...after }] })
    service.send({ type: 'FOCUS', id: 'a:b' })
    service.send({ type: 'POINTER_DOWN', id: 'a:b', point: { x: 500, y: 0 } })
    service.send({ type: 'POINTER_MOVE', point: { x: 500 + delta, y: 0 } })
    expect(service.state.context.size!.map(p => p.size)).toEqual(expected)
  })

  it('removes its global cursor when stopped during a drag', () => {
    const { service } = setup()
    service.send({ type: 'FOCUS', id: 'a:b' })
    service.send({ type: 'POINTER_DOWN', id: 'a:b', point: { x: 500, y: 0 } })
    service.send({ type: 'POINTER_MOVE', point: { x: 520, y: 0 } })
    expect(document.getElementById('splitter:audit:global-cursor')).not.toBeNull()
    service.stop()
    expect(document.getElementById('splitter:audit:global-cursor')).toBeNull()
  })
  it.each([
    { button: 2, isPrimary: true, defaultPrevented: false },
    { button: 0, isPrimary: false, defaultPrevented: false },
    { button: 0, isPrimary: true, defaultPrevented: true },
  ])('does not capture or resize for an ineligible pointer press: %j', (event) => {
    const { api, service } = setup()
    const capture = vi.fn()
    api().getResizeTriggerProps({ id: 'a:b' }).onPointerDown({
      ...event,
      pointerId: 1,
      clientX: 500,
      clientY: 0,
      currentTarget: { setPointerCapture: capture },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    })
    expect(service.state.value).toBe('idle')
    expect(capture).not.toHaveBeenCalled()
  })

  it('uses the public DOM handler for a primary touch press without hover', () => {
    const { api, service } = setup()
    const capture = vi.fn()
    api().getResizeTriggerProps({ id: 'a:b' }).onPointerDown({
      button: 0,
      isPrimary: true,
      defaultPrevented: false,
      pointerType: 'touch',
      pointerId: 4,
      clientX: 500,
      clientY: 0,
      currentTarget: { setPointerCapture: capture },
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    })
    expect(service.state.value).toBe('dragging')
    expect(capture).toHaveBeenCalledExactlyOnceWith(4)
  })
})
