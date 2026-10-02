import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

export function setupRangeAnchor(options: Partial<UserDefinedContext> = {}) {
  const nodes = collection({
    rootNode: {
      value: 'root',
      children: [
        { value: 'first' },
        { value: 'branch', children: [{ value: 'child' }] },
        { value: 'middle' },
        { value: 'last' },
      ],
    },
  })
  const onSelectionChange = vi.fn()
  const onExpandedChange = vi.fn()
  const service = machine({
    id: 'stage2-range-anchor',
    collection: nodes,
    selectionMode: 'multiple',
    onSelectionChange,
    onExpandedChange,
    ...options,
  })
  services.push(service)
  service.start()
  const api = () => connect(service.getState(), service.send, normalize)
  const host = document.createElement('div')
  const elements = new Map<string, HTMLElement>()
  nodes.visit({
    onEnter(node, indexPath) {
      const props = { node, indexPath }
      const element = document.createElement('div')
      element.textContent = node.value
      element.tabIndex = -1
      element.addEventListener('click', (event) => {
        const item = nodes.isBranchNode(node) ? api().getBranchControlProps(props) : api().getItemProps(props)
        item.onClick(event)
      })
      elements.set(node.value, element)
      host.append(element)
    },
  })
  document.body.append(host)
  const shiftClick = (value: string) => elements.get(value)!.dispatchEvent(new MouseEvent('click', { shiftKey: true, bubbles: true, cancelable: true }))
  return { service, api, elements, shiftClick, onSelectionChange, onExpandedChange }
}

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  document.body.replaceChildren()
})

describe('Tree coincident shift-range endpoints', () => {
  it.each(['first', 'branch', 'middle', 'last'])('keeps only %s when shift-clicking its existing anchor', (anchor) => {
    const { service, shiftClick, onSelectionChange, onExpandedChange } = setupRangeAnchor({ defaultSelectedValue: [anchor], defaultExpandedValue: ['branch'] })
    shiftClick(anchor)
    shiftClick(anchor)
    expect(service.state.context.selectedValue).toEqual([anchor])
    expect(service.state.context.expandedValue).toEqual(['branch'])
    expect(onSelectionChange).not.toHaveBeenCalled()
    expect(onExpandedChange).not.toHaveBeenCalled()
  })

  it.each([[], ['branch']])('does not select later visible nodes when the default anchor is also the target (%j)', (expanded) => {
    const { service, shiftClick, onSelectionChange } = setupRangeAnchor({ defaultExpandedValue: expanded })
    shiftClick('first')
    expect(service.state.context.selectedValue).toEqual(['first'])
    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: ['first'], focusedValue: null })
  })

  it.each(['first', 'branch', 'middle'])('contracts an existing range back to anchor %s', (anchor) => {
    const { service, shiftClick, onSelectionChange } = setupRangeAnchor({ defaultSelectedValue: [anchor, 'last'] })
    shiftClick(anchor)
    expect(service.state.context.selectedValue).toEqual([anchor])
    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: [anchor], focusedValue: null })
  })

  it.each(['accept', 'veto', 'delay'] as const)('retains controlled %s when contracting to the anchor', (mode) => {
    const fixture = setupRangeAnchor({ selectedValue: ['first', 'last'] })
    if (mode === 'accept')
      fixture.onSelectionChange.mockImplementation(({ selectedValue }) => fixture.service.setContext({ selectedValue }))
    fixture.shiftClick('first')
    expect(fixture.onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: ['first'], focusedValue: null })
    expect(fixture.service.state.context.selectedValue).toEqual(mode === 'accept' ? ['first'] : ['first', 'last'])
    if (mode === 'delay') {
      fixture.service.setContext({ selectedValue: ['first'] })
      expect(fixture.service.state.context.selectedValue).toEqual(['first'])
      expect(fixture.onSelectionChange).toHaveBeenCalledTimes(1)
    }
  })

  it.each([
    { anchor: 'first', target: 'last', expanded: [], expected: ['first', 'last', 'branch', 'middle'] },
    { anchor: 'last', target: 'first', expanded: [], expected: ['last', 'first', 'branch', 'middle'] },
    { anchor: 'branch', target: 'middle', expanded: ['branch'], expected: ['branch', 'middle', 'child'] },
    { anchor: 'middle', target: 'branch', expanded: ['branch'], expected: ['middle', 'branch', 'child'] },
  ])('preserves distinct endpoint behavior: $anchor to $target', ({ anchor, target, expanded, expected }) => {
    const { service, shiftClick, onSelectionChange } = setupRangeAnchor({ defaultSelectedValue: [anchor], defaultExpandedValue: expanded })
    shiftClick(target)
    expect(service.state.context.selectedValue).toEqual(expected)
    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: expected, focusedValue: null })
  })

  it('preserves single selection without toggling later nodes', () => {
    const { service, shiftClick, onSelectionChange } = setupRangeAnchor({ selectionMode: 'single', defaultSelectedValue: ['middle'] })
    shiftClick('middle')
    expect(service.state.context.selectedValue).toEqual(['middle'])
    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  it('uses the latest collection after insertion following the same anchor', () => {
    const { service, shiftClick, onSelectionChange } = setupRangeAnchor({ defaultSelectedValue: ['first'] })
    service.setContext({ collection: collection({ rootNode: { value: 'root', children: [{ value: 'first' }, { value: 'new' }, { value: 'last' }] } }) })
    shiftClick('first')
    expect(service.state.context.selectedValue).toEqual(['first'])
    expect(onSelectionChange).not.toHaveBeenCalled()
  })
})
