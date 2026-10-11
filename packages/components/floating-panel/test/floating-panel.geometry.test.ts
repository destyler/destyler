import type { UserDefinedContext } from '../src/types'
import { afterEach, describe, expect, it } from 'vitest'
// @vitest-environment happy-dom
import { connect } from '../src/connect'
import { machine } from '../src/machine'

let id = 0
const services: Array<ReturnType<typeof machine>> = []
const nodes: HTMLElement[] = []
const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any

function createPanel(context: Partial<UserDefinedContext> = {}) {
  const panelId = `panel-geometry-${++id}`
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

async function flush() {
  await Promise.resolve()
  await Promise.resolve()
}

afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  for (const node of nodes.splice(0)) node.remove()
})

describe('floating-panel initial geometry props', () => {
  it.each([{ defaultOpen: true }, { open: true }, { defaultOpen: false }])('supplies positioner geometry on the first render (%o)', (visibility) => {
    const panel = createPanel(visibility)
    expect(panel.api().getPositionerProps().style).toMatchObject({
      '--x': '100px',
      '--y': '80px',
      '--width': '300px',
      '--height': '200px',
      'top': 'var(--y)',
      'left': 'var(--x)',
    })
  })

  it('provides default geometry before machine start for SSR', () => {
    const service = machine({ id: 'ssr-geometry', defaultOpen: true })
    const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
    const api = connect(service.state, service.send, normalize)
    expect(api.getPositionerProps().style).toMatchObject({ '--x': '300px', '--y': '100px', '--width': '320px', '--height': '240px' })
  })

  it('reflects live programmatic geometry, including zero and negative coordinates', async () => {
    const panel = createPanel()
    panel.service.setContext({ position: { x: -25, y: 0 }, size: { width: 0, height: 125 } })
    await flush()
    expect(panel.api().getPositionerProps().style).toMatchObject({ '--x': '-25px', '--y': '0px', '--width': '0px', '--height': '125px' })
    expect(panel.positioner.style.getPropertyValue('--x')).toBe('-25px')
    expect(panel.positioner.style.getPropertyValue('--y')).toBe('0px')
    expect(panel.positioner.style.getPropertyValue('--width')).toBe('0px')
    expect(panel.positioner.style.getPropertyValue('--height')).toBe('125px')
  })
})
