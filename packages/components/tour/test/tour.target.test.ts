// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'
import { flush, setup, step } from './tour.test-helper'

describe('tour target contracts', () => {
  it('highlights a target which appears after entering the resolving state', async () => {
    let target: HTMLElement | null = null
    const { api, service } = setup({ steps: [{ ...step('a'), type: 'tooltip', target: () => target }], preventInteraction: true })
    api().start()
    await flush()
    expect(service.state.value).toBe('target.resolving')
    target = document.createElement('button')
    target.scrollIntoView = () => {}
    document.body.append(target)
    await new Promise(resolve => setTimeout(resolve, 0))
    await flush()
    expect(service.state.value).toBe('target.scrolling')
    expect(target.hasAttribute('data-tour-highlighted')).toBe(true)
    expect(target.inert).toBe(true)
  })

  it('restores caller-owned target attributes after dismissal', async () => {
    const target = document.createElement('button')
    target.scrollIntoView = () => {}
    target.inert = true
    target.setAttribute('data-tour-highlighted', 'caller-owned')
    document.body.append(target)
    const { api } = setup({ steps: [{ ...step('a'), type: 'tooltip', target: () => target }], preventInteraction: true })
    api().start()
    await flush()
    api().getCloseTriggerProps().onClick()
    await flush()
    expect(target.inert).toBe(true)
    expect(target.getAttribute('data-tour-highlighted')).toBe('caller-owned')
  })

  it('releases target inert ownership using the acquisition-time option', async () => {
    const target = document.createElement('button')
    target.scrollIntoView = () => {}
    target.inert = false
    const { api, service } = setup({ steps: [{ ...step('a'), target: () => target }], preventInteraction: true })
    api().start()
    await flush()
    expect(target.inert).toBe(true)
    service.setContext({ preventInteraction: false })
    service.stop()
    expect(target.inert).toBe(false)
  })

  it('does not overwrite a caller target attribute change made while open', async () => {
    const target = document.createElement('button')
    target.scrollIntoView = () => {}
    const { api, service } = setup({ steps: [{ ...step('a'), target: () => target }], preventInteraction: true })
    api().start()
    await flush()
    target.setAttribute('data-tour-highlighted', 'new-owner')
    target.inert = false
    service.stop()
    expect(target.getAttribute('data-tour-highlighted')).toBe('new-owner')
    expect(target.inert).toBe(false)
  })

  it('times out a missing target and ignores later insertion', async () => {
    vi.useFakeTimers()
    let target: HTMLElement | null = null
    const onStatusChange = vi.fn()
    const { api, service } = setup({ steps: [{ ...step('a'), target: () => target }], onStatusChange })
    api().start()
    await flush()
    expect(service.state.value).toBe('target.resolving')
    await vi.advanceTimersByTimeAsync(3000)
    await flush()
    expect(api().open).toBe(false)
    expect(api().step).toBeNull()
    expect(onStatusChange.mock.calls.map(([d]) => d.status)).toEqual(['started', 'not-found'])
    target = document.createElement('button')
    document.body.append(target)
    await flush()
    expect(target.hasAttribute('data-tour-highlighted')).toBe(false)
    vi.useRealTimers()
  })
  it('reads and releases the viewport belonging to its configured document', () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const rootNode = frame.contentDocument!
    const win = frame.contentWindow!
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    Object.defineProperty(win, 'visualViewport', { configurable: true, value: { width: 321, addEventListener, removeEventListener } })
    const { service } = setup({ getRootNode: () => rootNode }, ['trackBoundarySize'])
    expect(service.state.context.boundarySize.width).toBe(321)
    expect(addEventListener).toHaveBeenCalledTimes(1)
    const [type, callback] = addEventListener.mock.calls[0]
    expect(type).toBe('resize')
    service.stop()
    expect(removeEventListener).toHaveBeenCalledExactlyOnceWith('resize', callback)
  })
})
