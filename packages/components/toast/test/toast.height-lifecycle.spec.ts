import { afterEach, describe, expect, it, vi } from 'vitest'
import * as toast from '../index'

const normalize = { element: (props: any) => props, button: (props: any) => props } as any
const cleanups: VoidFunction[] = []
const nextFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
async function settle() {
  await Promise.resolve()
  await nextFrame()
  await nextFrame()
}
function fixture() {
  const region = document.createElement('div')
  region.id = 'toast-group:bottom'
  document.body.append(region)
  const machine = toast.group.machine({ id: 'native-height-lifetime', duration: 60_000 })
  machine.start()
  const api = toast.group.connect(machine, machine.send, normalize)
  cleanups.push(() => {
    machine.stop()
    region.remove()
  })
  function root(id: string, height: number) {
    const node = document.createElement('div')
    node.id = `toast:${id}`
    node.dataset.scope = 'toast'
    node.dataset.part = 'root'
    node.style.cssText = 'display:block;width:120px;height:auto;border:0;padding:0;margin:0'
    const before = document.createElement('div')
    before.dataset.ghost = 'before'
    const after = document.createElement('div')
    after.dataset.ghost = 'after'
    before.style.display = after.style.display = 'none'
    const content = document.createElement('div')
    content.style.cssText = `height:${height}px;margin:0;padding:0;border:0`
    content.textContent = id
    node.append(before, content, after)
    region.append(node)
    return { node, content }
  }
  return { api, machine, region, root }
}
afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})

describe('toast height observation in the browser', () => {
  it('cancels a removed toast before real rAF while a surviving root is measured and remains observed', async () => {
    const { api, machine, region, root } = fixture()
    const removed = root('removed', 31)
    const live = root('live', 48)
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    const disconnect = vi.spyOn(window.MutationObserver.prototype, 'disconnect')
    api.create({ id: 'removed' })
    const removedActor = machine.state.context.toasts[0]
    api.create({ id: 'live' })
    const liveActor = machine.state.context.toasts[0]
    api.remove('removed')
    await settle()

    expect(region.querySelectorAll('[data-part="root"]')).toHaveLength(2)
    expect(document.getElementById('toast:removed')).toBe(removed.node)
    expect(document.getElementById('toast:live')).toBe(live.node)
    expect(observe.mock.calls.filter(([target]) => target === removed.node)).toHaveLength(0)
    const liveObservations = observe.mock.calls.flatMap(([target], index) => target === live.node ? [index] : [])
    expect(liveObservations).toHaveLength(1)
    const observer = observe.mock.contexts[liveObservations[0]]
    expect(removedActor.state.context.mounted).toBe(false)
    expect(liveActor.state.context.height).toBeCloseTo(live.node.getBoundingClientRect().height, 5)
    expect(liveActor.state.context.height).toBe(48)
    expect(machine.state.context.heights.map(item => item.id)).toEqual(['live'])

    live.content.style.height = '72px'
    live.content.textContent = 'updated content'
    await vi.waitFor(() => expect(liveActor.state.context.height).toBe(72))
    expect(document.getElementById('toast:live')).toBe(live.node)
    expect(disconnect.mock.contexts.filter(context => context === observer)).toHaveLength(0)
    api.remove('live')
    expect(disconnect.mock.contexts.filter(context => context === observer)).toHaveLength(1)
    live.content.style.height = '96px'
    live.content.textContent = 'after removal'
    await settle()
    expect(liveActor.state.context.height).toBe(72)
    expect(machine.state.context.heights).toEqual([])
  })

  it('observes a reused DOM root only for the replacement actor and releases its real observer', async () => {
    const { api, machine, region, root } = fixture()
    const reused = root('reused', 52)
    const observe = vi.spyOn(window.MutationObserver.prototype, 'observe')
    const disconnect = vi.spyOn(window.MutationObserver.prototype, 'disconnect')
    api.create({ id: 'reused' })
    const original = machine.state.context.toasts[0]
    api.remove('reused')
    api.create({ id: 'reused' })
    const replacement = machine.state.context.toasts[0]
    expect(replacement).not.toBe(original)
    await settle()

    expect(region.querySelectorAll('[data-part="root"]')).toHaveLength(1)
    expect(document.getElementById('toast:reused')).toBe(reused.node)
    const observations = observe.mock.calls.flatMap(([target], index) => target === reused.node ? [index] : [])
    expect(observations).toHaveLength(1)
    const observer = observe.mock.contexts[observations[0]]
    expect(original.state.context.mounted).toBe(false)
    expect(original.state.context.height).toBe(0)
    expect(replacement.state.context.height).toBe(52)
    expect(replacement.state.context.height).toBeCloseTo(reused.node.getBoundingClientRect().height, 5)

    reused.content.style.height = '92px'
    reused.content.textContent = 'replacement content'
    await vi.waitFor(() => expect(replacement.state.context.height).toBe(92))
    expect(original.state.context.height).toBe(0)
    const measure = vi.spyOn(reused.node, 'getBoundingClientRect')
    api.remove('reused')
    expect(disconnect.mock.contexts.filter(context => context === observer)).toHaveLength(1)
    reused.content.style.height = '120px'
    reused.content.textContent = 'unobserved content'
    await settle()
    expect(measure).not.toHaveBeenCalled()
    expect(replacement.state.context.height).toBe(92)
    expect(machine.state.context.heights).toEqual([])
    expect(machine.state.context.toasts).toEqual([])
  })
})
