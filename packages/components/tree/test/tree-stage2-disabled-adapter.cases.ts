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
  unavailable?: boolean
  children?: Node[]
}

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []

afterEach(() => {
  for (const service of services.splice(0))
    service.stop()
  document.body.replaceChildren()
})

export function setupDisabledAdapter(part: 'item' | 'branch', disabled: boolean, mode: 'custom' | 'override' | 'fallback' = 'custom', controlled = false) {
  const node: Node = {
    id: 'target',
    name: 'Target',
    ...(mode === 'fallback' ? { disabled } : { unavailable: disabled }),
    ...(mode === 'override' ? { disabled: !disabled } : {}),
    ...(part === 'branch' ? { children: [{ id: 'child', name: 'Child' }] } : {}),
  }
  const nodes = collection<Node>({
    nodeToValue: node => node.id,
    nodeToString: node => node.name,
    ...(mode !== 'fallback' ? { isNodeDisabled: (node: Node) => !!node.unavailable } : {}),
    rootNode: { id: 'root', name: 'Root', children: [node] },
  })
  const onSelectionChange = vi.fn()
  const onExpandedChange = vi.fn()
  const service = machine({
    id: 'stage2-disabled-adapter',
    collection: nodes,
    ...(controlled ? { selectedValue: [], expandedValue: [] } : {}),
    onSelectionChange,
    onExpandedChange,
  } as UserDefinedContext)
  services.push(service)
  service.start()
  const api = () => connect(service.getState(), service.send, normalize)
  const nodeProps = { node, indexPath: [0] }
  const host = document.createElement('div')
  host.addEventListener('keydown', event => api().getTreeProps().onKeyDown(event))
  const target = document.createElement('div')
  const props = part === 'branch' ? api().getBranchControlProps(nodeProps) : api().getItemProps(nodeProps)
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on') && typeof value === 'function')
      target.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
    else if (value !== undefined && key !== 'style')
      target.setAttribute(key, String(value))
  }
  target.textContent = 'Target'
  host.append(target)
  document.body.append(host)
  return { api, nodeProps, service, target, onSelectionChange, onExpandedChange }
}

describe.each(['item', 'branch'] as const)('Tree %s collection disabled contract', (part) => {
  it.each([
    ['custom', true],
    ['custom', false],
    ['override', true],
    ['override', false],
    ['fallback', true],
    ['fallback', false],
  ] as const)('uses %s disabled state %s consistently in every exposed part', (mode, disabled) => {
    const { api, nodeProps } = setupDisabledAdapter(part, disabled, mode)
    expect(api().getNodeState(nodeProps).disabled).toBe(disabled)
    const getters = part === 'item'
      ? [api().getItemProps, api().getItemTextProps, api().getItemIndicatorProps]
      : [api().getBranchProps, api().getBranchControlProps, api().getBranchTriggerProps, api().getBranchTextProps, api().getBranchIndicatorProps]
    for (const getter of getters)
      expect(getter(nodeProps)['data-disabled']).toBe(disabled ? '' : undefined)
    const owner = part === 'item' ? api().getItemProps(nodeProps) : api().getBranchProps(nodeProps)
    expect(owner['aria-disabled']).toBe(disabled)
    expect(owner['aria-selected']).toBe(disabled ? undefined : false)
  })

  it.each([false, true])('blocks custom-disabled pointer and keyboard mutations (controlled=%s)', (controlled) => {
    const { service, target, onSelectionChange, onExpandedChange } = setupDisabledAdapter(part, true, 'custom', controlled)
    target.click()
    for (const key of ['Enter', ' ', 'ArrowRight', '*'])
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
    expect(service.state.context.selectedValue).toEqual([])
    expect(service.state.context.expandedValue).toEqual([])
    expect(onSelectionChange).not.toHaveBeenCalled()
    expect(onExpandedChange).not.toHaveBeenCalled()
  })

  it('keeps the custom adapter authoritative when raw disabled is true', () => {
    const { service, target, onSelectionChange } = setupDisabledAdapter(part, false, 'override')
    target.click()
    expect(service.state.context.selectedValue).toEqual(['target'])
    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: ['target'], focusedValue: null })
    expect(service.state.context.expandedValue).toEqual(part === 'branch' ? ['target'] : [])
  })

  it.each(['accept', 'veto', 'delay'] as const)('preserves controlled %s for an adapter-enabled node', (mode) => {
    const { target, service, onSelectionChange, onExpandedChange } = setupDisabledAdapter(part, false, 'override', true)
    if (mode === 'accept') {
      onSelectionChange.mockImplementation(({ selectedValue }) => service.setContext({ selectedValue }))
      onExpandedChange.mockImplementation(({ expandedValue }) => service.setContext({ expandedValue }))
    }
    target.click()
    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith({ selectedValue: ['target'], focusedValue: null })
    expect(service.state.context.selectedValue).toEqual(mode === 'accept' ? ['target'] : [])
    expect(service.state.context.expandedValue).toEqual(mode === 'accept' && part === 'branch' ? ['target'] : [])
    if (part === 'branch')
      expect(onExpandedChange).toHaveBeenCalledExactlyOnceWith({ expandedValue: ['target'], focusedValue: null })
    else
      expect(onExpandedChange).not.toHaveBeenCalled()
    if (mode === 'delay') {
      service.setContext({ selectedValue: ['target'], expandedValue: part === 'branch' ? ['target'] : [] })
      expect(service.state.context.selectedValue).toEqual(['target'])
      expect(service.state.context.expandedValue).toEqual(part === 'branch' ? ['target'] : [])
      expect(onSelectionChange).toHaveBeenCalledTimes(1)
      expect(onExpandedChange).toHaveBeenCalledTimes(part === 'branch' ? 1 : 0)
    }
  })

  it('uses replacement collection adapter values without mutating the node', () => {
    const { api, service, nodeProps } = setupDisabledAdapter(part, false)
    const replacement = (disabled: boolean) => collection<Node>({
      nodeToValue: node => node.id,
      rootNode: { id: 'root', name: 'Root', children: [nodeProps.node] },
      isNodeDisabled: () => disabled,
    })
    for (const disabled of [true, false, true]) {
      service.setContext({ collection: replacement(disabled) })
      expect(api().getNodeState(nodeProps).disabled).toBe(disabled)
      expect(nodeProps.node.disabled).toBeUndefined()
    }
  })
})

it('uses the adapter for the separate branch trigger click guard', () => {
  const { api, nodeProps, service, onExpandedChange } = setupDisabledAdapter('branch', true)
  const event = { stopPropagation: vi.fn() }
  api().getBranchTriggerProps(nodeProps).onClick(event)
  expect(service.state.context.expandedValue).toEqual([])
  expect(onExpandedChange).not.toHaveBeenCalled()
  expect(event.stopPropagation).not.toHaveBeenCalled()
})
