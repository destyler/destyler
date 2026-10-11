import type { UserDefinedContext } from '../src/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'
// @vitest-environment happy-dom
import { panelStack } from '../src/store'

let id = 0
const services: Array<ReturnType<typeof machine>> = []
const nodes: HTMLElement[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any

function createPanel(context: Partial<UserDefinedContext> = {}) {
  const panelId = `panel-stack-${++id}`
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

describe('floating-panel open stack ownership', () => {
  it('returns topmost status to the remaining open panel after close', async () => {
    const first = createPanel()
    const second = createPanel()
    await flush()
    expect(first.api().getContentProps()['data-topmost']).toBeUndefined()
    expect(second.api().getContentProps()['data-topmost']).toBe('')
    second.api().setOpen(false)
    await flush()
    expect(first.api().getContentProps()['data-topmost']).toBe('')
    expect(second.api().getContentProps()['data-topmost']).toBeUndefined()
    expect(panelStack.stack).toEqual([first.service.state.context.id])
  })

  it('keeps a vetoed close above the underlying panel until the parent accepts', async () => {
    const onOpenChange = vi.fn()
    const first = createPanel()
    const second = createPanel({ open: true, onOpenChange })
    await flush()
    second.api().getCloseTriggerProps().onClick(clickEvent())
    await flush()
    expect(onOpenChange.mock.calls).toEqual([[{ open: false }]])
    expect(second.api().open).toBe(true)
    expect(second.api().getContentProps()['data-topmost']).toBe('')
    expect(first.api().getContentProps()['data-topmost']).toBeUndefined()
    second.service.setContext({ open: false })
    await flush()
    expect(first.api().getContentProps()['data-topmost']).toBe('')
    expect(second.api().open).toBe(false)
  })

  it('retains only one stack entry throughout drag, resize, cancel and stop/restart', async () => {
    const panel = createPanel()
    const id = panel.service.state.context.id
    panel.service.send({ type: 'DRAG_START', position: { x: 100, y: 80 } })
    expect(panelStack.stack).toEqual([id])
    panel.service.send('ESCAPE')
    panel.service.send({ type: 'RESIZE_START', axis: 'e', position: { x: 400, y: 80 } })
    expect(panelStack.stack).toEqual([id])
    panel.service.send('DRAG_END')
    expect(panelStack.stack).toEqual([id])
    panel.service.stop()
    await flush()
    expect(panelStack.stack).toEqual([])
    panel.service.start()
    await flush()
    expect(panelStack.stack).toEqual([id])
    expect(panel.api().getContentProps()['data-topmost']).toBe('')
  })

  it('can close the surviving panel with Escape after the topmost panel closes', async () => {
    const first = createPanel({ closeOnEscape: true })
    const second = createPanel({ closeOnEscape: true })
    await flush()
    second.api().setOpen(false)
    await flush()
    first.api().getContentProps().onKeyDown({
      key: 'Escape',
      target: first.content,
      currentTarget: first.content,
      defaultPrevented: false,
      preventDefault: vi.fn(),
    })
    expect(first.api().open).toBe(false)
  })
})
