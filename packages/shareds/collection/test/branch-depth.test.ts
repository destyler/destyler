import { describe, expect, it } from 'vitest'
import { TreeCollection } from '../src/tree'

interface Node {
  value: string
  disabled?: boolean
  children?: Node[]
}

const root: Node = {
  value: 'ROOT',
  children: [
    { value: 'a', children: [{ value: 'a1', children: [{ value: 'leaf' }] }, { value: 'a2' }] },
    { value: 'b', disabled: true, children: [{ value: 'b1' }] },
    { value: 'c' },
  ],
}
const tree = new TreeCollection({ rootNode: root })

describe('tree branch depth filtering', () => {
  it.each([
    { depth: 0, expected: [] },
    { depth: 1, expected: ['a', 'b'] },
    { depth: 2, expected: ['a1'] },
    { depth: 3, expected: [] },
    { depth: 99, expected: [] },
  ])('returns the exact non-root branch set at depth $depth', ({ depth, expected }) => {
    expect(tree.getBranchValues(undefined, { depth })).toEqual(expected)
  })

  it('preserves unfiltered traversal order, including disabled branches', () => {
    expect(tree.getBranchValues()).toEqual(['a', 'a1', 'b'])
  })

  it.each([
    { depth: undefined, expected: ['a1'] },
    { depth: 0, expected: [] },
    { depth: 1, expected: ['a1'] },
  ])('treats the supplied subtree as depth zero ($depth)', ({ depth, expected }) => {
    expect(tree.getBranchValues(tree.findNode('a'), { depth })).toEqual(expected)
  })

  it('retains the first remaining depth match after skipping a subtree', () => {
    expect(tree.getBranchValues(undefined, { depth: 1, skip: ({ value }) => value === 'a' })).toEqual(['b'])
  })

  it('preserves root-skipping behavior', () => {
    expect(tree.getBranchValues(undefined, { depth: 1, skip: ({ value }) => value === 'ROOT' })).toEqual([])
  })

  it('returns no branches for empty trees or leaf subtrees', () => {
    expect(new TreeCollection({ rootNode: { value: 'ROOT' } }).getBranchValues()).toEqual([])
    expect(tree.getBranchValues(tree.findNode('c'), { depth: 1 })).toEqual([])
  })

  it('does not mutate the supplied tree', () => {
    const before = JSON.stringify(root)
    tree.getBranchValues(undefined, { depth: 1 })
    expect(tree.rootNode).toBe(root)
    expect(JSON.stringify(root)).toBe(before)
  })

  it('matches raw preorder branch sets at every fixture depth', () => {
    const branches: Array<{ value: string, depth: number }> = []
    function collect(node: Node, depth: number) {
      if (depth > 0 && node.children?.length)
        branches.push({ value: node.value, depth })
      node.children?.forEach(child => collect(child, depth + 1))
    }
    collect(root, 0)
    for (let depth = 0; depth <= 4; depth++) {
      const expected = branches.filter(node => node.depth === depth).map(node => node.value)
      expect(tree.getBranchValues(undefined, { depth })).toEqual(expected)
    }
  })
})
