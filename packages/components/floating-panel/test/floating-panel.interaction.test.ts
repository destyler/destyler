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
  const panelId = `panel-interaction-${++id}`
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

afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  for (const node of nodes.splice(0)) node.remove()
})

function pointerEvent(target: HTMLElement, extra: Record<string, unknown> = {}) {
  const setPointerCapture = vi.fn()
  Object.assign(target, { setPointerCapture })
  return { target, currentTarget: target, pointerId: 8, button: 0, clientX: 100, clientY: 100, defaultPrevented: false, setPointerCapture, stopPropagation: vi.fn(), ...extra }
}

describe('floating-panel interaction eligibility', () => {
  it.each(['drag', 'resize'] as const)('%s preserves consumer pointerdown cancellation', (kind) => {
    const panel = createPanel()
    const event = pointerEvent(panel.header, { defaultPrevented: true })
    const props = kind === 'drag' ? panel.api().getDragTriggerProps() : panel.api().getResizeTriggerProps({ axis: 'e' })
    props.onPointerDown(event)
    expect(event.setPointerCapture).not.toHaveBeenCalled()
    expect(event.stopPropagation).not.toHaveBeenCalled()
    expect(panel.api().dragging).toBe(false)
    expect(panel.api().resizing).toBe(false)
  })

  it.each(['drag', 'resize'] as const)('%s ignores non-primary mouse buttons', (kind) => {
    const panel = createPanel()
    const props = kind === 'drag' ? panel.api().getDragTriggerProps() : panel.api().getResizeTriggerProps({ axis: 'e' })
    for (const button of [1, 2]) {
      const event = pointerEvent(panel.header, { button })
      props.onPointerDown(event)
      expect(event.setPointerCapture).not.toHaveBeenCalled()
    }
    expect(panel.service.state.value).toBe('open')
  })

  it('does not move a disabled panel with the content arrow keys', () => {
    const onPositionChange = vi.fn()
    const panel = createPanel({ disabled: true, onPositionChange })
    const preventDefault = vi.fn()
    panel.api().getContentProps().onKeyDown({
      key: 'ArrowRight',
      defaultPrevented: false,
      target: panel.content,
      currentTarget: panel.content,
      preventDefault,
    })
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
    expect(onPositionChange).not.toHaveBeenCalled()
    expect(preventDefault).not.toHaveBeenCalled()
  })

  it.each(['close', 'minimize', 'maximize', 'restore'] as const)('disabled %s callbacks do not emit requests or mutate state', (kind) => {
    const onStageChange = vi.fn()
    const onOpenChange = vi.fn()
    const panel = createPanel({ disabled: kind !== 'restore', onStageChange, onOpenChange })
    if (kind === 'restore') {
      panel.api().getMaximizeTriggerProps().onClick(clickEvent())
      panel.service.setContext({ disabled: true })
      onStageChange.mockClear()
    }
    const api = panel.api()
    const props = ({ close: api.getCloseTriggerProps, minimize: api.getMinimizeTriggerProps, maximize: api.getMaximizeTriggerProps, restore: api.getRestoreTriggerProps })[kind]()
    props.onClick(clickEvent())
    expect(panel.api().open).toBe(true)
    expect(panel.service.state.context.stage).toBe(kind === 'restore' ? 'maximized' : undefined)
    expect(onStageChange).not.toHaveBeenCalled()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it.each([{ disabled: true }, { defaultPrevented: true }])('does not maximize on an ineligible double click (%o)', (condition) => {
    const onStageChange = vi.fn()
    const panel = createPanel({ disabled: condition.disabled, onStageChange })
    panel.api().getDragTriggerProps().onDoubleClick(clickEvent({ defaultPrevented: condition.defaultPrevented }))
    expect(panel.service.state.context.stage).toBeUndefined()
    expect(onStageChange).not.toHaveBeenCalled()
  })

  it.each(['input', 'textarea', 'select', 'button'])('leaves descendant %s arrow keys alone', (tag) => {
    const panel = createPanel()
    const child = document.createElement(tag)
    panel.content.appendChild(child)
    const preventDefault = vi.fn()
    panel.api().getContentProps().onKeyDown({ target: child, currentTarget: panel.content, key: 'ArrowRight', defaultPrevented: false, preventDefault })
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
    expect(preventDefault).not.toHaveBeenCalled()
  })

  it('moves on an eligible direct-content arrow key and cancels its browser default', () => {
    const onPositionChange = vi.fn()
    const panel = createPanel({ onPositionChange })
    const preventDefault = vi.fn()
    panel.api().getContentProps().onKeyDown({ target: panel.content, currentTarget: panel.content, key: 'ArrowRight', defaultPrevented: false, preventDefault })
    expect(panel.service.state.context.position).toEqual({ x: 101, y: 80 })
    expect(onPositionChange.mock.calls).toEqual([[{ position: { x: 101, y: 80 } }]])
    expect(preventDefault).toHaveBeenCalledTimes(1)
  })

  it('allows Escape from a descendant of the topmost panel', async () => {
    const onOpenChange = vi.fn()
    const panel = createPanel({ closeOnEscape: true, onOpenChange })
    const input = document.createElement('input')
    panel.content.appendChild(input)
    await Promise.resolve()
    await Promise.resolve()
    const preventDefault = vi.fn()
    panel.api().getContentProps().onKeyDown({ target: input, currentTarget: panel.content, key: 'Escape', defaultPrevented: false, preventDefault })
    expect(panel.api().open).toBe(false)
    expect(onOpenChange.mock.calls).toEqual([[{ open: false }]])
    expect(preventDefault).toHaveBeenCalledTimes(1)
  })

  it('starts an eligible primary resize with the requested axis and capture identity', () => {
    const panel = createPanel()
    const event = pointerEvent(panel.header)
    panel.api().getResizeTriggerProps({ axis: 'nw' }).onPointerDown(event)
    expect(panel.api().resizing).toBe(true)
    expect(panel.service.state.event).toMatchObject({ type: 'RESIZE_START', axis: 'nw', position: { x: 100, y: 100 } })
    expect(event.setPointerCapture).toHaveBeenCalledExactlyOnceWith(8)
    expect(event.stopPropagation).toHaveBeenCalledTimes(1)
    panel.service.send('DRAG_END')
    expect(panel.api().resizing).toBe(false)
  })

  it('maximizes and restores on eligible drag-area double clicks', () => {
    const panel = createPanel()
    panel.api().getDragTriggerProps().onDoubleClick(clickEvent())
    expect(panel.service.state.context.stage).toBe('maximized')
    expect(panel.service.state.context.size).toEqual({ width: window.innerWidth, height: window.innerHeight })
    panel.api().getDragTriggerProps().onDoubleClick(clickEvent())
    expect(panel.service.state.context.stage).toBeUndefined()
    expect(panel.service.state.context.size).toEqual({ width: 300, height: 200 })
    expect(panel.service.state.context.position).toEqual({ x: 100, y: 80 })
  })

  it('keeps eligible primary drag and consumer-cancelled click behavior', () => {
    const panel = createPanel()
    panel.api().getMaximizeTriggerProps().onClick(clickEvent({ defaultPrevented: true }))
    expect(panel.service.state.context.stage).toBeUndefined()
    const event = pointerEvent(panel.header)
    panel.api().getDragTriggerProps().onPointerDown(event)
    expect(panel.api().dragging).toBe(true)
    expect(event.setPointerCapture).toHaveBeenCalledExactlyOnceWith(8)
    expect(event.stopPropagation).toHaveBeenCalledTimes(1)
    panel.service.send('DRAG_END')
    expect(panel.api().dragging).toBe(false)
  })
})
