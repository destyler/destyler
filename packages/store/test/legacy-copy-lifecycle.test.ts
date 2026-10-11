import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  vi.stubGlobal('__destyler__proxyStateMap', new WeakMap())
  vi.stubGlobal('__destyler__refSet', new WeakSet())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function load(kind: 'legacy' | 'current') {
  vi.resetModules()
  return kind === 'legacy' ? import('./fixtures/store-0.2.11/proxy') : import('../src/proxy')
}

describe.each([
  ['legacy', 'legacy'],
  ['legacy', 'current'],
  ['current', 'legacy'],
  ['current', 'current'],
] as const)('%s parent with a %s child', (parentKind, childKind) => {
  it.each([
    { ahead: 'parent', sync: true },
    { ahead: 'parent', sync: false },
    { ahead: 'child', sync: true },
    { ahead: 'child', sync: false },
  ])('preserves observed updates with the $ahead clock ahead (sync: $sync)', async ({ ahead, sync }) => {
    const first = await load(parentKind)
    const second = await load(childKind)
    expect(first.proxy).not.toBe(second.proxy)
    const parent = first.proxy<{ child?: { value: number }, value: number }>({ value: 0 })
    const child = second.proxy({ value: 0 })
    const advanced = ahead === 'parent' ? parent : child
    for (let i = 0; i < 20; i++)
      advanced.value++
    parent.child = child
    const listener = vi.fn()
    const remove = first.subscribe(parent, listener, sync)
    const before = first.snapshot(parent)

    try {
      child.value++
      await Promise.resolve()
      expect(listener).toHaveBeenCalledTimes(1)
      expect(first.snapshot(parent).child?.value).toBe(child.value)
      expect(before.child?.value).toBe(ahead === 'child' ? 20 : 0)

      parent.value++
      await Promise.resolve()
      expect(listener).toHaveBeenCalledTimes(2)
      expect(first.snapshot(parent).value).toBe(parent.value)
      expect(first.snapshot(parent).child?.value).toBe(child.value)
    }
    finally {
      remove()
    }
  })
})

// An experimental shared-clock repair rolled an observed root back onto a cached
// version in this chain. Keep all legacy/current combinations as a compatibility
// control without imposing a new numeric ordering contract on legacy clocks.
describe.each([
  ['legacy', 'legacy', 'legacy'],
  ['legacy', 'legacy', 'current'],
  ['legacy', 'current', 'legacy'],
  ['legacy', 'current', 'current'],
  ['current', 'legacy', 'legacy'],
  ['current', 'legacy', 'current'],
  ['current', 'current', 'legacy'],
  ['current', 'current', 'current'],
] as const)('%s root, %s middle, %s leaf', (rootKind, middleKind, leafKind) => {
  it('keeps observed snapshots current when a listener writes through the middle copy', async () => {
    const [rootCopy, middleCopy, leafCopy] = [await load(rootKind), await load(middleKind), await load(leafKind)]
    expect(new Set([rootCopy.proxy, middleCopy.proxy, leafCopy.proxy]).size).toBe(3)
    interface State { value: number, child?: State }
    const root = rootCopy.proxy<State>({ value: 0 })
    const middle = middleCopy.proxy<State>({ value: 0 })
    const leaf = leafCopy.proxy<State>({ value: 0 })
    root.child = middle
    middle.child = leaf
    let pending = true
    const remove = rootCopy.subscribe(root, () => {
      if (pending) {
        pending = false
        middle.value++
      }
    }, true)

    try {
      const before = rootCopy.snapshot(root)
      root.value++
      const after = rootCopy.snapshot(root)
      expect(root.value).toBe(1)
      expect(middle.value).toBe(1)
      expect(after).not.toBe(before)
      expect(after).toMatchObject({ value: 1, child: { value: 1, child: { value: 0 } } })
      expect(before).toMatchObject({ value: 0, child: { value: 0 } })
      expect(middleCopy.snapshot(root)).toBe(after)
    }
    finally {
      remove()
    }
  })
})
