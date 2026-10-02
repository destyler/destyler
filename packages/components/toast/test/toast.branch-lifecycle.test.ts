// @vitest-environment happy-dom
import { trackDismissableBranch, trackDismissableElement } from '@destyler/dismissable'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as toast from '../index'

const normalize = { element: (props: any) => props, button: (props: any) => props } as any
const groups: toast.GroupService[] = []
const cleanups: VoidFunction[] = []
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
function pointerDown(target: HTMLElement) {
  target.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    composed: true,
    pointerType: 'mouse',
    button: 0,
  }))
}
async function fixture() {
  const layer = document.createElement('div')
  const region = document.createElement('div')
  const interaction = document.createElement('button')
  const outside = document.createElement('button')
  region.id = 'toast-group:bottom'
  region.append(interaction)
  document.body.append(layer, region, outside)
  const dismiss = vi.fn()
  cleanups.push(trackDismissableElement(layer, { onDismiss: dismiss }))
  await vi.advanceTimersByTimeAsync(0)
  const machine = toast.group.machine({ id: 'branch-lifecycle', duration: 60_000 })
  groups.push(machine)
  machine.start()
  const api = toast.group.connect(machine, machine.send, normalize)
  return { api, machine, region, interaction, outside, dismiss }
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
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  await flush()
  document.body.replaceChildren()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('toast dismissable branch lifetime', () => {
  it('protects toast interaction again after the previous last toast was removed', async () => {
    const { api, interaction, outside, dismiss } = await fixture()
    pointerDown(interaction)
    expect(dismiss).toHaveBeenCalledTimes(1)
    dismiss.mockClear()
    for (const id of ['first', 'second']) {
      api.create({ id })
      await flush()
      await frame()
      pointerDown(interaction)
      expect(dismiss).not.toHaveBeenCalled()
      pointerDown(outside)
      expect(dismiss).toHaveBeenCalledTimes(1)
      dismiss.mockClear()
      api.remove()
      await flush()
      pointerDown(interaction)
      expect(dismiss).toHaveBeenCalledTimes(1)
      dismiss.mockClear()
    }
  })
  it('retains an independently owned branch through repeated empty cycles and group disposal', async () => {
    const { api, machine, interaction, outside, dismiss } = await fixture()
    const foreign = document.createElement('button')
    document.body.append(foreign)
    const releaseForeign = trackDismissableBranch(foreign)
    cleanups.push(releaseForeign)
    for (let cycle = 0; cycle < 3; cycle++) {
      api.create({ id: `cycle-${cycle}` })
      await flush()
      await frame()
      pointerDown(interaction)
      pointerDown(foreign)
      expect(dismiss).not.toHaveBeenCalled()
      api.remove()
      await flush()
      pointerDown(foreign)
      expect(dismiss).not.toHaveBeenCalled()
      pointerDown(outside)
      expect(dismiss).toHaveBeenCalledTimes(1)
      dismiss.mockClear()
    }
    machine.stop()
    pointerDown(foreign)
    expect(dismiss).not.toHaveBeenCalled()
    cleanups.splice(cleanups.indexOf(releaseForeign), 1)
    releaseForeign()
    pointerDown(foreign)
    expect(dismiss).toHaveBeenCalledTimes(1)
  })
  it('protects toast interaction when a stopped group is started again', async () => {
    const { api, machine, interaction, outside, dismiss } = await fixture()
    api.create({ id: 'before-stop' })
    await flush()
    await frame()
    pointerDown(interaction)
    expect(dismiss).not.toHaveBeenCalled()
    machine.stop()
    pointerDown(interaction)
    expect(dismiss).toHaveBeenCalledTimes(1)
    dismiss.mockClear()
    machine.start()
    api.create({ id: 'after-restart' })
    await flush()
    await frame()
    pointerDown(interaction)
    expect(dismiss).not.toHaveBeenCalled()
    pointerDown(outside)
    expect(dismiss).toHaveBeenCalledTimes(1)
  })
})
