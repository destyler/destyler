import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

function createPresence(ctx: { present?: boolean, immediate?: boolean, onExitComplete?: () => void } = {}) {
  const service = machine({
    present: false,
    immediate: true,
    ...ctx,
  })
  service.start()
  return service
}

function apiOf(service: ReturnType<typeof machine>) {
  return connect(service.getState(), service.send, null as any)
}

describe('presence machine', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts unmounted when present is false', () => {
    const service = createPresence({ present: false })
    expect(service.getState().matches('unmounted')).toBe(true)
    expect(apiOf(service).present).toBe(false)
  })

  it('starts mounted when present is true', () => {
    const service = createPresence({ present: true })
    expect(service.getState().matches('mounted')).toBe(true)
    expect(apiOf(service).present).toBe(true)
  })

  it('mounts when present becomes true', async () => {
    const service = createPresence({ present: false, immediate: true })
    expect(apiOf(service).present).toBe(false)

    service.setContext({ present: true })
    await Promise.resolve()

    expect(service.getState().matches('mounted')).toBe(true)
    expect(apiOf(service).present).toBe(true)
  })

  it('unmounts immediately when present becomes false without animation styles', async () => {
    const onExitComplete = vi.fn()
    const service = createPresence({ present: true, immediate: true, onExitComplete })

    service.setContext({ present: false })
    await Promise.resolve()
    await Promise.resolve()

    expect(service.getState().matches('unmounted')).toBe(true)
    expect(apiOf(service).present).toBe(false)
    expect(onExitComplete).toHaveBeenCalledTimes(1)
  })

  it('unmount() forces an unmount from the mounted state', () => {
    const onExitComplete = vi.fn()
    const service = createPresence({ present: true, onExitComplete })
    const api = apiOf(service)

    api.unmount()

    expect(service.getState().matches('unmounted')).toBe(true)
    expect(onExitComplete).toHaveBeenCalledTimes(1)
  })

  it('setNode stores the node on context', () => {
    const service = createPresence({ present: true })
    const getComputedStyle = vi.fn(() => ({ animationName: 'none', animationDuration: '0s', animationDelay: '0s', display: 'block' }))
    const win = { getComputedStyle } as unknown as Window
    const node = {
      ownerDocument: { defaultView: win, visibilityState: 'visible' },
    } as unknown as HTMLElement

    apiOf(service).setNode(node)

    expect(service.getState().context.node).toBe(node)
    expect(getComputedStyle).toHaveBeenCalledWith(node)
  })

  it('connect.skip is false after an initial present flip', async () => {
    const service = createPresence({ present: false, immediate: true })
    expect(apiOf(service).skip).toBe(false)

    service.setContext({ present: true })
    await Promise.resolve()

    // after first sync, initial is true and present is mounted → skip becomes false when !initial && present
    expect(apiOf(service).present).toBe(true)
    expect(apiOf(service).skip).toBe(false)
  })
})

function createAnimatedNode(styles: {
  animationName: string
  animationDuration: string
  animationDelay?: string
  display?: string
}) {
  const listeners = new Map<string, Set<EventListener>>()
  const liveStyles = {
    animationName: styles.animationName,
    animationDuration: styles.animationDuration,
    animationDelay: styles.animationDelay ?? '0s',
    display: styles.display ?? 'block',
  }
  const win = {
    getComputedStyle: () => liveStyles,
  } as unknown as Window
  const node = {
    ownerDocument: { defaultView: win, visibilityState: 'visible' as DocumentVisibilityState },
    addEventListener(type: string, listener: EventListener) {
      if (!listeners.has(type))
        listeners.set(type, new Set())
      listeners.get(type)!.add(listener)
    },
    removeEventListener(type: string, listener: EventListener) {
      listeners.get(type)?.delete(listener)
    },
    dispatch(type: string) {
      const event = {
        type,
        target: node,
        composedPath: () => [node],
      } as unknown as AnimationEvent
      listeners.get(type)?.forEach(listener => listener(event))
    },
  } as unknown as HTMLElement & { dispatch: (type: string) => void }

  return { node, liveStyles, dispatch: (type: string) => (node as any).dispatch(type) }
}

describe('presence exit animation paths', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('enters unmountSuspended and unmounts on animationend', async () => {
    const onExitComplete = vi.fn()
    const service = createPresence({ present: true, immediate: true, onExitComplete })
    const { node, liveStyles, dispatch } = createAnimatedNode({
      animationName: 'none',
      animationDuration: '0s',
    })

    apiOf(service).setNode(node)
    await Promise.resolve()
    // Capture prevAnimationName as "none", then switch to a real exit animation
    liveStyles.animationName = 'fade-out'
    liveStyles.animationDuration = '0.2s'

    service.setContext({ present: false })
    await Promise.resolve()
    await Promise.resolve()

    expect(service.getState().matches('unmountSuspended')).toBe(true)
    expect(onExitComplete).not.toHaveBeenCalled()

    dispatch('animationend')

    expect(service.getState().matches('unmounted')).toBe(true)
    expect(apiOf(service).present).toBe(false)
    expect(onExitComplete).toHaveBeenCalledTimes(1)
  })

  it('unmounts on animationcancel while suspended', async () => {
    const onExitComplete = vi.fn()
    const service = createPresence({ present: true, immediate: true, onExitComplete })
    const { node, liveStyles, dispatch } = createAnimatedNode({
      animationName: 'none',
      animationDuration: '0s',
    })

    apiOf(service).setNode(node)
    await Promise.resolve()
    liveStyles.animationName = 'fade-out'
    liveStyles.animationDuration = '0.2s'

    service.setContext({ present: false })
    await Promise.resolve()
    await Promise.resolve()

    expect(service.getState().matches('unmountSuspended')).toBe(true)
    dispatch('animationcancel')

    expect(service.getState().matches('unmounted')).toBe(true)
    expect(onExitComplete).toHaveBeenCalledTimes(1)
  })

  it('with immediate=false waits for rAF before suspending/unmounting', async () => {
    const rafCallbacks: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    })

    const onExitComplete = vi.fn()
    const service = createPresence({ present: true, immediate: false, onExitComplete })

    service.setContext({ present: false })
    // context watchers notify on microtask
    await Promise.resolve()
    // syncPresence schedules via rAF — still mounted until the frame runs
    expect(service.getState().matches('mounted')).toBe(true)
    expect(rafCallbacks.length).toBeGreaterThan(0)

    rafCallbacks.splice(0).forEach(cb => cb(0))
    await Promise.resolve()

    expect(service.getState().matches('unmounted')).toBe(true)
    expect(onExitComplete).toHaveBeenCalledTimes(1)

    vi.unstubAllGlobals()
  })

  it('falls back to ANIMATION_DURATION timeout when animationend never fires', async () => {
    vi.useFakeTimers()
    const onExitComplete = vi.fn()
    const service = createPresence({ present: true, immediate: true, onExitComplete })
    const { node, liveStyles } = createAnimatedNode({
      animationName: 'none',
      animationDuration: '0s',
    })

    apiOf(service).setNode(node)
    await Promise.resolve()
    liveStyles.animationName = 'fade-out'
    liveStyles.animationDuration = '0.1s'
    liveStyles.animationDelay = '0s'

    service.setContext({ present: false })
    await Promise.resolve()
    await Promise.resolve()

    expect(service.getState().matches('unmountSuspended')).toBe(true)

    // parseMs(0.1s) + parseMs(0s) + 16.667 ≈ 116.667ms
    await vi.advanceTimersByTimeAsync(150)

    expect(service.getState().matches('unmounted')).toBe(true)
    expect(onExitComplete).toHaveBeenCalledTimes(1)
  })
})
