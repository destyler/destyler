import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

interface Node {
  id: string
  name: string
  disabled?: boolean
  children?: Node[]
}

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  document.body.replaceChildren()
})

export const keyboardCases = [
  { key: 'ArrowRight', part: 'branch', expanded: false, event: 'BRANCH_NODE.ARROW_RIGHT' },
  { key: 'ArrowRight', part: 'branch', expanded: true, event: 'BRANCH_NODE.ARROW_RIGHT' },
  { key: 'ArrowLeft', part: 'branch', expanded: false, event: 'BRANCH_NODE.ARROW_LEFT' },
  { key: 'ArrowLeft', part: 'branch', expanded: true, event: 'BRANCH_NODE.ARROW_LEFT' },
  { key: 'ArrowLeft', part: 'item', expanded: false, event: 'NODE.ARROW_LEFT' },
  { key: 'Enter', part: 'branch', expanded: false, event: 'BRANCH_NODE.CLICK' },
  { key: ' ', part: 'branch', expanded: false, event: 'BRANCH_NODE.CLICK' },
  { key: 'Enter', part: 'item', expanded: false, event: 'NODE.CLICK' },
  { key: ' ', part: 'item', expanded: false, event: 'NODE.CLICK' },
  { key: '*', part: 'branch', expanded: false, event: 'SIBLINGS.EXPAND' },
  { key: '*', part: 'item', expanded: false, event: 'SIBLINGS.EXPAND' },
  { key: 'a', part: 'branch', expanded: false, event: 'SELECTED.ALL' },
  { key: 'a', part: 'item', expanded: false, event: 'SELECTED.ALL' },
] as const

export function setupKeyboardTree(part: 'branch' | 'item', disabled: boolean, expanded = false, context: Partial<UserDefinedContext> = {}) {
  const child = { id: 'child', name: 'Child' }
  const branch = { id: 'branch', name: 'Branch', disabled: part === 'branch' && disabled, children: [child] }
  const leaf = { id: 'leaf', name: 'Leaf', disabled: part === 'item' && disabled }
  const parent = { id: 'parent', name: 'Parent', children: [branch, leaf] }
  const nodes = collection<Node>({
    nodeToValue: node => node.id,
    nodeToString: node => node.name,
    rootNode: { id: 'root', name: 'Root', children: [parent] },
  })
  const onExpandedChange = vi.fn()
  const onSelectionChange = vi.fn()
  const service = machine({
    id: 'disabled-keyboard-tree',
    collection: nodes,
    selectionMode: 'multiple',
    defaultExpandedValue: expanded ? ['parent', 'branch'] : ['parent'],
    defaultSelectedValue: ['parent'],
    onExpandedChange,
    onSelectionChange,
    ...context,
  })
  services.push(service)
  service.start()
  const send = vi.fn(service.send)
  const api = connect(service.getState(), send, normalize)
  const root = document.createElement('div')
  root.addEventListener('keydown', api.getTreeProps().onKeyDown)
  document.body.append(root)

  function mount(node: Node, indexPath: number[]) {
    const props = nodes.isBranchNode(node)
      ? api.getBranchControlProps({ node, indexPath })
      : api.getItemProps({ node, indexPath })
    const element = document.createElement('div')
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith('on') && typeof value === 'function')
        element.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
      else if (value !== undefined && key !== 'style')
        element.setAttribute(key, String(value))
    }
    root.append(element)
    return element
  }

  const parentElement = mount(parent, [0])
  const branchElement = mount(branch, [0, 0])
  const childElement = mount(child, [0, 0, 0])
  const leafElement = mount(leaf, [0, 1])
  const node = part === 'branch' ? branchElement : leafElement
  node.focus()
  expect(document.activeElement).toBe(node)
  expect(node.hasAttribute('data-disabled')).toBe(disabled)
  if (disabled)
    expect(node.dataset.disabled).toBe('')
  send.mockClear()
  onExpandedChange.mockClear()
  onSelectionChange.mockClear()
  return { service, send, node, parentElement, childElement, leafElement, onExpandedChange, onSelectionChange }
}

export function verifyKey(fixture: ReturnType<typeof setupKeyboardTree>, c: typeof keyboardCases[number], disabled: boolean) {
  const { service, send, node, parentElement, childElement, onExpandedChange, onSelectionChange } = fixture
  if (disabled) {
    expect(send).not.toHaveBeenCalled()
    expect(service.state.context.expandedValue).toEqual(c.expanded ? ['parent', 'branch'] : ['parent'])
    expect(service.state.context.selectedValue).toEqual(['parent'])
    expect(document.activeElement).toBe(node)
    expect(onExpandedChange).not.toHaveBeenCalled()
    expect(onSelectionChange).not.toHaveBeenCalled()
    return
  }
  expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: c.event }))
  if (c.key === 'Enter' || c.key === ' ') {
    expect(service.state.context.selectedValue).toEqual([c.part === 'branch' ? 'branch' : 'leaf'])
    expect(onSelectionChange).toHaveBeenCalledTimes(1)
  }
  if (c.part === 'branch' && ['Enter', ' ', 'ArrowRight'].includes(c.key))
    expect(service.state.context.expandedValue).toContain('branch')
  if (c.key === '*')
    expect(service.state.context.expandedValue).toContain('branch')
  if (c.key === 'ArrowLeft') {
    expect(service.state.context.expandedValue).not.toContain('branch')
    expect(document.activeElement).toBe(c.expanded ? node : parentElement)
  }
  if (c.key === 'ArrowRight' && c.expanded)
    expect(document.activeElement).toBe(childElement)
  if (c.key === 'a') {
    expect(service.state.context.selectedValue).toEqual(['parent', 'branch', 'child', 'leaf'])
    expect(send).toHaveBeenCalledWith({ type: 'SELECTED.ALL', moveFocus: true })
  }
}

describe.each([false, true])('connected tree keyboard guards (disabled=%s)', (disabled) => {
  describe.each([false, true])('nested event target=%s', (nested) => {
    it.each(keyboardCases)('$part $key (expanded=$expanded)', (c) => {
      const fixture = setupKeyboardTree(c.part, disabled, c.expanded)
      const target = nested ? document.createElement('span') : fixture.node
      if (nested)
        fixture.node.append(target)
      const event = new KeyboardEvent('keydown', { key: c.key, metaKey: c.key === 'a', bubbles: true, cancelable: true })
      target.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(!disabled)
      verifyKey(fixture, c, disabled)
    })
  })
})

describe('keyboard guard boundaries', () => {
  it.each(['ArrowDown', 'ArrowUp', 'Home', 'End'])('keeps %s navigation available on a disabled node', (key) => {
    const { node, send } = setupKeyboardTree('branch', true)
    node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      type: { ArrowDown: 'NODE.ARROW_DOWN', ArrowUp: 'NODE.ARROW_UP', Home: 'NODE.HOME', End: 'NODE.END' }[key],
    }))
  })

  it.each(['branch', 'item'] as const)('blocks disabled %s changes even when both values are controlled', (part) => {
    const { node, send, service, onExpandedChange, onSelectionChange } = setupKeyboardTree(part, true, true, {
      expandedValue: ['parent', 'branch'],
      selectedValue: ['parent'],
    })
    for (const key of ['ArrowLeft', 'ArrowRight', 'Enter', ' ', '*', 'a'])
      node.dispatchEvent(new KeyboardEvent('keydown', { key, metaKey: key === 'a', bubbles: true, cancelable: true }))
    expect(send).not.toHaveBeenCalled()
    expect(service.state.context.expandedValue).toEqual(['parent', 'branch'])
    expect(service.state.context.selectedValue).toEqual(['parent'])
    expect(onExpandedChange).not.toHaveBeenCalled()
    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  it.each([false, true])('keeps disabled pointer handlers inert (branch=%s)', (branch) => {
    const { node, send } = setupKeyboardTree(branch ? 'branch' : 'item', true)
    node.click()
    expect(send).not.toHaveBeenCalled()
  })
})
