import { describe, expect, it } from 'vitest'
import { portal } from '../src/utils/portal'
import { reflect } from '../src/utils/reflect'

describe('svelte utilities', () => {
  it('moves nodes to the target container and cleans up', () => {
    const container = document.createElement('section')
    const fallback = document.createElement('section')
    document.body.append(container, fallback)

    const node = document.createElement('div')
    fallback.appendChild(node)

    const { destroy, update } = portal(node, { container })

    expect(container.contains(node)).toBe(true)

    const next = document.createElement('section')
    document.body.appendChild(next)

    update({ container: next })
    expect(next.contains(node)).toBe(true)

    destroy()
    expect(node.isConnected).toBe(false)
  })

  it('reflects the latest object and preserves method bindings', () => {
    const first = {
      value: 1,
      getValue() {
        return this.value
      },
    }

    let current = first
    const mirrored = reflect(() => current)

    expect(mirrored.getValue()).toBe(1)

    current = {
      value: 2,
      getValue() {
        return this.value
      },
    }

    expect(mirrored.getValue()).toBe(2)
  })
})
