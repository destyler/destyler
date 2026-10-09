// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as toast from '../index'

const normalize = { element: (props: any) => props, button: (props: any) => props } as any
const groups: toast.GroupService[] = []
let frames: Map<number, FrameRequestCallback>
let frameId: number
async function flush() {
  for (let i = 0; i < 8; i++)
    await Promise.resolve()
}
async function frame() {
  const pending = [...frames]
  frames.clear()
  pending.forEach(([, callback]) => callback(Date.now()))
  await flush()
}
function group(options: Partial<toast.GroupMachineContext> = {}) {
  const machine = toast.group.machine({ id: `group-${groups.length}`, ...options })
  groups.push(machine)
  const placement = options.placement ?? 'bottom'
  const region = document.createElement('div')
  region.id = `toast-group:${placement}`
  region.tabIndex = -1
  document.body.append(region)
  machine.start()
  const api = toast.group.connect(machine, machine.send, normalize)
  return { machine, api, region }
}
function root(id: string) {
  const node = document.createElement('div')
  node.id = `toast:${id}`
  node.innerHTML = '<div data-ghost="before"></div><div data-ghost="after"></div>'
  document.body.append(node)
  return node
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  vi.setSystemTime(0)
  frameId = 0
  frames = new Map()
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback)
    return frameId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
})
afterEach(async () => {
  groups.splice(0).forEach(machine => machine.stop())
  await flush()
  document.body.replaceChildren()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('toast height observer lifetime', () => {
  it('does not install a height observer after removal before the first frame', async () => {
    const { api } = group()
    root('one')
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    api.create({ id: 'one', duration: 1000 })
    api.remove('one')
    await flush()
    await frame()
    expect(observe).not.toHaveBeenCalled()
  })
  it('disconnects an installed observer exactly once on removal', async () => {
    const { api } = group()
    root('one')
    const disconnect = vi.spyOn(window.MutationObserver.prototype, 'disconnect')
    api.create({ id: 'one', duration: 1000 })
    await flush()
    await frame()
    api.remove('one')
    expect(disconnect).toHaveBeenCalledTimes(1)
  })
  it('cancels only the removed toast frame while a different pending toast still measures', async () => {
    const { api, machine } = group()
    const first = root('one')
    const second = root('two')
    vi.spyOn(first, 'getBoundingClientRect').mockReturnValue({ height: 111 } as DOMRect)
    vi.spyOn(second, 'getBoundingClientRect').mockReturnValue({ height: 222 } as DOMRect)
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    const disconnect = vi.spyOn(window.MutationObserver.prototype, 'disconnect')
    api.create({ id: 'one', duration: 1000 })
    api.create({ id: 'two', duration: 1000 })
    api.remove('one')
    await flush()
    await frame()
    expect(observe).toHaveBeenCalledTimes(1)
    expect(observe.mock.calls[0][0]).toBe(second)
    expect(machine.state.context.heights.map(item => ({ id: item.id, height: item.height }))).toEqual([{ id: 'two', height: 222 }])
    expect(disconnect).not.toHaveBeenCalled()
    api.remove('two')
    expect(disconnect).toHaveBeenCalledTimes(1)
  })
  it('does not transfer a removed actor frame to a replacement with the same id', async () => {
    const { api, machine } = group()
    root('one')
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    api.create({ id: 'one' })
    const previous = machine.state.context.toasts[0]
    api.remove('one')
    api.create({ id: 'one' })
    const next = machine.state.context.toasts[0]
    expect(next).not.toBe(previous)
    await flush()
    await frame()
    expect(observe).toHaveBeenCalledTimes(1)
    expect(previous.state.context.mounted).toBe(false)
    expect(next.state.context.mounted).toBe(true)
  })
  it('cancels pending observer work when the owning group stops', async () => {
    const { api, machine } = group()
    root('one')
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    api.create({ id: 'one' })
    await flush()
    machine.stop()
    await frame()
    expect(observe).not.toHaveBeenCalled()
    expect(machine.state.context.toasts).toEqual([])
  })
})
