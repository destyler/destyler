// Native companion: count and release exact fixture-owned nodes while preserving harness styles.
import { describe, expect, it } from 'vitest'
import { cursorStyles, ownNode, setup } from './splitter.native-test-helper'

function move(service: ReturnType<typeof setup>['service']) {
  service.send({ type: 'FOCUS', id: 'a:b' })
  service.send({ type: 'POINTER_DOWN', id: 'a:b', point: { x: 500, y: 0 } })
  service.send({ type: 'POINTER_MOVE', point: { x: 530, y: 0 } })
}

describe('splitter cursor element ownership', () => {
  it('cleans its inserted document-head element for a shadow-root service across stop/restart', () => {
    const host = ownNode(document.createElement('div'))
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const { service, cursorId } = setup({}, shadow)
    for (let i = 0; i < 16; i++) {
      service.start()
      move(service)
      const styles = cursorStyles(cursorId)
      expect(styles).toHaveLength(1)
      const inserted = styles[0]
      service.stop()
      service.stop()
      expect(inserted.isConnected).toBe(false)
      expect(cursorStyles(cursorId)).toHaveLength(0)
    }
  })

  it('never overwrites or removes a caller style with the generated ID', () => {
    const { service, cursorId } = setup()
    const caller = ownNode(document.createElement('style'))
    caller.id = cursorId
    caller.textContent = 'body { color: red; }'
    document.head.append(caller)
    move(service)
    const styles = cursorStyles(cursorId)
    expect(styles).toHaveLength(2)
    const owned = styles.find(style => style !== caller)!
    expect(owned).toBeDefined()
    expect(caller.textContent).toBe('body { color: red; }')
    service.stop()
    expect(owned.isConnected).toBe(false)
    expect(cursorStyles(cursorId)).toEqual([caller])
    expect(caller.isConnected).toBe(true)
  })

  it('keeps another service and a caller replacement after stopping only its own service', () => {
    const first = setup()
    const second = setup()
    move(first.service)
    move(second.service)
    const [owned] = cursorStyles(first.cursorId)
    const [peer] = cursorStyles(second.cursorId)
    expect(owned).toBeDefined()
    expect(peer).toBeDefined()
    owned.remove()
    const caller = ownNode(document.createElement('style'))
    caller.id = first.cursorId
    document.head.append(caller)
    first.service.stop()
    expect(caller.isConnected).toBe(true)
    expect(peer.isConnected).toBe(true)
    expect(cursorStyles(second.cursorId)).toEqual([peer])
    second.service.stop()
    expect(peer.isConnected).toBe(false)
    expect(caller.isConnected).toBe(true)
  })
})
