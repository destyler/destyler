import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackFormControl } from '../index'

const cleanups: VoidFunction[] = []
const nextTask = () => new Promise<void>(resolve => window.setTimeout(resolve, 0))

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})

function fixture() {
  const container = document.createElement('div')
  const form = document.createElement('form')
  const input = document.createElement('input')
  input.defaultValue = 'initial'
  form.append(input)
  container.append(form)
  document.body.append(container)
  cleanups.push(() => container.remove())
  const track = (onFormReset = vi.fn()) => {
    const stop = trackFormControl(input, { onFormReset, onFieldsetDisabledChange: vi.fn() })!
    cleanups.push(stop)
    return { onFormReset, stop }
  }
  return { container, form, input, track }
}

describe('trackFormControl reset tasks with real timers', () => {
  it('notifies after every synthetic reset listener and microtask', async () => {
    const { form, input, track } = fixture()
    input.value = 'edited'
    const order: string[] = []
    const { onFormReset } = track(vi.fn(() => order.push('notification')))
    form.addEventListener('reset', () => {
      order.push('listener')
      queueMicrotask(() => order.push('microtask'))
    })

    form.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }))
    expect(onFormReset).not.toHaveBeenCalled()
    expect(order).toEqual(['listener'])
    expect(input.value).toBe('edited')
    await Promise.resolve()
    expect(onFormReset).not.toHaveBeenCalled()
    expect(order).toEqual(['listener', 'microtask'])
    await nextTask()
    expect(order).toEqual(['listener', 'microtask', 'notification'])
    expect(onFormReset).toHaveBeenCalledTimes(1)
    expect(input.value).toBe('edited')
  })

  it.each(['earlier form', 'later form', 'ancestor capture', 'ancestor bubble'] as const)(
    'suppresses the callback when an %s listener cancels reset',
    async (location) => {
      const { container, form, track } = fixture()
      const cancel = (event: Event) => event.preventDefault()
      if (location === 'earlier form')
        form.addEventListener('reset', cancel)
      if (location === 'ancestor capture')
        container.addEventListener('reset', cancel, true)
      const { onFormReset } = track()
      if (location === 'later form')
        form.addEventListener('reset', cancel)
      if (location === 'ancestor bubble')
        container.addEventListener('reset', cancel)

      // Only the listener contract is shared with Happy DOM. Native canceled
      // reset default actions are covered by the independent browser suite.
      const event = new Event('reset', { bubbles: true, cancelable: true })
      form.dispatchEvent(event)
      await nextTask()
      expect(onFormReset).not.toHaveBeenCalled()
      expect(event.defaultPrevented).toBe(true)
    },
  )

  it('keeps separate reset tasks with a microtask checkpoint between callbacks', async () => {
    const { form, track } = fixture()
    const order: string[] = []
    let count = 0
    const { onFormReset } = track(vi.fn(() => {
      const index = ++count
      order.push(`notification:${index}`)
      queueMicrotask(() => order.push(`microtask:${index}`))
    }))

    form.reset()
    form.reset()
    expect(onFormReset).not.toHaveBeenCalled()
    await nextTask()
    expect(order).toEqual(['notification:1', 'microtask:1', 'notification:2', 'microtask:2'])
    expect(onFormReset).toHaveBeenCalledTimes(2)
  })

  it('keeps each event cancellation independent across repeated resets', async () => {
    const { form, track } = fixture()
    const { onFormReset } = track()
    let count = 0
    form.addEventListener('reset', (event) => {
      if (++count === 2)
        event.preventDefault()
    })

    form.reset()
    form.reset()
    form.reset()
    await nextTask()
    expect(onFormReset).toHaveBeenCalledTimes(2)
  })

  it('queues a reset requested by a callback in a later task', async () => {
    const { form, track } = fixture()
    const order: string[] = []
    const { onFormReset } = track(vi.fn(() => {
      order.push('notification')
      if (order.length === 1) {
        form.reset()
        order.push('reentrant reset returned')
      }
    }))

    form.reset()
    await nextTask()
    expect(order).toEqual(['notification', 'reentrant reset returned'])
    expect(onFormReset).toHaveBeenCalledTimes(1)
    await nextTask()
    expect(order).toEqual(['notification', 'reentrant reset returned', 'notification'])
    expect(onFormReset).toHaveBeenCalledTimes(2)
  })

  it('cleanup discards pending resets and removes the reset listener', async () => {
    const { form, track } = fixture()
    const { onFormReset, stop } = track()
    form.reset()
    form.reset()
    stop()
    stop()
    form.reset()
    await nextTask()
    expect(onFormReset).not.toHaveBeenCalled()
  })

  it('a fresh tracker does not inherit callbacks from a stopped tracker', async () => {
    const { form, track } = fixture()
    const previous = track()
    form.reset()
    previous.stop()
    const current = track()
    form.reset()
    await nextTask()
    expect(previous.onFormReset).not.toHaveBeenCalled()
    expect(current.onFormReset).toHaveBeenCalledTimes(1)
  })

  it('stopping one tracker leaves another tracker on the same form active', async () => {
    const { form, track } = fixture()
    const first = track()
    const second = track()
    form.reset()
    first.stop()
    await nextTask()
    expect(first.onFormReset).not.toHaveBeenCalled()
    expect(second.onFormReset).toHaveBeenCalledTimes(1)
  })

  it('cleanup inside a callback cancels the remaining pending resets', async () => {
    const { form, track } = fixture()
    let stop: VoidFunction
    const onFormReset = vi.fn(() => stop())
    stop = track(onFormReset).stop
    form.reset()
    form.reset()
    await nextTask()
    expect(onFormReset).toHaveBeenCalledTimes(1)
  })

  it('callback cleanup and restart only notify for resets belonging to the new tracker', async () => {
    const { form, track } = fixture()
    let stop: VoidFunction
    const current = vi.fn()
    const previous = vi.fn(() => {
      stop()
      track(current)
      form.reset()
    })
    stop = track(previous).stop
    form.reset()
    form.reset()
    await nextTask()
    expect(previous).toHaveBeenCalledTimes(1)
    expect(current).not.toHaveBeenCalled()
    await nextTask()
    expect(previous).toHaveBeenCalledTimes(1)
    expect(current).toHaveBeenCalledTimes(1)
  })

  it('uses the tracked element document timers, including cleanup', async () => {
    const iframe = document.createElement('iframe')
    document.body.append(iframe)
    cleanups.push(() => iframe.remove())
    const win = iframe.contentWindow!
    const form = win.document.createElement('form')
    const input = win.document.createElement('input')
    form.append(input)
    win.document.body.append(form)
    const scheduled = vi.spyOn(win, 'setTimeout')
    const canceled = vi.spyOn(win, 'clearTimeout')
    const onFormReset = vi.fn()
    const stop = trackFormControl(input, { onFormReset, onFieldsetDisabledChange: vi.fn() })!
    cleanups.push(stop)

    form.reset()
    expect(scheduled).toHaveBeenCalledTimes(1)
    await nextTask()
    expect(onFormReset).toHaveBeenCalledTimes(1)
    form.reset()
    const timer = scheduled.mock.results[1].value
    stop()
    expect(canceled).toHaveBeenCalledWith(timer)
    await nextTask()
    expect(onFormReset).toHaveBeenCalledTimes(1)
  })
})

// These timer stubs model canceled/dequeued work deterministically. The tests
// above, and the native reset-button regressions, establish actual task order.
describe('trackFormControl deterministic timer lifetime', () => {
  function timers() {
    let nextId = 0
    const pending = new Map<number, VoidFunction>()
    const scheduled = vi.spyOn(window, 'setTimeout').mockImplementation(((callback: VoidFunction) => {
      pending.set(++nextId, callback)
      return nextId
    }) as typeof window.setTimeout)
    const canceled = vi.spyOn(window, 'clearTimeout').mockImplementation((id) => {
      if (id !== undefined)
        pending.delete(id)
    })
    return { pending, scheduled, canceled }
  }

  it('does not schedule an already canceled reset', () => {
    const { form, track } = fixture()
    form.addEventListener('reset', event => event.preventDefault())
    const { onFormReset } = track()
    const { scheduled } = timers()
    form.reset()
    expect(scheduled).not.toHaveBeenCalled()
    expect(onFormReset).not.toHaveBeenCalled()
  })

  it('cleanup cancels every outstanding timer exactly once', () => {
    const { form, track } = fixture()
    const { onFormReset, stop } = track()
    const { pending, scheduled, canceled } = timers()
    form.reset()
    form.reset()
    expect(scheduled).toHaveBeenCalledTimes(2)
    expect(pending.size).toBe(2)
    stop()
    stop()
    expect(pending.size).toBe(0)
    expect(canceled.mock.calls).toEqual([[1], [2]])
    expect(onFormReset).not.toHaveBeenCalled()
  })

  it('rejects a timer already dequeued when cleanup occurs', () => {
    const { form, track } = fixture()
    const { onFormReset, stop } = track()
    const { pending } = timers()
    form.reset()
    const callback = pending.get(1)!
    expect(callback).toBeTypeOf('function')
    pending.delete(1)
    stop()
    callback()
    expect(onFormReset).not.toHaveBeenCalled()
  })

  it('callback cleanup cancels other work without canceling the running timer', () => {
    const { form, track } = fixture()
    let stop: VoidFunction
    const onFormReset = vi.fn(() => stop())
    stop = track(onFormReset).stop
    const { pending, canceled } = timers()
    form.reset()
    form.reset()
    const callback = pending.get(1)!
    expect(callback).toBeTypeOf('function')
    pending.delete(1)
    callback()
    expect(onFormReset).toHaveBeenCalledTimes(1)
    expect(canceled.mock.calls).toEqual([[2]])
    expect(pending.size).toBe(0)
  })
})
