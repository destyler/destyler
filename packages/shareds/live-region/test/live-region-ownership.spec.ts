import { afterEach, describe, expect, it } from 'vitest'
import { createLiveRegion } from '../index'

const cleanups: VoidFunction[] = []
const fixtures: HTMLElement[] = []
afterEach(() => {
  for (const cleanup of cleanups.splice(0))
    cleanup()
  for (const fixture of fixtures.splice(0))
    fixture.remove()
})

const tick = (delay = 0) => new Promise<void>(resolve => setTimeout(resolve, delay))

describe('native live-region cleanup ownership', () => {
  it('keeps the latest announcement when unused or retired owners are destroyed', async () => {
    const unused = createLiveRegion()
    const first = createLiveRegion({ delay: 20 })
    const second = createLiveRegion({ level: 'assertive' })
    cleanups.push(unused.destroy, first.destroy, second.destroy)
    first.announce('Retired')
    const retired = document.querySelector('[data-live-announcer]')!
    second.announce('Current')
    const current = document.querySelector('[data-live-announcer]')!
    expect(retired.isConnected).toBe(false)
    unused.destroy()
    first.destroy()
    await tick()
    expect(current.isConnected).toBe(true)
    expect(current.textContent).toBe('Current')
    expect(current.getAttribute('role')).toBe('alert')
    expect(document.querySelectorAll('[data-live-announcer]')).toHaveLength(1)
    second.destroy()
    await tick(25)
    expect(current.isConnected).toBe(false)
    expect(retired.textContent).toBe('')
  })

  it('replaces and destroys its own shadow-root region without late writes', async () => {
    const host = document.createElement('div')
    fixtures.push(host)
    document.body.append(host)
    const root = document.createElement('div')
    host.attachShadow({ mode: 'open' }).append(root)
    const announcer = createLiveRegion({ root, delay: 20 })
    cleanups.push(announcer.destroy)
    announcer.announce('First')
    const first = root.querySelector('[data-live-announcer]')!
    announcer.announce('Second')
    const second = root.querySelector('[data-live-announcer]')!
    expect(root.querySelectorAll('[data-live-announcer]')).toHaveLength(1)
    expect(first.isConnected).toBe(false)
    announcer.destroy()
    announcer.destroy()
    await tick(25)
    expect(root.childElementCount).toBe(0)
    expect(first.textContent).toBe('')
    expect(second.textContent).toBe('')
  })
})
