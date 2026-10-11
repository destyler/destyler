import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'
import { store } from '../src/store'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []
let sequence = 0

function start(options: Partial<UserDefinedContext> = {}) {
  const onOpenChange = vi.fn(options.onOpenChange)
  const service = machine({
    id: `tooltip-warm-${sequence++}`,
    openDelay: 50,
    closeDelay: 50,
    ...options,
    onOpenChange,
  })
  services.push(service)
  service.start()
  const api = () => connect(service.getState(), service.send, normalize)
  return {
    service,
    api,
    onOpenChange,
    move(event = new PointerEvent('pointermove', { pointerType: 'mouse', cancelable: true })) {
      api().getTriggerProps().onPointerMove?.(event)
    },
    leave() {
      api().getTriggerProps().onPointerLeave?.(new PointerEvent('pointerleave', { pointerType: 'mouse' }))
    },
  }
}

function pair(ownerFirst: boolean, options: Partial<UserDefinedContext> = { open: false }) {
  if (ownerFirst) {
    const owner = start({ defaultOpen: true })
    const next = start(options)
    return { owner, next }
  }
  const next = start(options)
  const owner = start({ defaultOpen: true })
  return { owner, next }
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

describe.each([true, false])('controlled warm hover (visible owner created first: %s)', (ownerFirst) => {
  it('honors a parent veto and preserves the visible owner', async () => {
    const { owner, next } = pair(ownerFirst)
    next.move()
    expect(next.api().open).toBe(false)
    expect(next.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(store.id).toBe(owner.service.state.context.id)
    next.move()
    await vi.advanceTimersByTimeAsync(100)
    expect(next.api().open).toBe(false)
    expect(next.onOpenChange).toHaveBeenCalledTimes(1)
    expect(owner.onOpenChange).not.toHaveBeenCalled()
    expect(store.id).toBe(owner.service.state.context.id)
  })

  it('opens only after immediate callback acceptance is synchronized', async () => {
    let accept!: (open: boolean) => void
    const { owner, next } = pair(ownerFirst, {
      open: false,
      onOpenChange: details => accept(details.open),
    })
    accept = open => next.service.setContext({ open })
    next.move()
    expect(next.api().open).toBe(false)
    expect(store.id).toBe(owner.service.state.context.id)
    await vi.advanceTimersByTimeAsync(0)
    expect(next.api().open).toBe(true)
    expect(store.id).toBe(next.service.state.context.id)
    expect(next.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(owner.onOpenChange).not.toHaveBeenCalled()
  })

  it('waits for delayed acceptance before taking ownership from a closing tooltip', async () => {
    const { owner, next } = pair(ownerFirst)
    owner.leave()
    expect(owner.service.state.value).toBe('closing')
    next.move()
    await vi.advanceTimersByTimeAsync(25)
    expect(next.api().open).toBe(false)
    expect(owner.api().open).toBe(true)
    expect(store.id).toBe(owner.service.state.context.id)
    next.move()
    expect(next.onOpenChange).toHaveBeenCalledTimes(1)
    next.service.setContext({ open: true })
    await vi.advanceTimersByTimeAsync(0)
    expect(next.api().open).toBe(true)
    expect(owner.api().open).toBe(false)
    expect(store.id).toBe(next.service.state.context.id)
    expect(next.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(owner.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: false })
  })
})

describe('warm-hover compatibility controls', () => {
  it('allows another request after leaving a vetoed trigger', () => {
    const { owner, next } = pair(true)
    next.move()
    expect(next.api().open).toBe(false)
    next.leave()
    next.move()
    expect(next.api().open).toBe(false)
    expect(next.onOpenChange.mock.calls).toEqual([[{ open: true }], [{ open: true }]])
    expect(store.id).toBe(owner.service.state.context.id)
  })

  it('preserves immediate uncontrolled warm opening', () => {
    const { next } = pair(true, {})
    next.move()
    expect(next.api().open).toBe(true)
    expect(next.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(store.id).toBe(next.service.state.context.id)
  })

  it('preserves the delayed cold controlled path', async () => {
    const next = start({ open: false })
    next.move()
    await vi.advanceTimersByTimeAsync(49)
    expect(next.api().open).toBe(false)
    expect(next.onOpenChange).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(next.api().open).toBe(false)
    expect(next.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(store.id).toBeNull()
    next.service.setContext({ open: true })
    await vi.advanceTimersByTimeAsync(0)
    expect(next.api().open).toBe(true)
    expect(next.onOpenChange).toHaveBeenCalledTimes(1)
  })

  it('preserves controlled ownership for explicit undefined open', () => {
    const { owner, next } = pair(true, { open: undefined })
    next.move()
    expect(next.api().open).toBe(false)
    expect(next.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(store.id).toBe(owner.service.state.context.id)
  })

  it.each(['disabled', 'touch', 'prevented'] as const)('preserves %s pointer filtering', (mode) => {
    const { owner, next } = pair(true, { open: false, disabled: mode === 'disabled' })
    const event = new PointerEvent('pointermove', { pointerType: mode === 'touch' ? 'touch' : 'mouse', cancelable: true })
    if (mode === 'prevented')
      event.preventDefault()
    next.move(event)
    expect(next.api().open).toBe(false)
    expect(next.onOpenChange).not.toHaveBeenCalled()
    expect(store.id).toBe(owner.service.state.context.id)
  })

  it('does not request changes for parent-driven opening and closing', async () => {
    const { next } = pair(true)
    next.service.setContext({ open: true })
    await vi.advanceTimersByTimeAsync(0)
    expect(next.api().open).toBe(true)
    expect(store.id).toBe(next.service.state.context.id)
    next.service.setContext({ open: false })
    await vi.advanceTimersByTimeAsync(0)
    expect(next.api().open).toBe(false)
    expect(store.id).toBeNull()
    expect(next.onOpenChange).not.toHaveBeenCalled()
  })
})
