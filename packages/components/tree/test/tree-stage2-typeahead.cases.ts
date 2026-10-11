import type { UserDefinedContext } from '../src/types'
import { getByTypeahead } from '@destyler/dom'
import { createNormalizer } from '@destyler/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

interface Node {
  value: string
  label: string
  disabled?: boolean
  children?: Node[]
}

const normalize = createNormalizer(props => props)
const fixtures: Array<{ service: ReturnType<typeof machine>, host: HTMLElement }> = []
let sequence = 0

export function setupTypeahead(context: Partial<UserDefinedContext> = {}, branch = false) {
  const nodes: Node[] = [
    { value: 'start', label: 'Orange' },
    { value: 'berry', label: 'Blue berry', ...(branch ? { children: [{ value: 'child', label: 'Child' }] } : {}) },
    { value: 'sky', label: 'Blue sky' },
    { value: 'cedar', label: 'Cedar' },
    { value: 'disabled', label: 'Dormant', disabled: true },
  ]
  const treeCollection = collection<Node>({
    rootNode: { value: 'root', label: 'Root', children: nodes },
    nodeToValue: node => node.value,
    nodeToString: node => node.label,
  })
  const host = document.createElement('div')
  document.body.append(host)
  const root = host.attachShadow({ mode: 'open' })
  const onSelectionChange = vi.fn()
  const onExpandedChange = vi.fn()
  const onFocusChange = vi.fn()
  const service = machine({
    id: `tree-typeahead-${++sequence}`,
    collection: treeCollection,
    getRootNode: () => root,
    onSelectionChange,
    onExpandedChange,
    onFocusChange,
    ...context,
  })
  fixtures.push({ service, host })
  service.start()
  const send = vi.fn(service.send)
  const api = () => connect(service.getState(), send, normalize)
  function bind(element: HTMLElement, props: () => Record<string, any>) {
    for (const [name, value] of Object.entries(props())) {
      if (name.startsWith('on') && typeof value === 'function')
        element.addEventListener(name.slice(2).toLowerCase(), event => props()[name](event))
      else if (value !== undefined && name !== 'style')
        element.setAttribute(name, String(value))
    }
  }
  const tree = document.createElement('div')
  bind(tree, () => api().getTreeProps())
  const elements = Object.fromEntries(nodes.map((node, index) => {
    const element = document.createElement('div')
    // Search must use the collection's nodeToString, not this unrelated DOM text.
    element.textContent = `Visible ${node.value}`
    bind(element, () => treeCollection.isBranchNode(node)
      ? api().getBranchControlProps({ node, indexPath: [index] })
      : api().getItemProps({ node, indexPath: [index] }))
    tree.append(element)
    return [node.value, element]
  }))
  root.append(tree)
  const focus = (value: string) => elements[value].focus()
  focus('start')
  function key(key: string, init: KeyboardEventInit = {}) {
    focus(service.state.context.focusedValue ?? 'start')
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
    root.activeElement!.dispatchEvent(event)
    return event
  }
  return {
    service,
    host,
    root,
    tree,
    elements,
    api,
    send,
    focus,
    key,
    keys: () => service.state.context.typeaheadState.keysSoFar,
    onSelectionChange,
    onExpandedChange,
    onFocusChange,
  }
}

export function expectFocus(fixture: ReturnType<typeof setupTypeahead>, value: string) {
  expect(fixture.root.activeElement).toBe(fixture.elements[value])
  expect(fixture.service.state.context.focusedValue).toBe(value)
}

beforeEach(() => vi.useFakeTimers())
afterEach(async () => {
  try {
    if (vi.isFakeTimers())
      await vi.advanceTimersByTimeAsync(400)
    for (const { service, host } of fixtures.splice(0)) {
      service.stop()
      host.remove()
    }
  }
  finally {
    vi.clearAllTimers()
    vi.useRealTimers()
  }
})

describe('Tree per-instance typeahead ownership', () => {
  it.each([false, true])('interleaves independent public queries, reverse=%s', (reverse) => {
    const first = setupTypeahead()
    const second = setupTypeahead()
    const [early, late] = reverse ? [second, first] : [first, second]
    early.focus('start')
    early.key('b')
    late.focus('start')
    late.key('c')
    early.focus('berry')
    early.key('l')
    expectFocus(early, 'berry')
    late.focus('cedar')
    late.key('e')
    expectFocus(late, 'cedar')
    expect(early.keys()).toBe('bl')
    expect(late.keys()).toBe('ce')
    expect(early.api().selectedValue).toEqual([])
    expect(late.api().selectedValue).toEqual([])
    expect(early.onSelectionChange).not.toHaveBeenCalled()
    expect(late.onSelectionChange).not.toHaveBeenCalled()
  })

  it('keeps same-ID trees in separate roots independent', () => {
    const first = setupTypeahead({ id: 'same' })
    const second = setupTypeahead({ id: 'same' })
    first.key('b')
    expectFocus(first, 'berry')
    second.key('c')
    expectFocus(second, 'cedar')
    expect(first.keys()).toBe('b')
    expect(second.keys()).toBe('c')
    expect(first.service.state.context.typeaheadState).not.toBe(second.service.state.context.typeaheadState)
    expect(getByTypeahead.defaultOptions).toEqual({ keysSoFar: '', timer: -1 })
  })

  it.each([false, true])('expires each query at its own deadline, reverse=%s', async (reverse) => {
    const first = setupTypeahead()
    const second = setupTypeahead()
    const [early, late] = reverse ? [second, first] : [first, second]
    early.key('b')
    await vi.advanceTimersByTimeAsync(100)
    late.key('c')
    await vi.advanceTimersByTimeAsync(249)
    expect(early.keys()).toBe('b')
    expect(late.keys()).toBe('c')
    await vi.advanceTimersByTimeAsync(1)
    expect(early.keys()).toBe('')
    expect(late.keys()).toBe('c')
    expect(early.service.state.context.isTypingAhead).toBe(false)
    expect(late.service.state.context.isTypingAhead).toBe(true)
    early.key(' ')
    expect(early.api().selectedValue).toEqual(['berry'])
    late.key('e')
    expectFocus(late, 'cedar')
    expect(late.keys()).toBe('ce')
    await vi.advanceTimersByTimeAsync(350)
    expect(late.keys()).toBe('')
    expect(late.service.state.context.typeaheadState.timer).toBe(-1)
  })

  it.each([false, true])('stopping a peer cannot change the survivor deadline, reverse=%s', async (reverse) => {
    const first = setupTypeahead()
    const second = setupTypeahead()
    const [stopped, survivor] = reverse ? [second, first] : [first, second]
    stopped.key('b')
    stopped.service.stop()
    await vi.advanceTimersByTimeAsync(100)
    survivor.key('c')
    expectFocus(survivor, 'cedar')
    await vi.advanceTimersByTimeAsync(250)
    expect(survivor.keys()).toBe('c')
    survivor.key('e')
    expect(survivor.keys()).toBe('ce')
    await vi.advanceTimersByTimeAsync(350)
    expect(survivor.keys()).toBe('')
  })

  it.each([false, true])('a new mount starts empty while a previous actor has a query, stopped=%s', (stopped) => {
    const first = setupTypeahead()
    first.key('b')
    if (stopped)
      first.service.stop()
    const remounted = setupTypeahead()
    remounted.key(' ')
    expect(remounted.api().selectedValue).toEqual(['start'])
    remounted.key('c')
    expectFocus(remounted, 'cedar')
    expect(remounted.keys()).toBe('c')
    expect(first.keys()).toBe('b')
  })

  it('keeps simultaneous deadlines independent when only one query is refreshed', async () => {
    const first = setupTypeahead()
    const second = setupTypeahead()
    first.key('b')
    second.key('c')
    await vi.advanceTimersByTimeAsync(100)
    first.key('l')
    await vi.advanceTimersByTimeAsync(250)
    expect(first.keys()).toBe('bl')
    expect(second.keys()).toBe('')
    second.key(' ')
    expect(second.api().selectedValue).toEqual(['cedar'])
    await vi.advanceTimersByTimeAsync(100)
    expect(first.keys()).toBe('')
  })

  it('preserves an existing actor query across its ordinary stop/start', async () => {
    const fixture = setupTypeahead()
    fixture.key('b')
    fixture.service.stop()
    fixture.service.start()
    fixture.key('l')
    expect(fixture.keys()).toBe('bl')
    expectFocus(fixture, 'berry')
    await vi.advanceTimersByTimeAsync(350)
    expect(fixture.keys()).toBe('')
  })
})

describe('Tree typing-state and Space boundary', () => {
  it.each(['single', 'multiple'] as const)('continues multiword custom labels without selection in %s mode', (selectionMode) => {
    const fixture = setupTypeahead({ selectionMode })
    for (const key of 'blue s')
      expect(fixture.key(key).defaultPrevented).toBe(true)
    expectFocus(fixture, 'sky')
    expect(fixture.keys()).toBe('blue s')
    expect(fixture.service.state.context.isTypingAhead).toBe(true)
    expect(fixture.api().selectedValue).toEqual([])
    expect(fixture.onSelectionChange).not.toHaveBeenCalled()
  })

  it('does not select or expand a branch while continuing a multiword query', () => {
    const fixture = setupTypeahead({}, true)
    for (const key of 'blue s')
      fixture.key(key)
    expectFocus(fixture, 'sky')
    expect(fixture.api().selectedValue).toEqual([])
    expect(fixture.api().expandedValue).toEqual([])
    expect(fixture.onExpandedChange).not.toHaveBeenCalled()
  })

  it.each([false, true])('keeps ordinary Space selection outside a search, branch=%s', (branch) => {
    const fixture = setupTypeahead({}, branch)
    fixture.focus('berry')
    expect(fixture.key(' ').defaultPrevented).toBe(true)
    expect(fixture.api().selectedValue).toEqual(['berry'])
    expect(fixture.api().expandedValue).toEqual(branch ? ['berry'] : [])
    expect(fixture.keys()).toBe('')
  })

  it('returns Space to selection at the existing 350 ms query deadline', async () => {
    const fixture = setupTypeahead()
    fixture.key('b')
    await vi.advanceTimersByTimeAsync(349)
    expect(fixture.service.state.context.isTypingAhead).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    expect(fixture.service.state.context.isTypingAhead).toBe(false)
    fixture.key(' ')
    expect(fixture.api().selectedValue).toEqual(['berry'])
    expect(fixture.keys()).toBe('')
  })

  it('honors consumer cancellation without extending the pending deadline', async () => {
    const fixture = setupTypeahead()
    fixture.key('b')
    fixture.tree.addEventListener('keydown', event => event.preventDefault(), { capture: true })
    await vi.advanceTimersByTimeAsync(100)
    for (const key of ['l', ' '])
      fixture.key(key)
    expect(fixture.keys()).toBe('b')
    expect(fixture.api().selectedValue).toEqual([])
    await vi.advanceTimersByTimeAsync(250)
    expect(fixture.keys()).toBe('')
  })

  it.each(['ctrlKey', 'metaKey', 'altKey'] as const)('ignores %s character shortcuts without changing the query', (modifier) => {
    const fixture = setupTypeahead()
    fixture.key('b')
    expect(fixture.key('c', { [modifier]: true }).defaultPrevented).toBe(false)
    expect(fixture.keys()).toBe('b')
    expectFocus(fixture, 'berry')
    expect(fixture.api().selectedValue).toEqual([])
  })

  it('keeps typeahead=false character keys inert and ordinary Space selection available', () => {
    const fixture = setupTypeahead({ typeahead: false })
    expect(fixture.key('b').defaultPrevented).toBe(false)
    expectFocus(fixture, 'start')
    expect(fixture.keys()).toBe('')
    fixture.key(' ')
    expect(fixture.api().selectedValue).toEqual(['start'])
  })

  it('restores Space selection when typeahead is disabled during a pending query', () => {
    const fixture = setupTypeahead()
    fixture.key('b')
    fixture.service.setContext({ typeahead: false })
    expect(fixture.key(' ').defaultPrevented).toBe(true)
    expect(fixture.api().selectedValue).toEqual(['berry'])
    expect(fixture.keys()).toBe('b')
    expect(fixture.key('c').defaultPrevented).toBe(false)
    expectFocus(fixture, 'berry')
  })

  it('does not route Space from a disabled node into selection or an active query', () => {
    const fixture = setupTypeahead()
    fixture.key('b')
    fixture.focus('disabled')
    expect(fixture.key(' ').defaultPrevented).toBe(false)
    expect(fixture.keys()).toBe('b')
    expectFocus(fixture, 'disabled')
    expect(fixture.api().selectedValue).toEqual([])
  })

  it('retains repeated-character cycling and resets before a different query', async () => {
    const fixture = setupTypeahead()
    fixture.key('b')
    expectFocus(fixture, 'berry')
    fixture.key('b')
    expectFocus(fixture, 'sky')
    await vi.advanceTimersByTimeAsync(350)
    fixture.key('c')
    expectFocus(fixture, 'cedar')
    expect(fixture.keys()).toBe('c')
  })
})
