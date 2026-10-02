import { describe, expect, it } from 'vitest'
import { filePathToTree } from '../src/tree'

describe('file path collection values', () => {
  it.each(['a/a', 'src/components/src/index.ts', 'x/x/x'])('retains the full prefix for every segment of %s', (path) => {
    const tree = filePathToTree([path])
    const parts = path.split('/')
    const expected = parts.map((_, index) => parts.slice(0, index + 1).join('/'))
    expect(tree.getValues()).toEqual(expected)
    expect(new Set(tree.getValues()).size).toBe(parts.length)
    expected.forEach((value, index) => {
      const indexPath = tree.getIndexPath(value)!
      expect(tree.at(indexPath)?.value).toBe(value)
      expect(tree.findNode(value)?.label).toBe(parts[index])
      expect(tree.getValuePath(indexPath)).toEqual(expected.slice(0, index + 1))
    })
  })

  it('retains distinct repeated names under shared parents in traversal order', () => {
    const tree = filePathToTree(['a/b/a', 'a/b/b', 'a/b/a/x'])
    expect(tree.getValues()).toEqual(['a', 'a/b', 'a/b/a', 'a/b/a/x', 'a/b/b'])
    expect(tree.rootNode.children?.[0].children?.[0].children?.map(node => node.value)).toEqual(['a/b/a', 'a/b/b'])
  })

  it('deduplicates identical paths without mutating the input array', () => {
    const paths = ['a/b', 'a/c', 'a/b']
    const before = [...paths]
    const tree = filePathToTree(paths)
    expect(tree.getValues()).toEqual(['a', 'a/b', 'a/c'])
    expect(paths).toEqual(before)
  })

  it.each([
    { paths: [], values: [] },
    { paths: [''], values: [''] },
    { paths: ['/a'], values: ['', '/a'] },
    { paths: ['a/'], values: ['a', 'a/'] },
  ])('preserves root and empty-segment conventions for $paths', ({ paths, values }) => {
    const tree = filePathToTree(paths)
    expect(tree.rootNode.value).toBe('ROOT')
    expect(tree.rootNode.label).toBe('')
    expect(tree.getValues()).toEqual(values)
  })

  it('keeps first-seen sibling insertion order', () => {
    const tree = filePathToTree(['z/y', 'a/x', 'z/x'])
    expect(tree.getValues()).toEqual(['z', 'z/y', 'z/x', 'a', 'a/x'])
  })

  it('round-trips every prefix in a generated repeated-segment trie', () => {
    const paths: string[] = []
    let level = ['']
    for (let depth = 1; depth <= 4; depth++) {
      level = level.flatMap(prefix => ['a', 'b'].map(part => prefix ? `${prefix}/${part}` : part))
      paths.push(...level)
    }
    const tree = filePathToTree(paths)
    const values = tree.getValues()
    expect(values).toEqual([...paths].sort())
    expect(new Set(values).size).toBe(paths.length)
    for (const value of paths) {
      const indexPath = tree.getIndexPath(value)!
      expect(tree.at(indexPath)?.value).toBe(value)
      expect(tree.getValuePath(indexPath).at(-1)).toBe(value)
    }
  })
})
