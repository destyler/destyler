// @vitest-environment happy-dom
import type { UserDefinedContext } from '../src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

let id = 0
const services: Array<ReturnType<typeof machine>> = []
const nodes: HTMLElement[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any

function createPanel(context: Partial<UserDefinedContext> = {}) {
  const panelId = `panel-anchor-${++id}`
  const positioner = document.createElement('div')
  positioner.id = `float-panel:${panelId}:positioner`
  const content = document.createElement('div')
  content.id = `float-panel:${panelId}:content`
  const header = document.createElement('div')
  header.id = `float-panel:${panelId}:header`
  Object.defineProperty(header, 'offsetHeight', { configurable: true, value: 30 })
  content.appendChild(header)
  positioner.appendChild(content)
  document.body.appendChild(positioner)
  nodes.push(positioner)
  const service = machine({ id: panelId, defaultOpen: true, position: { x: 100, y: 80 }, size: { width: 300, height: 200 }, ...context })
  services.push(service)
  service.start()
  return { service, positioner, content, header, api: () => connect(service.state, service.send, normalize) }
}

async function flush() {
  await Promise.resolve()
  await Promise.resolve()
}

afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  for (const node of nodes.splice(0)) node.remove()
})

function scheduleFrames() {
  const frames = new Map<number, FrameRequestCallback>()
  let id = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++id, callback)
    return id
  })
  const cancel = vi.fn()
  // Deliberately retain cancelled callbacks to probe delivery races as well as cancellation.
  vi.stubGlobal('cancelAnimationFrame', cancel)
  return { frames, cancel }
}

afterEach(() => vi.unstubAllGlobals())

describe('floating-panel anchor frame ownership', () => {
  it.each(['close', 'stop'] as const)('cancels pending anchor work on %s and ignores late delivery', (end) => {
    const { frames, cancel } = scheduleFrames()
    const getAnchorPosition = vi.fn(() => ({ x: 456, y: 234 }))
    const panel = createPanel({ defaultOpen: false, getAnchorPosition })
    panel.api().setOpen(true)
    if (end === 'close')
      panel.api().setOpen(false)
    else panel.service.stop()
    expect(cancel).toHaveBeenCalledExactlyOnceWith(1)
    frames.get(1)!(0)
    expect(getAnchorPosition).not.toHaveBeenCalled()
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
  })

  it('allows exactly the latest open generation after close and reopen', () => {
    const { frames, cancel } = scheduleFrames()
    const getAnchorPosition = vi.fn(() => ({ x: 456, y: 234 }))
    const panel = createPanel({ defaultOpen: false, getAnchorPosition })
    panel.api().setOpen(true)
    panel.api().setOpen(false)
    panel.api().setOpen(true)
    expect(cancel).toHaveBeenCalledExactlyOnceWith(1)
    frames.get(1)!(0)
    expect(getAnchorPosition).not.toHaveBeenCalled()
    frames.get(2)!(0)
    expect(getAnchorPosition).toHaveBeenCalledTimes(1)
    expect(panel.service.state.context.position).toEqual({ x: 456, y: 234 })
    expect(panel.api().open).toBe(true)
  })

  it('allows a fresh generation after stop/restart without reviving the first frame', () => {
    const { frames } = scheduleFrames()
    const getAnchorPosition = vi.fn(() => ({ x: 456, y: 234 }))
    const panel = createPanel({ defaultOpen: false, getAnchorPosition })
    panel.api().setOpen(true)
    panel.service.stop()
    panel.service.start()
    panel.api().setOpen(true)
    frames.get(1)!(0)
    expect(getAnchorPosition).not.toHaveBeenCalled()
    frames.get(2)!(0)
    expect(getAnchorPosition).toHaveBeenCalledTimes(1)
    expect(panel.service.state.context.position).toEqual({ x: 456, y: 234 })
  })

  it.each(['close', 'stop'] as const)('does not commit the anchor returned by a callback that synchronously calls %s', (end) => {
    const { frames } = scheduleFrames()
    const panel = createPanel({ defaultOpen: false })
    panel.service.setContext({ getAnchorPosition: () => {
      if (end === 'close')
        panel.api().setOpen(false)
      else panel.service.stop()
      return { x: 456, y: 234 }
    } })
    panel.api().setOpen(true)
    frames.get(1)!(0)
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
  })

  it('keeps the pending frame after a controlled close veto, and cancels only on acceptance', async () => {
    const { frames, cancel } = scheduleFrames()
    const getAnchorPosition = vi.fn(() => ({ x: 456, y: 234 }))
    const panel = createPanel({ defaultOpen: false, open: false, getAnchorPosition })
    panel.service.setContext({ open: true })
    await flush()
    panel.api().setOpen(false)
    expect(cancel).not.toHaveBeenCalled()
    expect(panel.api().open).toBe(true)
    panel.service.setContext({ open: false })
    await flush()
    expect(cancel).toHaveBeenCalledExactlyOnceWith(1)
    frames.get(1)!(0)
    expect(getAnchorPosition).not.toHaveBeenCalled()
  })
})
