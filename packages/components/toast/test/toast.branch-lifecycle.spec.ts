import { trackDismissableElement } from '@destyler/dismissable'
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
function pointerDown(target: HTMLElement) {
  const rect = target.getBoundingClientRect()
  expect(rect.width).toBeGreaterThan(0)
  expect(rect.height).toBeGreaterThan(0)
  target.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    composed: true,
    pointerType: 'mouse',
    button: 0,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
  }))
}
function fixture() {
  const host = document.createElement('div')
  const layer = document.createElement('div')
  const region = document.createElement('div')
  const emptyTarget = document.createElement('button')
  const outside = document.createElement('button')
  layer.style.cssText = 'position:fixed;left:0;top:0;width:100px;height:100px'
  region.id = 'toast-group:bottom'
  region.style.cssText = 'position:fixed;left:200px;top:0;width:120px'
  emptyTarget.style.cssText = 'display:block;width:100px;height:30px'
  outside.style.cssText = 'position:fixed;left:400px;top:0;width:100px;height:30px'
  region.append(emptyTarget)
  host.append(layer, region, outside)
  document.body.append(host)
  const dismiss = vi.fn()
  const releaseLayer = trackDismissableElement(layer, { onDismiss: dismiss })
  const machine = toast.group.machine({ id: 'native-branch-lifetime', duration: 60_000 })
  machine.start()
  const api = toast.group.connect(machine, machine.send, normalize)
  cleanups.push(() => {
    machine.stop()
    releaseLayer()
    host.remove()
  })
  function create(id: string) {
    const root = document.createElement('div')
    root.id = `toast:${id}`
    root.dataset.scope = 'toast'
    root.dataset.part = 'root'
    const before = document.createElement('div')
    before.dataset.ghost = 'before'
    const after = document.createElement('div')
    after.dataset.ghost = 'after'
    const button = document.createElement('button')
    button.textContent = id
    button.style.cssText = 'display:block;width:100px;height:30px'
    root.append(before, button, after)
    region.append(root)
    api.create({ id, title: id })
    return { root, button }
  }
  return { api, machine, region, emptyTarget, outside, dismiss, create }
}
afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})

describe('toast branch protection in the browser', () => {
  it.each(['remove', 'restart'] as const)('protects first and recreated toast interaction after %s, while real outside still dismisses', async (reset) => {
    const { api, machine, region, emptyTarget, outside, dismiss, create } = fixture()
    await settle()
    pointerDown(emptyTarget)
    expect(dismiss).toHaveBeenCalledTimes(1)
    dismiss.mockClear()

    const first = create('first')
    await settle()
    expect(region.querySelectorAll('[data-part="root"]')).toHaveLength(1)
    expect(document.getElementById('toast:first')).toBe(first.root)
    pointerDown(first.button)
    expect(dismiss).not.toHaveBeenCalled()
    pointerDown(outside)
    expect(dismiss).toHaveBeenCalledTimes(1)
    dismiss.mockClear()

    if (reset === 'remove')
      api.remove()
    else
      machine.stop()
    first.root.remove()
    await settle()
    expect(region.querySelectorAll('[data-part="root"]')).toHaveLength(0)
    pointerDown(emptyTarget)
    expect(dismiss).toHaveBeenCalledTimes(1)
    dismiss.mockClear()
    if (reset === 'restart')
      machine.start()

    const second = create('second')
    await settle()
    expect(region.querySelectorAll('[data-part="root"]')).toHaveLength(1)
    expect(document.getElementById('toast:second')).toBe(second.root)
    expect(second.root).not.toBe(first.root)
    pointerDown(second.button)
    expect(dismiss).not.toHaveBeenCalled()
    pointerDown(outside)
    expect(dismiss).toHaveBeenCalledTimes(1)
  })
})
