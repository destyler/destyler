// @vitest-environment happy-dom
import type { Context } from '../index'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const services: Array<ReturnType<typeof machine>> = []
const frames: HTMLIFrameElement[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
let id = 0

function createPanel(context: Partial<Context> = {}) {
  const service = machine({ id: `boundary-owner-${++id}`, defaultOpen: true, position: { x: 100, y: 80 }, size: { width: 300, height: 200 }, ...context })
  services.push(service)
  service.start()
  return { service, api: () => connect(service.state, service.send, normalize) }
}

function owner() {
  const frame = document.createElement('iframe')
  document.body.appendChild(frame)
  frames.push(frame)
  return frame.contentWindow! as Window & typeof globalThis
}

function resize(win: Window, width: number, height: number) {
  Object.defineProperty(win, 'innerWidth', { configurable: true, value: width })
  Object.defineProperty(win, 'innerHeight', { configurable: true, value: height })
  win.dispatchEvent(new Event('resize'))
}

const capture = (options?: boolean | EventListenerOptions) => typeof options === 'boolean' ? options : !!options?.capture

afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  for (const frame of frames.splice(0)) frame.remove()
  vi.restoreAllMocks()
})

describe('floating-panel boundary owner controls', () => {
  it('routes the first viewport resize independently to each owner window', () => {
    const firstWindow = owner()
    const secondWindow = owner()
    const first = createPanel({ getRootNode: () => firstWindow.document })
    const second = createPanel({ getRootNode: () => secondWindow.document })
    window.dispatchEvent(new Event('resize'))
    expect(first.service.state.context.size).toEqual({ width: 300, height: 200 })
    expect(second.service.state.context.size).toEqual({ width: 300, height: 200 })
    resize(firstWindow, 210, 140)
    expect(first.service.state.context.size).toEqual({ width: 210, height: 140 })
    expect(first.service.state.context.position).toEqual({ x: 0, y: 0 })
    expect(second.service.state.context.size).toEqual({ width: 300, height: 200 })
    resize(secondWindow, 230, 160)
    expect(second.service.state.context.size).toEqual({ width: 230, height: 160 })
    expect(first.service.state.context.size).toEqual({ width: 210, height: 140 })
  })

  it('removes the exact owner listener on close and stop and reacquires it on restart', () => {
    const win = owner()
    const add = vi.spyOn(win, 'addEventListener')
    const remove = vi.spyOn(win, 'removeEventListener')
    const panel = createPanel({ getRootNode: () => win.document })
    const adds = () => add.mock.calls.filter(([type]) => type === 'resize')
    const removals = () => remove.mock.calls.filter(([type]) => type === 'resize')
    const assertRemoved = (index: number) => {
      expect(removals()[index]?.[1]).toBe(adds()[index]?.[1])
      expect(capture(removals()[index]?.[2])).toBe(capture(adds()[index]?.[2]))
    }
    expect(adds()).toHaveLength(1)
    panel.api().setOpen(false)
    expect(removals()).toHaveLength(1)
    assertRemoved(0)
    panel.api().setOpen(true)
    expect(adds()).toHaveLength(2)
    expect(adds()[1][1]).not.toBe(adds()[0][1])
    resize(win, 220, 150)
    expect(panel.service.state.context.size).toEqual({ width: 220, height: 150 })
    panel.service.stop()
    expect(removals()).toHaveLength(2)
    assertRemoved(1)
    panel.service.start()
    expect(adds()).toHaveLength(3)
    resize(win, 180, 120)
    expect(panel.service.state.context.size).toEqual({ width: 180, height: 120 })
    panel.service.stop()
    expect(removals()).toHaveLength(3)
    assertRemoved(2)
  })

  it('reacquires an owner ResizeObserver and skips only each new initial delivery', () => {
    const win = owner()
    const observers: Array<{ notify: ResizeObserverCallback, observe: ReturnType<typeof vi.fn>, disconnect: ReturnType<typeof vi.fn> }> = []
    vi.spyOn(win, 'ResizeObserver').mockImplementation(class implements ResizeObserver {
      observe = vi.fn()
      disconnect = vi.fn()
      unobserve = vi.fn()
      constructor(notify: ResizeObserverCallback) {
        observers.push({ notify, observe: this.observe, disconnect: this.disconnect })
      }
    })
    const boundary = win.document.createElement('div')
    win.document.body.appendChild(boundary)
    let rect = { x: 10, y: 20, width: 240, height: 150 }
    boundary.getBoundingClientRect = () => DOMRect.fromRect(rect)
    const panel = createPanel({ getRootNode: () => win.document, getBoundaryEl: () => boundary })
    const notify = (index: number) => observers[index].notify([], {} as ResizeObserver)
    expect(observers).toHaveLength(1)
    expect(observers[0].observe).toHaveBeenCalledExactlyOnceWith(boundary)
    notify(0)
    expect(panel.service.state.context.size).toEqual({ width: 300, height: 200 })
    notify(0)
    expect(panel.service.state.context.size).toEqual({ width: 240, height: 150 })
    panel.api().setOpen(false)
    expect(observers[0].disconnect).toHaveBeenCalledTimes(1)
    panel.api().setOpen(true)
    expect(observers).toHaveLength(2)
    expect(observers[1].observe).toHaveBeenCalledExactlyOnceWith(boundary)
    notify(1)
    expect(panel.service.state.context.size).toEqual({ width: 300, height: 200 })
    rect = { x: 10, y: 20, width: 190, height: 120 }
    notify(1)
    expect(panel.service.state.context.size).toEqual({ width: 190, height: 120 })
    panel.service.stop()
    expect(observers[1].disconnect).toHaveBeenCalledTimes(1)
    rect = { x: 10, y: 20, width: 170, height: 100 }
    panel.service.start()
    expect(observers).toHaveLength(3)
    expect(observers[2].observe).toHaveBeenCalledExactlyOnceWith(boundary)
    notify(2)
    expect(panel.service.state.context.size).toEqual({ width: 190, height: 120 })
    notify(2)
    expect(panel.service.state.context.size).toEqual({ width: 170, height: 100 })
    panel.service.stop()
    expect(observers.map(observer => observer.disconnect.mock.calls.length)).toEqual([1, 1, 1])
  })
})
