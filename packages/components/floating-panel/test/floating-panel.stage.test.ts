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
  const panelId = `panel-stage-${++id}`
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

describe('floating-panel stage contract', () => {
  it.each(['minimize', 'maximize'] as const)('%s notifies once and restore notifies once with exact geometry', (stage) => {
    const changes: unknown[] = []
    const panel = createPanel({ onStageChange: details => changes.push(details) })
    const initial = { position: { ...panel.service.state.context.position }, size: { ...panel.service.state.context.size } }
    const props = stage === 'minimize' ? panel.api().getMinimizeTriggerProps() : panel.api().getMaximizeTriggerProps()
    props.onClick(clickEvent())
    expect(changes).toEqual([{ stage: `${stage}d` }])
    expect(panel.api().getRestoreTriggerProps().hidden).toBe(false)
    panel.api().getRestoreTriggerProps().onClick(clickEvent())
    expect(changes).toEqual([{ stage: `${stage}d` }, { stage: undefined }])
    expect(panel.service.state.context.position).toEqual(initial.position)
    expect(panel.service.state.context.size).toEqual(initial.size)
  })

  it('notifies in stage, position, size order when maximizing and stage, size, position when restoring', () => {
    const calls: unknown[] = []
    const panel = createPanel({
      onStageChange: details => calls.push(['stage', details]),
      onPositionChange: details => calls.push(['position', details]),
      onSizeChange: details => calls.push(['size', details]),
    })
    panel.api().getMaximizeTriggerProps().onClick(clickEvent())
    expect(calls).toEqual([
      ['stage', { stage: 'maximized' }],
      ['position', { position: { x: 0, y: 0 } }],
      ['size', { size: { width: window.innerWidth, height: window.innerHeight } }],
    ])
    calls.length = 0
    panel.api().getRestoreTriggerProps().onClick(clickEvent())
    expect(calls).toEqual([
      ['stage', { stage: undefined }],
      ['size', { size: { width: 300, height: 200 } }],
      ['position', { position: { x: 100, y: 80 } }],
    ])
  })

  it('restoring an unstaged panel is a no-op', () => {
    const onStageChange = vi.fn()
    const panel = createPanel({ onStageChange })
    panel.api().getRestoreTriggerProps().onClick(clickEvent())
    expect(onStageChange).not.toHaveBeenCalled()
    expect(panel.service.state.context.size).toEqual({ width: 300, height: 200 })
  })
})
