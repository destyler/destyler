import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

interface Node {
  id: string
  name: string
  disabled?: boolean
  unavailable?: boolean
  children?: Node[]
}

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

export const focusScenarios = [
  { name: 'collapsed root branch', expanded: [], expected: 'branch' },
  { name: 'collapsed nested branch', expanded: ['branch'], expected: 'nested' },
  { name: 'expanded nested branch', expanded: ['branch', 'nested'], expected: 'deep' },
  { name: 'hidden descendant marked expanded', expanded: ['nested'], expected: 'branch' },
] as const

export const lastNodeKeys = ['End', 'Meta+A', 'ArrowUp'] as const

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  document.body.replaceChildren()
})

export function setupLastNodeTree(expanded: readonly string[] = [], controlled = false, customRoot?: Node) {
  const rootNode = customRoot ?? {
    id: 'root',
    name: 'Root',
    children: [
      { id: 'start', name: 'Start' },
      {
        id: 'branch',
        name: 'Branch',
        children: [
          { id: 'child', name: 'Child' },
          {
            id: 'nested',
            name: 'Nested',
            children: [
              { id: 'deep', name: 'Deep' },
              { id: 'disabled-deep', name: 'Disabled deep', disabled: true },
              { id: 'unavailable-deep', name: 'Unavailable deep', unavailable: true },
            ],
          },
        ],
      },
      { id: 'disabled-root', name: 'Disabled root', disabled: true },
    ],
  }
  const nodes = collection<Node>({
    rootNode,
    nodeToValue: node => node.id,
    nodeToString: node => node.name,
    isNodeDisabled: node => !!(node.disabled || node.unavailable),
  })
  const onFocusChange = vi.fn()
  const onExpandedChange = vi.fn()
  const onSelectionChange = vi.fn()
  const service = machine({
    id: 'last-visible-tree',
    collection: nodes,
    selectionMode: 'multiple',
    ...(controlled
      ? { expandedValue: [...expanded], selectedValue: ['start'] }
      : { defaultExpandedValue: [...expanded], defaultSelectedValue: ['start'] }),
    onFocusChange,
    onExpandedChange,
    onSelectionChange,
  })
  services.push(service)
  service.start()
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  root.setAttribute('role', 'tree')
  const controls = new Map<string, HTMLElement>()
  const contents = new Map<string, HTMLElement>()

  function mount(node: Node, indexPath: number[], parent: HTMLElement) {
    const branch = nodes.isBranchNode(node)
    const props = branch ? api().getBranchControlProps({ node, indexPath }) : api().getItemProps({ node, indexPath })
    const control = document.createElement('div')
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith('on') && typeof value === 'function')
        control.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
      else if (value !== undefined && key !== 'style')
        control.setAttribute(key, String(value))
    }
    control.textContent = node.name
    controls.set(node.id, control)
    parent.append(control)
    if (branch) {
      const content = document.createElement('div')
      content.setAttribute('role', 'group')
      contents.set(node.id, content)
      parent.append(content)
      node.children?.forEach((child, index) => mount(child, [...indexPath, index], content))
    }
  }
  rootNode.children?.forEach((node, index) => mount(node, [index], root))
  document.body.append(root)
  root.addEventListener('keydown', event => api().getTreeProps().onKeyDown(event))

  function render() {
    for (const [value, content] of contents)
      content.hidden = !(service.state.context.expandedValue?.includes(value) ?? false)
  }
  function focusStart() {
    controls.get('start')?.focus()
    onFocusChange.mockClear()
  }
  render()
  focusStart()
  return { service, nodes, controls, contents, onFocusChange, onExpandedChange, onSelectionChange, render, focusStart }
}

export function pressLastNodeKey(target: HTMLElement, key: typeof lastNodeKeys[number]) {
  const event = new KeyboardEvent('keydown', { key: key === 'Meta+A' ? 'a' : key, metaKey: key === 'Meta+A', bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
}

export function verifyLastNode(fixture: ReturnType<typeof setupLastNodeTree>, expected: string, expanded: readonly string[]) {
  expect(fixture.service.state.context.focusedValue).toBe(expected)
  expect(document.activeElement).toBe(fixture.controls.get(expected))
  expect(fixture.controls.get(expected)!.closest('[hidden]')).toBeNull()
  expect(fixture.service.state.context.expandedValue).toEqual([...expanded])
  expect(fixture.onExpandedChange).not.toHaveBeenCalled()
}

describe.each([false, true])('last visible Tree node (controlled=%s)', (controlled) => {
  describe.each(focusScenarios)('$name', (scenario) => {
    it.each(lastNodeKeys)('%s targets the last visible enabled node repeatedly', (key) => {
      const fixture = setupLastNodeTree(scenario.expanded, controlled)
      for (let cycle = 0; cycle < 2; cycle++) {
        fixture.focusStart()
        pressLastNodeKey(fixture.controls.get('start')!, key)
        verifyLastNode(fixture, scenario.expected, scenario.expanded)
      }
      if (key === 'Meta+A') {
        expect(fixture.onSelectionChange).toHaveBeenCalledWith(expect.objectContaining({ selectedValue: expect.arrayContaining(['start', 'branch']) }))
        if (controlled)
          expect(fixture.service.state.context.selectedValue).toEqual(['start'])
        else
          expect(fixture.service.state.context.selectedValue).toEqual(expect.arrayContaining(['start', 'branch']))
      }
      else {
        expect(fixture.service.state.context.selectedValue).toEqual(['start'])
        expect(fixture.onSelectionChange).not.toHaveBeenCalled()
      }
    })
  })
})

describe('last visible focus boundaries', () => {
  it('uses the latest parent expansion state without changing collection getLastNode semantics', () => {
    const fixture = setupLastNodeTree([], true)
    expect(fixture.nodes.getLastNode()?.id).toBe('branch')
    for (const scenario of focusScenarios) {
      fixture.service.setContext({ expandedValue: [...scenario.expanded] })
      fixture.render()
      fixture.focusStart()
      pressLastNodeKey(fixture.controls.get('start')!, 'End')
      verifyLastNode(fixture, scenario.expected, scenario.expanded)
      expect(fixture.nodes.getLastNode()?.id).toBe('branch')
    }
  })

  it('Shift+End keeps range selection while focusing its visible end', () => {
    const fixture = setupLastNodeTree(['branch', 'nested'], false, {
      id: 'root',
      name: 'Root',
      children: [
        { id: 'start', name: 'Start' },
        { id: 'branch', name: 'Branch', children: [
          { id: 'nested', name: 'Nested', children: [{ id: 'deep', name: 'Deep' }] },
        ] },
      ],
    })
    fixture.controls.get('start')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', shiftKey: true, bubbles: true, cancelable: true }))
    verifyLastNode(fixture, 'deep', ['branch', 'nested'])
    expect(fixture.service.state.context.selectedValue).toEqual(['start', 'branch', 'nested', 'deep'])
  })

  it('does not change ordinary ArrowUp movement before the first-node boundary', () => {
    const fixture = setupLastNodeTree(['branch', 'nested'])
    fixture.controls.get('deep')!.focus()
    pressLastNodeKey(fixture.controls.get('deep')!, 'ArrowUp')
    verifyLastNode(fixture, 'nested', ['branch', 'nested'])
  })

  it('ends on a root leaf when one follows the expanded branch', () => {
    const fixture = setupLastNodeTree(['branch'], false, {
      id: 'root',
      name: 'Root',
      children: [
        { id: 'start', name: 'Start' },
        { id: 'branch', name: 'Branch', children: [{ id: 'child', name: 'Child' }] },
        { id: 'tail', name: 'Tail' },
      ],
    })
    pressLastNodeKey(fixture.controls.get('start')!, 'End')
    verifyLastNode(fixture, 'tail', ['branch'])
  })

  it.each([false, true])('safely leaves focus unchanged with no enabled nodes (empty=%s)', (empty) => {
    const fixture = setupLastNodeTree([], false, {
      id: 'root',
      name: 'Root',
      children: empty ? [] : [{ id: 'disabled', name: 'Disabled', disabled: true }],
    })
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    expect(() => fixture.service.send({ type: 'NODE.END' })).not.toThrow()
    expect(() => fixture.service.send({ type: 'SELECTED.ALL', moveFocus: true })).not.toThrow()
    expect(() => fixture.service.send({ type: 'NODE.ARROW_UP', id: 'missing' })).not.toThrow()
    expect(document.activeElement).toBe(outside)
    expect(fixture.onFocusChange).not.toHaveBeenCalled()
  })
})
