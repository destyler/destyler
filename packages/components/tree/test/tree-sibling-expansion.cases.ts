import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

interface Node {
  id: string
  name: string
  children?: Node[]
}

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []
const initialExpanded = ['ancestor', 'other', 'deep']
const siblingExpanded = [...initialExpanded, 'nested', 'sibling']

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  document.body.replaceChildren()
})

export function setupSiblingTree(controlled = false, initial = initialExpanded) {
  const rootNode: Node = {
    id: 'root',
    name: 'Root',
    children: [
      {
        id: 'ancestor',
        name: 'Ancestor',
        children: [
          { id: 'nested', name: 'Nested', children: [{ id: 'deep', name: 'Deep', children: [{ id: 'child', name: 'Child' }] }] },
          { id: 'sibling', name: 'Sibling', children: [{ id: 'sibling-child', name: 'Sibling child' }] },
          { id: 'leaf', name: 'Leaf' },
        ],
      },
      { id: 'other', name: 'Other', children: [{ id: 'other-child', name: 'Other child' }] },
      { id: 'closed', name: 'Closed', children: [{ id: 'closed-child', name: 'Closed child' }] },
      { id: 'root-leaf', name: 'Root leaf' },
    ],
  }
  const nodes = collection<Node>({ nodeToValue: node => node.id, nodeToString: node => node.name, rootNode })
  const onExpandedChange = vi.fn()
  const onSelectionChange = vi.fn()
  const service = machine({
    id: 'sibling-expansion-tree',
    collection: nodes,
    ...(controlled ? { expandedValue: [...initial] } : { defaultExpandedValue: [...initial] }),
    defaultSelectedValue: ['other-child'],
    onExpandedChange,
    onSelectionChange,
  })
  services.push(service)
  service.start()
  const api = () => connect(service.getState(), service.send, normalize)
  const tree = document.createElement('div')
  tree.setAttribute('role', 'tree')
  const controls = new Map<string, HTMLElement>()
  const contents = new Map<string, HTMLElement>()
  const branches = new Map<string, HTMLElement>()

  function mount(node: Node, indexPath: number[], parent: HTMLElement) {
    const isBranch = nodes.isBranchNode(node)
    const props = isBranch ? api().getBranchControlProps({ node, indexPath }) : api().getItemProps({ node, indexPath })
    const control = document.createElement('div')
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith('on') && typeof value === 'function')
        control.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
      else if (value !== undefined && key !== 'style')
        control.setAttribute(key, String(value))
    }
    control.textContent = node.name
    controls.set(node.id, control)
    if (!isBranch) {
      parent.append(control)
      return
    }
    const branch = document.createElement('div')
    branch.setAttribute('role', 'treeitem')
    const content = document.createElement('div')
    content.setAttribute('role', 'group')
    branches.set(node.id, branch)
    contents.set(node.id, content)
    branch.append(control, content)
    parent.append(branch)
    node.children?.forEach((child, index) => mount(child, [...indexPath, index], content))
  }
  rootNode.children?.forEach((node, index) => mount(node, [index], tree))
  document.body.append(tree)

  function render() {
    for (const [value, content] of contents) {
      const expanded = service.state.context.expandedValue?.includes(value) ?? false
      content.hidden = !expanded
      branches.get(value)!.setAttribute('aria-expanded', String(expanded))
    }
  }
  tree.addEventListener('keydown', (event) => {
    api().getTreeProps().onKeyDown(event)
    render()
  })
  render()
  return { service, onExpandedChange, onSelectionChange, controls, contents, branches, render }
}

export function verifySiblingExpansion(fixture: ReturnType<typeof setupSiblingTree>, focused: string) {
  expect(fixture.service.state.context.expandedValue).toEqual(siblingExpanded)
  expect(fixture.service.state.context.selectedValue).toEqual(['other-child'])
  expect(fixture.onSelectionChange).not.toHaveBeenCalled()
  for (const value of siblingExpanded) {
    expect(fixture.contents.get(value)!.hidden).toBe(false)
    expect(fixture.branches.get(value)!.getAttribute('aria-expanded')).toBe('true')
  }
  expect(fixture.contents.get('closed')!.hidden).toBe(true)
  expect(document.activeElement).toBe(fixture.controls.get(focused))
  expect(fixture.controls.get(focused)!.closest('[hidden]')).toBeNull()
}

describe.each([false, true])('sibling expansion (controlled=%s)', (controlled) => {
  it.each(['nested', 'sibling', 'leaf'])('expands only branch siblings from %s without losing open nodes', (focused) => {
    const fixture = setupSiblingTree(controlled)
    const { service, controls, onExpandedChange, render } = fixture
    const control = controls.get(focused)!
    control.focus()
    const label = document.createElement('span')
    control.append(label)
    for (let cycle = 0; cycle < 2; cycle++) {
      const event = new KeyboardEvent('keydown', { key: '*', bubbles: true, cancelable: true })
      label.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
      expect(onExpandedChange).toHaveBeenCalledTimes(1)
      expect(onExpandedChange).toHaveBeenCalledWith({ expandedValue: siblingExpanded, focusedValue: focused })
      if (controlled && cycle === 0) {
        expect(service.state.context.expandedValue).toEqual(initialExpanded)
        service.setContext({ expandedValue: siblingExpanded })
        render()
      }
      verifySiblingExpansion(fixture, focused)
    }
  })
})

describe('sibling expansion boundaries', () => {
  it('preserves existing order and adds each new branch once', () => {
    const { service, onExpandedChange } = setupSiblingTree(false, ['sibling', 'other', 'ancestor', 'deep'])
    service.send({ type: 'SIBLINGS.EXPAND', id: 'nested' })
    expect(service.state.context.expandedValue).toEqual(['sibling', 'other', 'ancestor', 'deep', 'nested'])
    service.send({ type: 'SIBLINGS.EXPAND', id: 'nested' })
    expect(onExpandedChange).toHaveBeenCalledTimes(1)
  })

  it('expands top-level branches without dropping expanded descendants or adding a leaf', () => {
    const { service } = setupSiblingTree()
    service.send({ type: 'SIBLINGS.EXPAND', id: 'root-leaf' })
    expect(service.state.context.expandedValue).toEqual([...initialExpanded, 'closed'])
  })

  it.each(['missing', 'other-child'])('does not request a change for %s with no branch siblings', (id) => {
    const { service, onExpandedChange } = setupSiblingTree()
    service.send({ type: 'SIBLINGS.EXPAND', id })
    expect(service.state.context.expandedValue).toEqual(initialExpanded)
    expect(onExpandedChange).not.toHaveBeenCalled()
  })

  it('uses the latest controlled value on each request, without mutating the parent array', () => {
    const { service, onExpandedChange } = setupSiblingTree(true)
    service.send({ type: 'SIBLINGS.EXPAND', id: 'nested' })
    expect(onExpandedChange).toHaveBeenLastCalledWith(expect.objectContaining({ expandedValue: siblingExpanded }))
    const parentValue = ['ancestor', 'closed']
    service.setContext({ expandedValue: parentValue })
    service.send({ type: 'SIBLINGS.EXPAND', id: 'nested' })
    expect(onExpandedChange).toHaveBeenLastCalledWith(expect.objectContaining({ expandedValue: ['ancestor', 'closed', 'nested', 'sibling'] }))
    expect(service.state.context.expandedValue).toEqual(parentValue)
    expect(parentValue).toEqual(['ancestor', 'closed'])
  })
})
