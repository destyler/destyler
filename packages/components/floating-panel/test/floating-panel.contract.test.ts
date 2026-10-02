// @vitest-environment happy-dom
import type { UserDefinedContext } from '../src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

let id = 0
const services: Array<ReturnType<typeof machine>> = []
const nodes: HTMLElement[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any

function createPanel(context: Partial<UserDefinedContext> = {}) {
  const panelId = `panel-contract-${++id}`
  const positioner = document.createElement('div')
  positioner.id = `float-panel:${panelId}:positioner`
  const content = document.createElement('div')
  content.id = `float-panel:${panelId}:content`
  const header = document.createElement('div')
  header.id = `float-panel:${panelId}:header`
  Object.defineProperty(header, 'offsetHeight', { configurable: true, value: 30 })
  content.appendChild(header)
  positioner.appendChild(content)
  document.body.appendChild(positioner)
  nodes.push(positioner)
  const service = machine({ id: panelId, defaultOpen: true, position: { x: 100, y: 80 }, size: { width: 300, height: 200 }, ...context })
  services.push(service)
  service.start()
  return { service, positioner, content, header, api: () => connect(service.state, service.send, normalize) }
}

function clickEvent(extra: Record<string, unknown> = {}) {
  return { defaultPrevented: false, ...extra }
}

async function flush() {
  await Promise.resolve()
  await Promise.resolve()
}

afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  for (const node of nodes.splice(0)) node.remove()
})

describe('floating-panel geometry and controlled contract controls', () => {
  it.each(['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'] as const)('resizes %s from an independent opposite-edge oracle', (axis) => {
    const panel = createPanel()
    panel.service.send({ type: 'RESIZE_START', axis, position: { x: 100, y: 80 } })
    panel.service.send({ type: 'DRAG', axis, position: { x: 130, y: 100 } })
    const expected = {
      x: axis.includes('w') ? 130 : 100,
      y: axis.includes('n') ? 100 : 80,
      width: 300 + (axis.includes('e') ? 30 : axis.includes('w') ? -30 : 0),
      height: 200 + (axis.includes('s') ? 20 : axis.includes('n') ? -20 : 0),
    }
    const actual = { ...panel.service.state.context.position, ...panel.service.state.context.size }
    for (const key of ['x', 'y', 'width', 'height'] as const)
      expect(actual[key]).toBeCloseTo(expected[key], 10)
  })

  it.each(['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'] as const)('resizes %s about the original center with Alt', (axis) => {
    const panel = createPanel()
    panel.service.send({ type: 'RESIZE_START', axis, position: { x: 100, y: 80 } })
    panel.service.send({ type: 'DRAG', axis, altKey: true, position: { x: 130, y: 100 } })
    const width = 300 + (axis.includes('e') ? 60 : axis.includes('w') ? -60 : 0)
    const height = 200 + (axis.includes('s') ? 40 : axis.includes('n') ? -40 : 0)
    expect(panel.service.state.context.size).toEqual({ width, height })
    expect(panel.service.state.context.position).toEqual({ x: 250 - width / 2, y: 180 - height / 2 })
  })

  it.each([{ lockAspectRatio: true, shiftKey: false }, { lockAspectRatio: false, shiftKey: true }])('retains the original aspect ratio before constraints (%o)', ({ lockAspectRatio, shiftKey }) => {
    const panel = createPanel({ lockAspectRatio })
    panel.service.send({ type: 'RESIZE_START', axis: 'se', position: { x: 100, y: 80 } })
    panel.service.send({ type: 'DRAG', axis: 'se', shiftKey, position: { x: 160, y: 90 } })
    expect(panel.service.state.context.size).toEqual({ width: 360, height: 240 })
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
  })

  it('snaps drag deltas to the grid and emits exactly one final position', () => {
    const changes: unknown[] = []
    const panel = createPanel({ gridSize: 10, onPositionChange: d => changes.push(['move', d]), onPositionChangeEnd: d => changes.push(['end', d]) })
    panel.service.send({ type: 'DRAG_START', position: { x: 100, y: 80 } })
    panel.service.send({ type: 'DRAG', position: { x: 114, y: 96 } })
    panel.service.send('DRAG_END')
    expect(changes).toEqual([
      ['move', { position: { x: 110, y: 100 } }],
      ['end', { position: { x: 110, y: 100 } }],
    ])
    expect(panel.api().dragging).toBe(false)
  })

  it('controlled opening preserves veto/delay, then reflects acceptance without a second request', async () => {
    const onOpenChange = vi.fn()
    const panel = createPanel({ defaultOpen: false, open: false, onOpenChange })
    panel.api().getTriggerProps().onClick(clickEvent())
    await flush()
    expect(panel.api().open).toBe(false)
    expect(onOpenChange.mock.calls).toEqual([[{ open: true }]])
    panel.service.setContext({ open: true })
    await flush()
    expect(panel.api().open).toBe(true)
    expect(onOpenChange.mock.calls).toEqual([[{ open: true }]])
  })

  it('controlled closing during a drag preserves veto and ends resources only when accepted', async () => {
    const onOpenChange = vi.fn()
    const onPositionChangeEnd = vi.fn()
    const panel = createPanel({ open: true, onOpenChange, onPositionChangeEnd })
    panel.service.send({ type: 'DRAG_START', position: { x: 100, y: 80 } })
    panel.api().setOpen(false)
    await flush()
    expect(panel.api().dragging).toBe(true)
    expect(onOpenChange.mock.calls).toEqual([[{ open: false }]])
    panel.service.setContext({ open: false })
    await flush()
    expect(panel.api().open).toBe(false)
    expect(panel.api().dragging).toBe(false)
    expect(onPositionChangeEnd).not.toHaveBeenCalled()
  })

  it.each(['drag', 'resize'] as const)('%s pointer cancellation emits one end payload and removes listeners', (kind) => {
    const end = vi.fn()
    const panel = createPanel({ onPositionChangeEnd: end, onSizeChangeEnd: end })
    panel.service.send({ type: kind === 'drag' ? 'DRAG_START' : 'RESIZE_START', axis: 'se', position: { x: 100, y: 80 } })
    document.dispatchEvent(new PointerEvent('pointercancel', { pointerType: 'touch', pointerId: 1 }))
    expect(panel.service.state.value).toBe('open')
    expect(end.mock.calls).toEqual([[kind === 'drag' ? { position: { x: 100, y: 80 } } : { size: { width: 300, height: 200 } }]])
    document.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', pointerId: 1, clientX: 500, clientY: 300, buttons: 1 }))
    document.dispatchEvent(new PointerEvent('pointercancel', { pointerType: 'touch', pointerId: 1 }))
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
    expect(end).toHaveBeenCalledTimes(1)
  })

  it('observes pointer movement only on the owning document and disconnects at stop', () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const doc = iframe.contentDocument!
    const panel = createPanel({ getRootNode: () => doc })
    panel.service.send({ type: 'DRAG_START', position: { x: 100, y: 80 } })
    document.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', clientX: 200, clientY: 100, buttons: 1 }))
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
    doc.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', clientX: 200, clientY: 100, buttons: 1 }))
    expect(panel.service.state.context.position).toEqual({ x: 200, y: 100 })
    panel.service.stop()
    doc.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', clientX: 300, clientY: 150, buttons: 1 }))
    expect(panel.service.state.context.position).toEqual({ x: 200, y: 100 })
    iframe.remove()
  })
})
