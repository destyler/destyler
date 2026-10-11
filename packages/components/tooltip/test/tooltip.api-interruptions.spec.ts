import type { OpenChangeDetails } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'
import { store } from '../src/store'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []
let sequence = 0

function start(controlled: boolean, initiallyOpen = false, autoAccept = false) {
  let service: ReturnType<typeof machine>
  const onOpenChange = vi.fn((details: OpenChangeDetails) => {
    if (autoAccept)
      service.setContext({ open: details.open })
  })
  service = machine({
    id: `tooltip-api-${sequence++}`,
    openDelay: 50,
    closeDelay: 50,
    ...(controlled ? { open: initiallyOpen } : { defaultOpen: initiallyOpen }),
    onOpenChange,
  })
  services.push(service)
  service.start()
  return {
    service,
    onOpenChange,
    // Each call uses the current state, as in a normal rendered consumer.
    api: () => connect(service.getState(), service.send, normalize),
    async accept(open: boolean) {
      if (controlled) {
        service.setContext({ open })
        await vi.advanceTimersByTimeAsync(0)
      }
    },
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  store.setId(null)
})

afterEach(() => {
  services.reverse().forEach(service => service.stop())
  services.length = 0
  store.setId(null)
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe.each([false, true])('tooltip fresh API interruptions (controlled: %s)', (controlled) => {
  it('cancels pending opening instead of treating closed visibility as a no-op', async () => {
    const { service, api, onOpenChange } = start(controlled)
    for (let iteration = 0; iteration < 2; iteration++) {
      service.send('POINTER_MOVE')
      expect(service.state.value).toBe('opening')
      await vi.advanceTimersByTimeAsync(25)
      api().setOpen(false)
      await vi.advanceTimersByTimeAsync(100)
      expect(service.state.value).toBe('closed')
      expect(api().open).toBe(false)
      expect(onOpenChange.mock.calls).toEqual(Array.from({ length: iteration + 1 }, () => [{ open: false }]))
    }
  })

  it('cancels pending closing without a redundant open callback', async () => {
    const { service, api, onOpenChange } = start(controlled, true)
    for (let iteration = 0; iteration < 2; iteration++) {
      service.send('POINTER_LEAVE')
      expect(service.state.value).toBe('closing')
      await vi.advanceTimersByTimeAsync(25)
      api().setOpen(true)
      await vi.advanceTimersByTimeAsync(100)
      expect(service.state.value).toBe('open')
      expect(api().open).toBe(true)
      expect(onOpenChange).not.toHaveBeenCalled()
    }
  })

  it('preserves stable closed/open idempotence and ordinary API requests', async () => {
    const { api, onOpenChange, accept } = start(controlled)
    api().setOpen(false)
    api().setOpen(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    api().setOpen(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    await accept(true)
    expect(api().open).toBe(true)
    api().setOpen(true)
    api().setOpen(true)
    await vi.advanceTimersByTimeAsync(100)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    api().setOpen(false)
    await vi.advanceTimersByTimeAsync(100)
    expect(api().open).toBe(controlled)
    expect(onOpenChange).toHaveBeenCalledTimes(2)
    await accept(false)
    expect(api().open).toBe(false)
    api().setOpen(false)
    await vi.advanceTimersByTimeAsync(100)
    expect(onOpenChange.mock.calls).toEqual([[{ open: true }], [{ open: false }]])
  })

  it('preserves ordinary pointer delays and owner-controlled visibility', async () => {
    const { service, api, onOpenChange, accept } = start(controlled)
    service.send('POINTER_MOVE')
    await vi.advanceTimersByTimeAsync(49)
    expect(api().open).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(api().open).toBe(!controlled)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    await accept(true)
    expect(api().open).toBe(true)
    service.send('POINTER_LEAVE')
    await vi.advanceTimersByTimeAsync(49)
    expect(api().open).toBe(true)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(api().open).toBe(controlled)
    expect(onOpenChange.mock.calls).toEqual([[{ open: true }], [{ open: false }]])
    expect(service.state.value).toBe(controlled ? 'closing' : 'closed')
    await accept(false)
    expect(api().open).toBe(false)
  })
})

it('does not reopen a cancelled controlled request through a later timer callback', async () => {
  const { service, api, onOpenChange } = start(true, false, true)
  service.send('POINTER_MOVE')
  await vi.advanceTimersByTimeAsync(25)
  api().setOpen(false)
  await vi.advanceTimersByTimeAsync(100)
  expect(api().open).toBe(false)
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: false })
})

it('preserves a newer owner when a controlled closing tooltip vetoes the store close request', async () => {
  const older = start(true, true)
  older.service.send('POINTER_LEAVE')
  expect(older.service.state.value).toBe('closing')
  const newer = start(false, true)
  await vi.advanceTimersByTimeAsync(0)
  expect(store.id).toBe(newer.service.state.context.id)
  expect(older.service.state.value).toBe('closing')
  expect(older.api().open).toBe(true)
  expect(newer.api().open).toBe(true)
  expect(older.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: false })
  await vi.advanceTimersByTimeAsync(100)
  expect(store.id).toBe(newer.service.state.context.id)
  expect(older.api().open).toBe(true)
  expect(newer.api().open).toBe(true)
})
