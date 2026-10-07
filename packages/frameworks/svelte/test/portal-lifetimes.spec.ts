import { afterEach, describe, expect, it } from 'vitest'
import { portal } from '../src/utils/portal'

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

describe('svelte portal lifetimes', () => {
  it('rolls back its inline anchor when initial target resolution throws', () => {
    const { parent, before, node, after } = elements()
    const error = new Error('root failed')
    expect(() => portal(node, {
      getRootNode: () => {
        throw error
      },
    })).toThrow(error)
    expect(Array.from(parent.childNodes)).toEqual([before, node, after])
  })

  it('rolls back its inline anchor if the initial append rejects a hierarchy cycle', () => {
    const { parent, before, node, after } = elements()
    expect(() => portal(node, { container: node })).toThrow()
    expect(Array.from(parent.childNodes)).toEqual([before, node, after])
  })

  it('preserves prior mount ownership when an update append throws', () => {
    const { parent, before, node, after } = elements()
    const action = portal(node)
    expect(() => action.update({ container: node })).toThrow()
    expect(node.parentNode).toBe(document.body)
    action.update({ disabled: true })
    expect(Array.from(parent.children)).toEqual([before, node, after])
    action.destroy()
  })

  it('keeps a stable inline position if the original following sibling is removed', () => {
    const { parent, before, node, after } = elements()
    const action = portal(node)
    after.remove()
    const last = document.createElement('strong')
    parent.append(last)
    action.update({ disabled: true })
    expect(Array.from(parent.children)).toEqual([before, node, last])
    action.destroy()
    expect(Array.from(parent.childNodes)).toEqual([before, last])
  })

  it('removes the inline anchor and portal node exactly once on destroy', () => {
    const { parent, before, node, after } = elements()
    const action = portal(node)
    action.destroy()
    action.destroy()
    expect(Array.from(parent.childNodes)).toEqual([before, after])
    expect(node.parentNode).toBeNull()
  })

  it('restores the inline location when an enabled action becomes disabled', () => {
    const { parent, before, node, after } = elements()
    const action = portal(node)
    action.update({ disabled: true })
    expect(Array.from(parent.children)).toEqual([before, node, after])
    action.update({ disabled: false })
    expect(node.parentNode).toBe(document.body)
    action.update({ disabled: true })
    expect(Array.from(parent.children)).toEqual([before, node, after])
    action.destroy()
  })

  it('supports initially disabled actions and later enabling and disabling', () => {
    const { parent, before, node, after } = elements()
    const action = portal(node, { disabled: true })
    expect(Array.from(parent.children)).toEqual([before, node, after])
    action.update({ disabled: false })
    expect(node.parentNode).toBe(document.body)
    action.update({ disabled: true })
    expect(Array.from(parent.children)).toEqual([before, node, after])
    action.destroy()
  })

  it('cannot reappend an action node after destruction', () => {
    const { node } = elements()
    const action = portal(node)
    action.destroy()
    action.update({})
    expect(node.parentNode).toBeNull()
  })

  it('retains iframe Document ownership through disabling, re-enabling and destruction', () => {
    const { parent, before, node, after } = elements()
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const doc = frame.contentDocument!
    const getRootNode = () => doc
    const action = portal(node, { getRootNode })
    try {
      expect(node.parentNode).toBe(doc.body)
      expect(node.ownerDocument).toBe(doc)

      action.update({ disabled: true, getRootNode })
      expect(Array.from(parent.children)).toEqual([before, node, after])
      expect(node.ownerDocument).toBe(document)
      expect(doc.body.childNodes.length).toBe(0)

      action.update({ getRootNode })
      expect(node.parentNode).toBe(doc.body)
      expect(node.ownerDocument).toBe(doc)

      action.destroy()
      action.destroy()
      action.update({ getRootNode })
      expect(node.parentNode).toBeNull()
      expect(Array.from(parent.childNodes)).toEqual([before, after])
      expect(doc.body.childNodes.length).toBe(0)
    }
    finally {
      action.destroy()
      frame.remove()
    }
  })
})
