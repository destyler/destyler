import assert from 'node:assert/strict'
import process from 'node:process'

let window
if (process.execArgv.includes('--conditions=browser')) {
  const { Window } = await import('happy-dom')
  window = new Window()
  for (const name of ['window', 'document', 'navigator', 'Node', 'Element', 'HTMLElement'])
    Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? window : window[name] })
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window)
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window)
}
const adapter = await import('@destyler/svelte')
const client = await import('@destyler/svelte/client')
for (const entry of [adapter, client]) {
  for (const name of ['mergeProps', 'portal', 'reflect', 'useActor', 'useMachine', 'useService', 'useSnapshot'])
    assert.equal(typeof entry[name], 'function', `Missing ${name}`)
  assert.equal(typeof entry.normalizeProps.button, 'function')
}

await window?.happyDOM.close()
