import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []
const roots: HTMLElement[] = []
let sequence = 0

function start(options: Partial<UserDefinedContext> = {}, doc = document) {
  const id = `hover-card-lifecycle-${sequence++}`
  const root = doc.createElement('div')
  const trigger = doc.createElement('button')
  const positioner = doc.createElement('div')
  const content = doc.createElement('div')
  trigger.id = `${id}-trigger`
  positioner.id = `${id}-positioner`
  content.id = `${id}-content`
  trigger.textContent = 'Trigger'
  content.textContent = 'Content'
  positioner.append(content)
  root.append(trigger, positioner)
  doc.body.append(root)
  roots.push(root)
  const onOpenChange = vi.fn()
  const service = machine({
    id,
    ids: { trigger: trigger.id, positioner: positioner.id, content: content.id },
    getRootNode: () => doc,
    openDelay: 50,
    closeDelay: 50,
    onOpenChange,
    ...options,
  })
  services.push(service)
  service.start()
  const api = () => connect(service.getState(), service.send, normalize)
  return { service, api, onOpenChange }
}

beforeEach(() => vi.useFakeTimers())

afterEach(() => {
  services.reverse().forEach(service => service.stop())
  services.length = 0
  roots.reverse().forEach(root => root.remove())
  roots.length = 0
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('hover-card service lifetimes', () => {
  it.each([false, true])('cancels opening work on stop and restarts with a fresh delay (controlled: %s)', async (controlled) => {
    const { service, api, onOpenChange } = start(controlled ? { open: false } : {})
    service.send('POINTER_ENTER')
    await vi.advanceTimersByTimeAsync(25)
    service.stop()
    await vi.advanceTimersByTimeAsync(100)
    expect(onOpenChange).not.toHaveBeenCalled()
    service.start()
    service.send('POINTER_ENTER')
    await vi.advanceTimersByTimeAsync(49)
    expect(api().open).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(api().open).toBe(!controlled)
    if (controlled) {
      service.setContext({ open: true })
      await vi.advanceTimersByTimeAsync(0)
      expect(api().open).toBe(true)
    }
  })

  it.each([false, true])('cancels closing work on stop without notifying and restarts (controlled: %s)', async (controlled) => {
    const { service, api, onOpenChange } = start(controlled ? { open: true } : { defaultOpen: true })
    service.send('POINTER_LEAVE')
    await vi.advanceTimersByTimeAsync(25)
    service.stop()
    service.stop()
    await vi.advanceTimersByTimeAsync(100)
    expect(onOpenChange).not.toHaveBeenCalled()
    service.start()
    expect(api().open).toBe(true)
    service.send('POINTER_LEAVE')
    await vi.advanceTimersByTimeAsync(49)
    expect(onOpenChange).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: false })
    expect(api().open).toBe(controlled)
  })

  it('does not let a stopped service notify after a replacement starts', async () => {
    const older = start()
    older.service.send('TRIGGER_FOCUS')
    await vi.advanceTimersByTimeAsync(25)
    older.service.stop()
    const newer = start()
    newer.service.send('TRIGGER_FOCUS')
    await vi.advanceTimersByTimeAsync(50)
    expect(older.onOpenChange).not.toHaveBeenCalled()
    expect(newer.onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(newer.api().open).toBe(true)
  })

  it('resets pointer ownership before a later keyboard-open cycle', async () => {
    const { service, api, onOpenChange } = start()
    service.send('POINTER_ENTER')
    await vi.advanceTimersByTimeAsync(50)
    service.send('TRIGGER_BLUR')
    expect(api().open).toBe(true)
    service.send('POINTER_LEAVE')
    await vi.advanceTimersByTimeAsync(50)
    expect(api().open).toBe(false)
    service.send('TRIGGER_FOCUS')
    await vi.advanceTimersByTimeAsync(50)
    expect(api().open).toBe(true)
    service.send('TRIGGER_BLUR')
    expect(api().open).toBe(false)
    expect(onOpenChange.mock.calls).toEqual([
      [{ open: true }],
      [{ open: false }],
      [{ open: true }],
      [{ open: false }],
    ])
  })

  it('ignores touch entry and exit without starting or cancelling mouse delays', async () => {
    const { service, api, onOpenChange } = start()
    const touch = new PointerEvent('pointerenter', { pointerType: 'touch' })
    api().getTriggerProps().onPointerEnter?.(touch)
    await vi.advanceTimersByTimeAsync(100)
    expect(service.state.value).toBe('closed')
    expect(onOpenChange).not.toHaveBeenCalled()
    service.send('POINTER_ENTER')
    await vi.advanceTimersByTimeAsync(50)
    api().getTriggerProps().onPointerLeave?.(new PointerEvent('pointerleave', { pointerType: 'touch' }))
    await vi.advanceTimersByTimeAsync(100)
    expect(api().open).toBe(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
  })

  it('handles Escape in its iframe owner document and releases the old service on stop', async () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    roots.push(frame)
    const doc = frame.contentDocument!
    const { service, api, onOpenChange } = start({ defaultOpen: true }, doc)
    await vi.advanceTimersByTimeAsync(20)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(api().open).toBe(true)
    expect(onOpenChange).not.toHaveBeenCalled()
    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(api().open).toBe(false)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: false })
    service.stop()
    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })
})
