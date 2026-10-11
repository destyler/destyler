import { useService } from '@destyler/vanilla'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
const services: { service: ReturnType<typeof machine>, cursorId: string }[] = []
const fixtureNodes = new Set<HTMLElement>()
let baselineStyles = new Map<HTMLStyleElement, string | null>()
let sentinel: HTMLStyleElement
let sequence = 0
const sentinelText = ':root { --splitter-native-sentinel: 1; }'

export function ownNode<T extends HTMLElement>(node: T): T {
  fixtureNodes.add(node)
  return node
}

export function cursorStyles(cursorId: string): HTMLStyleElement[] {
  return Array.from(document.head.querySelectorAll('style')).filter(style => style.id === cursorId)
}

export const panels = [{ id: 'a', size: 50 }, { id: 'b', size: 50 }]
export async function flush() {
  for (let i = 0; i < 6; i++)
    await Promise.resolve()
}

export function setup(context: Record<string, unknown> = {}, rootNode: Document | ShadowRoot = document) {
  const id = `native-splitter-${++sequence}`
  const service = machine({ ...('size' in context ? {} : { defaultSize: panels }), ...context, id, getRootNode: () => rootNode } as any)
  const cursorId = `splitter:${id}:global-cursor`
  services.push({ service, cursorId })
  useService({}, service)
  const root = ownNode(document.createElement('div'))
  root.id = `splitter:${id}`
  Object.defineProperty(root, 'offsetWidth', { value: 1000 })
  Object.defineProperty(root, 'offsetHeight', { value: 1000 })
  if (rootNode.nodeType === 9)
    (rootNode as Document).body.append(root)
  else rootNode.append(root)
  const api = () => connect(service.state, service.send, normalize)
  return { service, api, root, cursorId }
}

beforeEach(() => {
  baselineStyles = new Map(Array.from(document.head.querySelectorAll('style'), style => [style, style.textContent]))
  sentinel = ownNode(document.createElement('style'))
  sentinel.textContent = sentinelText
  document.head.append(sentinel)
})

afterEach(() => {
  const current = services.splice(0)
  for (const { cursorId } of current) {
    for (const style of cursorStyles(cursorId)) {
      if (!baselineStyles.has(style))
        ownNode(style)
    }
  }
  try {
    for (const { service } of current) service.stop()
    for (const [style, text] of baselineStyles) {
      expect(style.isConnected).toBe(true)
      expect(style.textContent).toBe(text)
    }
    expect(sentinel.isConnected).toBe(true)
    expect(sentinel.textContent).toBe(sentinelText)
  }
  finally {
    for (const node of fixtureNodes) node.remove()
    fixtureNodes.clear()
    vi.restoreAllMocks()
  }
})
