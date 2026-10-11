import type { FocusTrapOptions } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FocusTrap } from '../src/focus-trap'

const traps: FocusTrap[] = []
const roots: HTMLElement[] = []

function fixture(options: FocusTrapOptions = {}) {
  const root = document.createElement('div')
  const trigger = document.createElement('button')
  const container = document.createElement('div')
  const content = document.createElement('button')
  trigger.textContent = 'Trigger'
  content.textContent = 'Content'
  container.append(content)
  root.append(trigger, container)
  document.body.append(root)
  roots.push(root)
  const trap = new FocusTrap(container, { fallbackFocus: content, ...options })
  traps.push(trap)
  return { trigger, container, content, trap }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  traps.reverse().forEach(trap => trap.deactivate({ returnFocus: false }))
  traps.length = 0
  vi.runAllTimers()
  roots.forEach(root => root.remove())
  roots.length = 0
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('focus trap lifecycle resources', () => {
  it('delays initial focus until the next task by default', () => {
    const { trigger, content, trap } = fixture()
    trigger.focus()
    trap.activate()
    expect(document.activeElement).toBe(trigger)
    vi.runAllTimers()
    expect(document.activeElement).toBe(content)
  })

  it('cancels initial focus when deactivated before the next task', () => {
    const { trigger, content, trap } = fixture()
    const focus = vi.spyOn(content, 'focus')
    trigger.focus()
    trap.activate().deactivate({ returnFocus: false })
    vi.runAllTimers()
    expect(focus).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(trigger)
  })

  it('cancels initial focus while paused', () => {
    const { trigger, content, trap } = fixture()
    const focus = vi.spyOn(content, 'focus')
    trigger.focus()
    trap.activate().pause()
    vi.runAllTimers()
    expect(focus).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(trigger)
    expect(trap.active).toBe(true)
    expect(trap.paused).toBe(true)
  })

  it('schedules only one initial focus when unpaused before the original task', () => {
    const initialFocus = vi.fn<() => HTMLElement>()
    const { trigger, content, trap } = fixture({ initialFocus })
    initialFocus.mockReturnValue(content)
    trigger.focus()
    // Resolve through a callback to count work even if the second focus is a no-op.
    trap.activate().pause().unpause()
    vi.runAllTimers()
    expect(initialFocus).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(content)
    expect(trap.paused).toBe(false)
    expect(trap.active).toBe(true)
  })

  it('resumes delayed focus after a completed pause', () => {
    const { trigger, content, trap } = fixture()
    trigger.focus()
    trap.activate().pause()
    vi.runAllTimers()
    trigger.focus()
    trap.unpause()
    expect(document.activeElement).toBe(trigger)
    vi.runAllTimers()
    expect(document.activeElement).toBe(content)
  })

  it('does not let a paused outer trap focus while a nested trap opts out of initial focus', () => {
    const trapStack: FocusTrap[] = []
    const outer = fixture({ trapStack })
    const inner = fixture({ trapStack, initialFocus: false })
    outer.container.append(inner.container)
    outer.trigger.focus()
    const outerFocus = vi.spyOn(outer.content, 'focus')
    outer.trap.activate()
    inner.trap.activate()
    expect(outer.trap.paused).toBe(true)
    vi.runAllTimers()
    expect(outerFocus).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(outer.trigger)
    inner.trap.deactivate({ returnFocus: false })
    expect(outer.trap.paused).toBe(false)
    vi.runAllTimers()
    expect(document.activeElement).toBe(outer.content)
  })

  it('preserves synchronous initial focus and removes focus listeners while paused', () => {
    const { trigger, content, trap } = fixture({ delayInitialFocus: false })
    trigger.focus()
    trap.activate()
    expect(document.activeElement).toBe(content)
    trigger.focus()
    expect(document.activeElement).toBe(content)
    trap.pause()
    trigger.focus()
    expect(document.activeElement).toBe(trigger)
    trap.unpause()
    expect(document.activeElement).toBe(content)
  })

  it('preserves the initial-focus opt-out across pause and unpause', () => {
    const { trigger, content, trap } = fixture({ initialFocus: false })
    const focus = vi.spyOn(content, 'focus')
    trigger.focus()
    trap.activate().pause().unpause()
    vi.runAllTimers()
    expect(focus).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(trigger)
  })

  it('returns focus once after repeated deactivation and supports a new activation', () => {
    const { trigger, content, trap } = fixture({ delayInitialFocus: false })
    const onPostDeactivate = vi.fn()
    trigger.focus()
    trap.activate()
    trap.deactivate({ onPostDeactivate }).deactivate({ onPostDeactivate })
    vi.runAllTimers()
    expect(document.activeElement).toBe(trigger)
    expect(onPostDeactivate).toHaveBeenCalledTimes(1)
    trap.activate()
    expect(document.activeElement).toBe(content)
    trap.deactivate()
    vi.runAllTimers()
    expect(document.activeElement).toBe(trigger)
  })

  it('ignores pause while inactive without consuming the next activation', () => {
    const onPause = vi.fn()
    const { trigger, content, trap } = fixture({ onPause })
    trigger.focus()
    trap.pause().pause()
    expect(trap.paused).toBe(false)
    expect(onPause).not.toHaveBeenCalled()
    trap.activate()
    vi.runAllTimers()
    expect(document.activeElement).toBe(content)
  })

  it('does not repeat pause hooks or retain work after repeated pause', () => {
    const onPause = vi.fn()
    const onPostPause = vi.fn()
    const { trigger, content, trap } = fixture({ onPause, onPostPause })
    const focus = vi.spyOn(content, 'focus')
    trigger.focus()
    trap.activate().pause().pause()
    vi.runAllTimers()
    expect(onPause).toHaveBeenCalledTimes(1)
    expect(onPostPause).toHaveBeenCalledTimes(1)
    expect(focus).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(trigger)
  })

  it('has already released paused work when onPostPause throws', () => {
    const error = new Error('post-pause callback')
    const { trigger, content, trap } = fixture({
      onPostPause() {
        throw error
      },
    })
    const focus = vi.spyOn(content, 'focus')
    trigger.focus()
    trap.activate()
    expect(() => trap.pause()).toThrow(error)
    expect(trap.paused).toBe(true)
    vi.runAllTimers()
    expect(focus).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(trigger)
  })
})
