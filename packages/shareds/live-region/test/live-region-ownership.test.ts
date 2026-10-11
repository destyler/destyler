// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLiveRegion } from '../index'

afterEach(() => {
  document.body.replaceChildren()
  vi.useRealTimers()
})

describe('live region ownership audit', () => {
  it('does not clear another owner when an unused announcer is destroyed', () => {
    vi.useFakeTimers()
    const unused = createLiveRegion()
    const active = createLiveRegion()
    active.announce('Current owner')
    vi.runAllTimers()
    const region = document.querySelector('[data-live-announcer]')!
    expect(region.textContent).toBe('Current owner')
    unused.destroy()
    expect(region.isConnected).toBe(true)
    active.destroy()
    expect(region.isConnected).toBe(false)
  })

  it('keeps last-announcement-wins while retired owner cleanup preserves the successor', () => {
    vi.useFakeTimers()
    const first = createLiveRegion()
    const second = createLiveRegion({ level: 'assertive' })
    first.announce('Old')
    const old = document.querySelector('[data-live-announcer]')!
    second.announce('New', 10)
    const current = document.querySelector('[data-live-announcer]')!
    expect(current).not.toBe(old)
    expect(old.isConnected).toBe(false)
    expect(current.getAttribute('role')).toBe('alert')
    first.destroy()
    vi.runAllTimers()
    expect(current.isConnected).toBe(true)
    expect(current.textContent).toBe('New')
    expect(document.querySelectorAll('[data-live-announcer]')).toHaveLength(1)
    second.destroy()
    expect(current.isConnected).toBe(false)
  })

  it('removes its own region inside a caller-provided shadow descendant root', () => {
    vi.useFakeTimers()
    const host = document.createElement('div')
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const root = document.createElement('div')
    shadow.append(root)
    const announcer = createLiveRegion({ root })
    announcer.announce('Nested root')
    vi.runAllTimers()
    const region = root.querySelector('[data-live-announcer]')!
    expect(region.textContent).toBe('Nested root')
    announcer.destroy()
    expect(region.isConnected).toBe(false)
  })

  it('retains existing same-owner replace, delay and role behavior', () => {
    vi.useFakeTimers()
    const announcer = createLiveRegion({ delay: 20 })
    announcer.announce('First')
    const first = document.querySelector('[data-live-announcer]')!
    announcer.announce('Second', 5)
    const current = document.querySelector('[data-live-announcer]')!
    expect(first.isConnected).toBe(false)
    expect(current.textContent).toBe('')
    expect(current.getAttribute('role')).toBe('status')
    vi.advanceTimersByTime(5)
    expect(current.textContent).toBe('Second')
    announcer.destroy()
    expect(current.isConnected).toBe(false)
  })
})

describe('live region timer and compatibility contracts', () => {
  it('cancels its pending write on destruction', () => {
    vi.useFakeTimers()
    const announcer = createLiveRegion({ delay: 100 })
    announcer.announce('Must not populate after cleanup')
    const region = document.querySelector('[data-live-announcer]')!
    expect(vi.getTimerCount()).toBe(1)
    announcer.destroy()
    announcer.destroy()
    expect(vi.getTimerCount()).toBe(0)
    vi.runAllTimers()
    expect(region.textContent).toBe('')
  })

  it('cancels only its own superseded timers and can announce again after destruction', () => {
    vi.useFakeTimers()
    const announcer = createLiveRegion({ delay: 100 })
    announcer.announce('First')
    const first = document.querySelector('[data-live-announcer]')!
    announcer.announce('Replacement', 10)
    expect(vi.getTimerCount()).toBe(1)
    vi.advanceTimersByTime(10)
    expect(document.querySelector('[data-live-announcer]')?.textContent).toBe('Replacement')
    expect(first.textContent).toBe('')
    announcer.destroy()
    announcer.announce('Reused', 0)
    vi.runAllTimers()
    expect(document.querySelector('[data-live-announcer]')?.textContent).toBe('Reused')
    expect(announcer.toJSON()).toBe('__live-region__')
    announcer.destroy()
  })

  it('uses the supplied document and root without touching another document', () => {
    vi.useFakeTimers()
    const other = document.implementation.createHTMLDocument('Other document')
    const root = other.createElement('section')
    other.body.append(root)
    const local = createLiveRegion()
    const remote = createLiveRegion({ document: other, root, level: 'assertive' })
    local.announce('Local')
    remote.announce('Other')
    vi.runAllTimers()
    expect(document.querySelector('[data-live-announcer]')?.textContent).toBe('Local')
    expect(root.querySelector('[data-live-announcer]')?.textContent).toBe('Other')
    expect(root.querySelector('[data-live-announcer]')?.ownerDocument).toBe(other)
    remote.destroy()
    expect(root.childElementCount).toBe(0)
    expect(document.querySelector('[data-live-announcer]')?.textContent).toBe('Local')
    local.destroy()
  })

  it('replaces its own prior region in a shadow descendant and supports a detached explicit root', () => {
    vi.useFakeTimers()
    const host = document.createElement('div')
    document.body.append(host)
    const root = document.createElement('div')
    host.attachShadow({ mode: 'open' }).append(root)
    const announcer = createLiveRegion({ root })
    announcer.announce('First')
    announcer.announce('Second')
    vi.runAllTimers()
    expect(root.querySelectorAll('[data-live-announcer]')).toHaveLength(1)
    expect(root.textContent).toBe('Second')
    announcer.destroy()
    root.remove()
    announcer.announce('Detached')
    vi.runAllTimers()
    expect(root.textContent).toBe('Detached')
    announcer.destroy()
    expect(root.childElementCount).toBe(0)
  })

  it('retires an old-version fixed-ID region while owner cleanup preserves an externally replaced successor', () => {
    vi.useFakeTimers()
    const legacy = document.createElement('span')
    legacy.id = '__live-region__'
    document.body.append(legacy)
    const announcer = createLiveRegion()
    announcer.announce('New owner')
    expect(legacy.isConnected).toBe(false)
    const owned = document.getElementById('__live-region__')!
    // Older bundles perform this document-global remove/create sequence.
    owned.remove()
    const successor = document.createElement('span')
    successor.id = '__live-region__'
    successor.textContent = 'Older-version successor'
    document.body.append(successor)
    announcer.destroy()
    expect(successor.isConnected).toBe(true)
    expect(successor.textContent).toBe('Older-version successor')
  })
})
