// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let ariaHidden: typeof import('../index').ariaHidden

beforeEach(async () => {
  // A deliberately failing cleanup probe must not poison another test's module registry.
  vi.resetModules()
  ;({ ariaHidden } = await import('../index'))
  vi.useFakeTimers()
})

afterEach(() => {
  document.body.replaceChildren()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function fixture() {
  const modal = document.createElement('div')
  const nested = document.createElement('div')
  const inside = document.createElement('button')
  const outside = document.createElement('div')
  modal.append(inside, nested)
  document.body.append(modal, outside)
  return { modal, nested, inside, outside }
}

describe('aria-hidden public cleanup ownership', () => {
  it('does not release a peer lock when the same returned cleanup is called twice', () => {
    const { modal, outside } = fixture()
    const first = ariaHidden([modal], { defer: false })
    const second = ariaHidden([modal], { defer: false })
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    first()
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    first()
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    second()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
  })

  it.each([false, true])('preserves two nested modal leases in either release order (outer first=%s)', (outerFirst) => {
    const { modal, nested, inside, outside } = fixture()
    const outer = ariaHidden([modal], { defer: false })
    const inner = ariaHidden([nested], { defer: false })
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    expect(inside.getAttribute('aria-hidden')).toBe('true')
    expect(nested.hasAttribute('aria-hidden')).toBe(false)
    const [first, last] = outerFirst ? [outer, inner] : [inner, outer]
    first()
    first()
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    expect(inside.hasAttribute('aria-hidden')).toBe(outerFirst)
    last()
    last()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
    expect(inside.hasAttribute('aria-hidden')).toBe(false)
    expect(document.querySelectorAll('[data-aria-hidden]')).toHaveLength(0)
    // Registry should remain usable after duplicate releases, not only restore this DOM.
    const next = ariaHidden([modal], { defer: false })
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    next()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
  })

  it('cancels deferred acquisition before reading targets and permits repeated cancellation', () => {
    const { modal, outside } = fixture()
    const getTargets = vi.fn(() => [modal])
    const cleanup = ariaHidden(getTargets)
    cleanup()
    cleanup()
    vi.runAllTimers()
    expect(getTargets).not.toHaveBeenCalled()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
  })

  it('does not acquire a deferred lease when target resolution disposes it reentrantly', () => {
    const { modal, outside } = fixture()
    const setAttribute = vi.spyOn(outside, 'setAttribute')
    let cleanup: VoidFunction
    const getTargets = vi.fn(() => {
      cleanup()
      return [modal]
    })
    cleanup = ariaHidden(getTargets)
    vi.runAllTimers()
    expect(getTargets).toHaveBeenCalledTimes(1)
    expect(setAttribute).not.toHaveBeenCalled()
    setAttribute.mockRestore()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
    cleanup()
    const fresh = ariaHidden([modal], { defer: false })
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    fresh()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
  })

  it('releases a lease acquired during reentrant custom-element disposal', () => {
    const { modal, outside } = fixture()
    let cleanup: VoidFunction
    const name = `cleanup-on-aria-hidden-${Math.random().toString(36).slice(2)}`
    customElements.define(name, class extends HTMLElement {
      static observedAttributes = ['aria-hidden']

      attributeChangedCallback(_name: string, _oldValue: string | null, value: string | null) {
        if (value === 'true')
          cleanup()
      }
    })
    const custom = document.createElement(name)
    document.body.append(custom)
    cleanup = ariaHidden([modal])
    vi.runAllTimers()
    expect(custom.hasAttribute('aria-hidden')).toBe(false)
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
    expect(document.querySelectorAll('[data-aria-hidden]')).toHaveLength(0)
    const fresh = ariaHidden([modal], { defer: false })
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    fresh()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
  })

  it('releases a completed deferred lease once without exposing a synchronous peer', () => {
    const { modal, outside } = fixture()
    const first = ariaHidden([modal])
    vi.runAllTimers()
    const peer = ariaHidden([modal], { defer: false })
    first()
    first()
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    peer()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
  })

  it('preserves external aria-hidden and live-announcer exemptions', () => {
    const { modal, outside } = fixture()
    outside.setAttribute('aria-hidden', 'true')
    const exempt = ['script', 'next-route-announcer', 'div', 'div'].map(tag => document.createElement(tag))
    exempt[2].setAttribute('aria-live', 'polite')
    exempt[3].setAttribute('data-live-announcer', 'true')
    document.body.append(...exempt)
    const cleanup = ariaHidden([modal], { defer: false })
    expect(outside.hasAttribute('data-aria-hidden')).toBe(true)
    for (const element of exempt)
      expect(element.hasAttribute('aria-hidden')).toBe(false)
    cleanup()
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    expect(outside.hasAttribute('data-aria-hidden')).toBe(false)
  })

  it('supports empty targets, nullable targets, and shadow descendants through the public wrapper', () => {
    const { modal, outside } = fixture()
    const empty = ariaHidden([null], { defer: false })
    empty()
    empty()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
    const shadow = modal.attachShadow({ mode: 'open' })
    const target = document.createElement('div')
    shadow.append(target)
    const cleanup = ariaHidden([null, target], { defer: false })
    expect(modal.hasAttribute('aria-hidden')).toBe(false)
    expect(outside.getAttribute('aria-hidden')).toBe('true')
    cleanup()
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
  })
})
