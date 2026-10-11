import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/ScrollArea'

let mount: HTMLElement
let cleanup: (() => void) | undefined

function getScrollbarY() {
  return page.locatoring('[data-part="scrollbar"][data-orientation="vertical"]')
}

function getRootEl() {
  return testHook.getPart('root').first()
}

async function setType(type: 'auto' | 'always' | 'scroll' | 'hover') {
  await page.getByTestId('type').selectOptions(type)
  // Allow control → setContext → connect re-render to settle.
  await vi.waitFor(async () => {
    const select = await page.getByTestId('type').element()
    expect((select as HTMLSelectElement).value).toBe(type)
  }, { timeout: 1000 })
}

async function waitForOverflowScrollbar() {
  await vi.waitFor(async () => {
    const scrollbar = await getScrollbarY().element()
    // Dimensions settle after ResizeObserver; overflow should exist for 1000 virtual items.
    expect(scrollbar.getAttribute('data-orientation')).toBe('vertical')
  }, { timeout: 3000 })
}

// Temporary never-merge diagnostic: original spec remains unchanged.
// An observed pass is not runner acceptance; original failures/retries remain visible.
let attempt = 0
let observe: (phase: string) => void = () => {}
let stopObservation: () => void = () => {}

function startObservation(mode: string, name: string, retry: number) {
  const attemptId = ++attempt
  const attemptMount = mount
  const root = attemptMount.querySelector<HTMLElement>('[data-scope="scroll-area"][data-part="root"]')
  const viewport = attemptMount.querySelector('[data-part="viewport"]')
  const firstDelay = attemptMount.querySelector('[data-testid="scrollHideDelay"]')
  const records: Record<string, unknown>[] = []
  let omitted = 0
  let gaps = 0
  let disposed = false
  const listeners: [string, EventListener][] = []
  const readSnapshot = (phase: string, event?: Event) => {
    try {
      const delay = attemptMount.querySelector('[data-testid="scrollHideDelay"]')
      return {
        phase,
        elapsed: performance.now(),
        rootConnected: root?.isConnected ?? false,
        sameRoot: root === attemptMount.querySelector('[data-scope="scroll-area"][data-part="root"]'),
        hovered: root?.matches(':hover') ?? false,
        state: attemptMount.querySelector('[data-part="scrollbar"][data-orientation="vertical"]')?.getAttribute('data-state'),
        delayReplacedSinceSetup: delay !== firstDelay,
        delayFocused: !!delay && document.activeElement === delay,
        trusted: event?.isTrusted,
      }
    }
    catch {
      gaps++
      return undefined
    }
  }
  const snapshot = (phase: string, event?: Event) => {
    if (disposed)
      return
    if (records.length >= 24) {
      omitted++
      return
    }
    const record = readSnapshot(phase, event)
    if (record)
      records.push(record)
  }
  for (const type of ['pointerenter', 'pointerleave', 'scroll']) {
    const listener: EventListener = (event) => {
      if (event.target === (type === 'scroll' ? viewport : root))
        snapshot(type, event)
    }
    root?.addEventListener(type, listener, { capture: true, passive: true })
    listeners.push([type, listener])
  }
  snapshot('installed')
  stopObservation = () => {
    if (disposed)
      return
    disposed = true
    for (const [type, listener] of listeners)
      root?.removeEventListener(type, listener, true)
    const finalSnapshot = readSnapshot('final')
    console.warn('[scrollarea-pointer-diagnostic]', JSON.stringify({ mode, name, retry, attemptId, records, finalSnapshot, omitted, gaps }))
  }
  return snapshot
}

describe.each(['inside-A', 'outside-B', 'inside-A2'])('[scroll-area pointer diagnostic %s]', (mode) => {
  beforeEach(async ({ task }) => {
    cleanup?.()
    if (mount && mount.parentElement) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    cleanup = render(mount)
    observe = startObservation(mode, task.name, task.result?.retryCount ?? 0)
    // Wait for component to initialize
    await vi.waitFor(() => {
      const root = document.querySelector('[data-scope="scroll-area"][data-part="root"]')
      expect(root).toBeTruthy()
    }, { timeout: 2000 })
    await waitForOverflowScrollbar()
    observe('setup-ready')
    if (mode === 'outside-B' && task.name.startsWith('[type=hover]')) {
      await page.getByRole('button', { name: 'Controls', exact: true }).hover()
      expect((await getRootEl().element()).matches(':hover')).toBe(false)
      observe('parked-outside')
    }
  })

  afterEach(() => {
    const stop = stopObservation
    stopObservation = () => {}
    try {
      observe('end')
      stop()
    }
    finally {
      try {
        cleanup?.()
      }
      finally {
        cleanup = undefined
        if (mount && mount.parentElement)
          document.body.removeChild(mount)
      }
    }
  })

  it('[type=auto] keeps vertical scrollbar visible with overflow', async () => {
    await setType('auto')
    await vi.waitFor(async () => {
      await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'visible')
    }, { timeout: 3000 })
    await userEvent.hover(getRootEl())
    expect((await getRootEl().element()).matches(':hover')).toBe(true)
    observe('seed-inside')
  })

  it('[type=hover] shows scrollbar on pointer enter and hides on leave', async () => {
    await setType('hover')
    // Virtual mount / measure can briefly emit scroll → interacting; wait for idle hide.
    const delayInput = page.getByTestId('scrollHideDelay')
    await delayInput.fill('50')
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(async () => {
      await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'hidden')
    }, { timeout: 2000 })

    await userEvent.hover(getRootEl())
    await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'visible')

    await userEvent.unhover(getRootEl())
    await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'hidden')
  })
})
