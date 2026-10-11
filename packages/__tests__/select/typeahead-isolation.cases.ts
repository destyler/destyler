import type { UserDefinedContext } from '../../components/select/src/types'
import { getByTypeahead } from '@destyler/dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect as menuConnect } from '../../components/menu/src/connect'
import { machine as menuMachine } from '../../components/menu/src/machine'
import { collection } from '../../components/select/src/collection'
import { connect } from '../../components/select/src/connect'
import { machine } from '../../components/select/src/machine'
import { collection as treeCollection } from '../../components/tree/src/collection'
import { connect as treeConnect } from '../../components/tree/src/connect'
import { machine as treeMachine } from '../../components/tree/src/machine'
import { createNormalizer } from '../../types/src/prop-types'

const normalize = createNormalizer(props => props)
const items = [{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }]
const services: Array<{ stop: () => unknown }> = []
const roots: HTMLElement[] = []
let sequence = 0

function setup(context: Partial<UserDefinedContext> = {}) {
  const host = document.createElement('div')
  document.body.append(host)
  roots.push(host)
  const root = host.attachShadow({ mode: 'open' })
  const service = machine({ id: `typeahead-${++sequence}`, collection: collection({ items }), getRootNode: () => root, ...context })
  const api = () => connect(service.getState(), service.send, normalize)
  const trigger = document.createElement('button')
  trigger.id = api().getTriggerProps().id
  const content = document.createElement('div')
  content.id = api().getContentProps().id
  content.tabIndex = 0
  root.append(trigger, content)
  const onFocus = () => api().getTriggerProps().onFocus()
  const onBlur = () => api().getTriggerProps().onBlur()
  const onKeyDown = (event: KeyboardEvent) => api().getTriggerProps().onKeyDown(event)
  trigger.addEventListener('focus', onFocus)
  trigger.addEventListener('blur', onBlur)
  trigger.addEventListener('keydown', onKeyDown)
  const stop = () => {
    trigger.removeEventListener('focus', onFocus)
    trigger.removeEventListener('blur', onBlur)
    trigger.removeEventListener('keydown', onKeyDown)
    service.stop()
  }
  services.push({ stop })
  service.start()
  function type(key: string) {
    trigger.focus()
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  }
  return { service, api, trigger, type, stop, keys: () => service.state.context.typeahead.keysSoFar }
}

interface PeerNode {
  id: string
  name: string
  children?: PeerNode[]
}

function setupActivePeer(kind: 'menu' | 'tree') {
  const host = document.createElement('div')
  document.body.append(host)
  roots.push(host)
  const root = kind === 'menu' ? document : host.attachShadow({ mode: 'open' })
  const mount = kind === 'menu' ? host : root
  const id = `active-${kind}-${++sequence}`
  const removeListeners: Array<() => void> = []
  function bind(element: HTMLElement, getProps: () => Record<string, any>) {
    for (const [name, value] of Object.entries(getProps())) {
      if (typeof value === 'function' && name.startsWith('on')) {
        const eventName = name.slice(2).toLowerCase()
        const listener = (event: Event) => getProps()[name](event)
        element.addEventListener(eventName, listener)
        removeListeners.push(() => element.removeEventListener(eventName, listener))
      }
      else if (value !== undefined && name !== 'style') {
        if (['hidden', 'disabled'].includes(name))
          element.toggleAttribute(name, !!value)
        else
          element.setAttribute(name, String(value))
      }
    }
  }
  function own(service: { stop: () => unknown }) {
    services.push({ stop() {
      removeListeners.forEach(remove => remove())
      service.stop()
    } })
  }
  if (kind === 'menu') {
    const service = menuMachine({ id, defaultOpen: true, getRootNode: () => root })
    const api = () => menuConnect(service.getState(), service.send, normalize)
    const trigger = document.createElement('button')
    bind(trigger, () => api().getTriggerProps())
    const content = document.createElement('div')
    bind(content, () => api().getContentProps())
    for (const item of items) {
      const node = document.createElement('div')
      node.textContent = item.label
      bind(node, () => api().getItemProps({ value: item.value }))
      content.append(node)
    }
    mount.append(trigger, content)
    own(service)
    service.start()
    return {
      type: (key: string) => content.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })),
      keys: () => service.state.context.typeaheadState.keysSoFar,
      matched: () => api().highlightedValue,
    }
  }
  const nodes: PeerNode[] = items.map(item => ({ id: item.value, name: item.label }))
  const service = treeMachine({
    id,
    getRootNode: () => root,
    collection: treeCollection<PeerNode>({
      rootNode: { id: 'root', name: 'Root', children: nodes },
      nodeToValue: node => node.id,
      nodeToString: node => node.name,
    }),
  })
  const api = () => treeConnect(service.getState(), service.send, normalize)
  const tree = document.createElement('div')
  bind(tree, () => api().getTreeProps())
  const elements = nodes.map((node, index) => {
    const element = document.createElement('div')
    element.textContent = node.name
    bind(element, () => api().getItemProps({ node, indexPath: [index] }))
    tree.append(element)
    return element
  })
  mount.append(tree)
  own(service)
  service.start()
  return {
    type: (key: string) => elements[0].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })),
    keys: () => service.state.context.typeaheadState.keysSoFar,
    matched: () => service.state.context.focusedValue,
  }
}

function cleanup() {
  try {
    for (const service of services.splice(0).reverse())
      service.stop()
  }
  finally {
    for (const root of roots.splice(0))
      root.remove()
  }
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

describe('select typeahead lifetime isolation', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(async () => {
    try {
      await vi.advanceTimersByTimeAsync(400)
      cleanup()
    }
    finally {
      vi.clearAllTimers()
      vi.useRealTimers()
      for (const root of roots.splice(0))
        root.remove()
    }
  })

  it('allocates independent buffers even for identical public IDs in separate roots', () => {
    const first = setup({ id: 'same-id' })
    const second = setup({ id: 'same-id' })
    expect(first.service.state.context.typeahead).not.toBe(second.service.state.context.typeahead)
    first.type('a')
    expect(first.keys()).toBe('a')
    expect(second.keys()).toBe('')
  })

  it.each([false, true])('interleaves independent query sequences, reverse=%s', (reverse) => {
    const first = setup()
    const second = setup()
    const a = reverse ? second : first
    const b = reverse ? first : second
    a.type('a')
    b.type('b')
    a.type('p')
    b.type('a')
    expect(a.keys()).toBe('ap')
    expect(b.keys()).toBe('ba')
    expect(a.api().value).toEqual(['apple'])
    expect(b.api().value).toEqual(['banana'])
  })

  it('starts a newly mounted Select empty while another query is active', () => {
    const first = setup()
    first.type('a')
    const second = setup()
    expect(second.keys()).toBe('')
    expect(second.api().value).toEqual([])
    expect(first.keys()).toBe('a')
    second.type(' ')
    expect(second.api().open).toBe(true)
    expect(first.keys()).toBe('a')
  })

  it.each([false, true])('expires each query at its own deadline, reverse=%s', async (reverse) => {
    const first = setup()
    const second = setup()
    const early = reverse ? second : first
    const late = reverse ? first : second
    early.type('a')
    await vi.advanceTimersByTimeAsync(100)
    late.type('b')
    await vi.advanceTimersByTimeAsync(250)
    expect(early.keys()).toBe('')
    expect(late.keys()).toBe('b')
    await vi.advanceTimersByTimeAsync(100)
    expect(late.keys()).toBe('')
    expect(early.service.state.context.typeahead.timer).toBe(-1)
    expect(late.service.state.context.typeahead.timer).toBe(-1)
  })

  it.each([false, true])('a stopped peer and its timeout cannot alter the survivor, reverse=%s', async (reverse) => {
    const first = setup()
    const second = setup()
    const stopped = reverse ? second : first
    const survivor = reverse ? first : second
    stopped.type('a')
    stopped.stop()
    await vi.advanceTimersByTimeAsync(100)
    survivor.type('b')
    await vi.advanceTimersByTimeAsync(250)
    expect(survivor.keys()).toBe('b')
    expect(survivor.api().value).toEqual(['banana'])
    await vi.advanceTimersByTimeAsync(100)
    expect(survivor.keys()).toBe('')
  })

  it('does not inherit a stopped instance query when remounted', () => {
    const first = setup()
    first.type('a')
    first.stop()
    const remounted = setup()
    expect(remounted.keys()).toBe('')
    remounted.type('b')
    expect(remounted.api().value).toEqual(['banana'])
  })

  it.each(['menu', 'tree'] as const)('mounts empty after an actual %s query is already active', (kind) => {
    const peer = setupActivePeer(kind)
    peer.type('b')
    expect(peer.keys()).toBe('b')
    expect(peer.matched()).toBe('banana')
    // Machines mutate the cached live proxy, not the raw default template.
    expect(getByTypeahead.defaultOptions).toEqual({ keysSoFar: '', timer: -1 })
    const select = setup()
    expect(select.keys()).toBe('')
    expect(select.service.state.context.isTypingAhead).toBe(false)
    select.type('a')
    expect(select.api().value).toEqual(['apple'])
    expect(peer.keys()).toBe('b')
    expect(getByTypeahead.defaultOptions).toEqual({ keysSoFar: '', timer: -1 })
  })

  it('retains ordinary incremental matching and debounce behavior', async () => {
    const select = setup()
    select.type('b')
    select.type('a')
    expect(select.keys()).toBe('ba')
    expect(select.api().value).toEqual(['banana'])
    await vi.advanceTimersByTimeAsync(349)
    expect(select.keys()).toBe('ba')
    await vi.advanceTimersByTimeAsync(1)
    expect(select.keys()).toBe('')
    select.type('a')
    expect(select.api().value).toEqual(['apple'])
  })

  it.each([false, true])('does not share query ownership with a Menu utility consumer, utilityFirst=%s', (utilityFirst) => {
    const select = setup()
    const menu = menuMachine({ id: `utility-menu-${++sequence}` })
    services.push(menu)
    menu.start()
    const nodes = items.map((item) => {
      const node = document.createElement('div')
      node.id = item.value
      node.textContent = item.label
      return node
    })
    let match: HTMLElement | undefined
    function search() {
      match = getByTypeahead(nodes, { state: menu.state.context.typeaheadState, activeId: null, key: 'b' })
    }
    if (utilityFirst) {
      search()
      select.type('a')
    }
    else {
      select.type('a')
      search()
    }
    expect(select.keys()).toBe('a')
    expect(select.api().value).toEqual(['apple'])
    expect(menu.state.context.typeaheadState.keysSoFar).toBe('b')
    expect(match?.id).toBe('banana')
    expect(getByTypeahead.defaultOptions).toEqual({ keysSoFar: '', timer: -1 })
  })
})

describe('select typeahead with real platform timers', () => {
  afterEach(async () => {
    try {
      // Real timer deadlines fire before this later cleanup deadline.
      await delay(400)
    }
    finally {
      cleanup()
    }
  })

  it.each([false, true])('keeps independent buffers and clears real deadlines, reverse=%s', async (reverse) => {
    const first = setup()
    const second = setup()
    const a = reverse ? second : first
    const b = reverse ? first : second
    a.type('a')
    b.type('b')
    expect(a.keys()).toBe('a')
    expect(b.keys()).toBe('b')
    expect(a.api().value).toEqual(['apple'])
    expect(b.api().value).toEqual(['banana'])
    await delay(400)
    expect(a.keys()).toBe('')
    expect(b.keys()).toBe('')
    expect(a.service.state.context.typeahead.timer).toBe(-1)
    expect(b.service.state.context.typeahead.timer).toBe(-1)
  })
})
