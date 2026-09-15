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
