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
  const panelId = `panel-boundary-${++id}`
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

function clickEvent(extra: Record<string, unknown> = {}) {
  return { defaultPrevented: false, ...extra }
}

afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  for (const node of nodes.splice(0)) node.remove()
})

const width = window.innerWidth
const height = window.innerHeight
afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height })
  vi.restoreAllMocks()
})

function resize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height })
  window.dispatchEvent(new Event('resize'))
}

describe('floating-panel boundary lifetime', () => {
  it('constrains an ordinary panel on the first window resize', () => {
    const changes: unknown[] = []
    const panel = createPanel({ onPositionChange: details => changes.push(details), onSizeChange: details => changes.push(details) })
    resize(250, 150)
    expect(panel.service.state.context.position).toEqual({ x: 0, y: 0 })
    expect(panel.service.state.context.size).toEqual({ width: 250, height: 150 })
    expect(changes).toEqual([{ size: { width: 250, height: 150 } }, { position: { x: 0, y: 0 } }])
  })

  it('updates a maximized panel on every window resize, without extra stage callbacks', () => {
    const stageChanges = vi.fn()
    const panel = createPanel({ onStageChange: stageChanges })
    panel.api().getMaximizeTriggerProps().onClick(clickEvent())
    stageChanges.mockClear()
    resize(900, 700)
    expect(panel.service.state.context.size).toEqual({ width: 900, height: 700 })
    resize(850, 650)
    expect(panel.service.state.context.size).toEqual({ width: 850, height: 650 })
    expect(stageChanges).not.toHaveBeenCalled()
  })

  it('ignores window resizes when closed and after stop, then observes the first resize after reopening', () => {
    const onSizeChange = vi.fn()
    const panel = createPanel({ onSizeChange })
    panel.api().setOpen(false)
    resize(700, 600)
    expect(onSizeChange).not.toHaveBeenCalled()
    panel.api().setOpen(true)
    resize(200, 150)
    expect(onSizeChange.mock.calls).toEqual([[{ size: { width: 200, height: 150 } }]])
    panel.service.stop()
    onSizeChange.mockClear()
    resize(100, 100)
    expect(onSizeChange).not.toHaveBeenCalled()
  })

  it('skips the initial ResizeObserver delivery and disconnects the owning observer', () => {
    let notify: ResizeObserverCallback = () => {}
    const disconnect = vi.fn()
    const observe = vi.fn()
    vi.spyOn(window, 'ResizeObserver').mockImplementation(class implements ResizeObserver {
      observe = observe
      disconnect = disconnect
      unobserve = vi.fn()
      constructor(cb: ResizeObserverCallback) {
        notify = cb
      }
    })
    const boundary = document.createElement('div')
    document.body.appendChild(boundary)
    // A premature initial delivery would visibly constrain this oversized panel.
    let boundaryRect = { x: 20, y: 25, width: 250, height: 150 }
    boundary.getBoundingClientRect = () => DOMRect.fromRect(boundaryRect)
    const panel = createPanel({ getBoundaryEl: () => boundary })
    expect(observe).toHaveBeenCalledExactlyOnceWith(boundary)
    notify([], {} as ResizeObserver)
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
    expect(panel.service.state.context.size).toEqual({ width: 300, height: 200 })
    boundaryRect = { x: 20, y: 25, width: 200, height: 150 }
    notify([], {} as ResizeObserver)
    expect(panel.service.state.context.position).toEqual({ x: 20, y: 25 })
    expect(panel.service.state.context.size).toEqual({ width: 200, height: 150 })
    panel.service.stop()
    expect(disconnect).toHaveBeenCalledTimes(1)
    boundary.remove()
  })
})
