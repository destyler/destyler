// @vitest-environment happy-dom
import type { Context } from '../index'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const services: Array<ReturnType<typeof machine>> = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
let id = 0
function createPanel(context: Partial<Context> = {}) {
  const service = machine({ id: `stack-public-${++id}`, defaultOpen: true, ...context })
  services.push(service)
  service.start()
  return { service, api: () => connect(service.state, service.send, normalize) }
}
async function flush() {
  await Promise.resolve()
  await Promise.resolve()
}
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
})

describe('floating-panel public stack controls', () => {
  it.each(['ordinary', 'drag', 'resize'] as const)('returns ownership after %s close, then reacquires it on reopen', async (kind) => {
    const first = createPanel({ closeOnEscape: true })
    const second = createPanel({ closeOnEscape: true })
    await flush()
    expect(first.api().getContentProps()['data-topmost']).toBeUndefined()
    expect(second.api().getContentProps()['data-topmost']).toBe('')
    if (kind !== 'ordinary')
      second.service.send({ type: kind === 'drag' ? 'DRAG_START' : 'RESIZE_START', axis: 'se', position: { x: 100, y: 80 } })
    expect(second.service.state.value).toBe(kind === 'ordinary' ? 'open' : kind === 'drag' ? 'open.dragging' : 'open.resizing')
    second.api().setOpen(false)
    await flush()
    expect(second.api().open).toBe(false)
    expect(second.api().getContentProps()['data-topmost']).toBeUndefined()
    expect(first.api().getContentProps()['data-topmost']).toBe('')
    second.api().setOpen(true)
    await flush()
    expect(second.api().getContentProps()['data-topmost']).toBe('')
    expect(first.api().getContentProps()['data-topmost']).toBeUndefined()
    second.api().setOpen(false)
    await flush()
    const target = document.createElement('div')
    first.api().getContentProps().onKeyDown({ key: 'Escape', target, currentTarget: target, defaultPrevented: false, preventDefault: vi.fn() })
    expect(first.api().open).toBe(false)
  })

  it('keeps controlled ownership until acceptance and restores it across stop and restart', async () => {
    const first = createPanel()
    const onOpenChange = vi.fn()
    const second = createPanel({ open: true, onOpenChange })
    await flush()
    second.api().setOpen(false)
    await flush()
    expect(onOpenChange.mock.calls).toEqual([[{ open: false }]])
    expect(second.api().open).toBe(true)
    expect(second.api().getContentProps()['data-topmost']).toBe('')
    expect(first.api().getContentProps()['data-topmost']).toBeUndefined()
    second.service.setContext({ open: false })
    await flush()
    expect(second.api().open).toBe(false)
    expect(second.api().getContentProps()['data-topmost']).toBeUndefined()
    expect(first.api().getContentProps()['data-topmost']).toBe('')
    second.service.setContext({ open: true })
    await flush()
    expect(second.api().getContentProps()['data-topmost']).toBe('')
    second.service.stop()
    await flush()
    expect(first.api().getContentProps()['data-topmost']).toBe('')
    second.service.start()
    await flush()
    expect(second.api().getContentProps()['data-topmost']).toBe('')
    expect(first.api().getContentProps()['data-topmost']).toBeUndefined()
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })
})
