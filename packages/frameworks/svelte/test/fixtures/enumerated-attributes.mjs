import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { after, before, test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Window } from 'happy-dom'
import { compile, compileModule } from 'svelte/compiler'
import ts from 'typescript'

const mode = process.env.AUDIT_ENUM_MODE || 'client'
const root = new URL('../../../../../', import.meta.url)
const source = new URL('./packages/frameworks/svelte/src/utils/normalize-props.ts', root)
const hydrationFile = pathToFileURL(process.env.AUDIT_ENUM_HYDRATION_FILE)
const window = new Window()
if (mode === 'client') {
  for (const name of ['window', 'document', 'Element', 'HTMLElement', 'HTMLInputElement', 'SVGElement', 'Node', 'Text', 'Comment', 'Document', 'DocumentFragment', 'Event', 'CustomEvent', 'MouseEvent', 'FocusEvent', 'MutationObserver']) globalThis[name] = name === 'window' ? window : window[name]
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: window.navigator })
}
let directory, normalizeProps, component, stateFactory, mount, hydrate, unmount, flushSync, render
before(async () => {
  directory = await mkdtemp(fileURLToPath(new URL('.audit-enumerated-svelte-generated-', root)))
  const output = pathToFileURL(`${directory}/`)
  const normalizerSource = await readFile(source, 'utf8')
  const compilerOptions = { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext }
  const factorySource = await readFile(new URL('./packages/types/src/prop-types.ts', root), 'utf8')
  await writeFile(new URL('factory.mjs', output), ts.transpileModule(factorySource, { compilerOptions }).outputText)
  const normalizer = ts.transpileModule(normalizerSource, { compilerOptions }).outputText.replace('\'@destyler/types\'', '\'./factory.mjs\'')
  await writeFile(new URL('normalize.mjs', output), normalizer)
  const template = '<script>let { state } = $props()</script><button {...state.current}></button>'
  await writeFile(new URL('Component.mjs', output), compile(template, { filename: 'EnumeratedAttributes.svelte', generate: mode }).js.code)
  ;({ normalizeProps } = await import(new URL('normalize.mjs', output)))
  ;({ default: component } = await import(new URL('Component.mjs', output)))
  if (mode === 'client') {
    ({ mount, hydrate, unmount, flushSync } = await import('svelte'))
    await writeFile(new URL('state.mjs', output), compileModule('export function stateFactory() { const state = $state({ current: {} }); return state }', { filename: 'state.svelte.js', generate: 'client' }).js.code)
    ;({ stateFactory } = await import(new URL('state.mjs', output)))
  }
  else {
    ({ render } = await import('svelte/server'))
  }
})
after(async () => {
  await window.happyDOM.abort()
  if (directory)
    await rm(directory, { recursive: true, force: true })
})
function parse(body) {
  const host = window.document.createElement('div')
  host.contentEditable = 'true'
  host.innerHTML = body
  return host
}
async function withMounted(props, action) {
  const state = stateFactory()
  state.current = props
  const host = document.createElement('div')
  host.contentEditable = 'true'
  document.body.append(host)
  const instance = mount(component, { target: host, props: { state } })
  flushSync()
  try {
    await action(host.querySelector('button'), next => flushSync(() => {
      state.current = next
    }), host)
  }
  finally {
    await unmount(instance)
    host.remove()
  }
}
for (const key of ['contentEditable', 'draggable', 'spellCheck']) {
  test(`Svelte ${mode}: supported ${key} booleans/strings, immutable input and removal`, async () => {
    const values = [false, true, 'false', 'true', undefined, ...(key === 'contentEditable' ? ['inherit'] : []), false]
    if (mode === 'server') {
      for (const value of values) {
        const input = Object.freeze({ [key]: value })
        const before = Object.getOwnPropertyDescriptors(input)
        const { body } = render(component, { props: { state: { current: normalizeProps.element(input) } } })
        assert.equal(parse(body).querySelector('button').getAttribute(key.toLowerCase()), value === undefined ? null : String(value))
        assert.deepEqual(Object.getOwnPropertyDescriptors(input), before)
      }
      return
    }
    await withMounted({}, (element, update) => {
      for (const value of values) {
        const input = Object.freeze({ [key]: value })
        const before = Object.getOwnPropertyDescriptors(input)
        update(normalizeProps.element(input))
        assert.equal(element.getAttribute(key.toLowerCase()), value === undefined ? null : String(value))
        if (key === 'contentEditable')
          assert.equal(element.isContentEditable, value !== false && value !== 'false')
        assert.deepEqual(Object.getOwnPropertyDescriptors(input), before)
      }
      update(normalizeProps.element(Object.freeze({})))
      assert.equal(element.hasAttribute(key.toLowerCase()), false)
      if (key === 'contentEditable')
        assert.equal(element.isContentEditable, true)
    })
  })
}
test(`Svelte ${mode}: native false spread is a passing framework control`, async () => {
  const props = Object.freeze({ contenteditable: false, draggable: false, spellcheck: false })
  const check = (element) => {
    for (const key of Object.keys(props)) assert.equal(element.getAttribute(key), 'false')
    assert.equal(element.isContentEditable, false)
  }
  if (mode === 'server')
    check(parse(render(component, { props: { state: { current: props } } }).body).querySelector('button'))
  else await withMounted(props, check)
})
test(`Svelte ${mode}: preserves true-boolean disabled and yes/no translate controls`, async () => {
  const check = (element, disabled) => {
    assert.equal(element.disabled, disabled)
    assert.equal(element.hasAttribute('disabled'), disabled)
    assert.equal(element.getAttribute('translate'), 'no')
  }
  if (mode === 'server') {
    for (const disabled of [true, false]) check(parse(render(component, { props: { state: { current: normalizeProps.element(Object.freeze({ disabled, translate: 'no' })) } } }).body).querySelector('button'), disabled)
  }
  else {
    await withMounted({}, (element, update) => {
      for (const disabled of [true, false]) {
        update(normalizeProps.element(Object.freeze({ disabled, translate: 'no' })))
        check(element, disabled)
      }
      update(normalizeProps.element({}))
      assert.equal(element.hasAttribute('disabled'), false)
      assert.equal(element.hasAttribute('translate'), false)
    })
  }
})
if (mode === 'server') {
  test('Svelte SSR emits the actual hydration fixture', async () => {
    const input = { contentEditable: false, draggable: false, spellCheck: false, disabled: false, translate: 'no' }
    const { body } = render(component, { props: { state: { current: normalizeProps.element(Object.freeze(input)) } } })
    await writeFile(hydrationFile, `${JSON.stringify({ input, body }, null, 2)}\n`)
    assert.equal(parse(body).querySelector('button').getAttribute('contenteditable'), 'false')
  })
}
else {
  test('Svelte hydrate reuses SSR node; false state updates/removes without losing explicit semantics', async () => {
    const { input, body } = JSON.parse(await readFile(hydrationFile, 'utf8'))
    const state = stateFactory()
    state.current = normalizeProps.element(Object.freeze(input))
    const host = parse(body)
    document.body.append(host)
    const original = host.querySelector('button')
    const instance = hydrate(component, { target: host, props: { state }, recover: false })
    flushSync()
    try {
      const element = host.querySelector('button')
      assert.equal(element, original)
      assert.equal(element.isContentEditable, false)
      for (const key of ['contenteditable', 'draggable', 'spellcheck']) assert.equal(element.getAttribute(key), 'false')
      flushSync(() => {
        state.current = normalizeProps.element(Object.freeze({ contentEditable: true, draggable: true, spellCheck: true }))
      })
      for (const key of ['contenteditable', 'draggable', 'spellcheck']) assert.equal(element.getAttribute(key), 'true')
      flushSync(() => {
        state.current = normalizeProps.element(Object.freeze({}))
      })
      for (const key of ['contenteditable', 'draggable', 'spellcheck']) assert.equal(element.hasAttribute(key), false)
      assert.equal(element.isContentEditable, true)
    }
    finally {
      await unmount(instance)
      host.remove()
    }
  })
  test('Svelte inherited contentEditable follows its ancestor after normalization', async () => {
    await withMounted(normalizeProps.element(Object.freeze({ contentEditable: 'inherit' })), (element, _update, host) => {
      assert.equal(element.isContentEditable, true)
      host.contentEditable = 'false'
      assert.equal(element.isContentEditable, false)
    })
  })
}
