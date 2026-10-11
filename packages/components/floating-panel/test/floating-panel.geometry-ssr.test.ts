// @vitest-environment node
import { expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

it('supplies initial panel geometry without browser globals during SSR', () => {
  expect(typeof document).toBe('undefined')
  expect(typeof window).toBe('undefined')
  const service = machine({ id: 'floating-panel-no-dom', defaultOpen: true, position: { x: -10, y: 0 }, size: { width: 300, height: 200 } })
  const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
  const api = connect(service.state, service.send, normalize)
  expect(api.getPositionerProps().style).toMatchObject({ '--x': '-10px', '--y': '0px', '--width': '300px', '--height': '200px' })
  expect(api.getContentProps().hidden).toBe(false)
})
