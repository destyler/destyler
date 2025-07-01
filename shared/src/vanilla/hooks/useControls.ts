import { deepGet, deepSet, getControlDefaults } from '@destyler/shared-private'

export function useControls(config) {
  let state = getControlDefaults(config)

  const listeners = new Set()

  function setState(key, value) {
    deepSet(state, key, value)
    listeners.forEach(fn => fn(state))
  }

  function getState(key) {
    return deepGet(state, key)
  }

  function subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  return {
    config,
    get context() {
      return state
    },
    setState,
    getState,
    keys: Object.keys(config),
    subscribe,
  }
}
