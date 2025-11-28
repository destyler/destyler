import { describe, expect, it } from 'vitest'
import {
  clone,
  globalRef,
  proxy,
  proxyWithComputed,
  ref,
  snapshot,
  subscribe,
} from '../index'

describe('index exports', () => {
  it('should export clone function', () => {
    expect(typeof clone).toBe('function')
  })

  it('should export globalRef function', () => {
    expect(typeof globalRef).toBe('function')
  })

  it('should export proxy function', () => {
    expect(typeof proxy).toBe('function')
  })

  it('should export ref function', () => {
    expect(typeof ref).toBe('function')
  })

  it('should export snapshot function', () => {
    expect(typeof snapshot).toBe('function')
  })

  it('should export subscribe function', () => {
    expect(typeof subscribe).toBe('function')
  })

  it('should export proxyWithComputed function', () => {
    expect(typeof proxyWithComputed).toBe('function')
  })

  describe('integration test', () => {
    it('should work together as a reactive store', () => {
      // Create initial state
      const initialState = {
        user: {
          name: 'John',
          age: 30,
        },
        items: [1, 2, 3],
      }

      // Clone to avoid mutation
      const cloned = clone(initialState)
      expect(cloned).toEqual(initialState)

      // Create proxy state
      const state = proxy(cloned)

      // Create computed properties
      const stateWithComputed = proxyWithComputed<
        typeof state,
        { itemCount: number, isAdult: boolean }
      >(
        { ...state },
        {
          itemCount: snap => snap.items.length,
          isAdult: snap => snap.user.age >= 18,
        },
      )

      expect(stateWithComputed.itemCount).toBe(3)
      expect(stateWithComputed.isAdult).toBe(true)

      // Create ref object
      const config = ref({ debug: true })
      const stateWithRef = proxy({ config, data: { value: 1 } })

      // Ref should maintain reference
      expect(stateWithRef.config).toBe(config)

      // Subscribe to changes
      const changes: any[] = []
      const unsubscribe = subscribe(stateWithRef, (ops) => {
        changes.push(ops)
      }, true)

      stateWithRef.data.value = 2
      expect(changes.length).toBe(1)

      // Snapshot should be frozen
      const snap = snapshot(stateWithRef)
      expect(Object.isFrozen(snap)).toBe(true)

      // Cleanup
      unsubscribe()
    })
  })
})
