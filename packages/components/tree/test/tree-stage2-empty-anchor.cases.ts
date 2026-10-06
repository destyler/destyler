import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

interface Node {
  value: string
  label: string
  children?: Node[]
}

const normalize = createNormalizer(props => props)
const fixtures: { service: ReturnType<typeof machine>, host: HTMLElement }[] = []
let sequence = 0

export function setupEmptyAnchor(options: Partial<UserDefinedContext> = {}, emptyFirst = false) {
  const emptyLeaf = { value: '', label: 'Empty leaf' }
  const firstLeaf = { value: 'first', label: 'First leaf' }
  const lastLeaf = { value: 'last', label: 'Last leaf' }
  const rootNode = {
    value: 'hidden-root-sentinel',
    label: 'Hidden root',
    children: emptyFirst ? [emptyLeaf, firstLeaf, lastLeaf] : [firstLeaf, emptyLeaf, lastLeaf],
  }
  const nodes = collection<Node>({ rootNode })
  const onSelectionChange = vi.fn()
  const service = machine({
    id: `empty-anchor-${++sequence}`,
    collection: nodes,
    selectionMode: 'multiple',
    onSelectionChange,
    ...options,
  })
  const api = () => connect(service.getState(), service.send, normalize)
  const host = document.createElement('div')
  const elements = new Map<string, HTMLElement>()
  nodes.visit({
    onEnter(node, indexPath) {
      const element = document.createElement('div')
      const props = () => api().getItemProps({ node, indexPath })
      const initial = props()
      element.id = initial.id!
      element.tabIndex = -1
      element.textContent = node.label
      element.addEventListener('click', event => props().onClick(event))
      element.addEventListener('focus', event => props().onFocus(event))
      elements.set(node.value, element)
      host.append(element)
    },
  })
  document.body.append(host)
  fixtures.push({ service, host })
  service.start()
  const shiftClick = (value: string) => elements.get(value)!.dispatchEvent(new MouseEvent('click', { shiftKey: true, bubbles: true, cancelable: true }))
  return { service, api, nodes, rootNode, emptyLeaf, elements, shiftClick, onSelectionChange }
}

afterEach(() => {
  for (const { service, host } of fixtures.splice(0)) {
    service.stop()
    host.remove()
  }
})

describe('Tree empty-string leaf range anchor', () => {
  it('keeps a valid empty leaf distinct from the nonempty hidden root', () => {
    const f = setupEmptyAnchor()
    expect(f.nodes.isRootNode(f.rootNode)).toBe(true)
    expect(f.nodes.isRootNode(f.emptyLeaf)).toBe(false)
    expect(f.nodes.findNode('')).toBe(f.emptyLeaf)
    expect(f.nodes.getNodeValue(f.emptyLeaf)).toBe('')
    expect(f.nodes.getIndexPath('')).toEqual([1])
    expect(f.nodes.getValue([1])).toBe('')
    expect(f.nodes.getValuePath([1])).toEqual([''])
    expect(f.nodes.getValues()).toEqual(['first', '', 'last'])
    expect([...f.elements.keys()]).toEqual(['first', '', 'last'])
    expect(f.api().getNodeState({ node: f.emptyLeaf, indexPath: [1] }).value).toBe('')
    expect(f.elements.has(f.rootNode.value)).toBe(false)
  })

  it('supports ordinary click selection and programmatic focus for the empty leaf', () => {
    const f = setupEmptyAnchor()
    f.elements.get('')!.click()
    expect(f.api().selectedValue).toEqual([''])
    expect(f.onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: [''], focusedValue: null })
    f.api().focus('')
    expect(document.activeElement).toBe(f.elements.get(''))
    expect(f.service.state.context.focusedValue).toBe('')
  })

  it.each([false, true])('contracts the coincident empty anchor instead of substituting the first node (controlled=%s)', (controlled) => {
    const f = setupEmptyAnchor(controlled ? { selectedValue: ['', 'last'] } : { defaultSelectedValue: ['', 'last'] })
    f.shiftClick('')
    expect(f.onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: [''], focusedValue: null })
    expect(f.api().selectedValue).toEqual(controlled ? ['', 'last'] : [''])
    expect(f.api().expandedValue).toEqual([])
  })

  it('keeps repeated Shift-clicks on a singleton empty anchor as no-ops', () => {
    const f = setupEmptyAnchor({ defaultSelectedValue: [''] })
    f.shiftClick('')
    f.shiftClick('')
    expect(f.api().selectedValue).toEqual([''])
    expect(f.onSelectionChange).not.toHaveBeenCalled()
  })

  it.each(['accept', 'veto', 'delay'] as const)('retains controlled %s for an empty anchor contraction', (mode) => {
    const f = setupEmptyAnchor({ selectedValue: ['', 'last'] })
    if (mode === 'accept')
      f.onSelectionChange.mockImplementation(({ selectedValue }) => f.service.setContext({ selectedValue }))
    f.shiftClick('')
    expect(f.onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: [''], focusedValue: null })
    expect(f.api().selectedValue).toEqual(mode === 'accept' ? [''] : ['', 'last'])
    if (mode === 'delay') {
      f.service.setContext({ selectedValue: [''] })
      expect(f.api().selectedValue).toEqual([''])
      expect(f.onSelectionChange).toHaveBeenCalledTimes(1)
    }
  })

  for (const controlled of [false, true]) {
    it.each([false, true])(`falls back to the first leaf for an empty selected array, controlled=${controlled}, emptyFirst=%s`, (emptyFirst) => {
      const f = setupEmptyAnchor(controlled ? { selectedValue: [] } : { defaultSelectedValue: [] }, emptyFirst)
      const first = emptyFirst ? '' : 'first'
      f.shiftClick(first)
      expect(f.onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: [first], focusedValue: null })
      expect(f.api().selectedValue).toEqual(controlled ? [] : [first])
    })
  }

  it.each([
    { anchor: '', target: 'last', expected: ['', 'last'] },
    { anchor: '', target: 'first', expected: ['', 'first'] },
    { anchor: 'first', target: 'last', expected: ['first', 'last', ''] },
    { anchor: 'last', target: 'first', expected: ['last', 'first', ''] },
  ])('preserves exact endpoint-first range order from $anchor to $target', ({ anchor, target, expected }) => {
    const f = setupEmptyAnchor({ defaultSelectedValue: [anchor] })
    f.shiftClick(target)
    expect(f.api().selectedValue).toEqual(expected)
    expect(f.onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: expected, focusedValue: null })
  })
})
