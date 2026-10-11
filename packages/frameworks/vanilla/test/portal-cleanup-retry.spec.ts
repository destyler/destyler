import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPortal } from '../src/components/portal'

let reentryId = 0

afterEach(() => {
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

function fixture() {
  const parent = document.createElement('main')
  const before = document.createElement('i')
  const node = document.createElement('span')
  const after = document.createElement('b')
  parent.append(before, node, after)
  document.body.append(parent)
  return { parent, before, node, after }
}

function anchorIn(parent: Node): Comment {
  return Array.from(parent.childNodes).find(node => node.nodeType === Node.COMMENT_NODE) as Comment
}

function expectRestored(value: ReturnType<typeof fixture>) {
  expect(Array.from(value.parent.childNodes)).toEqual([value.before, value.node, value.after])
}

describe('vanilla portal cleanup recovery', () => {
  it('allows explicit unmount after a real hierarchy error without revisiting a restored target child', () => {
    const first = document.createElement('span')
    document.body.append(first)
    const second = fixture()
    const portal = createPortal([first, second.node])
    portal.mount()
    second.node.append(second.parent)
    expect(() => portal.unmount()).toThrow()
    expect(first.parentNode).toBe(document.body)
    document.body.append(second.parent)
    portal.unmount()
    expect(Array.from(document.body.childNodes)).toEqual([first, second.parent])
    expectRestored(second)
    portal.unmount()
    expect(first.parentNode).toBe(document.body)
  })

  it('retains the returned disposer across a real hierarchy failure', () => {
    const value = fixture()
    const portal = createPortal(value.node)
    const release = portal.mount()
    value.node.append(value.parent)
    expect(release).toThrow()
    document.body.append(value.parent)
    expect(portal.mount()).toBe(release)
    release()
    expectRestored(value)
    release()
    expectRestored(value)
  })

  it('releases anchors without reclaiming a child moved externally after failure', () => {
    const value = fixture()
    const external = document.createElement('section')
    document.body.append(external)
    const portal = createPortal(value.node)
    const release = portal.mount()
    value.node.append(value.parent)
    expect(release).toThrow()
    document.body.append(value.parent)
    external.append(value.node)
    portal.unmount()
    expect(Array.from(value.parent.childNodes)).toEqual([value.before, value.after])
    expect(Array.from(external.childNodes)).toEqual([value.node])
    release()
    expect(value.node.parentNode).toBe(external)
  })

  it('rethrows the exact cleanup error and retries unfinished nodes only', () => {
    const first = fixture()
    const second = fixture()
    const portal = createPortal([first.node, second.node])
    const release = portal.mount()
    const failure = new Error('restore failed')
    const replace = vi.spyOn(anchorIn(second.parent), 'replaceWith').mockImplementationOnce(() => {
      throw failure
    })
    let caught: unknown
    try {
      release()
    }
    catch (error) {
      caught = error
    }
    expect(caught).toBe(failure)
    expectRestored(first)
    expect(second.node.parentNode).toBe(document.body)
    release()
    expect(replace).toHaveBeenCalledTimes(2)
    expectRestored(first)
    expectRestored(second)
  })

  it('retries anchor removal without removing a child already restored to the target', () => {
    const node = document.createElement('span')
    document.body.append(node)
    const portal = createPortal(node)
    const release = portal.mount()
    const anchor = anchorIn(document.body)
    const failure = new Error('anchor removal failed')
    const remove = vi.spyOn(anchor, 'remove').mockImplementationOnce(() => {
      throw failure
    })
    let caught: unknown
    try {
      release()
    }
    catch (error) {
      caught = error
    }
    expect(caught).toBe(failure)
    expect(Array.from(document.body.childNodes)).toEqual([node])
    portal.unmount()
    expect(remove).toHaveBeenCalledTimes(2)
    expect(Array.from(document.body.childNodes)).toEqual([node])
    release()
    expect(remove).toHaveBeenCalledTimes(2)
  })

  it('preserves a mount error when rollback succeeds', () => {
    const first = fixture()
    const second = fixture()
    const target = document.createElement('section')
    document.body.append(target)
    const append = target.appendChild.bind(target)
    const mountError = new Error('mount failed')
    vi.spyOn(target, 'appendChild').mockImplementation((node) => {
      if (node === second.node)
        throw mountError
      return append(node)
    })
    let caught: unknown
    try {
      createPortal([first.node, second.node], { container: target }).mount()
    }
    catch (error) {
      caught = error
    }
    expect(caught).toBe(mountError)
    expectRestored(first)
    expectRestored(second)
    expect(target.childNodes.length).toBe(0)
  })

  it('preserves rollback-error precedence and leaves explicit unmount available', () => {
    const first = fixture()
    const second = fixture()
    const target = document.createElement('section')
    document.body.append(target)
    const append = target.appendChild.bind(target)
    const mountError = new Error('mount failed')
    const cleanupError = new Error('rollback failed')
    vi.spyOn(target, 'appendChild').mockImplementation((node) => {
      if (node === second.node)
        throw mountError
      vi.spyOn(anchorIn(first.parent), 'replaceWith').mockImplementationOnce(() => {
        throw cleanupError
      })
      return append(node)
    })
    const portal = createPortal([first.node, second.node], { container: target })
    let caught: unknown
    try {
      portal.mount()
    }
    catch (error) {
      caught = error
    }
    expect(caught).toBe(cleanupError)
    portal.unmount()
    expectRestored(first)
    expectRestored(second)
    expect(target.childNodes.length).toBe(0)
  })

  it('stops mounting when append synchronously completes unmount', () => {
    const first = fixture()
    const second = fixture()
    const target = document.createElement('section')
    document.body.append(target)
    const append = target.appendChild.bind(target)
    const portal = createPortal([first.node, second.node], { container: target })
    const appends = vi.spyOn(target, 'appendChild').mockImplementation((node) => {
      const result = append(node)
      portal.unmount()
      return result
    })
    const release = portal.mount()
    expect(appends).toHaveBeenCalledTimes(1)
    expectRestored(first)
    expectRestored(second)
    release()
    expect(target.childNodes.length).toBe(0)
  })

  it('does not automatically retry a cleanup failure propagated through append', () => {
    const first = fixture()
    const second = fixture()
    const target = document.createElement('section')
    document.body.append(target)
    const append = target.appendChild.bind(target)
    const portal = createPortal([first.node, second.node], { container: target })
    const failure = new Error('nested cleanup failed')
    let attempts = 0
    vi.spyOn(target, 'appendChild').mockImplementation((node) => {
      const result = append(node)
      vi.spyOn(anchorIn(first.parent), 'replaceWith').mockImplementationOnce(() => {
        attempts++
        throw failure
      })
      portal.unmount()
      return result
    })
    let caught: unknown
    try {
      portal.mount()
    }
    catch (error) {
      caught = error
    }
    expect(caught).toBe(failure)
    expect(attempts).toBe(1)
    expect(first.node.parentNode).toBe(target)
    portal.unmount()
    expectRestored(first)
    expectRestored(second)
    expect(target.childNodes.length).toBe(0)
  })

  it('ignores recursive unmount while the same cleanup is running', () => {
    const value = fixture()
    const portal = createPortal(value.node)
    const release = portal.mount()
    const anchor = anchorIn(value.parent)
    const replace = anchor.replaceWith.bind(anchor)
    const restores = vi.spyOn(anchor, 'replaceWith').mockImplementation((...nodes) => {
      portal.unmount()
      release()
      replace(...nodes)
    })
    release()
    expect(restores).toHaveBeenCalledTimes(1)
    expectRestored(value)
  })

  it('keeps the newer mount created synchronously during an earlier append', () => {
    let onConnect: (() => void) | undefined
    class ReentryNode extends HTMLElement {
      connectedCallback() { onConnect?.() }
    }
    const name = `portal-append-reentry-${reentryId++}`
    customElements.define(name, ReentryNode)
    const first = fixture()
    const custom = document.createElement(name)
    first.node.replaceWith(custom)
    const second = fixture()
    const portal = createPortal([custom, second.node])
    let newer: (() => void) | undefined
    onConnect = () => {
      onConnect = undefined
      portal.unmount()
      newer = portal.mount()
    }
    const older = portal.mount()
    expect(newer).toBeTypeOf('function')
    expect(portal.mount()).toBe(newer)
    older()
    expect(custom.parentNode).toBe(document.body)
    expect(second.node.parentNode).toBe(document.body)
    portal.unmount()
    expect(Array.from(first.parent.childNodes)).toEqual([first.before, custom, first.after])
    expectRestored(second)
    expect(Array.from(document.body.childNodes)).toEqual([first.parent, second.parent])
  })

  it.each(['before', 'after'] as const)('preserves a newer mount that completes %s the older cleanup', (completion) => {
    let onConnect: (() => void) | undefined
    class ReentryNode extends HTMLElement {
      connectedCallback() { onConnect?.() }
    }
    const name = `portal-cleanup-order-${completion}-${reentryId++}`
    customElements.define(name, ReentryNode)
    const first = fixture()
    const custom = document.createElement(name)
    first.node.replaceWith(custom)
    const second = fixture()
    const portal = createPortal([custom, second.node])
    const release = portal.mount()
    let newer: (() => void) | undefined
    onConnect = () => {
      onConnect = undefined
      newer = portal.mount()
      if (completion === 'before')
        newer()
    }
    release()
    expect(newer).toBeTypeOf('function')
    expect(second.node.parentNode).toBe(document.body)
    expect(Array.from(second.parent.childNodes)).toEqual([second.before, second.after])
    if (completion === 'after') {
      expect(custom.parentNode).toBe(document.body)
      expect(portal.mount()).toBe(newer)
      newer!()
    }
    expect(Array.from(first.parent.childNodes)).toEqual([first.before, custom, first.after])
    expect(Array.from(document.body.childNodes)).toEqual([first.parent, second.parent, second.node])
    release()
    portal.unmount()
    expect(second.node.parentNode).toBe(document.body)
  })

  it.each(['before', 'after', 'during'] as const)('keeps the newer owner when its cleanup completes %s the older retry', (completion) => {
    const first = fixture()
    const second = fixture()
    const portal = createPortal([first.node, second.node])
    const older = portal.mount()
    const anchor = anchorIn(first.parent)
    const replace = anchor.replaceWith.bind(anchor)
    const failure = new Error('older cleanup failed after reentry')
    let newer: (() => void) | undefined
    vi.spyOn(anchor, 'replaceWith').mockImplementationOnce((...nodes) => {
      replace(...nodes)
      newer = portal.mount()
      if (completion === 'during')
        newer()
      throw failure
    })
    let caught: unknown
    try {
      older()
    }
    catch (error) {
      caught = error
    }
    expect(caught).toBe(failure)
    expect(newer).toBeTypeOf('function')
    expect(second.node.parentNode).toBe(document.body)
    if (completion !== 'during')
      expect(portal.mount()).toBe(newer)
    if (completion === 'before')
      portal.unmount()
    older()
    if (completion === 'after') {
      expect(first.node.parentNode).toBe(document.body)
      expect(portal.mount()).toBe(newer)
      portal.unmount()
    }
    expectRestored(first)
    expect(Array.from(second.parent.childNodes)).toEqual([second.before, second.after])
    expect(Array.from(document.body.childNodes)).toEqual([first.parent, second.parent, second.node])
    older()
    portal.unmount()
    expect(second.node.parentNode).toBe(document.body)
  })
})
