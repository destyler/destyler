import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FocusTrap } from '../src/focus-trap'

let trap: FocusTrap
let container: HTMLDivElement

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

beforeEach(() => {
  vi.useFakeTimers()
  container = document.createElement('div')
  container.tabIndex = -1
  document.body.append(container)
})

afterEach(() => {
  trap.deactivate({ returnFocus: false })
  vi.runAllTimers()
  container.remove()
  vi.useRealTimers()
})

describe('replacement completion compatibility', () => {
  it('preserves a replacement started from initial tabbable fallback resolution', async () => {
    const replacement = deferred()
    const oldPostActivate = vi.fn()
    const replacementPostActivate = vi.fn()
    let replaced = false
    trap = new FocusTrap(container, {
      delayInitialFocus: false,
      onPostActivate: oldPostActivate,
      fallbackFocus() {
        if (!replaced) {
          replaced = true
          trap.activate({ checkCanFocusTrap: () => replacement.promise, onPostActivate: replacementPostActivate })
        }
        return container
      },
    })
    trap.activate()
    replacement.resolve()
    await Promise.resolve()
    expect(replacementPostActivate).toHaveBeenCalledTimes(1)
  })

  it('preserves a replacement started from deferred tabbable fallback resolution', async () => {
    const original = deferred()
    const replacement = deferred()
    const replacementPostActivate = vi.fn()
    let replaced = false
    trap = new FocusTrap(container, {
      delayInitialFocus: false,
      fallbackFocus() {
        if (!replaced) {
          replaced = true
          trap.deactivate({ returnFocus: false })
          trap.activate({ checkCanFocusTrap: () => replacement.promise, onPostActivate: replacementPostActivate })
        }
        return container
      },
    })
    trap.activate({ checkCanFocusTrap: () => original.promise })
    original.resolve()
    await Promise.resolve()
    replacement.resolve()
    await Promise.resolve()
    expect(replacementPostActivate).toHaveBeenCalledTimes(1)
  })

  it('preserves a replacement started from initialFocus', async () => {
    const replacement = deferred()
    const replacementPostActivate = vi.fn()
    let replaced = false
    trap = new FocusTrap(container, {
      delayInitialFocus: false,
      fallbackFocus: container,
      initialFocus() {
        if (!replaced) {
          replaced = true
          trap.deactivate({ returnFocus: false })
          trap.activate({ checkCanFocusTrap: () => replacement.promise, onPostActivate: replacementPostActivate })
        }
        return container
      },
    })
    trap.activate()
    replacement.resolve()
    await Promise.resolve()
    expect(replacementPostActivate).toHaveBeenCalledTimes(1)
  })
})
