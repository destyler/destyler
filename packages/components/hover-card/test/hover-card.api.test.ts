// @vitest-environment happy-dom
import { createNormalizer } from '@destyler/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  document.body.replaceChildren()
  vi.useRealTimers()
})

function start(controlled: boolean, initiallyOpen = false) {
  const trigger = document.createElement('button')
  const positioner = document.createElement('div')
  const content = document.createElement('div')
  trigger.id = 'hover-card-api-trigger'
  positioner.id = 'hover-card-api-positioner'
  content.id = 'hover-card-api-content'
  positioner.append(content)
  document.body.append(trigger, positioner)
  const onOpenChange = vi.fn()
  const service = machine({
    id: 'hover-card-api-test',
    ids: { trigger: trigger.id, positioner: positioner.id, content: content.id },
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
    api: () => connect(service.getState(), service.send, normalize),
    async accept(open: boolean) {
      if (controlled) {
        service.setContext({ open })
        await vi.advanceTimersByTimeAsync(0)
      }
    },
  }
}

describe.each([false, true])('hover-card API interruptions (controlled=%s)', (controlled) => {
  it.each(['OPEN', 'POINTER_ENTER', 'TRIGGER_FOCUS'])('cancels %s before its opening delay, repeatedly', async (event) => {
    const { service, api, onOpenChange } = start(controlled)
    for (let iteration = 0; iteration < 2; iteration++) {
      service.send(event)
      expect(service.state.value).toBe('opening')
      await vi.advanceTimersByTimeAsync(25)
      api().setOpen(false)
      await vi.advanceTimersByTimeAsync(50)
      expect(service.state.value).toBe('closed')
      expect(api().open).toBe(false)
      expect(onOpenChange.mock.calls).toEqual(Array.from({ length: iteration + 1 }, () => [{ open: false }]))
    }
  })

  it('cancels a pending close without a redundant open callback, repeatedly', async () => {
    const { service, api, onOpenChange } = start(controlled, true)
    for (let iteration = 0; iteration < 2; iteration++) {
      service.send('POINTER_LEAVE')
      expect(service.state.value).toBe('closing')
      await vi.advanceTimersByTimeAsync(25)
      api().setOpen(true)
      await vi.advanceTimersByTimeAsync(50)
      expect(service.state.value).toBe('open')
      expect(api().open).toBe(true)
      expect(onOpenChange).not.toHaveBeenCalled()
    }
  })

  it('requests close immediately during closing and cancels its delayed callback', async () => {
    const { service, api, onOpenChange, accept } = start(controlled, true)
    service.send('POINTER_LEAVE')
    expect(service.state.value).toBe('closing')
    api().setOpen(false)
    expect(api().open).toBe(controlled)
    expect(onOpenChange.mock.calls).toEqual([[{ open: false }]])
    await vi.advanceTimersByTimeAsync(100)
    expect(api().open).toBe(controlled)
    expect(onOpenChange.mock.calls).toEqual([[{ open: false }]])
    await accept(false)
    expect(api().open).toBe(false)
  })

  it('honors newer requests through the same API snapshot', async () => {
    const { api, onOpenChange, accept } = start(controlled)
    const initialApi = api()
    for (let iteration = 0; iteration < 2; iteration++) {
      initialApi.setOpen(true)
      initialApi.setOpen(false)
      await vi.advanceTimersByTimeAsync(100)
      expect(api().open).toBe(false)
    }
    expect(onOpenChange.mock.calls).toEqual([[{ open: false }], [{ open: false }]])

    initialApi.setOpen(true)
    await vi.advanceTimersByTimeAsync(50)
    expect(api().open).toBe(!controlled)
    await accept(true)
    expect(api().open).toBe(true)
    initialApi.setOpen(false)
    expect(onOpenChange).toHaveBeenLastCalledWith({ open: false })
    await accept(false)
    expect(api().open).toBe(false)
    expect(onOpenChange).toHaveBeenCalledTimes(4)
  })

  it('preserves normal hover delays and controlled ownership', async () => {
    const { service, api, onOpenChange, accept } = start(controlled)
    service.send('POINTER_ENTER')
    await vi.advanceTimersByTimeAsync(49)
    expect(api().open).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(api().open).toBe(!controlled)
    expect(onOpenChange.mock.calls).toEqual([[{ open: true }]])
    await accept(true)
    expect(api().open).toBe(true)

    service.send('POINTER_LEAVE')
    await vi.advanceTimersByTimeAsync(49)
    expect(api().open).toBe(true)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(api().open).toBe(controlled)
    expect(onOpenChange.mock.calls).toEqual([[{ open: true }], [{ open: false }]])
    await accept(false)
    expect(api().open).toBe(false)
  })

  it('does not restart an opening delay or notify for settled no-op requests', async () => {
    const { api, onOpenChange, accept } = start(controlled)
    api().setOpen(false)
    api().setOpen(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    api().setOpen(true)
    await vi.advanceTimersByTimeAsync(25)
    api().setOpen(true)
    await vi.advanceTimersByTimeAsync(25)
    expect(onOpenChange.mock.calls).toEqual([[{ open: true }]])
    await accept(true)
    api().setOpen(true)
    api().setOpen(true)
    await vi.advanceTimersByTimeAsync(100)
    expect(api().open).toBe(true)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })
})
