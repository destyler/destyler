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
})
