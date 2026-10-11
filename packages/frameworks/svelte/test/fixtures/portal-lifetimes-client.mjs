import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { after, afterEach, before, test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Window } from 'happy-dom'
import { compile } from 'svelte/compiler'
import ts from 'typescript'

const window = new Window()
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node', 'Text', 'Comment', 'Document', 'DocumentFragment', 'Event', 'CustomEvent', 'MutationObserver']) {
  globalThis[name] = name === 'window' ? window : window[name]
}
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: window.navigator })
let directory, component, flushSync, mount, unmount
const instances = new Set()

before(async () => {
  ({ flushSync, mount, unmount } = await import('svelte'))
  const root = new URL('../../', import.meta.url)
  directory = await mkdtemp(fileURLToPath(new URL('.audit-portal-lifetimes-', root)))
  const output = pathToFileURL(`${directory}/`)
  const portal = await readFile(new URL('src/utils/portal.ts', root), 'utf8')
  const { outputText } = ts.transpileModule(portal, {
    compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext },
  })
  await writeFile(new URL('portal.js', output), outputText)
  const filename = new URL('PortalLifetimes.svelte', import.meta.url)
  const source = (await readFile(filename, 'utf8')).replace('../../src/utils/portal', './portal.js')
  const { js } = compile(source, { filename: fileURLToPath(filename), generate: 'client' })
  const entry = new URL('PortalLifetimes.js', output)
  await writeFile(entry, js.code)
  component = (await import(entry.href)).default
})

afterEach(async () => {
  for (const instance of instances)
    await unmount(instance)
  instances.clear()
  document.body.replaceChildren()
})

after(async () => {
  if (directory)
    await rm(directory, { recursive: true, force: true })
  await window.happyDOM.close()
})

for (const initiallyDisabled of [false, true]) {
  test(`real Svelte mount/update/unmount preserves portal lifetime (initial disabled=${initiallyDisabled})`, async () => {
    const host = document.createElement('main')
    const container = document.createElement('aside')
    document.body.append(host, container)
    const instance = mount(component, { target: host, props: { initiallyDisabled, container } })
    instances.add(instance)
    flushSync()
    const origin = host.querySelector('[data-origin]')
    const node = document.querySelector('[data-portal]')
    assert.equal(node.parentNode, initiallyDisabled ? origin : container)
    flushSync(() => instance.setDisabled(false))
    assert.equal(node.parentNode, container)
    flushSync(() => instance.setDisabled(true))
    assert.deepEqual(Array.from(origin.children).map(element => element.tagName), ['I', 'SPAN', 'B'])
    assert.equal(node.parentNode, origin)
    flushSync(() => instance.setDisabled(false))
    assert.equal(node.parentNode, container)
    await unmount(instance)
    instances.delete(instance)
    assert.equal(container.childNodes.length, 0)
    assert.equal(host.childNodes.length, 0)
  })
}
