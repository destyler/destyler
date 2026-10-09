import { afterEach, describe, expect, it } from 'vitest'
import { Portal } from '../index'
import { createPortal } from '../src/components/portal'

afterEach(() => document.body.replaceChildren())

function elements() {
  const parent = document.createElement('main')
  const before = document.createElement('i')
  const node = document.createElement('span')
  const after = document.createElement('b')
  parent.append(before, node, after)
  document.body.append(parent)
  return { parent, before, node, after }
}

describe('vanilla portal lifetimes', () => {
  it('preserves mount and unmount through a transparent consumer proxy', () => {
    const { parent, before, node, after } = elements()
    const portal = new Proxy(createPortal(node), {})
    const cleanup = portal.mount()
    expect(node.parentNode).toBe(document.body)
    portal.unmount()
    expect(Array.from(parent.childNodes)).toEqual([before, node, after])
    const current = portal.mount()
    cleanup()
    expect(node.parentNode).toBe(document.body)
    current()
    expect(Array.from(parent.childNodes)).toEqual([before, node, after])
  })

  it('keeps a public subclass cleanup member independent from mount cleanup', () => {
    let calls = 0
    class ApplicationPortal extends Portal {
      cleanup = () => { calls++ }
    }
    const { parent, before, node, after } = elements()
    const portal = new ApplicationPortal(node)
    const applicationCleanup = portal.cleanup
    const first = portal.mount()
    expect(node.parentNode).toBe(document.body)
    expect(portal.mount()).toBe(first)
    expect(portal.cleanup).toBe(applicationCleanup)
    portal.unmount()
    expect(Array.from(parent.childNodes)).toEqual([before, node, after])
    const second = portal.mount()
    first()
    expect(node.parentNode).toBe(document.body)
    second()
    second()
    expect(Array.from(parent.childNodes)).toEqual([before, node, after])
    expect(calls).toBe(0)
    portal.cleanup()
    expect(calls).toBe(1)
  })

  it('rolls back earlier moves and every anchor if a later append rejects a hierarchy cycle', () => {
    const first = elements()
    const second = elements()
    const target = document.createElement('section')
    second.node.append(target)
    const portal = createPortal([first.node, second.node], { container: target })
    expect(() => portal.mount()).toThrow()
    expect(Array.from(first.parent.childNodes)).toEqual([first.before, first.node, first.after])
    expect(Array.from(second.parent.childNodes)).toEqual([second.before, second.node, second.after])
    portal.unmount()
    expect(first.node.parentNode).toBe(first.parent)
    second.parent.append(target)
    const cleanup = portal.mount()
    cleanup()
    expect(first.node.parentNode).toBe(first.parent)
    expect(second.node.parentNode).toBe(second.parent)
  })

  it('restores adjacent nodes even when the input order differs from the DOM', () => {
    const { parent, before, node, after } = elements()
    const cleanup = createPortal([after, node]).mount()
    cleanup()
    expect(Array.from(parent.children)).toEqual([before, node, after])
    expect(parent.childNodes.length).toBe(3)
  })

  it('does not reclaim removed nodes or leave internal anchors behind', () => {
    const { parent, node } = elements()
    const cleanup = createPortal(node).mount()
    node.remove()
    cleanup()
    expect(node.parentNode).toBeNull()
    expect(parent.childNodes.length).toBe(2)
  })

  it('ignores an old cleanup after a new mount has started', () => {
    const { parent, node } = elements()
    const portal = createPortal(node)
    const previous = portal.mount()
    previous()
    const current = portal.mount()
    previous()
    expect(node.parentNode).toBe(document.body)
    current()
    expect(node.parentNode).toBe(parent)
    expect(parent.childNodes.length).toBe(3)
  })

  it('restores children to an original DocumentFragment and removes all anchors', () => {
    const parent = document.createDocumentFragment()
    const node = document.createElement('span')
    const sibling = document.createElement('b')
    parent.append(node, sibling)
    const cleanup = createPortal(node).mount()
    cleanup()
    expect(Array.from(parent.childNodes)).toEqual([node, sibling])
  })

  it('restores each child to its own parent and sibling position', () => {
    const first = elements()
    const second = elements()
    const portal = createPortal([first.node, second.node])
    const cleanup = portal.mount()
    expect(first.node.parentNode).toBe(document.body)
    expect(second.node.parentNode).toBe(document.body)
    cleanup()
    expect(Array.from(first.parent.children)).toEqual([first.before, first.node, first.after])
    expect(Array.from(second.parent.children)).toEqual([second.before, second.node, second.after])
  })

  it('restores adjacent portal children in their original order', () => {
    const { parent, before, node, after } = elements()
    const cleanup = createPortal([node, after]).mount()
    cleanup()
    expect(Array.from(parent.children)).toEqual([before, node, after])
  })

  it('does not overwrite the original location on a repeated mount', () => {
    const { parent, before, node, after } = elements()
    const portal = createPortal(node)
    portal.mount()
    const cleanup = portal.mount()
    cleanup()
    expect(Array.from(parent.children)).toEqual([before, node, after])
  })

  it('does not unmount an element when mount was disabled or never called', () => {
    const { parent, node } = elements()
    const disabled = createPortal(node, { disabled: true })
    disabled.mount()
    disabled.unmount()
    expect(node.parentNode).toBe(parent)
    createPortal(node).unmount()
    expect(node.parentNode).toBe(parent)
  })

  it('does not steal nodes moved to an external owner before cleanup', () => {
    const { node } = elements()
    const external = document.createElement('section')
    document.body.append(external)
    const cleanup = createPortal(node).mount()
    external.append(node)
    cleanup()
    expect(node.parentNode).toBe(external)
  })

  it('removes originally detached nodes and allows a later fresh mount', () => {
    const node = document.createElement('span')
    const portal = createPortal(node)
    const cleanup = portal.mount()
    cleanup()
    expect(node.parentNode).toBeNull()
    const parent = document.createElement('main')
    parent.append(node)
    document.body.append(parent)
    const nextCleanup = portal.mount()
    nextCleanup()
    expect(node.parentNode).toBe(parent)
    parent.removeChild(node)
    cleanup()
    expect(node.parentNode).toBeNull()
  })
})
