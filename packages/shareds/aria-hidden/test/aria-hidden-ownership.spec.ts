import { afterEach, describe, expect, it } from 'vitest'
import { ariaHidden } from '../index'

const cleanups: VoidFunction[] = []
afterEach(() => {
  for (const cleanup of cleanups.splice(0))
    cleanup()
  document.querySelectorAll('[data-a11y-audit-fixture]').forEach(node => node.remove())
})

function fixture() {
  const target = document.createElement('div')
  const outside = document.createElement('div')
  target.dataset.a11yAuditFixture = ''
  outside.dataset.a11yAuditFixture = ''
  document.body.append(target, outside)
  return { target, outside }
}

const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

describe('native custom-element aria-hidden cleanup', () => {
  it('never changes outside attributes after disposal during target resolution', async () => {
    const { target, outside } = fixture()
    const mutations: MutationRecord[] = []
    const observer = new MutationObserver(records => mutations.push(...records))
    observer.observe(outside, { attributes: true })
    let cleanup: VoidFunction = () => {}
    cleanup = ariaHidden(() => {
      cleanup()
      return [target]
    })
    cleanups.push(cleanup)
    try {
      await nextFrame()
      expect(outside.hasAttribute('aria-hidden')).toBe(false)
      expect(mutations).toHaveLength(0)
    }
    finally {
      observer.disconnect()
    }
  })

  it('releases a newly acquired lease if attributeChangedCallback disposes it', async () => {
    const { target, outside } = fixture()
    let cleanup: VoidFunction = () => {}
    const name = `cleanup-on-hide-${Math.random().toString(36).slice(2)}`
    customElements.define(name, class extends HTMLElement {
      static observedAttributes = ['aria-hidden']

      attributeChangedCallback(_name: string, _oldValue: string | null, value: string | null) {
        if (value === 'true')
          cleanup()
      }
    })
    const custom = document.createElement(name)
    custom.dataset.a11yAuditFixture = ''
    document.body.append(custom)
    cleanup = ariaHidden([target])
    cleanups.push(cleanup)
    await nextFrame()
    expect(custom.hasAttribute('aria-hidden')).toBe(false)
    expect(outside.hasAttribute('aria-hidden')).toBe(false)
  })
})
