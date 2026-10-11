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

describe('toast timing origin', () => {
  it('creates once, updates the same actor, dismisses once, and removes after exactly removeDelay', async () => {
    const { machine, api } = group({ removeDelay: 200 })
    const statuses: string[] = []
    expect(api.create({ id: 'one', title: 'First', duration: 1000, onStatusChange: e => statuses.push(e.status) })).toBe('one')
    const actor = machine.state.context.toasts[0]
    expect(api.create({ id: 'one', title: 'Duplicate' })).toBe('one')
    expect(api.getCount()).toBe(1)
    api.update('one', { title: 'Updated' })
    expect(machine.state.context.toasts[0]).toBe(actor)
    expect(actor.state.context.title).toBe('Updated')
    api.dismiss('one')
    api.dismiss('one')
    expect(statuses).toEqual(['visible', 'dismissing'])
    expect(api.getCount()).toBe(1)
    await vi.advanceTimersByTimeAsync(199)
    expect(api.getCount()).toBe(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(api.getCount()).toBe(0)
    expect(statuses).toEqual(['visible', 'dismissing', 'unmounted'])
  })
  it('pauses and resumes only the remaining visible duration across repeated cycles', async () => {
    const { api, machine } = group()
    api.create({ id: 'one', duration: 1000 })
    const actor = machine.state.context.toasts[0]
    await vi.advanceTimersByTimeAsync(200)
    api.pause('one')
    api.pause('one')
    expect(actor.state.context.remaining).toBe(800)
    await vi.advanceTimersByTimeAsync(500)
    api.resume('one')
    await vi.advanceTimersByTimeAsync(300)
    api.pause('one')
    expect(actor.state.context.remaining).toBe(500)
    await vi.advanceTimersByTimeAsync(500)
    api.resume('one')
    await vi.advanceTimersByTimeAsync(499)
    expect(actor.state.hasTag('visible')).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    expect(actor.state.value).toBe('dismissing')
  })
  it('starts the replacement duration clock when a timed toast is updated', async () => {
    const { api, machine } = group()
    api.create({ id: 'one', duration: 1000 })
    await vi.advanceTimersByTimeAsync(400)
    api.update('one', { duration: 2000 })
    await vi.advanceTimersByTimeAsync(0)
    await vi.advanceTimersByTimeAsync(300)
    api.pause('one')
    const actor = machine.state.context.toasts[0]
    expect(actor.state.context.remaining).toBe(1700)
    await vi.advanceTimersByTimeAsync(5000)
    expect(actor.state.value).toBe('visible:persist')
    api.resume()
    await vi.advanceTimersByTimeAsync(1699)
    expect(actor.state.value).toBe('visible')
    await vi.advanceTimersByTimeAsync(1)
    expect(actor.state.value).toBe('dismissing')
  })
  it('starts the success duration clock when a long-running promise resolves', async () => {
    const { api, machine } = group()
    let resolve!: (value: string) => void
    api.promise(new Promise<string>(r => resolve = r), { loading: { title: 'Waiting' }, success: { title: 'Done', duration: 2000 }, error: {} })
    await vi.advanceTimersByTimeAsync(5000)
    resolve('done')
    await flush()
    await vi.advanceTimersByTimeAsync(0)
    await vi.advanceTimersByTimeAsync(300)
    api.pause()
    const actor = machine.state.context.toasts[0]
    expect(actor.state.context.remaining).toBe(1700)
    await vi.advanceTimersByTimeAsync(5000)
    expect(actor.state.value).toBe('visible:persist')
    api.resume()
    await vi.advanceTimersByTimeAsync(1699)
    expect(actor.state.value).toBe('visible')
    await vi.advanceTimersByTimeAsync(1)
    expect(actor.state.value).toBe('dismissing')
  })
  it('removes immediately without dismiss callbacks and leaves the other actor live', async () => {
    const { api, machine } = group()
    const status = vi.fn()
    api.create({ id: 'one', duration: 1000, onStatusChange: status })
    api.create({ id: 'two', duration: 2000 })
    const survivor = machine.state.context.toasts[0]
    api.remove('one')
    expect(api.getCount()).toBe(1)
    expect(machine.state.context.toasts[0]).toBe(survivor)
    expect(status.mock.calls).toEqual([[{ status: 'visible' }]])
    await vi.advanceTimersByTimeAsync(1000)
    expect(survivor.state.value).toBe('visible')
  })
  it('keeps a loading toast persistent through pause and resume', async () => {
    const { api, machine } = group()
    api.loading({ id: 'one', duration: 5 })
    api.pause('one')
    api.resume('one')
    await vi.advanceTimersByTimeAsync(10000)
    expect(machine.state.context.toasts[0].state.value).toBe('visible:persist')
  })
  it('an immediate pause/resume after update preserves the unpaused updated timeout', async () => {
    const { api, machine } = group()
    const statuses: string[] = []
    api.create({ id: 'continuous', duration: 1000, onStatusChange: e => statuses.push(`continuous:${e.status}`) })
    api.create({ id: 'paused', duration: 1000, onStatusChange: e => statuses.push(`paused:${e.status}`) })
    await vi.advanceTimersByTimeAsync(400)
    api.update('continuous', { duration: 2000 })
    api.update('paused', { duration: 2000 })
    await vi.advanceTimersByTimeAsync(0)
    api.pause('paused')
    api.resume('paused')
    const actors = machine.state.context.toasts
    expect(actors[0].state.context.remaining).toBe(actors[1].state.context.remaining)
    await vi.advanceTimersByTimeAsync(1999)
    expect(actors.map(actor => actor.state.value)).toEqual(['visible', 'visible'])
    expect(statuses).toEqual(['continuous:visible', 'paused:visible'])
    await vi.advanceTimersByTimeAsync(1)
    expect(actors.map(actor => actor.state.value)).toEqual(['dismissing', 'dismissing'])
    expect(statuses).toEqual(['continuous:visible', 'paused:visible', 'continuous:dismissing', 'paused:dismissing'])
  })
  it('retains explicit zero duration for immediate dismissal and the configured removal delay', async () => {
    const { api, machine } = group({ removeDelay: 25 })
    const statuses: string[] = []
    api.create({ id: 'zero', duration: 0, onStatusChange: e => statuses.push(e.status) })
    expect(machine.state.context.toasts[0].state.context.duration).toBe(0)
    await vi.advanceTimersByTimeAsync(0)
    expect(statuses).toEqual(['visible', 'dismissing'])
    expect(api.getCount()).toBe(1)
    await vi.advanceTimersByTimeAsync(24)
    expect(api.getCount()).toBe(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(api.getCount()).toBe(0)
    expect(statuses).toEqual(['visible', 'dismissing', 'unmounted'])
  })
  it('keeps default loading infinity persistent until an explicit zero-duration terminal update', async () => {
    const { api, machine } = group()
    api.loading({ id: 'loading' })
    const actor = machine.state.context.toasts[0]
    expect(actor.state.context.duration).toBe(Infinity)
    await vi.advanceTimersByTimeAsync(100_000)
    expect(actor.state.value).toBe('visible:persist')
    api.update('loading', { type: 'success', duration: 0 })
    await vi.advanceTimersByTimeAsync(1)
    expect(actor.state.value).toBe('dismissing')
    expect(actor.state.context.duration).toBe(0)
  })
})
