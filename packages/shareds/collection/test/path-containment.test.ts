import { describe, expect, it } from 'vitest'
import { TreeCollection } from '../src/tree'

interface Node {
  value: string
  children: Node[]
}

function node(path: number[], depth: number): Node {
  return {
    value: JSON.stringify(path),
    children: depth > 0 ? [node([...path, 0], depth - 1), node([...path, 1], depth - 1)] : [],
  }
}

const tree = new TreeCollection({ rootNode: node([], 3) })

describe('tree index-path containment', () => {
  it.each([
    { parent: [], child: [], expected: true },
    { parent: [], child: [0, 1], expected: true },
    { parent: [0], child: [], expected: false },
    { parent: [0, 1], child: [0], expected: false },
    { parent: [0, 1, 1], child: [0, 1], expected: false },
    { parent: [0], child: [0], expected: true },
    { parent: [0], child: [0, 1], expected: true },
    { parent: [0, 1], child: [0, 1, 0], expected: true },
    { parent: [0], child: [1, 0], expected: false },
    { parent: [0, 1], child: [0, 0], expected: false },
    { parent: [1, 0], child: [0], expected: false },
  ])('$parent contains $child: $expected', ({ parent, child, expected }) => {
    expect(tree.contains(parent, child)).toBe(expected)
  })

  it('matches each actual node ancestor chain across all path pairs', () => {
    const paths = [[], ...tree.flatten().map(node => node.indexPath)]
    for (const child of paths) {
      const ancestors = Array.from({ length: child.length + 1 }, (_, depth) => JSON.stringify(child.slice(0, depth)))
      for (const parent of paths)
        expect(tree.contains(parent, child)).toBe(ancestors.includes(JSON.stringify(parent)))
    }
  })

  it('does not mutate either supplied path', () => {
    const parent = [0, 1]
    const child = [0, 1, 0]
    expect(tree.contains(parent, child)).toBe(true)
    expect(parent).toEqual([0, 1])
    expect(child).toEqual([0, 1, 0])
  })
})
