import type { FocusTrapOptions } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FocusTrap } from '../src/focus-trap'

const traps: FocusTrap[] = []
let root: HTMLDivElement

function deferred() {
  let resolve!: () => void
  let reject!: (reason: Error) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

function fixture(options: FocusTrapOptions = {}) {
  const trigger = document.createElement('button')
  const container = document.createElement('div')
  const content = document.createElement('button')
  trigger.textContent = 'Trigger'
  content.textContent = 'Content'
  container.append(content)
  root.append(trigger, container)
  const trap = new FocusTrap(container, { fallbackFocus: content, delayInitialFocus: false, ...options })
  traps.push(trap)
  return { trigger, content, trap }
}

beforeEach(() => {
  vi.useFakeTimers()
  root = document.createElement('div')
  document.body.append(root)
})

afterEach(() => {
  traps.reverse().forEach(trap => trap.deactivate({ returnFocus: false }))
  traps.length = 0
  vi.runAllTimers()
  root.remove()
  vi.useRealTimers()
})

describe('focus trap activation generations', () => {
  it.each(['resolve', 'reject'] as const)('finishes the current readiness promise on %s', async (settle) => {
    const gate = deferred()
    const events: string[] = []
    const { trigger, content, trap } = fixture({
      checkCanFocusTrap: () => gate.promise,
      onActivate: () => events.push('activate'),
      onPostActivate: () => events.push('post activate'),
    })
    trigger.focus()
    trap.activate()
    expect(document.activeElement).toBe(trigger)
    expect(events).toEqual(['activate'])
    gate[settle](new Error('readiness rejected'))
    await Promise.resolve()
    expect(document.activeElement).toBe(content)
    expect(events).toEqual(['activate', 'post activate'])
  })

  it.each(['resolve', 'reject'] as const)('ignores %s after deactivation', async (settle) => {
    const gate = deferred()
    const onPostActivate = vi.fn()
    const initialFocus = vi.fn<() => HTMLElement>()
    const { trigger, content, trap } = fixture({ checkCanFocusTrap: () => gate.promise, onPostActivate, initialFocus })
    initialFocus.mockReturnValue(content)
    trigger.focus()
    trap.activate().deactivate({ returnFocus: false })
    gate[settle](new Error('readiness rejected'))
    await Promise.resolve()
    expect(trap.active).toBe(false)
    expect(document.activeElement).toBe(trigger)
    expect(initialFocus).not.toHaveBeenCalled()
    expect(onPostActivate).not.toHaveBeenCalled()
  })

  it.each(['resolve', 'reject'] as const)('ignores an older %s while a newer readiness promise is pending', async (settle) => {
    const older = deferred()
    const newer = deferred()
    const oldPostActivate = vi.fn()
    const newPostActivate = vi.fn()
    const { trigger, content, trap } = fixture()
    trigger.focus()
    trap.activate({ checkCanFocusTrap: () => older.promise, onPostActivate: oldPostActivate })
    trap.deactivate({ returnFocus: false })
    trap.activate({ checkCanFocusTrap: () => newer.promise, onPostActivate: newPostActivate })
    older[settle](new Error('old readiness rejected'))
    await Promise.resolve()
    expect(document.activeElement).toBe(trigger)
    expect(oldPostActivate).not.toHaveBeenCalled()
    expect(newPostActivate).not.toHaveBeenCalled()
    newer.resolve()
    await Promise.resolve()
    expect(document.activeElement).toBe(content)
    expect(newPostActivate).toHaveBeenCalledTimes(1)
  })

  it('ignores the old completion after the replacement has already activated', async () => {
    const older = deferred()
    const newer = deferred()
    const oldPostActivate = vi.fn()
    const newPostActivate = vi.fn()
    const initialFocus = vi.fn<() => HTMLElement>()
    const { content, trap } = fixture({ initialFocus })
    initialFocus.mockReturnValue(content)
    trap.activate({ checkCanFocusTrap: () => older.promise, onPostActivate: oldPostActivate })
    trap.deactivate({ returnFocus: false })
    trap.activate({ checkCanFocusTrap: () => newer.promise, onPostActivate: newPostActivate })
    newer.resolve()
    await Promise.resolve()
    older.resolve()
    await Promise.resolve()
    expect(initialFocus).toHaveBeenCalledTimes(1)
    expect(oldPostActivate).not.toHaveBeenCalled()
    expect(newPostActivate).toHaveBeenCalledTimes(1)
  })

  it.each([false, true])('does not continue after onActivate stops the trap (asynchronous: %s)', async (asynchronous) => {
    const checkCanFocusTrap = vi.fn(() => Promise.resolve())
    const onPostActivate = vi.fn()
    const { trigger, trap } = fixture()
    trigger.focus()
    trap.activate({
      checkCanFocusTrap: asynchronous ? checkCanFocusTrap : undefined,
      onActivate: () => trap.deactivate({ returnFocus: false }),
      onPostActivate,
    })
    await Promise.resolve()
    expect(trap.active).toBe(false)
    expect(document.activeElement).toBe(trigger)
    expect(checkCanFocusTrap).not.toHaveBeenCalled()
    expect(onPostActivate).not.toHaveBeenCalled()
  })

  it.each([false, true])('does not continue after onActivate replaces the activation (asynchronous: %s)', async (asynchronous) => {
    const oldGate = vi.fn(() => Promise.resolve())
    const newGate = deferred()
    const oldPostActivate = vi.fn()
    const newPostActivate = vi.fn()
    const events: string[] = []
    const { trigger, content, trap } = fixture()
    trigger.focus()
    trap.activate({
      checkCanFocusTrap: asynchronous ? oldGate : undefined,
      onPostActivate: oldPostActivate,
      onActivate() {
        events.push('old activate')
        trap.deactivate({ returnFocus: false })
        trap.activate({
          checkCanFocusTrap: () => newGate.promise,
          onActivate: () => events.push('new activate'),
          onPostActivate: newPostActivate,
        })
      },
    })
    await Promise.resolve()
    expect(events).toEqual(['old activate', 'new activate'])
    expect(document.activeElement).toBe(trigger)
    expect(oldGate).not.toHaveBeenCalled()
    expect(oldPostActivate).not.toHaveBeenCalled()
    newGate.resolve()
    await Promise.resolve()
    expect(document.activeElement).toBe(content)
    expect(newPostActivate).toHaveBeenCalledTimes(1)
  })

  it('propagates an onActivate error without cancelling its replacement activation', async () => {
    const error = new Error('activation callback')
    const replacement = deferred()
    const oldGate = vi.fn(() => Promise.resolve())
    const oldPostActivate = vi.fn()
    const newPostActivate = vi.fn()
    const { content, trap } = fixture()
    expect(() => trap.activate({
      checkCanFocusTrap: oldGate,
      onPostActivate: oldPostActivate,
      onActivate() {
        trap.deactivate({ returnFocus: false })
        trap.activate({ checkCanFocusTrap: () => replacement.promise, onPostActivate: newPostActivate })
        throw error
      },
    })).toThrow(error)
    expect(oldGate).not.toHaveBeenCalled()
    expect(oldPostActivate).not.toHaveBeenCalled()
    replacement.resolve()
    await Promise.resolve()
    expect(document.activeElement).toBe(content)
    expect(newPostActivate).toHaveBeenCalledTimes(1)
  })

  it('does not duplicate readiness checks when activate is called while already active', async () => {
    const gate = deferred()
    const checkCanFocusTrap = vi.fn(() => gate.promise)
    const onPostActivate = vi.fn()
    const { trap } = fixture({ checkCanFocusTrap, onPostActivate })
    trap.activate().activate()
    expect(checkCanFocusTrap).toHaveBeenCalledTimes(1)
    gate.resolve()
    await Promise.resolve()
    expect(onPostActivate).toHaveBeenCalledTimes(1)
  })

  it('preserves current-generation completion callbacks when paused while waiting', async () => {
    const gate = deferred()
    const events: string[] = []
    const { trap } = fixture({
      initialFocus: false,
      checkCanFocusTrap: () => gate.promise,
      onActivate: () => events.push('activate'),
      onPostPause: () => events.push('post pause'),
      onPostActivate: () => events.push('post activate'),
    })
    trap.activate().pause()
    gate.resolve()
    await Promise.resolve()
    expect(trap.paused).toBe(true)
    expect(events).toEqual(['activate', 'post pause', 'post activate'])
  })
})
