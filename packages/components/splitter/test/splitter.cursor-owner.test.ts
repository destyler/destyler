// @vitest-environment happy-dom
import { useService } from '@destyler/vanilla'
import { afterEach, describe, expect, it } from 'vitest'
import { machine } from '../src/machine'

const services: ReturnType<typeof machine>[] = []
function create(id: string, rootNode: Document | ShadowRoot = document) {
  const root = document.createElement('div')
  root.id = `splitter:${id}`
  Object.defineProperty(root, 'offsetWidth', { value: 1000 })
  if (rootNode.nodeType === 9)
    (rootNode as Document).body.append(root)
  else rootNode.append(root)
  const service = machine({ id, getRootNode: () => rootNode, defaultSize: [{ id: 'a', size: 50 }, { id: 'b', size: 50 }] })
  services.push(service)
  useService({}, service)
  return service
}
function move(service: ReturnType<typeof machine>) {
  service.send({ type: 'FOCUS', id: 'a:b' })
  service.send({ type: 'POINTER_DOWN', id: 'a:b', point: { x: 500, y: 0 } })
  service.send({ type: 'POINTER_MOVE', point: { x: 530, y: 0 } })
}
afterEach(() => {
  services.splice(0).forEach(service => service.stop())
  document.body.replaceChildren()
  document.head.querySelectorAll('style').forEach(style => style.remove())
})
describe('splitter cursor element ownership', () => {
  it('cleans its inserted document-head element for a shadow-root service across stop/restart', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const service = create('shadow', shadow)
    for (let i = 0; i < 16; i++) {
      service.start()
      move(service)
      expect(document.head.querySelectorAll('style')).toHaveLength(1)
      const inserted = document.head.querySelector('style')!
      service.stop()
      service.stop()
      expect(inserted.isConnected).toBe(false)
      expect(document.head.querySelectorAll('style')).toHaveLength(0)
    }
  })
  it('never overwrites or removes a caller style with the generated ID', () => {
    const caller = document.createElement('style')
    caller.id = 'splitter:caller:global-cursor'
    caller.textContent = 'body { color: red; }'
    document.head.append(caller)
    const service = create('caller')
    move(service)
    expect(document.head.querySelectorAll('style')).toHaveLength(2)
    expect(caller.textContent).toBe('body { color: red; }')
    service.stop()
    expect(document.head.querySelectorAll('style')).toHaveLength(1)
    expect(caller.isConnected).toBe(true)
  })
  it('keeps another service and a caller replacement after stopping only its own service', () => {
    const first = create('first')
    const second = create('second')
    move(first)
    move(second)
    const owned = document.getElementById('splitter:first:global-cursor')!
    owned.remove()
    const caller = document.createElement('style')
    caller.id = 'splitter:first:global-cursor'
    document.head.append(caller)
    first.stop()
    expect(caller.isConnected).toBe(true)
    expect(document.getElementById('splitter:second:global-cursor')).not.toBeNull()
    second.stop()
    expect(caller.isConnected).toBe(true)
  })
})
